const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if(isEmpty(body.name)){
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        )
    }
  }
} // for newDoc

module.exports = { handleBody }