/*

Nir Kedem 209080928
Maor Hamay 307966978

*/
console.log('start about file');
const express = require('express');
const router = express.Router();

/* GET products listing. */
/* GET specific product listing */
router.get('/', function(request,response) {

    const developers = [
        {
            firstname: 'Nir' ,
            lastname:'Kedem' ,
            id:'209080928' ,
            email:'nir602@gmail.com'
        },
        {
            firstname:'Maor' ,
            lastname:'Hamay' ,
            id:'307966978' ,
            email: 'maorhy323@gmail.com'
        }
    ];

    response.status(200);
    response.send(developers);
    return response;
});

module.exports = router;


