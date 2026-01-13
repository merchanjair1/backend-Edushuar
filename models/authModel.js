class Auth {
    constructor({ uid, email, passwordHash = null }) {
        this.uid = uid
        this.email = email
        this.passwordHash = passwordHash 
    }
}

module.exports = Auth
