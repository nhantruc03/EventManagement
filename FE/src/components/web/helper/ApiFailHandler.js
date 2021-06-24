import auth from '../../../router/auth';
import { message } from 'antd';
export default function handle(error) {
    console.log('fail message', error)
    switch (error.toLowerCase()) {
        case "jwt expired":
            auth.logout();
            window.location.reload()
            break;
        case "duplicate data":
            message.error('Thông tin đã tồn tại, vui lòng kiểm tra lại!');
            break;
        case "missing fields!":
            message.error('Thông tin yêu cầu bị thiếu, vui lòng kiểm tra lại!');
            break;
        default:
            break;
    }
}