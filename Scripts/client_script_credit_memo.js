/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
define(['N/currentRecord'], function(currentRecord) {

    function disableAndProcess() {
        // Get a reference to the button using its ID
        // The ID is the one defined in the User Event script (custpage_my_button)
        var button = window.document.querySelector('#custpage_generate_ei_button');

        // Check if the button element exists and disable it immediately
        if (button) {
            button.disabled = true;

        }

        // --- Place your actual processing logic here ---
        // e.g., perform a time-consuming task, call a Suitelet, etc.
        console.log('Button clicked and disabled. Performing processing...');
        
        // After processing is complete (e.g., within the callback of an async operation), 
        // you might re-enable it if the page doesn't reload, or hide it if the action is final.

        // If your logic involves form submission, make sure you handle it correctly to avoid issues
        // where disabling the button prevents its value from being sent.
    }

    return {
        disableAndProcess: disableAndProcess
    };
});