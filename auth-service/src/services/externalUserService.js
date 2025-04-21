// services/externalUserService.js
const axios = require('axios');

// Configure base URL from environment variables
const USER_REGISTRATION_URL = process.env.USER_REGISTRATION_URL || 'http://user-registration-service:8002';

/**
 * Client for communicating with the external user registration service
 */
const externalUserService = {
  // Validate a user in the external system
  async validateUser(userId) {
    try {
      const response = await axios.get(`${USER_REGISTRATION_URL}/validate/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`External user validation error: ${error.message}`);
      return { valid: false };
    }
  },

  // Get a user from the external system
  async getUser(userId) {
    try {
      const response = await axios.get(`${USER_REGISTRATION_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`External user fetch error: ${error.message}`);
      return null;
    }
  },

  // List users from the external system
  async listUsers(role = null) {
    try {
      const url = role ? `${USER_REGISTRATION_URL}/users?role=${role}` : `${USER_REGISTRATION_URL}/users`;
      const response = await axios.get(url);
      return response.data.users || [];
    } catch (error) {
      console.error(`External users list error: ${error.message}`);
      return [];
    }
  },

  // Check if email exists in external system
  async emailExists(email) {
    try {
      const users = await this.listUsers();
      return users.some(user => user.email === email);
    } catch (error) {
      console.error(`Email check error: ${error.message}`);
      return false;
    }
  }
};

module.exports = externalUserService;