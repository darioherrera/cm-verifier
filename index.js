const typesense = require("./pipelines/typsense");
const meta = require("./spiders/metaextract");

(() => {
    const app = {
        apienabled: false, // Verifica los sitios que tengan el api activada
        metaextract: false, // Extrae los metadatos,
        typesensePipe: true, //Importa los datos en typsense
        typesenseReset: true, //Reinicia typsense

        init: async() => {
            console.log(`Arrancando pipelines y procesos `);
            if (app.apienabled) {
                //run apienabled
            }
            else if (app.metaextract) {
                meta.start();
            }
            else if (app.typesensePipe) {
                let serverData = typesense.showCurrentTypsense();
                if (app.typesenseReset) {
                    await typesense.reset();
                }
                console.log(serverData);
                typesense.start();
            }
        },

        startSpiders: () => {

        },

        startPipeLines: () => {

        }


    }
    //starts the project
    return app.init();
})();
