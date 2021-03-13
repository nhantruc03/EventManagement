const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.actionId) || isEmpty(body.userId) || isEmpty(body.text)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "actionId",
        "userId",
        "text"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }