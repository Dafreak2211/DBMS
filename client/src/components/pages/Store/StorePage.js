import React, { useState, useContext } from "react";
import { Navigation } from "../../layout/navigation/Navigation";
import { StoreContent } from "../../layout/storecontent/StoreContent";
import { Notify } from "../../layout/notify/Notify";

export const StorePage = ({ history }) => {
  let [toggleNotify, setToggleNotify] = useState(false);

  if (toggleNotify) {
    setTimeout(() => {
      setToggleNotify(!toggleNotify);
    }, 1000);
  }
  return (
    <div className="storepage">
      <Navigation history={history} />
      <StoreContent
        toggleNotify={toggleNotify}
        setToggleNotify={setToggleNotify}
      />

      <Notify
        message="Order successfully"
        status="success"
        position="bottom-left"
        toggleNotify={toggleNotify}
        setToggleNotify={setToggleNotify}
      />
    </div>
  );
};
