/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], function(currentRecord) {
    function pageInit(scriptContext) {
        // Solo ejecutar en modo 'edit' para evitar errores en 'view'
        if (scriptContext.mode !== 'copy') return;

        var rec = scriptContext.currentRecord;
        var lineCount = rec.getLineCount({ sublistId: 'item' });

        for (var i = 0; i < lineCount; i++) {
            // 1. Seleccionar la línea específica
            rec.selectLine({
                sublistId: 'item',
                line: i
            });

            //alert('Carga: '+i);

            // 2. Establecer el nuevo valor en el campo deseado
            rec.setCurrentSublistText({
                sublistId: 'item',
                fieldId: 'custcol_mx_txn_line_sat_tax_object',
                text: '02 - Sí objeto de impuesto.',
                ignoreFieldChange: true
            });

            // 3. Confirmar los cambios en la línea
            rec.commitLine({ sublistId: 'item' });
        }
    }

    return {
        pageInit: pageInit
    };
});