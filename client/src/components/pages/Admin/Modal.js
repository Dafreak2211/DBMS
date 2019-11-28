import React, { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "./useForm";
import { saveLog } from "../../../ultis/Log";
import { AccountContext } from "../../../App";
import shortid from "shortid";

export const Modal = props => {
  const { modal, setModal, setTriggerRerender } = props;

  const [image, setImage] = useState(null);
  const [rerender, setRerender] = useState(null);

  const [values, handleChange] = useForm({
    product_name: "",
    price_per_unit: 0,
    remaining_quantity: 0,
    product_Id: shortid.generate(),
    group_Id: "B1",
    description: ""
  });

  const [groupId, setGroupId] = useState([]);

  useEffect(() => {
    let fetchData = async () => {
      let respond = await axios({
        url: "http://localhost:5000/api/groupId",
        method: "GET"
      });

      if (respond.data.status === "success") {
        setGroupId(respond.data.result[0]);
        console.log(respond.data.result[0]);
      }
    };

    fetchData();
  }, [rerender]);

  function preview_image(event) {
    var reader = new FileReader();
    setImage("");
    reader.onload = function() {
      if (!reader.result) return;

      let output = document.getElementById("outputArea");
      let tempImage = document.getElementById("temp");

      tempImage.style.display = "none";
      document.querySelector(".deleteImage").style.display = "block";
      output.style.display = "block";

      output.src = reader.result;
    };
    setImage(event.target.files[0]);
    reader.readAsDataURL(event.target.files[0]);
  }

  function handleDeleteImage(e) {
    var output = document.getElementById("outputArea");
    let tempImage = document.getElementById("temp");

    output.removeAttribute("src");
    output.style.display = "none";
    document.querySelector(".deleteImage").style.display = "none";
    tempImage.style.display = "block";
  }

  async function saveForm(e, context) {
    e.preventDefault();

    let formData = new FormData();
    const {
      product_name,
      product_Id,
      price_per_unit,
      group_Id,
      description,
      remaining_quantity
    } = values;
    formData.append("image", image);
    formData.append("product_name", product_name);
    formData.append("price_per_unit", price_per_unit);
    formData.append("remaining_quantity", remaining_quantity);
    formData.append("product_Id", product_Id);
    formData.append("group_Id", group_Id);
    formData.append("description", description);
    // can not send whole array or object list

    let respond = await axios({
      method: "POST",
      url: "http://localhost:5000/api/try",
      data: formData,
      headers: {
        "content-type": "multipart/form-data"
      }
    });

    if (respond.data.status === "success") {
      // close after added

      saveLog(
        "product",
        `add ${product_name}`,
        context.username || sessionStorage.getItem("username")
      );
      setRerender(Math.random());
      setTriggerRerender(Math.random());
      setModal(!modal);
    } else {
      alert(respond.data.error.sqlMessage);
    }
  }

  function clicking(e) {
    if (e.target.className === "modal-wrapper appear") {
      setModal(!modal);
    }
  }

  return (
    <div
      onClick={clicking}
      className={modal ? "modal-wrapper appear" : "modal-wrapper"}
    >
      <div className="modal">
        <div className="exitBtn" onClick={() => setModal(!modal)}>
          &#x3A7;
        </div>
        <div className="modal__heading">Add new product</div>
        <div className="modal__body">
          <div className="modal__list-group modal__list-group--name">
            <input
              type="text"
              name="product_name"
              value={values.product_name}
              onChange={handleChange}
            />
            <label htmlFor="">Product Name</label>
          </div>
          <div className="modal__list-group">
            <div className="modal-price modal__list-group-small">
              <input
                type="number"
                name="price_per_unit"
                value={values.price_per_unit}
                onChange={handleChange}
                min={0}
              />
              <label htmlFor="">Price</label>
            </div>
            <div className="modal-quantity modal__list-group-small ">
              <input
                type="number"
                name="remaining_quantity"
                onChange={handleChange}
                value={values.remaining_quantity}
                min={0}
              />
              <label htmlFor="">Quantity</label>
            </div>
          </div>
          <div className="modal__list-group  ">
            <div className="modal-productId modal__list-group-small">
              <input
                type="text"
                name="product_Id"
                onChange={handleChange}
                value={values.product_Id}
              />
              <label htmlFor="">Product ID</label>
            </div>

            <div className="modal-groupId modal__list-group-small">
              <select name="" id="" onChange={handleChange} name="group_Id">
                {groupId &&
                  groupId.map(each => (
                    <option value={each.groupProduct_id}>
                      {`${each.groupProduct_id} (${each.groupProduct_name}) `}
                    </option>
                  ))}
              </select>

              <label htmlFor="">Group ID</label>
            </div>
          </div>

          <div className="modal__list-group modal__list-group--description">
            <input
              type="text"
              name="description"
              onChange={handleChange}
              value={values.description}
            />
            <label htmlFor="">Description</label>
          </div>
          <div className="modal__list-group-special modal-image">
            <input
              type="file"
              name="image"
              id="image"
              onChange={preview_image}
            />
            <label htmlFor="image" className="primary">
              Image
            </label>
            <label htmlFor="image" className="fakeInputField">
              <img src="/photo2.png" alt="" id="temp" />
              <img id="outputArea"></img>
            </label>
            <div className="deleteImage" onClick={handleDeleteImage}>
              <span>&#x3A7;</span>
            </div>
          </div>
        </div>
        <div className="modal__footer">
          <a
            href="#"
            className="btn cancelBtn btn__no__bg"
            onClick={() => setModal(!modal)}
          >
            Cancel
          </a>
          <AccountContext.Consumer>
            {context => (
              <a
                href="#"
                className="btn saveBtn"
                onClick={e => saveForm(e, context)}
              >
                Save
              </a>
            )}
          </AccountContext.Consumer>
        </div>
      </div>
    </div>
  );
};
