const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  // if (isEmpty(body.name) || isEmpty(body.guestTypeId)) {
  //   return {
  //     error: "Missing fields!"
  //   }
  // }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "guestTypeId",
        "phone",
        "email",
        "status"
      )
    }
  }
} // for newDoc

module.exports = { handleBody }