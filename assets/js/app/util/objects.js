/**
 * @fileOverview
 * Objects Delcaration File
 *
 * @author Shannon Moeller <smoeller@nerdery.com>
 * @version 1.0.0
 */
/*jshint plusplus: false, white: false */
/*global define */
define(function() {
    'use strict';

    return {
        /**
         * Copies properties to a target object from multiple other objects.
         * Useful for things like cloning an object to a new empty object,
         * or merging an object of defaults with a configuration object.
         *
         * @param {Object} object Object to receive properties.
         * @param {...Object} otherObjects Any number of other objects.
         * @return {Object} The original object, agumented.
         */
        copy: function(object) {
            var argument;
            var key;
            var length = arguments.length;
            var i = 1;

            for (; i < length; i++) {
                argument = arguments[i];

                for (key in argument) {
                    if (argument.hasOwnProperty(key)) {
                        object[key] = argument[key];
                    }
                }
            }

            return object;
        }
    };
});
