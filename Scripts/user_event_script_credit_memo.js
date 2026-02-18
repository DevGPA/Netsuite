/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record','N/log', 'N/ui/serverWidget'], function(record, log, serverWidget) {
    function beforeLoad(context) {
        try {
            var form = context.form;
            var buttonId = 'custpage_generate_ei_button'; // Reemplaza con tu ID real

            // 1. Obtener la referencia al botón
            var myButton = form.getButton({ id: buttonId });

            var rec = context.newRecord;   
            var gpaEstatus = rec.getText({
                fieldId: 'custbody_gpa_estado_aprobacion'
            });


            if (gpaEstatus !== 'Aprobado') {
                // 2. Deshabilitar el botón
                myButton.isDisabled = true;

                // 3. Registrar en el log de ejecución
                log.debug({
                    title: 'Botón Deshabilitado',
                    details: 'El botón con ID: ' + buttonId + ' ha sido desactivado exitosamente.'
                });
            } 

            if (gpaEstatus === 'Aprobado') {
                // 2. Deshabilitar el botón
                myButton.isDisabled = false;

                // 3. Registrar en el log de ejecución
                log.debug({
                    title: 'Botón Habilitado',
                    details: 'El botón con ID: ' + buttonId + ' ha sido activado exitosamente.'
                });
            } 
            
            /*  else {
                log.error({
                    title: 'Error al obtener botón',
                    details: 'No se encontró el botón con ID: ' + buttonId
                });
            } */

        } catch (e) {
            log.error({
                title: 'Excepción en beforeLoad',
                details: e.message
            });
        }
    }

    return { beforeLoad: beforeLoad };
});