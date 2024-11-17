const Donate = require('../models/donate');
const paypal = require('@paypal/checkout-server-sdk');
const { client } = require('../paypalConfig');

// Hiển thị form donate
exports.showDonateForm = (req, res) => {
    res.render('donation/index');
};

// Xử lý quyên góp
exports.processDonate = async (req, res) => {
    const { amount } = req.body;

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: amount.toString()
            }
        }]
    });

    try {
        const order = await client.execute(request);
        const approvalUrl = order.result.links.find(link => link.rel === 'approve').href;
        console.log('Thanh toán thành công:', order);
        res.redirect(approvalUrl);
    } catch (error) {
        console.error('Thanh toán chưa thành công:', error);
        res.status(500).send('Lỗi máy chủ nội bộ');
    }
};

exports.listDonations = async (req, res) => {
    try {
        const donations = await Donate.findAll();
        const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
        res.status(200).json({ donations, totalDonations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
