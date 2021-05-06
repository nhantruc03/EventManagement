const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(bodt.description) || isEmpty(body.userId)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "description",
        "userId",
        "actionId",
        "eventId",
        "scriptId",
      )
    }
  }
} // for newDoc

module.exports = { handleBody }