/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], function (record, log) {
    function beforeSubmit(context) {
        // Ejecutar solo al crear o editar
        try {
            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
                var newRecord = context.newRecord;

                // 1. Obtener el ID del Contrato
                var contractId = newRecord.getValue({ fieldId: 'purchasecontract' });

                // 2. Validar y cambiar estado de aprobación
                if (contractId) {
                    newRecord.setValue({
                        fieldId: 'approvalstatus',
                        value: 2 // Estado: Aprobado
                    });

                    log.debug({
                        title: 'Éxito',
                        details: 'Estado de aprobación actualizado a Aprobado OC con Contrato'
                    });
                }
            }
        }
    
        catch (e) {
            log.error({
                title: 'Error en auto-aprobación',
                details: e.message
            });
        }
    }
    return {
        beforeSubmit: beforeSubmit
    };
});