const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.name) || isEmpty(body.address) || isEmpty(body.posterUrl) || isEmpty(body.eventTypeId) || isEmpty(body.description)) {
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "startDate",
        "startTime",
        "beginDate",
        "expireDate",
        "address",
        "posterUrl",
        "availUser",
        "tagId",
        "eventTypeId",
        "description",
        "isClone"
        // "faculties"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }