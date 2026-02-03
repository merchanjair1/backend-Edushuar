class ContributionHistory {
    constructor({ id = null, contributionId, status, resolvedAt = new Date(), resolvedBy = null, userName, userPhoto, contributionData }) {
        this.id = id;
        this.contributionId = contributionId;
        this.status = status;
        this.resolvedAt = resolvedAt;
        this.resolvedBy = resolvedBy;
        this.userName = userName;
        this.userPhoto = userPhoto;
        this.contributionData = contributionData;
    }
}

module.exports = ContributionHistory;
