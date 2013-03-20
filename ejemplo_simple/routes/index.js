
/*
 * GET home page.
 */

exports.index = function(req, res){
  // Esta lógica nos permitirá llevar un registro de las visitas
  if (!req.session.visit_count) {
    // Si no tenemos la variable implementada, inicialicemosla en 1.
    req.session.visit_count = 1;
  } else {
    // Si existe, la incrementamos en 1.
    req.session.visit_count += 1;
  }

  // Imprimamos por consola el valor
  console.log(req.session.visit_count);

  res.render('index', { title: 'Express' });
};
