module.exports = function pdf(data, options, receiptId) {
  const pdf = require("html-pdf");

  pdf.create(data, options).toFile(`order - ${receiptId}.pdf`, err => {
    if (err) {
      console.log(err);
    }
  });
};
