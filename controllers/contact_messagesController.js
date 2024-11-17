const ContactMessage = require('../models/contact_messages');

// Tạo một tin nhắn liên hệ mới
exports.createContactMessage = async (req, res) => {
    try {
        const { full_name, email, phone_number, message } = req.body;
        const newMessage = await ContactMessage.create({
            full_name,
            email,
            phone_number,
            message
        });
        res.status(201).render('contact');
    } catch (error) {
        res.status(500).json({ error: 'Không thể tạo tin nhắn liên hệ' });
    }
};

// Lấy tất cả các tin nhắn liên hệ
exports.getAllContactMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.findAll();
        res.status(200).render('contact_messages', { messages });
    } catch (error) {
        res.status(500).render('error', { error: 'Không thể lấy tin nhắn liên hệ' });
    }
};

// Lấy một tin nhắn liên hệ theo ID
exports.getContactMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await ContactMessage.findByPk(id);
        if (message) {
            res.status(200).json(message);
        } else {
            res.status(404).json({ error: 'Không tìm thấy tin nhắn liên hệ' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy tin nhắn liên hệ' });
    }
};

// Cập nhật một tin nhắn liên hệ theo ID
exports.updateContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, phone_number, message } = req.body;
        const [updated] = await ContactMessage.update({
            full_name,
            email,
            phone_number,
            message
        }, {
            where: { id }
        });
        if (updated) {
            const updatedMessage = await ContactMessage.findByPk(id);
            res.status(200).json(updatedMessage);
        } else {
            res.status(404).json({ error: 'Không tìm thấy tin nhắn liên hệ' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Không thể cập nhật tin nhắn liên hệ' });
    }
};

// Xóa một tin nhắn liên hệ theo ID
exports.deleteContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ContactMessage.destroy({
            where: { id }
        });
        if (deleted) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'Không tìm thấy tin nhắn liên hệ' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Không thể xóa tin nhắn liên hệ' });
    }
};
