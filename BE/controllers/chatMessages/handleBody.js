const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.groupID) || isEmpty(body.userID)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "groupID",
        "userID",
        "text",
        "resourceUrl"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }