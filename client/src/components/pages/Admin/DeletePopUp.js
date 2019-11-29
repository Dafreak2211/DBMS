import React from "react";
import axios from "axios";
import { AccountContext } from "../../../App";
import { saveLog } from "../../../ultis/Log";

export const DeletePopUp = props => {
  const {
    itemForUpdate,
    setTriggerRerender,
    setDeletePopupAppear,
    deletePopupAppear
  } = props;

  async function onDelete(e, context) {
    e.preventDefault();
    let respond = await axios({
      method: "post",
      url: "http://localhost:5000/api/delete",
      data: {
        product_id: itemForUpdate.product_id
      }
    });

    if (respond.data.status === "success") {
      // Cannot update quantity

      saveLog(
        "product",
        `delete ${itemForUpdate.product_name}`,
        context.username || sessionStorage.getItem("username")
      );
      // force re-render to update data
      setTriggerRerender(Math.random());
      setDeletePopupAppear(!deletePopupAppear);
    } else if (respond.data.status === "failed") {
      alert("Failed");
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
      <AccountContext.Consumer>
        {context => (
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
              <a
                href="#"
                className="btn btn-small modalBtn"
                onClick={e => onDelete(e, context)}
              >
                Delete
              </a>
            </div>
          </div>
        )}
      </AccountContext.Consumer>
    </div>
  );
};
