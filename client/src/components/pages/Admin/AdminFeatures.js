import React, { useState } from "react";
import axios from "axios";

export const AdminFeature = ({ modal, setModal, setStore }) => {
  const [input, setInput] = useState("");

  function onSearch(e) {
    setInput(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();

    let respond = await axios({
      url: "http://localhost:5000/api/search",
      method: "POST",
      data: {
        key: input
      }
    });

    console.log(respond.data.result);
    setStore(respond.data.result);
    // finish up the search feature... full text search ?? may be
  }

  return (
    <>
      <div className="admin-page__features">
        <div className="admin-page__features--add button-container">
          <a href="#" className="btn addBtn" onClick={() => setModal(!modal)}>
            Add
          </a>
        </div>
        <div className="admin-page__features--search ">
          <form onSubmit={onSubmit}>
            <input
              onChange={onSearch}
              autoComplete="off"
              type="text"
              name="search"
              value={input}
              placeholder="Search for product..."
            />
            <img src="/search.svg" alt="" />
          </form>
        </div>
      </div>
      {/* end admin features */}
    </>
  );
};
