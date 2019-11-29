import React, { useState, useEffect } from "react";
import "./SignInPage.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { AccountContext } from "../../../App";
import { saveLog } from "../../../ultis/Log";
import shortid from "shortid";
import "particles.js/particles";

const particlesJS = window.particlesJS;

export const SignUpPage = props => {
  let [username, setUsername] = useState("");
  let [fullname, setFullname] = useState("");
  let [password, setPassword] = useState("");
  let [repassword, setRePassword] = useState("");

  let [formError, setFormError] = useState(null);

  useEffect(() => {
    particlesJS.load(
      "particles-js",
      "/assets/particlesjs-config.json",
      function() {}
    );
  }, []);

  return (
    <div className="account-page" id="particles-js">
      <AccountContext.Consumer>
        {context => (
          <form className="account-form" onSubmit={e => onSubmit(e, context)}>
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
              <button type="submit" className="btn signInBtn">
                Sign Up
              </button>
            </div>
            <div className="form__alternative">
              <p>
                Already have an account ? <Link to="/">Sign In</Link>
              </p>
            </div>
          </form>
        )}
      </AccountContext.Consumer>
    </div>
  );

  function resetError() {
    setTimeout(() => setFormError(""), 1000);
  }

  async function onSubmit(e, context) {
    e.preventDefault();

    if (password !== repassword) {
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
  }
};
