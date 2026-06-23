/**
 * CropHealth Model
 * Defines the structure for crop health reports
 */

class CropHealth {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.crop = data.crop;
    this.disease = data.disease;
    this.severity = data.severity; // Low, Moderate, High
    this.affectedArea = data.affectedArea || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Validate crop health data
  static validate(data) {
    const errors = [];

    if (!data.userId) {
      errors.push('User ID is required');
    }

    if (!data.crop || data.crop.trim().length < 2) {
      errors.push('Crop name must be at least 2 characters long');
    }

    if (!data.disease || data.disease.trim().length < 2) {
      errors.push('Disease name must be at least 2 characters long');
    }

    if (!data.severity || !['Low', 'Moderate', 'High'].includes(data.severity)) {
      errors.push('Severity must be Low, Moderate, or High');
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
      disease: this.disease,
      severity: this.severity,
      affectedArea: this.affectedArea,
      createdAt: this.createdAt
    };
  }
}

module.exports = CropHealth;
