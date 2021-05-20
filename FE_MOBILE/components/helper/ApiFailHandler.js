import auth from './../../router/auth'
export default function handle(message) {
    console.log('fail message', message)
    let temp = {
        isExpired: false,
        message: "",
    }
    switch (message.toLowerCase()) {
        case "jwt expired":
            auth.logout();
            temp.isExpired = true;
            break;
        case "Duplicate data":
            temp.message = "Đã tồn tại"
            break;
        default:
            break;
    }
    return temp
}