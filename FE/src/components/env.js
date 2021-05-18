var AUTH = ''
try {
    var login = localStorage.getItem('login');
    var obj = JSON.parse(login);
    AUTH = obj.token;
} catch (e) {
    console.log(e);
}


export { AUTH }

const WebSocketServer = 'ws://localhost:3001'
export { WebSocketServer }
