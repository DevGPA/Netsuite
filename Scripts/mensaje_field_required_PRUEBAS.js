/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/record', 'N/ui/dialog', 'N/search'], function (record, dialog, search) {

    var itemQuimExist = false;
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

            alert('itemId: ' + itemId);

            if (itemId) {
                var itemRecord = record.load({
                    type: record.Type.INVENTORY_ITEM, // Or other item types
                    id: itemId
                });


                /** OBTENER FAMILIA DE LOS ARTICULOS */
                var numLines = itemRecord.getLineCount({
                    sublistId: 'hierarchyversions'
                });

                alert('Node: ' + numLines);

                var hierarchyVersionId = itemRecord.getSublistValue({
                    sublistId: 'hierarchyversions',
                    fieldId: 'hierarchynode',
                    line: 0
                });




                alert('Node: ' + hierarchyVersionId);

                var hierarchyNodeName = search.lookupFields({
                    type: 'merchandisehierarchynode',
                    id: 109, // Lista de Familias de Articulos
                    columns: ['name']
                }).name;

                alert('Node: ' + hierarchyNodeName);

                // Ini Familia del Arículo

                if (itemRecord) {

                    var hierarchyNodeId = hierarchyVersionId;

                    var hierarchyNodeName = search.lookupFields({
                        type: 'merchandisehierarchynode',
                        id: hierarchyNodeId,
                        columns: ['name']
                    }).name;

                    alert('Familia: ' + hierarchyNodeName);
                    if(hierarchyNodeName === 'Productos Quimicos')
                    {
                        itemQuimExist = true;
                    }

                }



                // Fin Familia del Artículo

                var itemFields = search.lookupFields({
                    type: 'inventoryitem',
                    id: itemId,
                    columns: ['quantityonhand', 'quantityavailable']
                });

                alert('Stock: ' + itemFields);

            }
            // Fin Set Datos NO_INVENTORY ITEMS    

        }

        return false; // Allow the line to be added if all validations pass
    }


    function saveRecord(context) {
        var currentRecord = context.currentRecord;

        //Cliente Presente
        var fieldValue = currentRecord.getValue('custbody_gpa_fecha_envio');

        if (fieldValue) {
            try {

                var startDate = currentRecord.getValue('trandate');
                var endDate = currentRecord.getValue('custbody_gpa_fecha_envio');

                var d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                var d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
                var tipoEntrega = currentRecord.getText('custbody_lr_u0195_delivery_type');

                if (d1.getTime() != d2.getTime() && tipoEntrega == 'F.O.B. Entrega en almacén GPA CON Cliente Presente') {

                    var options = {
                        title: 'Información!',
                        message: 'El Tipo de Entrega no corresponde con la Fecha de Entrega',
                        buttons: [{
                            label: 'Entendio',
                            value: false
                        }]
                    };
                    dialog.alert(options);

                    log.debug({
                        title: 'Success',
                        details: 'Funciona la compración de fechas para entrega'
                    });

                    return false;
                }

            } catch (e) {

                log.error({
                    title: e.name,
                    details: e.message
                });
            }
        }



        //Fletera no maneja Quimicos
        var fieldTextLoc = currentRecord.getValue('location');
        alert(fieldTextLoc);

        var fieldTextCarr = currentRecord.getText('custbody1');
        alert(fieldTextCarr);


        var mySearch = search.create({
            type: 'customrecord1500', // El ID de cadena de tu registro
            filters: [
                ['custrecord3', 'is', fieldTextLoc],
                'AND',
                ['name', 'is', fieldTextCarr]
            ],
            columns: ['custrecord5', 'name']
        });

        alert(fieldTextLoc);
        var manejaQuim = false;

        mySearch.run().each(function (result) {
            var value1 = result.getValue({ name: 'custrecord5' });
            var name = result.getValue({ name: 'name' });
            //alert('Valor encontrado: '+name+ ' maneja quimico: '+value1);
            manejaQuim = result.getValue({ name: 'custrecord5' });
            return false; // Continuar iterando
        });

        //alert(manejaQuim);
        if(itemQuimExist == true && manejaQuim == false)
        {
            var options = {
                title: 'Información!',
                message: 'La Fletera Seleccionada no maneja Quimicos',
                buttons: [{
                    label: 'Entendio',
                    value: false
                }]
            };

            var userResponse = dialog.create(options).then(function (result) {
                return result; // Returns true if Yes, false if No
            });

            if (!userResponse.value) { // If user clicked No
                return false; // Prevent record submission
            }

        }



        fieldValue = currentRecord.getValue('leadsource'); // Replace with your field ID
        var lineCount = currentRecord.getLineCount({
            sublistId: 'item'
        });

        if (fieldValue === '') {
            var options = {
                title: 'Información!',
                message: 'Se requiere un valor para el campo lead sorce',
                buttons: [{
                    label: 'Entendio',
                    value: false
                }]
            };

            var userResponse = dialog.create(options).then(function (result) {
                return result; // Returns true if Yes, false if No
            });

            if (!userResponse.value) { // If user clicked No
                return false; // Prevent record submission
            }
        }

        // SO CON GUIA PREPAGADA
        fieldValue = currentRecord.getValue('custbody_lr_u0195_delivery_type');
        if (fieldValue === '1') {

            fieldValue = currentRecord.getValue('custbody2');
            if (fieldValue === '') {
                var options = {
                    title: 'Información!',
                    message: 'Se requiere agregar el Archivo de Guía Prepagada',
                    buttons: [{
                        label: 'Entendio',
                        value: false
                    }]
                };

                var userResponse = dialog.create(options).then(function (result) {
                    return result; // Returns true if Yes, false if No
                });

                if (!userResponse.value) { // If user clicked No
                    return false; // Prevent record submission
                }
            }
        }
        //FIN SO CON GUIA PREPAGADA

        /*         if(lineCount > 0){
                    var options = {
                        title: 'Información!',
                        message: 'Numero de lineas de articulos: '+lineCount,
                        buttons: [ {
                            label: 'Entendio',
                            value: false
                        }]
                    };
        
                    var userResponse = dialog.create(options).then(function(result) {
                        return result; // Returns true if Yes, false if No
                    });
        
                    if (!userResponse.value) { // If user clicked No
                        return false; // Prevent record submission
                    }
                } */

        // SO CON ENTREGA FOB Y MAS DE 5 ARTICULOS
        fieldValue = currentRecord.getText('custbody_lr_u0195_delivery_type');
        alert('Entrega ' + fieldValue);
        if (lineCount > 5) {
            var options = {
                title: 'Información!',
                message: 'Numero de lineas de articulos: ' + lineCount,
                buttons: [{
                    label: 'Entendio',
                    value: false
                }]
            };

            var userResponse = dialog.create(options).then(function (result) {
                return result; // Returns true if Yes, false if No
            });

            if (!userResponse.value) { // If user clicked No
                return false; // Prevent record submission
            }

        }
        //FIN SO CON ENTREGA FOB Y MAS DE 5 ARTICULOS

        // SO FECHA DE ENVIO


        fieldValue = currentRecord.getValue('custbody_gpa_fecha_envio');

        if (fieldValue) {
            try {

                var startDate = currentRecord.getValue('trandate');
                var endDate = currentRecord.getValue('custbody_gpa_fecha_envio');

                var d1 = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
                var d2 = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());


                if (d1.getTime() != d2.getTime()) {

                    var options = {
                        title: 'Error',
                        message: 'La fecha de entrega es diferente a la del documento ',
                        buttons: [{
                            label: 'Entendio',
                            value: false
                        }]
                    };
                    dialog.alert(options);

                    log.debug({
                        title: 'Success',
                        details: 'Funciona la compración de fechas para entrega'
                    });

                    return false;
                }

            } catch (e) {

                log.error({
                    title: e.name,
                    details: e.message
                });
            }
        }
        //FIN SO FECHA DE ENVIO

        return false; // Allow record submission
    }
    return {
        saveRecord: saveRecord,
        validateLine: validateLine
    };
})