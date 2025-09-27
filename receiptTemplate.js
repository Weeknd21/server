// receiptTemplate.js
/**
 * Convierte los datos de la orden en formato ReceiptLine Markdown.
 * @param {object} data - Los datos de la orden (items, total, etc.)
 * @returns {string} La cadena de texto en Markdown lista para imprimir.
 */
exports.buildReceiptMarkdown = (data) => {
    // Definimos el encabezado y la fecha
    let markdown = `
^^^${data.storeName || 'MI NEGOCIO POS'}
Fecha: ${data.date}
---
`;

    // Detalles de los artículos
    // Formato sugerido de ReceiptLine: Nombre | Cantidad | Precio
    data.items.forEach(item => {
        // Asegúrate de formatear los precios a dos decimales
        markdown += `${item.name} | ${item.qty} | ${item.price.toFixed(2)}\n`;
    });

    // Totales
    markdown += `
---
Subtotal | | ${data.subtotal.toFixed(2)}
Impuesto | | ${data.tax.toFixed(2)}
^TOTAL | | ^${data.total.toFixed(2)}

¡Gracias por su compra!
`;
    return markdown.trim();
};
