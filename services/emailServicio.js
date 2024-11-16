const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const enviarCorreoConfirmacion = async (destinatario, detallesCompra) => {
    const { orderNumber, total, detalles } = detallesCompra;

    const htmlContent = `
        <h2>Confirmación de Compra</h2>
        <p>Gracias por tu compra en nuestra tienda.</p>
        <h3>Detalles de la Orden:</h3>
        <p><strong>Número de Orden:</strong> ${orderNumber}</p>
        <p><strong>Total:</strong> $${total}</p>
        <h3>Productos:</h3>
        <ul>
            ${detalles.map(item => `
                <li>${item.producto} - Cantidad: ${item.cantidad} - Precio: $${item.precio}</li>
            `).join('')}
        </ul>
        <p>Gracias por tu preferencia.</p>
    `;

    try {
        console.log('Intentando enviar correo a:', destinatario);  // Agregado para debugging
        const { data, error } = await resend.emails.send({
            from: 'La tiendita <onboarding@resend.dev>',
            to: destinatario,
            subject: 'Confirmación de tu compra',
            html: htmlContent
        });

        if (error) {
            console.error('Error específico de Resend:', error);
            throw error;
        }

        console.log('Correo enviado exitosamente a:', destinatario);
        return data;
    } catch (error) {
        console.error('Error detallado al enviar correo:', error);
        throw error;
    }
};

module.exports = {
    enviarCorreoConfirmacion
};
