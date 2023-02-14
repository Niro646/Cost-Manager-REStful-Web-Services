/*

Nir Kedem 209080928
Maor Hamay 307966978

*/
const express = require('express');
const { Cost } = require('../models/data-base');
const url = require('url');
const router = express.Router();

router.get(`/`, function (req, res) {
    const queryObject = url.parse(req.url, true).query;

    async function findingCostsDocuments() {
        try {
            //looking for specific document in the COST collection in accordance with user input values
            const costDocuments = await Cost.find({
                year: queryObject.year,
                month: queryObject.month,
                user_id: queryObject.user_id
            });

            const reportDocument = {
                sport: [],
                food: [],
                housing: [],
                health: [],
                other: [],
                transportation: [],
                education: []
            };

            //for every cost document exist in DB push relevant properties to the selected category
            costDocuments.forEach((cost) => {
                const category = cost.category;
                const day=cost.day;
                const sum=cost.sum;
                const des=cost.description;
                reportDocument[category].push({day,des,sum});
            });

            console.log(reportDocument);
            res.status(200).send(reportDocument);
        } catch (errorMessage) {
            console.error(errorMessage);
            res.status(500).send('the error is: ' +errorMessage);
            throw errorMessage;
        }

    }
    findingCostsDocuments();
});

module.exports = router;
