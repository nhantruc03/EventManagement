class Auth {
    constructor() {
        this.authenticatedDoctor = false
        this.authenticatedAdmin = false
        this.authenticatedPharmarcist = false
        this.authenticatedStaff = false
    }

    login(data) {
        localStorage.setItem('login', JSON.stringify(data));
        if (data.role === "Admin") {
            this.authenticatedAdmin = true
            this.authenticatedPharmarcist = true
            this.authenticatedDoctor = true
            this.authenticatedStaff = true
        }
        else if (data.role === "doctor") {
            this.authenticatedAdmin = false
            this.authenticatedPharmarcist = false
            this.authenticatedDoctor = true
            this.authenticatedStaff = false
        }
        else if (data.role === "pharmacist") {
            this.authenticatedAdmin = false
            this.authenticatedPharmarcist = true
            this.authenticatedDoctor = false
            this.authenticatedStaff = false
        }
        else if(data.role === "Nhân viên"){
            this.authenticatedAdmin = false
            this.authenticatedPharmarcist = false
            this.authenticatedDoctor = false
            this.authenticatedStaff = true
        }
    }

    logout(cb) {
        localStorage.removeItem('login')
        this.authenticatedDoctor = false
        this.authenticatedAdmin = false
        this.authenticatedPharmarcist = false
        this.authenticatedStaff = false
    }

    isAuthenticatedAdmin() {
        try {
            var test = localStorage.getItem('login');
            var obj = JSON.parse(test);
            this.login(obj);
            return this.authenticatedAdmin;
        } catch (e) {
            this.authenticatedAdmin = false
            return this.authenticatedAdmin;
        }
    }

    isAuthenticatedDoctor() {
        try {
            var test = localStorage.getItem('login');
            var obj = JSON.parse(test);
            this.login(obj);
            return this.authenticatedDoctor;
        } catch (e) {
            this.authenticatedDoctor = false
            return this.authenticatedDoctor;
        }
    }

    isAuthenticatedPharmacist() {
        try {
            var test = localStorage.getItem('login');
            var obj = JSON.parse(test);
            this.login(obj);
            return this.authenticatedPharmarcist;
        } catch (e) {
            this.authenticatedDoctor = false
            return this.authenticatedPharmarcist;
        }
    }

    isAuthenticatedStaff() {
        try {
            var test = localStorage.getItem('login');
            var obj = JSON.parse(test);
            this.login(obj);
            return (this.authenticatedPharmarcist || this.authenticatedAdmin || this.authenticatedDoctor || this.authenticatedStaff);
        } catch (e) {
            this.authenticatedDoctor = false
            return this.authenticatedPharmarcist;
        }
    }
}

export default new Auth()