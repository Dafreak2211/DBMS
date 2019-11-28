import React, { useState, useEffect } from "react";
import "./SignInPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { saveLog } from "../../../ultis/Log";
import { AccountContext } from "../../../App";
import { Loader } from "../../layout/loader/Loader";

export const SignInPage = props => {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  let [formError, setFormError] = useState(null);
  let [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 1500);
  }, []);

  function revealPassword(e) {
    const inputField = document.getElementById("password");
    const currentType = inputField.getAttribute("type");
    currentType === "password"
      ? inputField.setAttribute("type", "text")
      : inputField.setAttribute("type", "password");
  }

  return (
    <div className="account-page">
      <Loader class={loader ? "loader-wrapper" : "loader-wrapper disappear"} />}
      <form className="account-form">
        <h3 className="account-form__header">Sign In</h3>
        {formError && <div className="form__error">{formError}</div>}
        <div className="list-group">
          <input
            autoComplete="off"
            type="text"
            onChange={e => {
              setUsername(e.target.value);
              setFormError(null);
            }}
            name="username"
            required
            id="username"
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="list-group">
          <input
            autoComplete="off"
            type="password"
            onChange={e => {
              setPassword(e.target.value);
              setFormError(null);
            }}
            name="password"
            required
            id="password"
          />
          <label htmlFor="password">Password</label>
          <span onClick={revealPassword}>
            <img src="/eye.png" alt="" />
          </span>
        </div>

        <div className="button-container">
          <AccountContext.Consumer>
            {context => (
              <Link
                to="/store"
                onClick={e => onClick(e, context)}
                className="btn signInBtn"
              >
                Sign in
              </Link>
            )}
          </AccountContext.Consumer>
        </div>
        <div className="form__alternative">
          <p>
            Create new account ? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );

  function resetError() {
    setTimeout(() => setFormError(""), 1000);
  }
  async function onClick(e, context) {
    e.preventDefault();

    if (!username) {
      setFormError("Username is required");
      resetError();
    } else if (!password) {
      setFormError("Password is required");
      resetError();
    } else {
      let respond = await axios({
        url: "http://localhost:5000/api/account",
        method: "POST",
        data: {
          username,
          password
        }
      });

      if (respond.data.status === "failed") {
        setFormError(respond.data.error);
      } else if (respond.data.status === "success") {
        sessionStorage.setItem("authentication", true);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("privilege", respond.data.isPrivileged);
        context.updateState(username);
        // log file
        saveLog("account", "sign in", username);

        props.history.push("/store");
      }
    }
  }
};

// stop other accounts access Admin Panel except the authorized account
// 1. check matching to specific username/password ??
// 2. set one additional property call role="admin"
