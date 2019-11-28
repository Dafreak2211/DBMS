import React, { useState, useEffect } from "react";
import "./SignInPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { AccountContext } from "../../../App";
import { saveLog } from "../../../ultis/Log";
import shortid from "shortid";

export const SignUpPage = props => {
  let [username, setUsername] = useState("");
  let [fullname, setFullname] = useState("");
  let [password, setPassword] = useState("");
  let [repassword, setRePassword] = useState("");

  let [formError, setFormError] = useState(null);

  return (
    <div className="account-page">
      <form className="account-form">
        <h3 className="account-form__header">Sign In</h3>
        {formError && <div className="form__error signup">{formError}</div>}
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
            type="text"
            onChange={e => {
              setFullname(e.target.value);
              setFormError(null);
            }}
            name="fullname"
            required
            id="fullname"
          />
          <label htmlFor="fullname">Fullname</label>
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
        </div>
        <div className="list-group">
          <input
            autoComplete="off"
            type="password"
            onChange={e => {
              setRePassword(e.target.value);
              setFormError(null);
            }}
            name="repassword"
            required
            id="repassword"
          />
          <label htmlFor="repassword">Re-Password</label>
        </div>

        <div className="button-container">
          <AccountContext.Consumer>
            {context => (
              <Link
                to="/store"
                onClick={e => onClick(e, context)}
                className="btn signInBtn"
              >
                Sign Up
              </Link>
            )}
          </AccountContext.Consumer>
        </div>
        <div className="form__alternative">
          <p>
            Already have an account ? <Link to="/">Sign In</Link>
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
    } else if (!fullname) {
      setFormError("Fullname is required");
      resetError();
    } else if (!password) {
      setFormError("Password is required");
      resetError();
    } else if (!repassword) {
      setFormError("Repassword is required");
      resetError();
    } else if (password !== repassword) {
      setFormError("Repassword doen't match");
      resetError();
    } else {
      // All data is fullfilled. Starts to check logical
      // Check username existence. If it exists then don't allow to create

      let respond = await axios({
        url: "http://localhost:5000/api/signup",
        method: "POST",
        data: {
          username,
          password,
          id: shortid.generate(),
          fullname
        }
      });

      if (respond.data.status === "failed") {
        setFormError(respond.data.error);
      } else if (respond.data.status === "success") {
        saveLog("account", "sign up", username);
        props.history.push("/");
      }
    }

    // else {
    //

    //   if (respond.data.status === "failed") {
    //     setFormError(respond.data.error);
    //   } else if (respond.data.status === "success") {
    //     sessionStorage.setItem("authentication", true);
    //     sessionStorage.setItem("username", username);
    //     context.updateState(username);
    //     // log file
    //     saveLog("account", "sign in", username);

    //     props.history.push("/store");
    //   }
    // }
  }
};
