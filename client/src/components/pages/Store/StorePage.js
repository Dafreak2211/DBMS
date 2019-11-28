import React, { useState } from "react";
import { Navigation } from "../../layout/navigation/Navigation";
import { StoreContent } from "../../layout/storecontent/StoreContent";

export const StorePage = ({ history }) => {
  return (
    <div className="storepage">
      <Navigation history={history} />
      <StoreContent />
    </div>
  );
};
