const User = require('../models/user');

// Register User
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  
  try {
    await User.create({ username, password, role_id: role });
    res.redirect('/login');
  } catch (err) {
    res.status(500).send('Error in registration');
  }
};

// Login (không dùng Passport.js)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.redirect('/login');
    }

    if (password !== user.password) {
      return res.redirect('/login');
    }

    req.session.user = user;
    res.redirect('/homepage');
  } catch (err) {
    res.status(500).send('Error in login');
  }
};
