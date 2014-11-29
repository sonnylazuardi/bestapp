angular.module('inklusik.routes', ['simpleLogin'])

  .constant('ROUTES', {
    'login': {
      url: "/login",
      controller: 'LoginCtrl',
      animation: 'slide-in-up'
    },
    'map': {
      url: "/map",
      templateUrl: "templates/map.html",
      controller: 'MapCtrl'
    },
    'search': {
      url:'/search',
      templateUrl: "templates/search.html",
      controller: 'SearchCtrl'
    },
    'nearest': {
      url:'/nearest',
      templateUrl: "templates/nearest.html",
      controller: 'NearestCtrl'
    },
    'register': {
      url:'/register',
      templateUrl: "templates/register.html",
      controller: 'RegisterCtrl'
    },
    'toilet-add': {
      url:'/toilet/add',
      templateUrl: "templates/toilet-add.html",
      controller: 'ToiletAddCtrl'
    },
    'toilet-statistic': {
      url:'/toilet/statistic',
      templateUrl: "templates/toilet-statistic.html",
      controller: 'ToiletStatisticCtrl'
    },
    'toilet': {
      url:'/toilet/:id',
      templateUrl: "templates/toilet.html",
      controller: 'ToiletCtrl'
    },
    'timeline': {
      url:'/timeline',
      templateUrl: "templates/timeline.html",
      controller: 'TimelineCtrl'
    },
    'popular': {
      url:'/popular',
      templateUrl: "templates/popular.html",
      controller: 'PopularCtrl'
    },
    'report': {
      url:'/report/:id',
      templateUrl: "templates/report.html",
      controller: 'ReportCtrl'
    }
  })
  
  .config(function($stateProvider) {
   
    $stateProvider.stateAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['requireUser', function(requireUser) {
        return requireUser();
      }];
      $stateProvider.state(path, route);
    }
  })

  .config(function($stateProvider, ROUTES, $urlRouterProvider) {
    angular.forEach(ROUTES, function(route, path) {
      if ( route.authRequired ) {
        $stateProvider.stateAuthenticated(path, route);
      } else {
        $stateProvider.state(path, route);
      }
    });
    // routes which are not in our map are redirected to /home
    $urlRouterProvider.otherwise('/nearest');
  })

  .run(function($rootScope, $location, simpleLogin, ROUTES, loginRedirectPath) {
    simpleLogin.watch(check, $rootScope);

    $rootScope.$on("$routeChangeError", function(e, next, prev, err) {
      if( angular.isObject(err) && err.authRequired ) {
        $location.path(loginRedirectPath);
      }
    });

    function check(user) {
      if( !user && authRequired($location.path()) ) {
        $location.path(loginRedirectPath);
      }
    }

    function authRequired(path) {
      return ROUTES.hasOwnProperty(path) && ROUTES[path].authRequired;
    }
  });