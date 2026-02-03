class Contribution {
    constructor({ id = null, userId, userName = null, userPhoto = null, type, status = "pending", data, createdAt = new Date() }) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userPhoto = userPhoto;
        this.type = type;
        this.status = status;
        this.data = data;
        this.createdAt = createdAt;
    }
}

module.exports = Contribution;
