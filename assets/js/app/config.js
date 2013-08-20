'use strict'

require.config({
    baseUrl: "assets/js/app",
    paths: {
        'jquery': 'external/jquery/jquery-1.9.1.min',
        'jquery-ui': '//code.jquery.com/ui/1.10.3/jquery-ui',
        'jquery-mouse-wheel': 'external/jquery/jquery.mousewheel.min',
    },
    shim: {
        "jquery": {
            exports: "$"
        },
        "jquery-ui": {
            exports: "$",
            deps: ['jquery']
        },
        "jquery-mouse-wheel": {
            exports: "$",
            deps: ['jquery']
        }
    },
    config: {
    }
});
