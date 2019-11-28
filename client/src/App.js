import React, { useState } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { SignInPage } from "./components/pages/SignIn&SignUp/SignInPage";
import { StorePage } from "./components/pages/Store/StorePage";
import { AdminPage } from "./components/pages/Admin/AdminPage";
import { SignUpPage } from "./components/pages/SignIn&SignUp/SignUpPage";
import { UnauthorizedPage } from "./components/pages/UnauthorizedPage";

export let AccountContext = React.createContext();

function App() {
  let [username, setUsername] = useState(null);

  return (
    <div className="App">
      <AccountContext.Provider
        value={{
          username,
          updateState: data => {
            setUsername(data);
          }
        }}
      >
        <Router>
          <Switch>
            <Route
              path="/"
              exact
              render={props => {
                let authentication = sessionStorage.getItem("authentication");
                return authentication ? (
                  <Redirect to="/store" />
                ) : (
                  <SignInPage {...props} />
                );
              }}
            ></Route>

            <Route
              path="/signup"
              exact
              render={props => <SignUpPage {...props} />}
            ></Route>
            <Route
              path="/admin"
              render={props => {
                let privilege = sessionStorage.getItem("privilege");
                return privilege === "0" ? (
                  <UnauthorizedPage {...props} />
                ) : (
                  <AdminPage {...props} />
                );
              }}
            ></Route>

            <Route
              path="/store"
              render={props => {
                let authentication = sessionStorage.getItem("authentication");

                return authentication ? (
                  <StorePage {...props} />
                ) : (
                  <Redirect to="/" />
                );
              }}
            ></Route>
          </Switch>
        </Router>
      </AccountContext.Provider>
    </div>
  );
}

export default App;
