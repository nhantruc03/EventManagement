const { pick } = require('lodash')
const EventAssign = require('../models/eventAssign')

async function getPermission(eventId, userId, systemRoleId) {
    let data = {
        eventId,
        userId
    }
    const query = { ...pick(data, 'eventId', 'userId'), isDeleted: false }

    event_assign = await EventAssign.find(query)

    let permissons = [systemRoleId];

    if (event_assign[0]) {
        if (event_assign[0].credentialsId) {
            permissons = [...permissons, ...event_assign[0].credentialsId]
        }
        if (event_assign[0].roleId) {
            permissons = [...permissons, event_assign[0].roleId._id]
        }
    }

    return permissons
}

function checkPermission(listPermissons, listPermissionNeed) {
    let isFounded = listPermissionNeed.some(ai => listPermissons.some(bi=> bi.toString() === ai.toString()));
    return isFounded
}


module.exports = { getPermission, checkPermission }