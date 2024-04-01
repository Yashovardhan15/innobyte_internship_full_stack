function loginverify(req, res) {
    req.check("email");
    req.check("password").notEmpty().withMessage("Password required").trim();
  
    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ errors: errors });
    }
  }
  
  module.exports = loginverify;



