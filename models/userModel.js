
class User {
  constructor({ id = null, username, email, password, role = "user", photoProfile = null }) {
    this.id = id
    this.username = username
    this.email = email
    this.password = password
    this.role = role
    this.photoProfile = photoProfile
  }
}

module.exports = User
