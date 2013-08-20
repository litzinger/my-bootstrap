/**
 * @fileOverview
 * Sandbox Delcaration File
 *
 * @author Shannon Moeller <smoeller@nerdery.com>
 * @version 1.0.0
 */
/*jshint browser: true, white: false */
/*global define */
define(function(require, exports, module) {
    'use strict';

    var jQuery = require('jquery');
    var functions = require('util/functions');

    /**
     * Speed up access to slicing. Useful for converting array-like objects to real arrays.
     * @type {Function}
     */
    var slice = Array.prototype.slice;

    /**
     * A simple application sandbox. Serves as a replaceable
     * facade to lower-level libraries ensuring a consistent
     * application interface regardless of later core changes.
     *
     * @return {this}
     */
    var Sandbox = function() {
        var self = this;

        /**
         * A selector-based cache of module instances.
         * @type {Object<String,Object[]>}
         * @private
         */
        this._channels = {};

        /**
         * Use jQuery as a core event system.
         * @type {jQuery}
         * @private
         */
        this._events = jQuery({});

        // Map document events to sandbox
        this.dom(document).on({
            ready: function() {
                self.emit('domReady');
            }
        });

        // Map window events to sandbox
        this.dom(window).on({
            hashchange: function() {
                self.emit('hashchange');
            },
            load: function() {
                self.emit('domLoaded');
            }
        });

        return this;
    };

    /**
     * Sandbox prototype.
     * @type {Object}
     */
    Sandbox.prototype = {
        /**
         * A dom selector and rendering engine.
         *
         * @param {String} selector A css selector or a string of HTML to render.
         * @return {jQuery} An instance of jQuery
         */
        dom: function(selector) {
            return jQuery(selector);
        },

        /**
         * Global events subscriber.
         *
         * @param {String} name The desired events channel
         * @param {Function} callback A method to execute when the event is triggered.
         * @return {this} Maintains chain.
         */
        on: function(name, callback) {
            this._events.on(name, functions.unshiftArgument(callback));

            return this;
        },

        /**
         * Global events unsubscriber.
         *
         * @param {String} name The desired events channel
         * @param {Function} callback A method to remove from the callback list.
         * @return {this} Maintains chain.
         */
        off: function(name, callback) {
            this._events.off(name, functions.unshiftArgument(callback));

            return this;
        },

        /**
         * Global event publisher.
         *
         * @param {String} name The desired events channel
         * @param {...*} args Optional paramters to pass to each callback.
         * @return {this} Maintains chain.
         */
        emit: function(name) {
            this._events.trigger(name, slice.call(arguments, 1));

            return this;
        },

        /**
         * Safely creates instances of modules for each DOMElement matching the a selector
         * and caches references to them.
         *
         * @param {Function} Module A sandbox-compatible module class to start.
         * @param {String} selector A CSS string which targets root DOMElements.
         * @param {?Object<String,*>} config An optional object containing configuration options.
         * @return {this} Maintains chain.
         */
        start: function(Module, selector, config) {
            var self = this;
            var channels = this._channels;

            // Load cached channel
            var channel = (channels[selector] || []);

            // Select existing DOMElements, if any, and create module instances.
            this.dom(selector || window).each(function(i, el) {
                var instance;

                try {
                    // Create instance.
                    instance = new Module(self, el, config);

                    // Assign instance as data to element for east access later.
                    self.dom(el).data('module', instance);

                    // Cache reference
                    channel.push(instance);
                }
                catch (error) {
                    // Emit error for anyone who cares
                    self.emit('error', error, {
                        config: config,
                        instance: instance,
                        message: error && error.message,
                        module: Module,
                        selector: selector
                    });

                    // Disable instance if possible
                    self.stop(instance);
                }
            });

            // Store channel
            channels[selector] = channel;

            return this;
        },

        /**
         * Safely destroys an instance of a module.
         *
         * @param {Object} module An instance of a module.
         * @return {this} Maintains chain.
         */
        stop: function(module) {
            if (module && typeof module.disable === 'function') {
                module.disable();
            }

            return this;
        }
    };

    return Sandbox;
});
