const axios = require('axios');

// URL do JSON Server (dinâmica para Docker ou local)
const JSON_SERVER_URL = process.env.JSON_SERVER_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: JSON_SERVER_URL,
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json'  
  }
});

module.exports = api;