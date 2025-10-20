// server.js
const express = require('express');
const receiptio = require('receiptio');
// Importamos la función que construye el Markdown
const { buildReceiptMarkdown, buildReceiptMarkdownPassword } = require('./receiptTemplate'); 
const app = express();
const PORT = 3001; 

// --- CONFIGURACIÓN DE LA IMPRESORA POR RED (ETHERNET) ---
// ⚠️ REEMPLACE ESTA DIRECCIÓN IP con la IP estática real de su impresora.
// Nota: receiptio asume el puerto 9100 si no se especifica.
const PRINTER_IP_ADDRESS = '192.168.1.87'; // Ejemplo de IP
const CHARACTERS_PER_LINE = 42; 

// La opción '-d' ahora usa la dirección IP directamente.
const PRINTER_OPTIONS = `-d ${PRINTER_IP_ADDRESS} -c ${CHARACTERS_PER_LINE}`;
// -------------------------------------------------

// Middleware para parsear el cuerpo JSON de las peticiones
app.use(express.json());

// Middleware CORS: Permite que Next.js llame a este servidor local.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});

// Endpoint principal para recibir el JSON y enviar a la impresora
app.post('/print', async (req, res) => {
    const receiptData = req.body;
    
    // ✅ VALIDACIÓN CORREGIDA: Verificamos que los datos existan y que incluyan un código de seguimiento.
    if (!receiptData || !receiptData.trackingCode) {
        // Ahora el error se lanza si no hay datos o si falta el trackingCode, que es un campo clave.
        return res.status(400).json({ success: false, message: 'Datos de recibo faltantes o el Código de Seguimiento está vacío.' });
    }

    try {
        // 1. Construir el Markdown
        const markdown = (receiptData.password == 'true')? buildReceiptMarkdownPassword(receiptData): buildReceiptMarkdown(receiptData);
        
        console.log('Markdown generado:\n', markdown);
        console.log(`Enviando a impresora por IP: ${PRINTER_IP_ADDRESS}`);

        // 2. Ejecutar la impresión usando receiptio
        const result = await receiptio.print(markdown, PRINTER_OPTIONS);
        
        console.log('Resultado de la impresión de receiptio:', result);
        
        // 3. Responder a Next.js
        res.status(200).json({ success: true, message: 'Impresión enviada correctamente.' });

    } catch (error) {
        console.error('🔴 ERROR CRÍTICO DE IMPRESIÓN:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Fallo de conexión a la impresora. Verifique la IP, la red y el firewall.', 
            details: error.message 
        });
    }
});

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor de impresión local ejecutándose en http://localhost:${PORT}`);
    console.log(`🔌 Impresora configurada en IP: ${PRINTER_IP_ADDRESS}`);
});
