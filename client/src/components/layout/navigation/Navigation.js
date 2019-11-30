import React, { useState } from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";
import { saveLog } from "../../../ultis/Log";

export const Navigation = ({ history }) => {
  const [logout, setLogout] = useState(false);

  function onClick(e) {
    e.preventDefault();
    setLogout(!logout);
  }
  return (
    <div className="navigation">
      <div className="container">
        <Link to="/" className="link__home">
          Home
        </Link>
        <Link to="/store" className="link__store">
          <img src="/001-shop.png" alt="" />
          Store
        </Link>
        <Link to="/admin" className="link__admin">
          <img src="/002-id-card.png" alt="" />
          Admin Panel
        </Link>
        <ul className="loginContainer" onClick={e => onClick(e)}>
          <img src="/user.png" alt="" />

          <ul className={logout ? "smooth" : ""}>
            <li>
              haitran <span className="online-status"></span>
            </li>
            <li>
              <Link
                to="/logout"
                className="link__logout hidden"
                onClick={handleLogout}
              >
                <img src="/logout.png" alt="" />
                Logout
              </Link>
            </li>
          </ul>
        </ul>
      </div>
    </div>
  );

  function handleLogout(e) {
    e.preventDefault();
    // Since we didn't use any session in server. Just go ahead and clear all sessionstorage
    saveLog("account", "logout", sessionStorage.getItem("username"));
    sessionStorage.clear();
    history.push("/");
  }
};
