import React from "react";
import "./Navigation.css";
import { Link } from "react-router-dom";

export const Navigation = ({ history }) => {
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
        <Link to="/logout" className="link__logout" onClick={handleLogout}>
          <img src="/logout.png" alt="" />
          Logout
        </Link>
      </div>
    </div>
  );

  function handleLogout(e) {
    e.preventDefault();
    // Since we didn't use any session in server. Just go ahead and clear all sessionstorage

    sessionStorage.clear();
    history.push("/");
  }
};
