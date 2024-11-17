exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role_id === 1) return next();
    return res.status(403).send('Unauthorized');
  };
  
  exports.isModerator = (req, res, next) => {
    if (req.user && (req.user.role_id === 2 || req.user.role_id === 1)) return next();
    return res.status(403).send('Unauthorized');
  };
  
  exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  };
  