/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/error'], (record, error) => {

    const beforeSubmit = (context) => {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            const newRecord = context.newRecord;

            // Example: Validate a custom field
            const customField = newRecord.getValue({ fieldId: 'leadsource' });
            if (!customField) {
                throw error.create({
                    name: 'MISSING_CUSTOM_FIELD',
                    message: 'El campo lead sorce no puede estar vacio',
                    notifyOff: true
                });
            }

            // Example: Set a default value for a field if it's empty
            if (!newRecord.getValue({ fieldId: 'memo' })) {
                newRecord.setValue({ fieldId: 'memo', value: 'Default Memo Text' });
            }
        }
    };

    return {
        beforeSubmit: beforeSubmit
    };
})

