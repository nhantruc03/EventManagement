import axios from "axios";
import Url from "../../env";
import getToken from "../../Auth";
import AsyncStorage from "@react-native-community/async-storage";
export default async function getCredentials(eventId) {
    let login = await AsyncStorage.getItem('login');
    let user = JSON.parse(login);
    const event_assign = await (
        axios.post(`${Url()}/api/event-assign/getAll`, { eventId: eventId, userId: user.id }, {
            headers: {
                'Authorization': await getToken()
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