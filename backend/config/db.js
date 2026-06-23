/**
 * In-memory database for Week 4
 * This will be replaced with MongoDB in Week 5
 */

// In-memory arrays to store data
let users = [];
let queries = [];
let cropReports = [];

// Initialize with some sample data for testing
const initializeSampleData = () => {
  if (users.length === 0) {
    users = [
      {
        id: '1',
        name: 'Demo Farmer',
        email: 'farmer@example.com',
        password: '$2a$10$demo_hashed_password', // This is a placeholder
        location: 'Punjab',
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (queries.length === 0) {
    queries = [
      {
        id: '1',
        userId: '1',
        crop: 'Rice',
        issue: 'Brown spots on leaves',
        diagnosis: 'Possible fungal leaf blight',
        recommendation: 'Use copper fungicide and improve drainage',
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (cropReports.length === 0) {
    cropReports = [
      {
        id: '1',
        userId: '1',
        crop: 'Wheat',
        disease: 'Rust',
        severity: 'Moderate',
        affectedArea: '2 acres',
        createdAt: new Date().toISOString()
      }
    ];
  }
};

// Initialize sample data
initializeSampleData();

// Database operations
const db = {
  // User operations
  users: {
    findAll: () => users,
    findById: (id) => users.find(u => u.id === id),
    findByEmail: (email) => users.find(u => u.email === email),
    create: (userData) => {
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      users.push(newUser);
      return newUser;
    },
    update: (id, updates) => {
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return users[index];
      }
      return null;
    },
    delete: (id) => {
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  // Query operations
  queries: {
    findAll: () => queries,
    findById: (id) => queries.find(q => q.id === id),
    findByUserId: (userId) => queries.filter(q => q.userId === userId),
    create: (queryData) => {
      const newQuery = {
        id: Date.now().toString(),
        ...queryData,
        createdAt: new Date().toISOString()
      };
      queries.push(newQuery);
      return newQuery;
    },
    update: (id, updates) => {
      const index = queries.findIndex(q => q.id === id);
      if (index !== -1) {
        queries[index] = { ...queries[index], ...updates };
        return queries[index];
      }
      return null;
    },
    delete: (id) => {
      const index = queries.findIndex(q => q.id === id);
      if (index !== -1) {
        queries.splice(index, 1);
        return true;
      }
      return false;
    },
    search: (query) => {
      const searchTerm = query.toLowerCase();
      return queries.filter(q => 
        q.crop.toLowerCase().includes(searchTerm) ||
        q.issue.toLowerCase().includes(searchTerm) ||
        q.diagnosis.toLowerCase().includes(searchTerm)
      );
    }
  },

  // Crop report operations
  cropReports: {
    findAll: () => cropReports,
    findById: (id) => cropReports.find(r => r.id === id),
    findByUserId: (userId) => cropReports.filter(r => r.userId === userId),
    create: (reportData) => {
      const newReport = {
        id: Date.now().toString(),
        ...reportData,
        createdAt: new Date().toISOString()
      };
      cropReports.push(newReport);
      return newReport;
    },
    update: (id, updates) => {
      const index = cropReports.findIndex(r => r.id === id);
      if (index !== -1) {
        cropReports[index] = { ...cropReports[index], ...updates };
        return cropReports[index];
      }
      return null;
    },
    delete: (id) => {
      const index = cropReports.findIndex(r => r.id === id);
      if (index !== -1) {
        cropReports.splice(index, 1);
        return true;
      }
      return false;
    }
  },

  // Reset database (for testing)
  reset: () => {
    users = [];
    queries = [];
    cropReports = [];
    initializeSampleData();
  }
};

module.exports = db;
