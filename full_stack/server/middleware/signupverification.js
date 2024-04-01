function signupverify(req, res) {
    req.check("email")
    req.check("username")
    req.check("password")
  
    const errors = req.validationErrors();
    if (errors) {
      const errorMessage = errors.map((error) => error.msg);
      return res.status(400).json({ errors: errorMessage });
    }
  }
  
  module.exports = signupverify;