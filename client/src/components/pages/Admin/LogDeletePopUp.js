import React, { useState } from "react";
import axios from "axios";

export const LogDeletePopUp = ({
  type,
  changeState,
  appear,
  selectedID,
  setTriggerRerender
}) => {
  function onCancel(e) {
    changeState(!appear);
  }

  const getURL = () => {
    return type === "all"
      ? "http://localhost:5000/api/deleteAllLog"
      : "http://localhost:5000/api/deleteLog";
  };

  async function onDelete(e) {
    e.preventDefault();

    let url = getURL();
    console.log(url);
    let respond = await axios({
      url,
      method: "POST",
      data: {
        id: selectedID
      }
    });

    if (respond.data.status === "success") {
      changeState(!appear);
      setTriggerRerender(Math.random());
    }
    // if (respond.data.stauts === "failed");
  }

  return (
    <div
      className="popup__wrapper appear"
      onClick={e => {
        if (e.target.className === "popup__wrapper appear") {
          changeState(!appear);
        }
      }}
    >
      <div className="popup ">
        <div className="exitBtn" onClick={onCancel}>
          &#x3A7;
        </div>
        <div className="popup__heading">
          {type === "single"
            ? "Are you sure to delete this ?"
            : "Are you sure to delete all of this ?"}
        </div>

        <div className="popup__footer">
          <a
            href="#"
            className="btn btn-small cancelBtn btn__no__bg"
            onClick={onCancel}
          >
            Cancel
          </a>
          <a href="#" className="btn btn-small modalBtn " onClick={onDelete}>
            Delete
          </a>
        </div>
      </div>
    </div>
  );
};
