;
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

            }


        }


    }


    return app.init();
})()
