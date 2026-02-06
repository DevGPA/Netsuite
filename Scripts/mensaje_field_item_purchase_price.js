/**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */

define(['N/record', 'N/ui/dialog', 'N/search'], function (record, dialog, search) {

    var myGlobalVariable = null;

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

            var itemRecord = record.load({
                type: record.Type.INVENTORY_ITEM, // Or other item types
                id: itemId
            });

            // Ini Familia del Arículo

            if (itemRecord) {

                var hierarchyNodeId = itemRecord.getSublistValue({
                    sublistId: 'merchandisehierarchy',
                    fieldId: 'hierarchynode',
                    line: 0
                });

                var hierarchyNodeName = search.lookupFields({
                    type: 'merchandisehierarchynode',
                    id: hierarchyNodeId,
                    columns: ['name']
                }).name;

                alert('Familia: '+hierarchyNodeName);
            }

            // Fin Familia del Artículo


            //Ini Precios Autorizados por Dirección

            var numVendors = itemRecord.getLineCount({ sublistId: 'itemvendor' });
            var preferredPrice = null;

            var sublistRecord = itemRecord.getSublistSubrecord({
                sublistId: 'itemvendor',
                fieldId: 'itemvendorprice',
                line: 0
            });

            var vendorprice = sublistRecord.getSublistValue({ sublistId: 'itemvendorpricelines', fieldId: 'vendorprice', line: 0 });

            var price = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'rate' // Replace with your quantity field ID
            });

            currentRecord.setCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'custcol4',
                value: vendorprice
            });


            if (vendorprice < price) {
                var options = {
                    title: 'Error',
                    message: 'El precio autorizado por dirección es de: ' + vendorprice
                };
                dialog.alert(options);
                return false;
            }

            //Fin Precios Autorizados por Dirección


            //return false; // Prevent the line from being added



            // You can also check other fields on the current line
            var quantity = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity' // Replace with your quantity field ID
            });

            if (quantity <= 0) {
                var options = {
                    title: 'Error',
                    message: 'La cantidad del artículo debe ser mayor a 0'
                };
                dialog.alert(options);
                return false;
            }
        }

        return true; // Allow the line to be added if all validations pass
    }

    return {
        validateLine: validateLine
    };
});