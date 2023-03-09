var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
      res.render("index", {
        title: "Message Board Home",
        error: null,// err,
        data: null//results
      });
    });

module.exports = router;