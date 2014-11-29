// Inklusik App
angular.module('inklusik', [
  'ionic',
  'firebase',
  'ngStorage',
  'ngCordova',
  'inklusik.config',
  'inklusik.routes',
  'inklusik.filters',
  'inklusik.services',
  'inklusik.directives',
  'inklusik.decorators',
  'inklusik.controllers',
  'uiGmapgoogle-maps',
  'highcharts-ng'
])

.run(function(simpleLogin, $ionicPlatform, $state) {
  simpleLogin.getUser();
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    $ionicPlatform.registerBackButtonAction(function () {
      if($state.current.name=="login"){
        navigator.app.exitApp();
      }
      else {
        navigator.app.backHistory();
      }
    }, 100);
  });
})

.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
    //    key: 'your api key',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });
});