export default function checkPermission (listPermissons, listPermissionNeed) {
    let isFounded = listPermissionNeed.some( ai => listPermissons.includes(ai) );
    return isFounded
}