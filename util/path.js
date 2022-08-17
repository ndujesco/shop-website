const path = require('path');

module.exports = path.dirname(require.main.filename);
const root = path.dirname(require.main.filename);

const orderId = "333333"
const invoiceName = "invoice-" + orderId + ".pdf"
const invoicePath = path.join("data", "invoices/" + invoiceName)

