// receiptTemplate.js
/**
 * Convierte los datos de la orden JSON en formato ReceiptLine Markdown.
 * * ESTRUCTURA DE DATOS ESPERADA:
 * {
 * date: "27/09/2025 - 14:05",
 * branchName: "San Antonio",
 * branchPhone: "464 168 3300",
 * deviceBrand: "Xiaomi",
 * deviceModel: "Poco X6 Pro",
 * deviceSerial: "89323",
 * deviceColor: "Azul",
 * serviceType: "Cambio de pantalla",
 * accessories: "Sin bandeja ni chip",
 * customerName: "Jose Perez",
 * customerPhone: "4641553001",
 * customerEmail: "jose.perez@example.com",
 * totalCost: 900.00,
 * downPayment: 500.00,
 * pendingBalance: 400.00,
 * trackingCode: "0004A-1" 
 * }
 * @param {object} data - Los datos de la orden
 * @returns {string} La cadena de texto en Markdown lista para imprimir.
 */
exports.buildReceiptMarkdown = (data) => {

    // Función auxiliar para formatear montos
    const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;


    // Construcción del recibo usando Template Literals (inyección de variables)
    const markdown = `
^^^^RzCell
Comprobante de Ingreso
${data.created_at || ''}
-

| Sucursal: ${data.branchName || ''}~
| ${data.branchPhone || ''}~

~Dispositivo: ${data.deviceBrand || ''} ${data.deviceModel || ''} |
~Serie: ${data.deviceSerial || ''} |
~Color: ${data.deviceColor || ''} |
~Servicio: ${data.serviceType || ''} |
~Accesorios: ${data.accessories || ''} |


~Nombre: ${data.customerName || ''} |
~Telefono: ${data.customerPhone || ''} |
~Email: ${data.customerEmail || ''} |

| Costo Total: ${formatCurrency(data.totalCost)}~
| Anticipo: ${formatCurrency(data.downPayment)}~
| Saldo Pendiente: ${formatCurrency(data.pendingBalance)}~

Codigo de Seguimiento:

^^^^${data.ID || ''}

{code:${data.ID || ''}; option: code128 4 100 nohri}

Gracias por tu preferencia. Conserve esta nota
como comprobante, sin nota no se entregan 
telefonos.

© 2025 RzCell. Todos los derechos reservados.

=

~~~~~^^^"${data.trackingCode || ''} | ^^${data.serviceType || ''} |

~
-
`;
    // Limpiar saltos extra
    return markdown.trim();
};

exports.buildReceiptMarkdownPassword = (data) => {

    // Función auxiliar para formatear montos
    const formatCurrency = (amount) => `$${(amount || 0).toFixed(2)}`;


    // Construcción del recibo usando Template Literals (inyección de variables)
    const markdown = `
^^^^RzCell
Comprobante de Ingreso
${data.date}
-

| Sucursal: ${data.branch_name || ''}~
| ${data.branchPhone || ''}~

~Dispositivo: ${data.device_brand || ''} ${data.device_model || ''} |
~Serie: ${data.serie || ''} |
~Color: ${data.color || ''} |
~Servicio: ${data.repair_type || ''} |
~Accesorios: ${data.accessories || ''} |


~Nombre: ${data.client_name || ''} |
~Telefono: ${data.client_phone || ''} |
~Email: ${data.client_email || ''} |

| Costo Total: ${formatCurrency(data.totalCost)}~
| Anticipo: ${formatCurrency(data.downPayment)}~
| Saldo Pendiente: ${formatCurrency(data.pendingBalance)}~

Codigo de Seguimiento:

^^^^${data.trackingCode || ''}

{code:${data.trackingCode || ''}; option: code128 4 100 nohri}

Gracias por tu preferencia. Conserve esta nota
como comprobante, sin nota no se entregan 
telefonos.

© 2025 RzCell. Todos los derechos reservados.

=

~~~~~^^^"${data.trackingCode || ''} | ^^${data.serviceType || ''} |


-

Contrasena:

^^^"•     •     •



^^^"•     •     •



^^^"•     •     •

~
~
`;
    // Limpiar saltos extra
    return markdown.trim();
};
