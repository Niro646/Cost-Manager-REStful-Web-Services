/*

Nir Kedem 209080928
Maor Hamay 307966978

*/

const express = require('express');
const url = require('url');
const { Cost, User } = require('../models/data-base');
const router = express.Router();

//handle incoming POST requests regarding adding new costs
router.post('/', function (req, res) {

    const queryObject = url.parse(req.url, true).query;

    User.findOne({ id: req.body.user_id }, function (error, document) {

        // check if match user in body and user in DB
        if (error==null) {
            if (document==null ) {
                if(!document){
                    res.status(200).send('the userID in collection not match to userID in body');
                }
            } else {
                if((req.body.day>=1&&req.body.day<=31)
                &&(req.body.month>=1&&req.body.month<=12))
                {
                    //create and save new cost in mongoDB by the user add
                    Cost.create(req.body)
                        .then((cost) => {
                            console.log(`create new cost: ${cost}`);
                            res.status(200).send(`Cost created succesfully: ${cost}`);
                        })
                        .catch((error, cost) => {
                            console.error('the error message of !err is: ' +error);
                            res.status(500);
                            res.send('Error creating cost! the category does not match !');
                        });
                }
                else{
                    res.status(200).send('invalid input! - wrong day or month');
                }
            }
        }
    });
});
module.exports = router;
