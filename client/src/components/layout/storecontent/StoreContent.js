import React, { useState, useEffect } from "react";
import { Products } from "../products/Products";
import { CheckOut } from "../checkout/Checkout";
import "./StoreContent.css";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
export const StoreContent = ({ toggleNotify, setToggleNotify }) => {
  const [store, setStore] = useState(null);
  const [rerender, triggerRerender] = useState(null);
  const [productByCategory, setProductByCategory] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:5000/api/products");
      setStore(result.data);
    };
    fetchData();
  }, [rerender]);

  let flag = false;
  {
    store &&
      store.forEach(each => {
        if (each.isSelected === true) {
          flag = true;
        }
      });
  }

  return (
    <div className="store-content">
      <div className="container">
        {store && (
          <>
            <Products
              store={store}
              productByCategory={productByCategory}
              setProductByCategory={setProductByCategory}
              setStore={setStore}
              triggerRerender={triggerRerender}
            />

            <CSSTransition
              in={flag}
              timeout={200}
              classNames="checkout"
              unmountOnExit
              appear
            >
              <CheckOut
                store={store}
                setStore={setStore}
                toggleNotify={toggleNotify}
                setToggleNotify={setToggleNotify}
                triggerRerender={triggerRerender}
              />
            </CSSTransition>
          </>
        )}
      </div>
    </div>
  );
};
