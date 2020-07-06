// import axios from 'axios';
const axios = require('axios');
const instance = axios.create({
    baseURL:  'http://localhost:8080',//'http://www.jason-oyp.work',
    headers: { 'Authorization': localStorage.getItem('token') }
});

module.exports = instance;