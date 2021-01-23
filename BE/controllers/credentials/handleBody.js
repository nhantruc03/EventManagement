const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if(isEmpty(body.userId) || isEmpty(body.roleId)){
    return {
      error: "Missing fields!"
    }
  }
  return {
    error: null,
    body: {
      ...pick(body,
        "userId",
        "roleId",
        )
    }
  }
} // for newDoc

module.exports = { handleBody }