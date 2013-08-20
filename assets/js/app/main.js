/**
 * @fileOverview Main entry point for RequireJS
 */

require(['module/App'],
    function(App) {
        var app = new App();
        app.init();
    }
);
