import React from "react";
import { Navigation } from "../../layout/navigation/Navigation";
import { Illustration } from "./Illustration";
import "./style.css";
import { GoBack } from "./GoBack";

export const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <Navigation />
      <div className="container">
        <Illustration />
        <GoBack />
      </div>
    </div>
  );
};
