'use strict';
const CryptoJS = require("crypto-js");

module.exports = { 
    name: 'crypto-js' , 
    generateUUID: () => CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.sha256) 
}