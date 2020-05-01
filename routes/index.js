let express = require('express');
let router = express.Router();


/***************************************************************
 * Landing Page
 ***************************************************************/
router.get('/', (req, res, next) => {
  res.render('index')
})

module.exports = router;
