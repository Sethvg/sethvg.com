var app = angular.module('website',['ngRoute']);


app.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'home/_home.html',
            controller: 'homeCtrl'
        }).
        otherwise({
            redirectTo: '/phones'
        });
    }]);


app.controller("global",function($scope){

    $scope.name = "Seth Van Grinsven";

});