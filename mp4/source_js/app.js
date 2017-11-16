var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/settings', {
        templateUrl: 'partials/settings.html',
        controller: 'SettingsController'
    }).
    when('/users', {
        templateUrl: 'partials/users.html',
        controller: 'UsersController'
    }).
    when('/addUser', {
        templateUrl: 'partials/addUser.html',
        controller: 'AddUserController'
    }).
    when('/users/:userId', {
        templateUrl: 'partials/userDetail.html',
        controller: 'UserDetailsController'
    }).
    when('/tasks', {
        templateUrl: 'partials/tasks.html',
        controller: 'TasksController'
    }).
    when('/addTask', {
        templateUrl: 'partials/addTask.html',
        controller: 'AddTaskController'
    }).
    when('/tasks/:taskId', {
        templateUrl: 'partials/taskDetail.html',
        controller: 'TaskDetailsController'
    }).
    when('/tasks/:taskId/edit', {
        templateUrl: 'partials/addTask.html',
        controller: 'AddTaskController'
    }).
    otherwise({
        redirectTo: '/settings'
    });

}]);
