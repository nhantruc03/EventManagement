const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.scriptId) || isEmpty(body.description) || isEmpty(body.time)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "scriptId",
        "description",
        "time"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }