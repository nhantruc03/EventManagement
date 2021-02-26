const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if (isEmpty(body.phone) || isEmpty(body.email) || isEmpty(body.gender) || isEmpty(body.birthday) || isEmpty(body.roleId)) {
    return {
      error: "Missing fields!"
    }
  }
  if (body.phone != null && isNaN(body.phone)) {
    return {
      error: "Phone Number only contains numbers"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "name",
        "birthday",
        "address",
        "phone",
        "username",
        "password",
        "email",
        "roleId",
        "gender")
    }
  }
} // for newDoc

module.exports = { handleBody }