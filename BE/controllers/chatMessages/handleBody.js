const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.roomId) || isEmpty(body.userId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "roomId",
        "userId",
        "text",
        "resourceUrl"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }