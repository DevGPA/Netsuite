/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 */
define(['N/currentRecord', 'N/currency', 'N/log', 'N/record', 'N/ui/dialog'], (currentRecord, currency, log, record, dialog) => {

    function pageInit(context) {
        const salesOrder = context.currentRecord;

        // Check if the record is a new sales order
        if (salesOrder.isNew) {
            try {
                const usdCurrencyId = 2; // Internal ID for USD (adjust if different in your account)
                const targetCurrencyId = salesOrder.getValue({ fieldId: 'currency' });
                const transactionDate = salesOrder.getValue({ fieldId: 'trandate' });

                // Only change if the current currency is not already USD
                if (targetCurrencyId != usdCurrencyId) {
                    // Set the currency to USD
                    // NOTE: This only works if USD is a valid currency for the selected customer/subsidiary
                    salesOrder.setValue({
                        fieldId: 'currency',
                        value: usdCurrencyId,
                        ignoreFieldChange: true
                    });

                    // Fetch the current exchange rate (uses system's daily rate by default)
                    // The N/currency module's exchangeRate method can fetch the rate
                    var rate = currency.exchangeRate({
                        source: usdCurrencyId, // Original currency
                        target: targetCurrencyId, // Target currency (USD)
                        date: transactionDate
                    });

                    // Set the exchange rate field
                    // The 'exchangerate' field is typically on the 'Accounting' subtab in the UI
                    salesOrder.setValue({
                        fieldId: 'exchangerate',
                        value: rate,
                        ignoreFieldChange: true
                    });

                    log.debug('Currency and Rate Set', `Currency set to USD (${usdCurrencyId}), Exchange Rate: ${rate}`);
                }

            } catch (e) {
                log.error('CURRENCY_ERROR', `Error setting currency or exchange rate: ${e.message || e}`);
            }
        }
    }

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;
        var fieldName = context.fieldId;

        if (fieldName === 'entity') {
            var entityId = currentRecord.getValue({
                fieldId: 'entity'
            });

            if (entityId) {
                // You need the internal ID of the USD currency record in your NetSuite instance.
                // Assuming '1' is the internal ID for USD (check your account).
                // Or use the ISO code 'USD' if supported by the field type.
                var usdCurrencyId = '2';
                const transactionDate = currentRecord.getValue({ fieldId: 'trandate' });

                var rate = currency.exchangeRate({
                    source: usdCurrencyId, // Original currency
                    target: '1', // Target currency (USD)
                    date: transactionDate
                });

                currentRecord.setValue({
                    fieldId: 'currency',
                    value: usdCurrencyId,
                    ignoreFieldChange: true // Prevents triggering further field changes unnecessarily
                });

                // Set the exchange rate field
                // The 'exchangerate' field is typically on the 'Accounting' subtab in the UI
                currentRecord.setValue({
                    fieldId: 'exchangerate',
                    value: rate,
                    ignoreFieldChange: true
                });

            }
        }
    }

    function validateLine(context) {
        var currentRecord = context.currentRecord;
        var sublistId = context.sublistId;

        if (sublistId === 'item') {
            // Assuming 'item' is your sublist ID
            var itemId = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item' // Replace with your item field ID
            });

            var itemRecord = record.load({
                type: record.Type.INVENTORY_ITEM, // Or other item types
                id: itemId
            });

            var basePrice = itemRecord.getMatrixSublistValue({
                sublistId: 'price2',
                fieldId: 'price',
                column: 0,
                line: 0
            });


            var options = {
                title: 'Información',
                message: 'El precio base es: ' + basePrice
            };

            dialog.alert(options);
        }
        return true;
    }

    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        validateLine: validateLine
    };
});