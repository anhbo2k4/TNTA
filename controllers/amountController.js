const Amount = require('../models/amount');

// Lấy tất cả mức donate
exports.getAllAmounts = async (req, res) => {
    try {
        const amounts = await Amount.findAll();
        res.json(amounts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
