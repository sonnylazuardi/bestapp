var myApp = angular.module("inklusik", ["ionic", "firebase",
  "inklusik.config",
  "inklusik.routes",
  "inklusik.filters",
  "inklusik.services",
  "inklusik.directives",
  "inklusik.decorators",
  "inklusik.controllers"]);

myApp.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

myApp.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  });

  $stateProvider.state('play', {
    url: '/play',
    templateUrl: 'templates/play.html',
    controller: 'PlayCtrl'
  });

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

})
;

