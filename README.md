herman-sessions-tutorial
========================

Una introducción a sessions (sesiones) usando NodeJS y ExpressJS

# Ejemplo Simple

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

