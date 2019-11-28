module.exports = (
  { selected, receiptId, username, timestamp, total },
  hello
) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>PDF</title>
      <style>
        @import url("https://fonts.googleapis.com/css?family=Roboto:400,500&display=swap");
        *,
        *::after,
        *::before {
            padding: 0;
            margin: 0;
            box-sizing: inherit;
        }
        
        html {
            box-sizing: border-box;
            font-size: 62.5%;
        }
        
        body {
            line-height: 1.6;
            font-family: "Roboto", sans-serif;
        }
        
        .pdf-template {
            width: 50rem;
            margin: auto;
            box-shadow: 0 1.5rem 3rem rgba(0, 0, 0, 0.1);
            padding: 5rem 8rem;
        }
        .pdf-template__heading {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .pdf-template__heading h1 {
            margin: 0;
            font-size: 5rem;
            text-transform: uppercase;
            color: #0d4477;
            letter-spacing: 0.05rem;
            margin-bottom: 3rem;
        }
        .pdf-template__logo {
            height: 5rem;
            width: 5rem;
            background: gray;
            border-radius: 50%;
            position: relative;
        }
        .pdf-template__logo p {
            display: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .pdf-template__info p {
            font-size: 1.4em;
            color: #4d4848;
        }
        .pdf-template__info p:not(:last-child) {
            margin-bottom: 1rem;
        }
        .pdf-template__info p span {
            color: #000;
            font-weight: 500;
        }
        .pdf-template__row {
            display: grid;
            grid-template-columns: repeat(12, 1fr);
        }
        .pdf-template__items {
            margin-top: 5rem;
        }
        .pdf-template__items-tab {
            border: 4px solid #313548;
            border-left: none;
            border-right: none;
        }
        .pdf-template__items h3 {
            padding: 2rem 0;
            grid-column: span 3;
            justify-self: center;
        }
        .pdf-template__item {
            font-size: 1.4rem;
            padding: 1.5rem 0;
        }
        .pdf-template__item p {
            grid-column: span 3;
            justify-self: center;
        }
        .pdf-template__subtotal {
            margin-top: 5rem;
        }
        .pdf-template__subtotal > * {
            justify-self: center;
            font-size: 1.4rem;
        }
        .pdf-template__subtotal h3 {
            grid-column: 7/10;
        }
        .pdf-template__subtotal p {
            grid-column: 10/-1;
        }
        .pdf-template__footer {
            text-align: center;
            margin-top: 5rem;
        }
      </style>
    </head>
    <body>
        <div class="pdf-template">
        <div class="pdf-template__heading">
            <h1>receipt</h1>
        </div>
        <div class="pdf-template__info">
            <p>
            Cashier: <span>${username}</span>
            </p>
            <p>
            Receipt: <span>${receiptId}</span>
            </p>
            <p>
            Receipt Date: <span>${timestamp}</span>
            </p>
        </div>
        <div class="pdf-template__items">
            <div class="pdf-template__row pdf-template__items-tab">
                <h3>QT</h3>
                <h3>Name</h3>
                <h3>Unit Price</h3>
                <h3>Amount</h3>
                </div>
            </div>
            ${hello()} 
        <div class="pdf-template__row pdf-template__subtotal">
            <h3>Subtotal</h3>
            <p>${total}</p>
        </div>
        <div class="pdf-template__footer">
            <i>Thank you for shopping at our store</i>
        </div>
        </div>
    </body>
  </html>
   `;
};

{
  /* <script> 
let abc = document.querySelector(".pdf-template__items");
</script> */
}

// {selected.map(({ product_name, quantity, price_per_unit }) => (
//     <div class="pdf-template__row pdf-template__item">
//         <p>a</p>
//         <p>b</p>
//         <p>c</p>
//         <p>d</p>
//     </div>
//     ))}
