let express = require('express');
let formidable = require('formidable')

let router = express.Router();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/upload', (req, res) => {

  let form = new formidable.IncomingForm({ //recuperando o formulario
    uploadDir: './upload',
    keepExtensions: true,
  })

  //tratando as requisições
  form.parse(req, (err, fields, files) => {
    res.json({
      files
    })
  })

  res.json(req.body)
})

module.exports = router;
