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
  'inklusik.controllers'
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
});

/*
The only required option is the "success" callback. Usage:
 
var shake = new Shake({
  frequency: 300,                                                //milliseconds between polls for accelerometer data.
  waitBetweenShakes: 1000,                                       //milliseconds to wait before watching for more shake events.
  threshold: 12,                                                 //how hard the shake has to be to register.
  success: function(magnitude, accelerationDelta, timestamp) {}, //callback when shake is detected. "this" will be the "shake" object.
  failure: function() {},                                        //callback when watching/getting acceleration fails. "this" will be the "shake" object.
});
shake.startWatch();
shake.stopWatch();
*/
 
