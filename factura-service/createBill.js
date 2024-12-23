const puppeteer = require('puppeteer');

async function createBill(productList, cart_id) {
    const nombreFactura = Math.floor(Math.random() * 30000);
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Factura Ejemplo</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
            </head>
            <body>
                <div class="container mt-4">
                    <h2 class="mb-4">Factura Ejemplo de cart ${cart_id}</h2>
                    ${productList.map((e) => `
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>${e.name}</td>
                                    <td>${e.quantity}</td>
                                    <td>${e.unitaryPrice}</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2">Total</td>
                                    <td>${e.totalPrice}</td>
                                </tr>
                        </table>
                    `).join('')}
                </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
            </body>
            </html>
            `;
    await page.setContent(htmlContent)
    await page.pdf({
        path: `${nombreFactura}-factura.pdf`,
        format: 'A4',
        printBackground: true

    })
    console.log('Pdf generado correctamente')
    await browser.close()

}

module.exports = {
    createBill
}