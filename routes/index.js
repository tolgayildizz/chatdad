const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(!req.user) {
    res.render('index');
  }
  else {
    res.redirect('/chat');
  }
});

router.get('/getUser', function(req, res, next) {
  res.json(req.user)
});


module.exports = router;
