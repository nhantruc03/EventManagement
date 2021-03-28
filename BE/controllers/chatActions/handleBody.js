const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.actionId) || isEmpty(body.userId)) {
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
        "text",
        "resourceUrl"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }