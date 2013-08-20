/**
 * @fileOverview
 * Functions Delcaration File
 *
 * @author Shannon Moeller <smoeller@nerdery.com>
 * @version 1.0.0
 */
/*jshint plusplus: false, white: false */
/*global define */
define(function(require) {
    'use strict';

    var jQuery = require('jquery');
    var slice = Array.prototype.slice;

    return {
        /**
         * Enforces the context for one or more methods.
         *
         * @param {Object} context The desired context object.
         * @param {String,String[]} method A method name, or a list of method names.
         * @returns {this} Maintains chain.
         */
        bind: function(context, method) {
            var i;

            if (jQuery.type(method) === 'array') {
                i = method.length;

                while (i--) {
                    this.bind(context, method[i]);
                }

                return this;
            }

            context[method] = jQuery.proxy(context, method);

            return this;
        },

        /**
         * Wraps a function in a closure which accepts an additional leading
         * parameter. For example, when jQuery triggers an event, it always
         * passes an event object as the first parameter. This value is not
         * always useful and clutters certain method interfaces.
         *
         * Example:
         *
         *   var subpub = $({});
         *
         *   function ugly(event, bar) {
         *      console.log(bar); // event param required, but unused
         *   }
         *
         *   function clean(bar) {
         *      console.log(bar); // only accepts the data we want
         *   }
         *
         *   subpub.on('data', ugly);
         *   subpub.on('data', unshiftArgument(clean));
         *
         *   subpub.trigger('data', ['apple']);
         *
         * @param {Function} method
         * @return {Function} A method which accepts an additional parameter.
         */
        unshiftArgument: function(method) {
            return function() {
                return method.apply(this, slice.call(arguments, 1));
            };
        }
    };
});
