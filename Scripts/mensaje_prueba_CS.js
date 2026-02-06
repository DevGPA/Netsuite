/**
 *@NApiVersion 2.0
 *@NScriptType ClientScript
 */


define(['N/ui/dialog'],

    function(dialog) {

        function helloWorld() {

            var options = {
                title: 'Hola',
                message: 'A ver Gabriel...!'
            };
        
            try {
           
                dialog.alert(options);
           
                log.debug ({
                    title: 'Success',
                    details: 'Funciona la prueba mensaje'
                });
        
            } catch (e) {
           
                log.error ({ 
                    title: e.name,
                    details: e.message
                });           
            } 
        }
              
    return {
        pageInit: helloWorld
    };
}); 

        