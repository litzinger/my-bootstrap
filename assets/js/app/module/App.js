/**
 * @fileOverview App module definition
 */
define(function(require) {
    'use strict';

    /**
     * @name App
     * @class App Initial application setup. Runs once upon every page load.
     * @constructor
     */
    var App = function() {};

    /**
     * Initializes the application and kicks off loading of prerequisites
     */
    App.prototype.init = function() 
    {
        var Sandbox = require('sandbox');

        // Create an application instance.
        var sandbox = new Sandbox();

        // Singletons
        var Logger   = require('singleton/Logger');

        // Views
        var Dropdown = require('view/Dropdown');

        sandbox.start(Logger)
            .start(Dropdown, '.dropdown-toggle');
    };

    return App;
});
