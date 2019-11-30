import React, { useEffect, useState } from "react";
import "./Checkout.css";
import axios from "axios";
import shortId from "shortid";
import { saveLog } from "../../../ultis/Log";
import { AccountContext } from "../../../App";
import { Notify } from "../notify/Notify";

export const CheckOut = props => {
  const {
    store,
    setStore,
    triggerRerender,
    setToggleNotify,
    toggleNotify
  } = props;

  let selected = store.filter(each => each.isSelected === true);

  let quantity = selected.reduce((a, b) => a + b.quantity, 0);

  let total = selected.reduce((a, b) => a + b.price_per_unit * b.quantity, 0);

  function onChangeNumber(num, product) {
    let index = 0;
    for (var i = 0; i < store.length; i++) {
      if (store[i].product_name === product.product_name) {
        index = i;
      }
    }

    let a = { ...product, quantity: parseInt(num) };
    setStore(oldState => [
      ...oldState.slice(0, index),
      a,
      ...oldState.slice(index + 1)
    ]);
  }

  async function onProceed(e, context) {
    e.preventDefault();

    let receiptId = shortId.generate();
    let username = context.username || sessionStorage.getItem("username");

    selected.forEach(
      each => (each.afterOrder = each.remaining_quantity - each.quantity)
    );

    // pug seems to be more reliable than other methods. Try
    // to find a way to passdata to pug
    // get cann't pass data
    let respond = await axios({
      url: "/api/checkout",
      method: "POST",
      data: {
        selected,
        receiptId,
        username,
        total,
        timestamp: new Date().toLocaleString()
      }
    });

    let respond2 = await axios({
      url: "http://localhost:5000/api/receipt",
      method: "POST",
      data: {
        receiptId,
        username,
        timestamp: new Date().toLocaleString()
      }
    });

    let respond3 = await axios({
      url: "http://localhost:5000/api/detailReceipt",
      method: "POST",
      data: {
        selected,
        receiptId
      }
    });

    if (respond.data.status === "failed") {
      console.log("Error");
    }
    if (respond.data.status === "success") {
      saveLog("order", `proceed an order ${receiptId}`, `${username}`);

      setToggleNotify(!toggleNotify);

      triggerRerender(Math.random());
    }
  }

  return (
    <div className="checkout">
      <div className="checkout__title">
        <h3>Your order</h3>
      </div>
      <div className="checkout__form">
        <div className="checkout__form--heading ">Total</div>
        <div className="line-break"></div>
        <div className="checkout__form--products ">
          {selected.map((each, i) => (
            <div className="checkout__form--product">
              <div className="checkout__form--product-name">
                <p>
                  {i + 1} . {each.product_name}
                </p>
              </div>
              <div className="checkout__form--product-quantity">
                <p>
                  x
                  <input
                    type="number"
                    min={1}
                    max={each.remaining_quantity}
                    value={each.quantity}
                    onChange={e => onChangeNumber(e.target.value, each)}
                  />
                </p>
              </div>
            </div>
            // end product
          ))}
        </div>
        <div className="line-break"></div>
        <div className="checkout__form--total">
          <div className="checkout__form--total-quantity">
            Quantity: {quantity}
          </div>
          <div className="checkout__form--total-price">
            Total Price: <span>{total}$</span>
          </div>
        </div>
        <AccountContext.Consumer>
          {context => (
            <div className="button-container">
              <a
                href="#"
                className="btn proceedBtn"
                onClick={e => onProceed(e, context)}
              >
                Proceed
              </a>
            </div>
          )}
        </AccountContext.Consumer>
      </div>
    </div>
  );
};
