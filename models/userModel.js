class User {
  constructor({ id = null, authId, email, firstName, lastName, photoProfile = null, birthdate = null, role = "student", status = "active", createdAt = null }) {
    this.id = id
    this.authId = authId
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
    this.photoProfile = photoProfile
    this.birthdate = birthdate
    this.role = role
    this.status = status
    this.createdAt = createdAt
  }
}

module.exports = User
