import React, { useState } from "react";

import "./Loader.css";

export const Loader = props => {
  // const [loader, setLoader] = useState(true);

  return (
    <div className={props.class}>
      <div className="loader">
        <img src="/Interwind-1s-200px.svg" alt="" />
      </div>
    </div>
  );
};
