import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { AUTH } from "../../env"
export default async function getCredentials(eventId) {
    let login = localStorage.getItem('login');
    let user = JSON.parse(login);
    const event_assign = await trackPromise(
        axios.post('/api/event-assign/getAll', { eventId: eventId, userId: user.id }, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => res.data.data)
    )


    let list_credentials = [user.roleId];
    if (event_assign[0]) {
        if (event_assign[0].credentialsId) {
            list_credentials = [...list_credentials, ...event_assign[0].credentialsId]
        }
        if (event_assign[0].roleId) {
            list_credentials = [...list_credentials, event_assign[0].roleId._id]
        }
    }

    return list_credentials;
}