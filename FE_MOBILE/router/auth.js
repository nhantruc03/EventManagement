import AsyncStorage from "@react-native-community/async-storage";

class Auth {
    constructor() {
        this.authenticatedAdmin = false
    }

    async login(data) {
        await AsyncStorage.setItem('login', JSON.stringify(data));
        if (data.role === "Admin") {
            this.authenticatedAdmin = true
        }
    }

    async logout(cb) {
        await AsyncStorage.removeItem('login')
        this.authenticatedAdmin = false
    }

    isAuthenticatedAdmin() {
        try {
            // var test = await AsyncStorage.getItem('login');
            // var obj = JSON.parse(test);
            // await this.login(obj);
            // console.log("user", this.authenticatedAdmin)
            return this.authenticatedAdmin;
        } catch (e) {
            this.authenticatedAdmin = false
            console.log("user", this.authenticatedAdmin)
            return this.authenticatedAdmin;
        }
    }
}

export default new Auth()