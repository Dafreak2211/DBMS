import axios from "axios";
import shortid from "shortid";

export const saveLog = (type, event, username) => {
  let info = {
    type,
    event,
    username,
    timestamp: new Date().toLocaleString(),
    logId: shortid.generate()
    // set up server
    // NOTE: SET UP BACKUP USERNAME TO ENSURE THAT
    // WHEN USER REFRESH PAGE IT'S STILL AVAILABLE
  };

  axios({
    url: "http://localhost:5000/api/log",
    method: "POST",
    data: info
  });
};
