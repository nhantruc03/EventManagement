const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.actionId) || isEmpty(body.url) || isEmpty(body.extension) || isEmpty(body.userId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "actionId",
        "url",
        "extension",
        "userId"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }