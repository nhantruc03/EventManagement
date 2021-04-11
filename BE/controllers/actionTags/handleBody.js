const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if(isEmpty(body.name) || isEmpty(body.background) || isEmpty(body.color)){
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "background",
        "color",
        )
    }
  }
} // for newDoc

module.exports = { handleBody }