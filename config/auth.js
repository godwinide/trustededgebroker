module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated() && !req.user?.isAdmin) {
      return next();
    }
    req.flash('error_msg', 'Login required');
    res.redirect(303, '/signin');
  },
  ensureAdmin: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      req.flash('error_msg', 'Login required');
      res.redirect(303, '/admin/signin');
    }
    req.flash('error_msg', 'Login required');
    res.redirect(303, '/admin/signin');
  },
  forwardAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect(303, '/');
  }
};