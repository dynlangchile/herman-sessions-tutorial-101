
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.get_login = function (req, res) {
  res.render('get_login');
}

exports.post_login = function (req, res) {

  // PLACEHOLDER
  res.send('Aquí debería ir la respuesta al POST /login')
  // PLACEHOLDER-END
}