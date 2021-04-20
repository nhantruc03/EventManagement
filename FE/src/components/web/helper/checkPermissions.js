export default function checkPermission (listPermissons, listPermissionNeed) {
    console.log(listPermissons)
    let isFounded = listPermissionNeed.some( ai => listPermissons.includes(ai) );
    console.log(isFounded)
    return isFounded
}