// var AUTH = ''


let AUTH = () => {
    try {
        var login = localStorage.getItem('login');
        var obj = JSON.parse(login);
        // AUTH = obj.token;
        return obj.token
    } catch (e) {
        console.log(e);
        return ""
    }
}


export { AUTH }

// heroku deployed
// const WebSocketServer = 'wss://back-e-e.herokuapp.com'

const WebSocketServer = 'ws://localhost:3001'
export { WebSocketServer }
