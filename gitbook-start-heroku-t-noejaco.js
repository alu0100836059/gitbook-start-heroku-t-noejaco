#! /usr/bin/env node


var fs = require('fs');
var path = require('path');
var child = require("child_process");
var exec = require('child_process').exec;
var prompt = require("prompt");
var heroku = require('heroku-client');





function initialize(directorio) {


    console.log("\nGenerando directorio...")

    var contenido='\ngulp.task("deploy-heroku-token", function () {'+
        '\n\tvar heroku = require("gitbook-start-heroku-token-alex-moi");'+
        '\n\tvar url = paquete.repository.url;'+

        '\n\n\ heroku.deploy();'+
        '\n});\n\n';


    //añadimos la tarea
    fs.writeFileSync(path.resolve(process.cwd(),'gulpfile.js'), contenido,  {'flag':'a'},  function(err) {
        if (err) {
            return console.error(err);
        }


    });

    datos(directorio);

};



function datos(directorio){

      var git = require('simple-git')(path.join(process.cwd()));
      // Utilizamos prompt para pedir los datos por consola
      // :nombre de la aplicación, :token y :repositorio
      prompt.get([{
              name: 'nombre_app',
              required: true
            },{
              name: 'token_app',
              required: true
            },{
                name: 'repositorio'
            }], function (err, datos) {

            //-------------------------------------------------
            // Comprobamos las salidas
            console.log('Sus datos son:');
            console.log('  nombre: ' + datos.nombre_app);
            console.log('  token: ' + datos.token_app);
            console.log('  repositorio: ' + datos.repositorio);
           //--------------------------------------------------

            //variable con el contenido de config.json
            var json = '{\n "Heroku":{\n\t"nombre_app": "'+datos.nombre_app+'",\n\t "token_app": "'+datos.token_app+'"\n\t}\n}';

            // Creamos el directorio .token_heroku
            fs.mkdirSync(path.join(process.cwd(), ".token_heroku"));

            // Pasamos a .token_heroku/token.json el contenido de configuración json
            fs.writeFileSync(path.join(process.cwd(),".token_heroku","token.json"),json);

            // token = token.json
            var token = require(path.join(process.cwd(), ".token_heroku","token.json"));

            var package_= require(path.join(process.cwd(), 'package.json'));

            // Creamos el heroku-client con la configuración
            var heroku_ = new heroku({ token : token.Heroku.token_app });

                heroku_.post('/apps', {body: {name: token.Heroku.nombre_app}} ).then(app => {

                    // ¿?¿?¿?¿?
                    //git.init().addRemote('heroku', datos.repositorio).add('.').commit('Primer commit').push('heroku','master');



                });

          });

}

function deploy() {



    console.log("Comenzando el deploy en HEROKU");



    child.exec('git add . ; git commit -m "subiendo a heroku"; git push heroku master;', function(error, stdout, stderr){
        if(error)
          console.log(error)

        console.log(stderr);
        console.log(stdout);
      });



};

module.exports = {
  initialize,
  deploy
}
