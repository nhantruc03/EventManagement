const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.scriptId) || isEmpty(body.userId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "scriptId",
        "userId",
        "text",
        "resourceUrl"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }