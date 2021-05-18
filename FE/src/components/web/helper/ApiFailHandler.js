import auth from '../../../router/auth';
export default function handle (message) {
    console.log('fail message',message)
    switch (message.toLowerCase()) {
        case "jwt expired":
            auth.logout();
            window.location.reload()
            break;

        default:
            break;
    }
}