/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], function(currentRecord) {
    function fieldChanged(context) {
        var rec = context.currentRecord;
        // Verificar que estamos en la sublista de artículos y que cambió el campo 'item'
        if (context.sublistId === 'item' && context.fieldId === 'item') {
            var itemId = rec.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });

            if (itemId) {
                // Establecer el valor en otro campo de la misma línea
                alert(itemId)
            }
        }
    }
    return { fieldChanged: fieldChanged };
});