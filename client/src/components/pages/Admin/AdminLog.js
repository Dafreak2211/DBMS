import React, { useState, useEffect } from "react";
import axios from "axios";
import { LogDeletePopUp } from "./LogDeletePopUp";
import { CSSTransition } from "react-transition-group";
import { Notify } from "../../layout/notify/Notify";

export const AdminLog = () => {
  const [log, setLog] = useState(null);
  const [generalLog, setGeneralLog] = useState(null);

  const [appear, setAppear] = useState(false);
  const [selectedID, setSelectedID] = useState(null);
  const [triggerRerender, setTriggerRerender] = useState(null);

  const [deleteType, setDeleteType] = useState("all");

  const [toggleNotify, setToggleNotify] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const fetchData = async () => {
        const result = await axios("http://localhost:5000/api/logInfo");
        // make default data is order
        let type =
          sessionStorage.getItem("adminLogType") !== null
            ? sessionStorage.getItem("adminLogType")
            : "order";
        let order = result.data.result.filter(each => each.type === type);
        setLog(order);
        setGeneralLog(result.data.result);
      };
      fetchData();
      renderItem();
    } catch (error) {
      console.error(error);
    }
  }, [triggerRerender]);

  function renderItem() {
    let state = sessionStorage.getItem("adminLogType") || "order";
    let target = document.getElementById(state);

    let current = document.querySelector(".admin__log--category-tab.current");
    console.log([target, current]);
    if (target === current) return;
    // inital is Order tab
    else {
      current.classList.remove("current");
      target.classList.add("current");
    }
  }
  function onClick(e) {
    e.preventDefault();
    // filter by type
    let type = e.target.getAttribute("contentType");
    let match = generalLog.filter(each => each.type === type);

    sessionStorage.setItem("adminLogType", type);

    // SWITCH LOG CATEGORY TAG
    document
      .querySelector(".admin__log--category-tab.current")
      .classList.remove("current");
    e.target.classList.add("current");
    setLog(match);
  }

  function changeState(e, log_id, type) {
    if (e) {
      e.preventDefault();
    }
    setAppear(!appear);
    setDeleteType(type);
    setSelectedID(log_id);
  }

  // function onClearAll(e) {
  //   e.preventDefault();

  //   setAppear(!appear);
  // }

  return (
    <div className="admin__log">
      <Notify
        message={message}
        status="success"
        position="bottom-right"
        toggleNotify={toggleNotify}
        setToggleNotify={setToggleNotify}
      />
      {appear && (
        <LogDeletePopUp
          type={deleteType}
          changeState={changeState}
          appear={appear}
          selectedID={selectedID}
          setTriggerRerender={setTriggerRerender}
          setMessage={setMessage}
          setToggleNotify={setToggleNotify}
        ></LogDeletePopUp>
      )}

      <a
        href="#"
        className="btn clearAll__btn btn__purple"
        // onClick={onClearAll}
        onClick={e => changeState(e, "abc", "all")}
      >
        Clear All
      </a>
      <div className="admin__log--category">
        <a
          href="#"
          className="admin__log--category-tab current"
          onClick={onClick}
          contentType="order"
          id="order"
        >
          Order
        </a>
        <a
          href="#"
          className="admin__log--category-tab"
          onClick={onClick}
          contentType="product"
          id="product"
        >
          Product
        </a>
        <a
          href="#"
          className="admin__log--category-tab "
          onClick={onClick}
          contentType="account"
          id="account"
        >
          Account
        </a>
      </div>
      {log &&
        log.map(each => (
          <div className="admin__log--content">
            <div className="admin__log--row">
              <p>
                <span>{each.username}</span> {each.event}
              </p>
              <p>{each.timestamp}</p>
              <a href="#" onClick={e => changeState(e, each.log_id, "single")}>
                <img src="/delete.svg" alt="delete" />
              </a>
            </div>
            {/* each row */}
          </div>
        ))}
    </div>
  );
};
