import React, { useEffect } from "react";

export const AdminTabs = ({ tab, setTab }) => {
  useEffect(() => {
    renderDom();
  });

  function renderDom() {
    // Ensure after refresh still stay in the same tab
    let whichTab = tab === true ? "general" : "history";
    let current = document.querySelector(".admin__tab--current");
    let a = document.getElementById(whichTab);

    // if current leave tab is inital tab(general)
    if (current === a) {
      return;
    } else {
      current.removeAttribute("class");
      a.classList.add("admin__tab--current");
    }
  }

  function switchTab(e) {
    let current = document.querySelector(".admin__tab--current");
    let target = e.target;
    if (current !== target) {
      current.removeAttribute("class");
      target.classList.add("admin__tab--current");

      let storage = tab ? false : true;
      // tab ? "history" : "general";
      // save oppsite b/c after setTab the position will be switched
      sessionStorage.setItem("admintab", storage);
      setTab(!tab);
    } else {
      return;
    }
  }

  return (
    <div className="admin__tab">
      <div className="container">
        <div className="admin__tab--wrapper">
          <p
            className="admin__tab--current"
            onClick={switchTab}
            contentData="general"
            id="general"
          >
            General
          </p>
          <p onClick={switchTab} contentData="history" id="history">
            History
          </p>
        </div>
      </div>
      <div className="admin__tab--background"></div>
    </div>
  );
};
