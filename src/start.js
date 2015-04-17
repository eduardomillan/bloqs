/*global requirejs */
requirejs.config({
    baseUrl: 'scripts',
    paths: {
        'jquery': '../../bower_components/jquery/dist/jquery.min',
        'interact': '../../bower_components/interact/interact.min'
    }
});

requirejs(['main']);