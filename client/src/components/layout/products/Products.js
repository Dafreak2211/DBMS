import React, { useEffect } from "react";
import "./Products.css";
import axios from "axios";

export const Products = props => {
  const {
    store,
    setStore,
    triggerRerender,
    setProductByCategory,
    productByCategory
  } = props;

  let renderData = () => {
    return productByCategory ? productByCategory : store;
  };

  function handleOnClick(product_name) {
    let selectedElement = store.find(
      each => each.product_name === product_name
    );
    let i = store.findIndex(each => each.product_name === product_name);

    if (selectedElement.remaining_quantity !== 0) {
      selectedElement.isSelected = !selectedElement.isSelected;
      let newStore = [
        ...store.slice(0, i),
        selectedElement,
        ...store.slice(i + 1)
      ];
      setStore(newStore);
    }
  }

  function getClassName(each) {
    return each.isSelected
      ? "product selected"
      : each.remaining_quantity === 0
      ? "product disable"
      : "product";
  }

  let category = [
    {
      content: "All",
      background: "#000",
      image: "/asterisk-outline.png",
      groupProduct_id: "all"
    },
    {
      content: "Food",
      background: "#366EDC",
      image: "/food.png",
      groupProduct_id: "B2"
    },
    {
      content: "Beverage",
      background: "#3F7AB1",
      image: "/coffee.png",
      groupProduct_id: "B3"
    },
    {
      content: "Snack",
      background: "#25BBB2",
      image: "/burger.png",
      groupProduct_id: "B1"
    }
  ];
  async function setCategory(content) {
    //set rerender to refresh the data

    // find match content get the groupId
    let { groupProduct_id } = category.find(each => each.content === content);
    if (groupProduct_id === "all") {
      setProductByCategory(store);
    } else {
      let matchedProducts = store.filter(each => {
        return each.groupProduct_id === groupProduct_id;
      });
      setProductByCategory(matchedProducts);
    }
  }
  return (
    <div className="products">
      <div className="products__category">
        {category.map(each => (
          <div
            className="each-category"
            style={{ backgroundColor: each.background }}
            onClick={() => setCategory(each.content)}
            // set up api to send products by category
          >
            <p>{each.content}</p>
            <img src={each.image} alt="" />
          </div>
        ))}
      </div>
      {renderData().map((each, i) => (
        <div
          className={getClassName(each)}
          onClick={() => {
            handleOnClick(each.product_name);
            // the index is diffrent
          }}
        >
          <img src={each.image_url} className="product__image" alt="" />
          <div className="overlay">
            <div className="product-info__name">
              <h3>{each.product_name}</h3>
            </div>
            <div className="product-info__quantity">
              <p>{each.remaining_quantity} more left</p>
            </div>
            <div className="product-info__price">
              <p>{each.price_per_unit}$</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
