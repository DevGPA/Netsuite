/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log', 'N/search'], function(record, log, search) {

    function afterSubmit(context) {
        // Aplica a: Item FulFillment
        if (context.type !== context.UserEventType.CREATE && context.type !== context.UserEventType.EDIT) {
            return;
        }

        const itemFulfillmentRecord = context.newRecord;
        const salesOrderId = itemFulfillmentRecord.getValue({
            fieldId: 'createdfrom'
        });

        if (!salesOrderId) {
            return; // Si no tiene asociada la orden de venta sale del proceso
        }

        try {
            // 1. Transformacion de la orden de venta a factura 
            const invoiceRecord = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: salesOrderId,
                toType: record.Type.INVOICE,
                isDynamic: false // Para manipular las lineas de articulos
            });

            // 2. Validar que las cantidades en el item fulfillment corresponden a las de la orden de venta
            const invoiceLineCount = invoiceRecord.getLineCount({
                sublistId: 'item'
            });

            for (i = invoiceLineCount - 1; i >= 0; i--) {
                const fulfilledQuantity = parseFloat(itemFulfillmentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: i
                })) || 0;
                
                // Si la cantidad de fulfilled en la linea es 0 (o la linea no se encuentra ), elimina la linea de la factura
                if (fulfilledQuantity === 0) {
                    invoiceRecord.removeLine({
                        sublistId: 'item',
                        line: i
                    });
                } else {
                    // Agregar la cantidad en la linea sugun el fulfilled 
                    invoiceRecord.setSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: fulfilledQuantity,
                        line: i
                    });
                }
            }

            // 3. Guarda los registros en la factura
            const invoiceId = invoiceRecord.save();
            log.audit('Factura creada', 'Se generó la Factura ' +invoiceId+' desde la Orden de Venta '+salesOrderId);

        } catch (e) {
            log.error('IF to Invoice Error', 'Error transforming Sales Order '+salesOrderId+' to Invoice:'+e.message);
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});