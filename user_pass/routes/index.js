
/*
 * GET home page.
 */

exports.index = function(req, res) {
  var is_logged_in,
      username,
      fullname;
  // Veamos si el usuario tiene sesión
  if (req.session.is_logged_in) {
    is_logged_in = true;
    username = req.session.user.username;
    fullname = req.session.user.fullname;
  } else {
    is_logged_in = false;
  }

  var renderVars =  { title         : 'Express'
                    , is_logged_in  : is_logged_in
                    , username      : username
                    , fullname      : fullname
                    }

  console.log(renderVars)

  res.render( 'index', renderVars);
}

exports.get_login = function (req, res) {
  res.render('get_login', { title: 'Simple Login'});
}

exports.post_login = function (req, res) {
  var username = req.body.username || '';
  var password = req.body.password || '';

  mockDatabaseQuery(username, password, onDBResponse);

  function onDBResponse (response) {
    if (response === 'ERROR') return res.send('Error en la Autenticación');
    if (response === 'OK') return autenticacionOK();
  }

  function autenticacionOK () {
    // Ahora rellenemos la sesión
    req.session.is_logged_in  = true;
    req.session.user          = {}
    req.session.user.username = username;
    req.session.user.fullname = 'Juan Carlos Moya';
    return res.redirect('/');
  }
}

// Nuestra función para simular la consulta a la base de datos
function mockDatabaseQuery (username, password, callback) {
  if (username === 'juan' && password === 'moya') {
    callback('OK');
  } else {
    callback('ERROR');
  }
}