const axios = require('axios');

const unsplash = axios.create({
  baseURL: 'https://api.unsplash.com',
  params: {
    client_id: process.env.UNSPLASH_ACCESS_KEY 
  }
});

module.exports = unsplash;