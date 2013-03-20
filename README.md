herman-sessions-tutorial
========================

Una introducción a sessions (sesiones) usando NodeJS y ExpressJS

## Ejemplo Simple

````bash
$ sudo npm install -g express
$ mkdir ejemplo_simple
$ cd ejemplo_simple
$ express
$ npm install
````

En `ejemplo_simple` corremos `app.js`

````bash
$ node app.js
Express server listening on port 3000
````

Si hacemos un request, vemos que express no arroja cookie.

![Pantallazo](http://cl.ly/image/1K2a2v1I1i0G/Screen%20Shot%202013-03-20%20at%208.27.56%20AM.png)

Una rápida inspección al _html_ nos muestra además que no hay información para que pensemos que hay algún tipo de sesión.

Agreguemos soporte de sesiones a nuestra aplicación (disclaimer: este es el ejemplo esencial que aparece por ahí en internet. Pero es para que empecemos).

* `app.js`

````js
//...

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // Cambios introducidos al express básico
  app.use(express.cookieParser());
  app.use(express.session({secret: 'crazy clown'}));
  // Fin de los cambios

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

//...
````

Una rápida inspección nos muestra que ahora tenemos soporte para cookies. La sesión está implementada.

![Pantallazo](http://cl.ly/image/043L0e0A2F0D/Screen%20Shot%202013-03-20%20at%208.31.09%20AM.png)

Aún si, no hemos hecho nada valioso. Simplemente tenemos una cookie _bindeada_ (por inglés _bind_ que significa "amarre" o "amarrar") a un identificador de sesión. Implementaremos un rudimentario contador de visitas para darle valor a esta implementación.

Lo primero que haremos es reconocer al objeto de sesiones, el cual es una propiedad de `req`, la abstracción de la _request_ hecha al servidor

* `routes/index.js`

````js
exports.index = function(req, res){
  // Reconozcamos el objeto de sesión
  console.log(req.sessionID);
  console.log(req.session);

  res.render('index', { title: 'Express' });
};
````

Al correr el programa, e invocar a `/` obtendremos:

````bash
[ hermanjunge: ~/sess/ejemplo_simple ]$ node app.js
Express server listening on port 3000
W9AQREyG7MT9UvTJETN8tsDT
{ cookie:
   { path: '/',
     _expires: null,
     originalMaxAge: null,
     httpOnly: true } }
GET / 200 29ms - 170
GET /stylesheets/style.css 304 9ms
````

Que es la información de `id` de la sesión y lo que viene por defecto. Nuestra idea es añadir una variable a `req.session` para poder contar las visitas. Esta es la modificación que haremos:

* `routes/index.js`

````js
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
````

Ejecutando el programa, y haciendo varios requests a `/` vemos el resultado en la consola:

````bash
[ hermanjunge: ~/sess/ejemplo_simple ]$ node app.js
Express server listening on port 3000
1
GET / 200 38ms - 170
GET /stylesheets/style.css 304 1ms
2
GET / 200 4ms - 170
GET /stylesheets/style.css 304 1ms
3
GET / 200 2ms - 170
GET /stylesheets/style.css 304 1ms
4
GET / 200 2ms - 170
GET /stylesheets/style.css 304 0ms
5
GET / 200 3ms - 170
GET /stylesheets/style.css 304 1ms
6
GET / 200 3ms - 170
GET /stylesheets/style.css 304 1ms
7
GET / 200 2ms - 170
GET /stylesheets/style.css 304 2ms
````

Ya que somos desconfiados (siempre debemos serlo), vamos a llamar a `http://localhost:3000/` desde otro browser y veremos el resultado:

```bash
6
GET / 200 3ms - 170
GET /stylesheets/style.css 304 1ms
7
GET / 200 2ms - 170
GET /stylesheets/style.css 304 2ms
1
GET / 200 4ms - 170
GET /stylesheets/style.css 200 1ms - 110
2
GET / 200 3ms - 170
GET /stylesheets/style.css 304 0ms
3
GET / 200 2ms - 170
GET /stylesheets/style.css 304 1ms
8
GET / 200 2ms - 170
GET /stylesheets/style.css 304 1ms
9
GET / 200 2ms - 170
GET /stylesheets/style.css 304 1ms
```

Podemos ver que la cuenta del primer browser no se vió afectada y que el segundo browser tiene su propia cuenta. Nuestra sesión funciona!

## Sesión con user y password

Por supuesto que queremos más, y no hablo de implementar la variable de las visitas en las vistas, ni otros _eye_candy_. Hablo de poder habilitar una sesión dados un user y password adecuados. Esto es lo que haremos en el siguiente ejemplo.

Primero creemos el ambiente en express:

````bash
$ mkdir user_pass
$ cd user_pass
$ express
$ npm install
````

Modificamos nuevamente `app.js`

* `app.js`

````js
//...

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // Cambios introducidos al express básico
  app.use(express.cookieParser());
  app.use(express.session({secret: 'crazy clown'}));
  // Fin de los cambios

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

//...
````

Y bueno, vamos a crear un formulario de login muy primitivo:

### Formulario de login en express 

Las rutas:

* `app.js`

````js
app.get('/', routes.index);
app.get('/users', user.list);

// Rutas para el login
app.get('/login', routes.get_login);
app.post('/login', routes.post_login);
// Fin de las Rutas para el login

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
````

Que necesitan sus respectivos _controller handlers_:

* `routes/index.js`

````js
exports.get_login = function (req, res) {
  res.render('get_login');
}

exports.post_login = function (req, res) {

  // PLACEHOLDER
  res.send('Aquí debería ir la respuesta al POST /login')
  // PLACEHOLDER-END
}
````

Veremos en unos instantes qué es lo que hay que hacer con el _handler_ del `POST`. Queremos terminar luego nuestro formulario.

* `views/get_login.jade`

````jade

````
