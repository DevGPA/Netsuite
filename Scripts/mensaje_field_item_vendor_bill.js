/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */

define(['N/record', 'N/ui/dialog', 'N/search'], function (record, dialog, search) {

    function helloWorld(context) {
        var fid = context.fieldId;
        alert('Field Id: '+fid);
    }


    function validateLine(context) {
        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;

        if (sublistId === 'item') { // Assuming 'item' is your sublist ID
            var itemValue = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item' // Replace with your item field ID
            });

            // Perform your validation logic here
            if (!itemValue) {
                alert('Seleccione un articulo antes de agregar la linea');
                return false; // Prevent the line from being added
            }

            var itemId = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item' // Replace with your item field ID
            });

            // Ini Set Datos NO_INVENTORY ITEMS    
            if (itemId) {
                var itemRecord = record.load({
                    type: record.Type.NON_INVENTORY_ITEM, // Or other item types
                    id: itemId
                });

                var customListValue = itemRecord.getValue({
                    fieldId: 'custitem2'
                });

                alert('Valor: '+customListValue);

                currentRecord.setCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'custitem2',
                    value: customListValue
                });
            }
            // Fin Set Datos NO_INVENTORY ITEMS    

        }

        return true; // Allow the line to be added if all validations pass
    }

    return {
        validateLine: validateLine,
        fieldChanged: helloWorld
    };
});