const { pick } = require("lodash")
const { isEmpty } = require("lodash");
const handleBody = (body) => {
  if(isEmpty(body.userId) || isEmpty(body.actionId) || isEmpty(body.role)){
    return {
      error: "Missing fields!"
    }
  }

  if (body.role != null && isNaN(body.role)) {
    return {
      error: "Role only contains numbers"
    }
  }

  return {
    error: null,
    body: {
      ...pick(body,
        "userId",
        "actionId",
        "role",
        )
    }
  }
} // for newDoc

module.exports = { handleBody }