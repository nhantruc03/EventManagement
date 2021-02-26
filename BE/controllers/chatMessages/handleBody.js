const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.chatRoomID) || isEmpty(body.userID) || isEmpty(body.text)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "chatRoomID",
        "userID",
        "text"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }