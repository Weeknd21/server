// server.js
const express = require('express');
const receiptio = require('receiptio');
// Importamos la función que construye el Markdown
const { buildReceiptMarkdown } = require('./receiptTemplate'); 
const app = express();
const PORT = 3001; 

// --- CONFIGURACIÓN DE LA IMPRESORA COMPARTIDA ---
// ⚠️ REEMPLAZA ESTO con el nombre de recurso compartido de tu impresora.
// Ejemplo: Si compartiste tu impresora con el nombre 'POS_Recibo', usa 'POS_Recibo'.
const SHARED_PRINTER_NAME = '192.168.1.87:9100'; 
const CHARACTERS_PER_LINE = 42; 

// La opción '-d //./...' indica a receiptio que use la ruta UNC de la impresora local compartida.
const PRINTER_OPTIONS = `${SHARED_PRINTER_NAME} -c ${CHARACTERS_PER_LINE}`;
// -------------------------------------------------

// Middleware para parsear el cuerpo JSON de las peticiones
app.use(express.json());

// Middleware CORS: Es necesario para que tu aplicación Next.js (que corre en un puerto diferente) 
// pueda llamar a este servidor local.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    // Maneja peticiones OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).send();
    }
    next();
});

// Endpoint principal para recibir el JSON y enviar a la impresora
app.post('/print', async (req, res) => {
    const receiptData = req.body;
    
    if (!receiptData || !receiptData.items || receiptData.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Datos de recibo faltantes o vacíos.' });
    }

    try {
        // 1. Construir el Markdown
        const markdown = buildReceiptMarkdown(receiptData);
        
        console.log('Markdown generado:\n', markdown);
        console.log(`Enviando a impresora compartida: ${PRINTER_OPTIONS}`);

        // 2. Ejecutar la impresión usando receiptio
        const result = await receiptio.print(markdown, PRINTER_OPTIONS);
        
        console.log('Resultado de la impresión de receiptio:', result);
        
        // 3. Responder a Next.js
        res.status(200).json({ success: true, message: 'Impresión enviada correctamente.' });

    } catch (error) {
        console.error('🔴 ERROR CRÍTICO DE IMPRESIÓN:', error.message);
        // Retorna un error para que la aplicación Next.js lo maneje
        res.status(500).json({ 
            success: false, 
            message: 'Fallo en el servidor de impresión local. Revise la configuración de la impresora compartida.', 
            details: error.message 
        });
    }
});

// Inicia el servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor de impresión local ejecutándose en http://localhost:${PORT}`);
    console.log(`🔌 Esperando solicitudes de impresión desde la red...`);
});
