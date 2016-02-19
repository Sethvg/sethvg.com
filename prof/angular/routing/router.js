app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller:'homeController'
      }).
      when('/mvc', {
        templateUrl: 'partials/mvc.html',
        controller: 'mvcController'
      }).
      when('/examples', {
          templateUrl: 'partials/examples.html',
          controller: 'examplesController'

        }).
    when('/directives', {
        templateUrl: 'partials/directives.html',
        controller: 'directivesController'

      }).
  	when('/promises', {
      templateUrl: 'partials/promises.html',
      controller: 'promisesController'

    }).
      otherwise({
        redirectTo: '/home'
      });
  }]);