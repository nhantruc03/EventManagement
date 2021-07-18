let AUTH = () => {
    var login = localStorage.getItem('login');
    var obj = JSON.parse(login);
    return obj.token ? obj.token : ""
}
// heroku deployed
// const WebSocketServer = 'wss://back-e-e.herokuapp.com'

const WebSocketServer = 'ws://localhost:3001'
export { AUTH, WebSocketServer }
