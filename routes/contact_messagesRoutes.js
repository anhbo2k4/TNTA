const express = require('express');
const router = express.Router();
const contactMessagesController = require('../controllers/contact_messagesController');

// Tạo một tin nhắn liên hệ mới
router.post('/', contactMessagesController.createContactMessage);

// Lấy tất cả các tin nhắn liên hệ
router.get('/', contactMessagesController.getAllContactMessages);

// Lấy một tin nhắn liên hệ theo ID
router.get('/:id', contactMessagesController.getContactMessageById);

// Cập nhật một tin nhắn liên hệ theo ID
router.put('/:id', contactMessagesController.updateContactMessage);

// Xóa một tin nhắn liên hệ theo ID
router.delete('/:id', contactMessagesController.deleteContactMessage);

module.exports = router;
