const express = require('express');
const router = express.Router();
const donateController = require('../controllers/donateController');
const Donate = require('../models/donate');
// Hiển thị form donate
router.get('/', async (req, res) => {
    try {
        const donations = await Donate.findAll();
        const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
        res.render('donation/index', { donations, totalDonations });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Xử lý donate
// router.post('/donate', donateController.processDonate);

// Hiển thị danh sách donate


// router.post('/paypal', donateController.processDonate);


module.exports = router;
