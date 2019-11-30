import React, { useState } from "react";
import "./Notify.css";

export const Notify = ({
  message,
  status,
  position,
  toggleNotify,
  setToggleNotify
}) => {
  return (
    <div
      className={`notify ${position} ${status} ${toggleNotify ? "" : "appear"}`}
      onClick={() => setToggleNotify(!toggleNotify)}
    >
      <div className={`notify__dash`}></div>
      <div className="notify__message">
        <p>{message}</p>
      </div>
    </div>
  );
};
