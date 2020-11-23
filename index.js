const typsense = require("./pipelines/typsense");

 
(() => {
    const app = {
        apienabled: false, // Verifica los sitios que tengan el api activada
        metaextract: false, // Extrae los metadatos,
        typesense: true,

        init: async() => {
            console.log(`Arrancando pipelines y procesos `);
            if (app.apienabled) {
                //run apienabled
            }
            else if (app.metaextract) {

            }
            else if (app.typesense) {
                let serverData = typsense.showCurrentTypsense();
                console.log(serverData);
                typesense.start();
            }


        }


    }

    //starts the project
    return app.init();
})();
