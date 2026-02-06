/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */


define(['N/ui/dialog'],

    function(dialog) {

        function helloWorld() {

            var options = {
                title: 'Hola',
                message: 'Cambió de Valor!'
            };
        
            try {
           
                dialog.alert(options);
           
                log.debug ({
                    title: 'Success',
                    details: 'Funciona la prueba fieldChanged'
                });
        
            } catch (e) {
           
                log.error ({ 
                    title: e.name,
                    details: e.message
                });           
            } 
        }
              
    return {
        fieldChanged: helloWorld
    };
})