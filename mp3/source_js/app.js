var app = angular.module('mp3',['ngRoute']);


app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/list.html',
            controller: 'listController'
        })
        .when('/gallery', {
            templateUrl: 'partials/gallery.html',
            controller: 'galleryController'
        })
        .when('/details', {
            templateUrl: 'partials/details.html',
            controller: 'detailsController'
        })
        .otherwise({
            redirectTo: '/'
        });
});