// i18n.js
const i18n = require('i18n');
const path = require('path');

i18n.configure({
    locales: ['en', 'vi'], // Thêm các ngôn ngữ hỗ trợ, ví dụ 'en' (tiếng Anh), 'vi' (tiếng Việt)
    directory: path.join(__dirname, 'locales'), // Đường dẫn đến các tệp ngôn ngữ
    defaultLocale: 'en',
    cookie: 'lang', // Tên cookie để lưu ngôn ngữ
    queryParameter: 'lang', // Tên tham số query trong URL để thay đổi ngôn ngữ
    autoReload: true, // Tự động tải lại các tệp ngôn ngữ khi có thay đổi
    syncFiles: true // Đồng bộ các tệp ngôn ngữ giữa các ngôn ngữ
});

module.exports = i18n;
