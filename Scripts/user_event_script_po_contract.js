/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], function(record, log) {
    function beforeSubmit(context) {
        // Ejecutar solo al crear o editar
        if (context.type === context.UserEventTypes.CREATE || context.type === context.UserEventTypes.EDIT) {
            var newRecord = context.newRecord;

            // 1. Obtener el ID del Contrato
            var contractId = newRecord.getValue({ fieldId: 'purchasecontract' });

            // 2. Validar y cambiar estado de aprobación
            if (contractIdract) {
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

    return {
        beforeSubmit: beforeSubmit
    };
});