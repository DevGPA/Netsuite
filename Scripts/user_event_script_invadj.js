/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'], function (record, log) {

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var inventoryAdjustmentRecord = context.newRecord;
            var lineCount = inventoryAdjustmentRecord.getLineCount({
                sublistId: 'inventory'
            });

            //log.debug('Inventory Adjustment Line Count', lineCount);

            for (var i = 0; i < lineCount; i++) {
                var item = inventoryAdjustmentRecord.getSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'item',
                    line: i
                });

                var location = inventoryAdjustmentRecord.getSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'location',
                    line: i
                });

                var adjustQtyBy = inventoryAdjustmentRecord.getSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'adjustqtyby',
                    line: i
                });

                log.debug('Item Details on Line ' + i, 'Item ID: ' + item + ', Location ID: ' + location + ', Adjusted Quantity: ' + adjustQtyBy);

                // You can add your business logic or validations here.
                // For example, if adjustQtyBy is negative, check a specific condition.
                if (adjustQtyBy < 0) {

                    // Perform specific actions or throw an error to stop submission.
                }

                var adjustmentId = context.newRecord.id;

                var inventoryAdjustmentRecord2 = record.create({
                    type: record.Type.INVENTORY_ADJUSTMENT,
                    id: adjustmentId,
                    isDynamic: false
                });

                inventoryAdjustmentRecord2.setSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'location',
                    line: 1, 
                    value: location 
                });

                inventoryAdjustmentRecord2.setSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'item',
                    line: 1, 
                    value: item 
                });

                inventoryAdjustmentRecord2.setSublistValue({
                    sublistId: 'inventory',
                    fieldId: 'adjustqtyby',
                    line: 1, 
                    value: (adjustQtyBy * -1)
                });

            }
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});