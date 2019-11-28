import React from "react";
import { Link } from "react-router-dom";

export const GoBack = () => {
  return (
    <div className="goback">
      <p>You don't have authentication to access this page. Please go back !</p>
      <div className="button-container">
        <Link to="/store" className="btn btn-inverse">
          Go back
        </Link>
      </div>
    </div>
  );
};
