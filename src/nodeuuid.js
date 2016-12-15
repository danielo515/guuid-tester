'use strict';
const uuid = require('node-uuid');

module.exports = { 
    name: 'node-uuid' , 
    generateUUID: () => uuid.v4()
}