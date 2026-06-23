/**
 * Query Model
 * Defines the structure for crop advisory queries
 */

class Query {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.crop = data.crop;
    this.issue = data.issue;
    this.diagnosis = data.diagnosis || null;
    this.recommendation = data.recommendation || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Validate query data
  static validate(data) {
    const errors = [];

    if (!data.userId) {
      errors.push('User ID is required');
    }

    if (!data.crop || data.crop.trim().length < 2) {
      errors.push('Crop name must be at least 2 characters long');
    }

    if (!data.issue || data.issue.trim().length < 5) {
      errors.push('Issue description must be at least 5 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      crop: this.crop,
      issue: this.issue,
      diagnosis: this.diagnosis,
      recommendation: this.recommendation,
      createdAt: this.createdAt
    };
  }
}

module.exports = Query;
