/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */


define(['N/ui/dialog'],

    function(dialog) {

        function helloWorld(context) {
            var fieldId = context.fieldId;
            var currentRecord = context.currentRecord;
            
            var options = {
                title: 'Error',
                message: 'La fecha de entrega es diferente a la del documento '+fieldId
            };
            if (fieldId === 'enddate') {
                try {
                    
                    var startDate = currentRecord.getValue('trandate');
                    var endDate = currentRecord.getValue('enddate');

                    var d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                    var d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());


                    if (d1.getTime() != d2.getTime()) 
                    {
                        dialog.alert(options);
                
                        log.debug ({
                            title: 'Success',
                            details: 'Funciona la compración de fechas'
                        });
                    }   
            
                } catch (e) {
            
                    log.error ({ 
                        title: e.name,
                        details: e.message
                    });           
                } 
            }   
        }
              
    return {
        fieldChanged: helloWorld
    };
})