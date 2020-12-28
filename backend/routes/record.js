const express = require('express');
const { CreateNewAccessCode,
        getAllRecords,
        ValidateAccessCode
      } = require('../controllers/recordController');

const route = express.Router();

route.post('/record', CreateNewAccessCode);
route.post('/verify', ValidateAccessCode);
route.get('/records', getAllRecords); 


module.exports = {
    routes: route
}
