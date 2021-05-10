export function sendPushNoti(e) {
    if (e.userId.push_notification_token) {
        fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: e.userId.push_notification_token,
                title: `Thông báo: ${e.name}`,
                body: e.description,
                sound: 'default'
            })
        })
    }
}

export function sendListPushNoti(e) {
    e.forEac(x => {
        if (x.userId.push_notification_token) {
            fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: x.userId.push_notification_token,
                    title: `Thông báo: ${x.name}`,
                    body: x.description,
                    sound: 'default'
                })
            })
        }
    })
}