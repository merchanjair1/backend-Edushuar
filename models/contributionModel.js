class Contribution {
    constructor({ id = null, userId, type, status = "pending", data, createdAt = new Date() }) {
        this.id = id;
        this.userId = userId;
        this.type = type;
        this.status = status;
        this.data = data;
        this.createdAt = createdAt;
    }
}

module.exports = Contribution;
