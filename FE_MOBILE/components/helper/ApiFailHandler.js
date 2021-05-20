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
        default:
            break;
    }
    return temp
}