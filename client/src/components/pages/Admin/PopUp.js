import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveLog } from "../../../ultis/Log";

export const PopUp = ({
  itemForUpdate,
  setTriggerRerender,
  setpopupAppear,
  popupAppear,
  setMessage,
  setToggleNotify,
  toggleNotify
}) => {
  const [oldValue, setOldValue] = useState(itemForUpdate);

  const [value, setValue] = useState("");
  const [updateField, setUpdateField] = useState("");

  function onChangeSelect(e) {
    let index = e.target.options.selectedIndex;
    setUpdateField(e.target.options[index].value);
  }

  useEffect(() => {
    setUpdateField("quantity");
  }, []);

  async function onUpdate(e) {
    e.preventDefault();
    let data = { value, updateField, idForUpdate: itemForUpdate.product_id };

    if (data.updateField === "quantity") {
      data.value = parseInt(data.value);
    } else if (data.updateField === "price_per_unit") {
      data.value = parseFloat(data.value);
    }

    let respond = await axios({
      url: `http://localhost:5000/api/update/`,
      method: "post",
      data
    });

    if (respond.data.status === "success") {
      saveLog(
        "product",
        `update ${oldValue.product_name} from ${oldValue[updateField]} to ${value}`,
        sessionStorage.getItem("username")
      );
      setTriggerRerender(Math.random()); // force re-render to update the state
      setMessage("Update successfully");
      setToggleNotify(true);

      setTimeout(() => setToggleNotify(false), 1000);
      setpopupAppear(!popupAppear);
    }
  }
  return (
    <div
      className="popup__wrapper appear"
      onClick={e => {
        if (e.target.className === "popup__wrapper appear popup-enter-done") {
          setpopupAppear(!popupAppear);
        }
      }}
    >
      <div className="popup ">
        <div className="exitBtn" onClick={() => setpopupAppear(!popupAppear)}>
          &#x3A7;
        </div>
        <div className="popup__heading">
          Update <span>{itemForUpdate.product_name}</span>
        </div>
        <div className="popup__body">
          <select name="" id="" onChange={onChangeSelect}>
            <option value="quantity">quantity</option>
            <option value="product_name">product_name</option>
            <option value="price_per_unit">price_per_unit</option>
          </select>
          <input
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            name="updateField"
            placeholder="Enter new value"
          />
        </div>
        <div className="popup__footer">
          <a
            href="#"
            className="btn btn-small cancelBtn btn__no__bg"
            onClick={e => {
              e.preventDefault();
              setpopupAppear(!popupAppear);
            }}
          >
            Cancel
          </a>
          <a href="#" className="btn btn-small modalBtn" onClick={onUpdate}>
            Update
          </a>
        </div>
      </div>
    </div>
  );
};
