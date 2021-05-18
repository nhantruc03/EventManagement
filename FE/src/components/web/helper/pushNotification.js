import axios from "axios"
import ApiFailHandler from './ApiFailHandler'
export function sendPushNoti(e) {
    if (e.userId.push_notification_token) {
        let data = JSON.stringify({
            to: e.userId.push_notification_token,
            title: `Thông báo: ${e.name}`,
            body: e.description,
            sound: 'default'
        })
        axios.post('/--/api/v2/push/send', data, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .catch(err => {
                ApiFailHandler(err.response?.data?.error)
            })
    }
}

export function sendListPushNoti(e) {
    e.forEach(x => {
        if (x.userId.push_notification_token) {
            let data = JSON.stringify({
                to: x.userId.push_notification_token,
                title: `Thông báo: ${x.name}`,
                body: x.description,
                sound: 'default'
            })
            axios.post('/--/api/v2/push/send', data, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
        }
    })
}