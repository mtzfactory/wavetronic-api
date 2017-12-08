[![Skylab-coders](https://mtzfactory.github.io/logos/png/skylab-coders.png)](http://www.skylabcoders.com/)
![javascript](https://mtzfactory.github.io/logos/png-2/javascript.png)
![nodejs](https://mtzfactory.github.io/logos/png-2/nodejs.png)
![express](https://mtzfactory.github.io/logos/png-2/express.png)
![passport](https://mtzfactory.github.io/logos/png-2/passport.png)
![mongodb](https://mtzfactory.github.io/logos/png-2/mongodb.png)

## WAVETRONIC.

[Wavetronic][wavetronic] es una app realizada en React Navtive, una nueva forma de descubrir y compartir música con tus amigos.

En este repositorio encontrarás el backend de la app en forma de Api REST, realizado en NodeJs/Express con soporte en MongoDB. 

### INSTALACION

Para instalar este proyecto:

```bash
    $ git clone https://github.com/mtzfactory/wavetronic-api
    $ cd wavetronic-api
    $ npm install
    $ npm start
```

### CONFIGURACION

El servidor utiliza una serie de variables de entorno que deben configurarse previamente a su ejecución.
Para ello creamos un fichero _.env_ con el siguiente contenido:

```bash
    DEBUG=app,web,api,auth,usr,jmo
    API_PORT=<api_port>
    API_SECRET=<api_secret_para_passport>
    MONGO_HOST=<host_mongodb>
    MONGO_PORT=<puerto_mongodb>
    MONGO_DB=<base_de_datos_mongodb>
    MONGO_USER=<usuario_mongodb>
    MONGO_PASS=<clave_mongodb>
```

Para poder realizar consultas a nuestro proveedor de contenidos, en este caso [Jamendo][jamendo], debemos registrarnos como desarrollador en su plataforma y configuar nuestro entorno con nuestro identificador de cliente.

```bash
    JAMENDO_CLIENT_ID=<jamendo_client_id>
    JAMENDO_CLIENT_SECRET=<jamendo_client_secret>
```

También es necasio [la _server key_ de Firebase][firebase], para poder enviar y recibir notificaciones push, la cuál la puedes encuentrar en la sección de Configuración / Mensajería en la nube, una vez registres tu proyecto.

```bash
    FCM_SERVER_KEY=<server_key_de_firebase_cloud_messages>
```

### POSTMAN

En la carpeta *postman* se encuentra un fichero que se puede importar a la aplicación con el mismo nombre.
En este fichero estan dados de alta todos los _endpoints_ de nuestra Api así como las diferentes acciones que nos permite, echale un vistazo...

### HEROKU

Una vez hemos probado que todo funciona en local, es hora de subirlo a un servidor en la nube, en este caso hemos escogido *Heroku* por su sencillez de mantenimento, a parte de que es gratis claro ;-)

Del mismo modo que configuramos el entorno en nuestra máquina de desarrollo, debemos hacerlo también en Heroku. Esto lo conseguimos de la siguiente manera:

```bash
    $ heroku config:set API_SECRET=<api_secret_para_passport>
    $ heroku config:set MONGO_HOST=<host_mongodb>
    $ heroku config:set MONGO_PORT=<puerto_mongodb>
    $ heroku config:set MONGO_DB=<base_de_datos_mongodb>
    $ heroku config:set MONGO_USER=<usuario_mongodb>
    $ heroku config:set MONGO_PASS=<>
    $ heroku config:set JAMENDO_CLIENT_ID=<jamendo_client_id>
    $ heroku config:set JAMENDO_CLIENT_SECRET=<jamendo_client_secret>
    $ heroku config:set FCM_SERVER_KEY=<server_key_de_firebase_cloud_messages>
```
La única variable que no se debe configurar es API_PORT, ya que el propio Heroku lo hará por nosotros.

Para comprobar que se ha congigurado correctamente el entorno de Heroku podemos ejecutar el siguiente comando:
```bash
    $ heroku config
```

#### SkylabCoders Academy - Full Stack Web Development Bootcamp

[wavetronic]:https://github.com/mtzfactory/wavetronic-mobile
[firebase]:https://console.firebase.google.com/project
[jamendo]:https://developer.jamendo.com/v3.0