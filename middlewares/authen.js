// middlewares/authen.js
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.session.userId) { // kiểm tra xem đã đăng nhập hay chưa
            return next();
        }
        res.redirect('/admin/login'); // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
    },
    forwardAuthenticated: (req, res, next) => {
        if (!req.session.userId) { // kiểm tra xem đã đăng nhập hay chưa
            return next();
        }
        res.redirect('/admin'); // Chuyển hướng đến trang dashboard nếu đã xác thực
    }
};