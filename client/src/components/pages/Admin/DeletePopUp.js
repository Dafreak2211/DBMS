import React, { useState, useEffect } from "react";
import axios from "axios";

export const DeletePopUp = ({
  itemForUpdate,
  setTriggerRerender,
  setDeletePopupAppear,
  deletePopupAppear
}) => {
  async function onDelete(e) {
    e.preventDefault();
    let respond = await axios({
      method: "post",
      url: "http://localhost:5000/api/delete",
      data: {
        product_id: itemForUpdate.product_id
      }
    });

    if (respond.data.status === "success") {
      // force re-render to update data
      setTriggerRerender(Math.random());
      setDeletePopupAppear(!deletePopupAppear);
    } else if (respond.data.status === "failed") {
      console.log("Failed");
    }
  }

  return (
    <div
      className="popup__wrapper appear"
      onClick={e => {
        if (e.target.className === "popup__wrapper appear popup-enter-done") {
          setDeletePopupAppear(!deletePopupAppear);
        }
      }}
    >
      <div className="popup ">
        <div
          className="exitBtn"
          onClick={() => setDeletePopupAppear(!deletePopupAppear)}
        >
          &#x3A7;
        </div>
        <div className="popup__heading">
          Are you sure to delete <span>{itemForUpdate.product_name} ?</span>
        </div>

        <div className="popup__footer">
          <a
            href="#"
            className="btn btn-small cancelBtn btn__no__bg"
            onClick={() => setDeletePopupAppear(!deletePopupAppear)}
          >
            Cancel
          </a>
          <a href="#" className="btn btn-small modalBtn" onClick={onDelete}>
            Delete
          </a>
        </div>
      </div>
    </div>
  );
};
