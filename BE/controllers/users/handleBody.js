const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if ((body.phoneNumber != null && isNaN(body.phoneNumber)) || isEmpty(body.role) || isEmpty(body.email) || isEmpty(body.gender) || isEmpty(body.birthday)) {
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
        "phoneNumber",
        "facultyId",
        "departmentId",
        "username",
        "password",
        "role",
        "email",
        "gender")
    }
  }
} // for newDoc

module.exports = { handleBody }