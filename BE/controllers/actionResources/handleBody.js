const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.actionId) || isEmpty(body.url) || isEmpty(body.extension)) {
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
        "extension"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }