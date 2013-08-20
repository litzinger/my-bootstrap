/**
 * @fileOverview Dropdown View Module File
 *
 * @author Brian Litzinger
 * @version 1.0
 */
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
            isDebugging: false,

            // Events
            eventNamespace: '.fc.dropdown',
            eventClick: 'click',

            // Selectors & Elements
            selectButton: '.dropdown-toggle',
            selectMenu: '.dropdown-menu',
            selectAlignRight: 'dropdown-menu_alignRight',
            selectBackdrop: '.dropdown-backdrop',

            classOpen: 'open',
            classBackdrop: 'dropdown-backdrop',

            // Misc
            menuAlignment: 'center'
        },

        // Application-level config
        module.config()
    );

    /**
     * Description
     *
     * @name Dropdown
     * @class Dropdown short description
     * @constructor
     *
     * @since 1.0
     */
    var Dropdown = function(sandbox, element, config) {
        this.sandbox = sandbox;
        this.element = element;
        this.$element = sandbox.dom(element);
        this.config = objects.copy({}, defaults, config);
        this.init();
    };

    /**
     * Initializes the UI Component View
     * Runs a single setupHandlers call, followed by createChildren and layout
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.init = function() {
        return this.setupHandlers()
                   .createChildren()
                   .layout()
                   .enable();
    };

    /**
     * Binds the scope of any handler functions
     * Should only be run on initialization of the view
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.setupHandlers = function() {
        // Bind event handlers scope here
        functions.bind(this, [
            'clickButton',
            'clearMenus'
        ]);

        return this;
    };

    /**
     * Create any child objects or references to DOM elements
     * Should only be run on initialization of the view
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.createChildren = function() {
        // Create any other dependencies here
        this.$menu = this.$element.next(this.config.selectMenu);
        this.$backdrop = $('<div class="'+ this.config.classBackdrop +'"/>');

        return this;
    };

    /**
     * Performs measurements and applys any positiong style logic
     * Should be run anytime the parent layout changes
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.layout = function() {
        // Grab our positions
        var buttonWidth = this.$element.width();
        var menuWidth = this.$menu.outerWidth();
        var buttonCenter = Math.ceil(buttonWidth / 2);
        var menuCenter = Math.ceil(menuWidth / 2);
        var difference = menuCenter - buttonCenter;
        var leftPos = this.$menu.css('left').replace('px', '');

        // If the menu is set to right align, override config
        if (this.$menu.hasClass(this.config.selectAlignRight)) {
            this.config.menuAlignment = 'right';
        }
        
        switch (this.config.menuAlignment) {
            case 'center':
                this.$menu.css('left', parseInt(leftPos - difference) + 'px');
            break;
            case 'right':
                this.$menu.css({
                    'left': 'inherit',
                    'right': '0px'
                });
            break;
            default:
                // left alignment is default, no changes necessary
            break;
        }

        return this;
    };

    /**
     * Enables the view
     * Performs any event binding to handlers
     * Exits early if it is already enabled
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.enable = function() {
        if (this.isEnabled) {
            return this;
        }

        this.isEnabled = true;

        this.$element.on(this.config.eventClick + this.config.eventNamespace, this.clickButton);

        return this;
    };

    Dropdown.prototype.clickButton = function(event) {
        console.log(this);
        if (event) {
            event.preventDefault();
        }
        
        if (this.$element.is('.disabled, :disabled')) return;

        var isActive = this.$element.hasClass(this.config.classOpen);

        this.clearMenus();

        if ( !isActive) {
            this.$backdrop.insertAfter(this.$menu)
                .show()
                .on(this.config.eventClick + this.config.eventNamespace, this.clearMenus);

            this.$element.toggleClass(this.config.classOpen);
            this.$menu.show();
        }

        this.$menu.focus();
    };

    Dropdown.prototype.clearMenus = function()
    {
        this.$backdrop.hide();

        if ( !this.$element.hasClass(this.config.classOpen)) return;

        this.$element.removeClass(this.config.classOpen);
        this.$menu.hide();
    };

    /**
     * Disables the view
     * Tears down any event binding to handlers
     * Exits early if it is already disabled
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.disable = function() {
        if (!this.isEnabled) {
            return this;
        }

        this.isEnabled = false;

        // Tear down any event handlers

        return this;
    };

    /**
     * Destroys the view
     * Tears down any events, handlers, elements
     * Should be called when the object should be left unused
     *
     * @returns {Dropdown}
     * @since 1.0
     */
    Dropdown.prototype.destroy = function() {
        this.disable();
        
        return this;
    };

    return Dropdown;
});