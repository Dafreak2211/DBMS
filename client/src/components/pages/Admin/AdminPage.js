import React, { useState, useEffect } from "react";
import { Navigation } from "../../layout/navigation/Navigation";
import "./AdminPage.css";
import axios from "axios";
import { Modal } from "./Modal";
import { PopUp } from "./PopUp";
import { DeletePopUp } from "./DeletePopUp";
import { AdminFeature } from "./AdminFeatures";
import { AdminProducts } from "./AdminProducts";
import { AdminTabs } from "./AdminTabs";
import { AdminLog } from "./AdminLog";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { Notify } from "../../layout/notify/Notify";

export const AdminPage = ({ history }) => {
  const [store, setStore] = useState(null);
  const [modal, setModal] = useState(false); // open add product modal
  const [itemForUpdate, setItemForUpdate] = useState(null);
  const [triggerRerender, setTriggerRerender] = useState(null);
  const [popupAppear, setpopupAppear] = useState(false); // open edit, update popup
  const [deletePopupAppear, setDeletePopupAppear] = useState(false); // open edit, update popup

  const [tab, setTab] = useState(true); // true means general, false mean history

  let [toggleNotify, setToggleNotify] = useState(false);
  let [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://localhost:5000/api/products");
      setStore(result.data);
    };
    fetchData();
    console.log(sessionStorage.getItem("admintab"));
    // accidentally convert boolean to string
    if (sessionStorage.getItem("admintab") !== null) {
      let boo = sessionStorage.getItem("admintab") === "true" ? true : false;
      setTab(boo);
    }
  }, [triggerRerender]);

  function onEdit(e, product) {
    e.preventDefault();
    setpopupAppear(!popupAppear);
    setItemForUpdate(product);
  }

  function onDelete(e, product) {
    e.preventDefault();
    setDeletePopupAppear(!deletePopupAppear);
    setItemForUpdate(product);
  }

  return (
    <div className="admin-page">
      <Modal
        modal={modal}
        setModal={setModal}
        setTriggerRerender={setTriggerRerender}
        setMessage={setMessage}
        setToggleNotify={setToggleNotify}
      />
      <Notify
        message={message}
        status="success"
        position="bottom-right"
        toggleNotify={toggleNotify}
        setToggleNotify={setToggleNotify}
      />
      <CSSTransition
        in={popupAppear}
        timeout={350}
        classNames="popup"
        unmountOnExit
        appear
      >
        <PopUp
          itemForUpdate={itemForUpdate}
          setTriggerRerender={setTriggerRerender}
          setpopupAppear={setpopupAppear}
          popupAppear={popupAppear}
          setMessage={setMessage}
          setToggleNotify={setToggleNotify}
        />
      </CSSTransition>

      <CSSTransition
        in={deletePopupAppear}
        timeout={350}
        classNames="popup"
        unmountOnExit
        appear
      >
        <DeletePopUp
          itemForUpdate={itemForUpdate}
          setTriggerRerender={setTriggerRerender}
          setDeletePopupAppear={setDeletePopupAppear}
          deletePopupAppear={deletePopupAppear}
          setMessage={setMessage}
          setToggleNotify={setToggleNotify}
        />
      </CSSTransition>

      <Navigation history={history} />
      <div className="container">
        <div className="admin-page__heading">Admin Panel</div>

        <CSSTransition
          in={tab}
          classNames="admin__tab"
          timeout={200}
          unmountOnExit
        >
          <>
            <AdminFeature
              modal={modal}
              setModal={setModal}
              setStore={setStore}
            />
            <AdminProducts store={store} onDelete={onDelete} onEdit={onEdit} />
          </>
        </CSSTransition>

        <CSSTransition
          in={!tab}
          classNames="admin__tab"
          timeout={200}
          unmountOnExit
        >
          <AdminLog />
        </CSSTransition>

        <AdminTabs tab={tab} setTab={setTab} />
      </div>
    </div>
  );
};
