/**
 * User Model
 * Defines the structure and validation for user data
 */

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password; // Hashed password
    this.location = data.location || null;
    this.farmLocation = data.farmLocation || null;
    this.cropType = data.cropType || null;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  // Validate user data
  static validate(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Invalid email address');
    }

    if (!data.password || data.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Email validation helper
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Sanitize user data (remove sensitive info)
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      location: this.location,
      farmLocation: this.farmLocation,
      cropType: this.cropType,
      createdAt: this.createdAt
    };
  }
}

module.exports = User;
