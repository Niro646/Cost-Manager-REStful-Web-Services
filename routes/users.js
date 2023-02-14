/*

Nir Kedem 209080928
Maor Hamay 307966978

*/
const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
