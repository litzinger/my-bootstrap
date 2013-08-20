/**
 * @fileOverview
 * Logger Declaration File
 *
 * @author Shannon Moeller <smoeller@nerdery.com>
 * @version 1.0.0
 */
/*jshint browser: true, white: false */
/*global define */
define(function(require, exports, module) {
    'use strict';

    /**
     * Modules
     */
    var functions = require('util/functions');
    var objects = require('util/objects');

    /**
     * Default configuration values. Can be overridden by application configuration.
     * @type {Object<String,String>}
     */
    var defaults = objects.copy(
        {
            // Class names
            isDebugging: false
        },

        // Application-level config
        module.config()
    );

    /**
     * Logger constructor.
     *
     * @param {Sandbox} sandbox The controlling sandbox instance.
     * @constructor
     */
    function Logger(sandbox) {
        this.sandbox = sandbox;
        this.config = objects.copy({}, defaults);

        // Setup handlers
        functions.bind(this, 'error');

        // Listen for errors
        sandbox.on('error', this.error);
    }

    /**
     * Logger prototype.
     * @type {Object}
     */
    Logger.prototype = {
        /**
         * Listens for errors and notifies developers if desired.
         *
         * @param {?Error} error A native error object, or custom error object.
         * @param {?Object} context Additional contextual information which may be helpful.
         * @return {this} Maintains chain.
         */
        error: function(error, context) {
            if (this.config.isDebugging) {
                if (typeof console === 'undefined') {
                    // No debugger
                    alert(error.message);
                } else if (typeof console.error === 'undefined') {
                    // Simple debugger
                    console.log(error);
                    console.log(context);
                } else {
                    // Advanced debugger
                    console.error(error);
                    console.dir(context);
                }
            }

            return this;
        }
    };

    return Logger;
});
