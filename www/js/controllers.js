angular.module('inklusik.controllers', ['ui.knob', 'ngCordova', 'uiGmapgoogle-maps'])

.controller('LoginCtrl', function($scope, $rootScope, simpleLogin) {
    $rootScope.loginShow = true;
    $rootScope.auth = false;
    $rootScope.MigmeLogin = function(){
    // 	window.open('http://diora.suitdev.com/authorize-migme');
    	$rootScope.loginShow = false;
    	$rootScope.auth = true;
    }
})

.controller('MenuCtrl', function($scope, fbutil, requireUser, simpleLogin, $rootScope, $state) {
    $scope.exit = function() {
        navigator.app.exitApp();
    }
    $scope.logout = function() {
    	$rootScope.loginShow = true;
    	$rootScope.auth = false;
    }
})

.controller('HomeCtrl', function($scope, $rootScope, simpleLogin, $location) {
  if (!$rootScope.auth)
    $rootScope.loginShow = true;
  $scope.discover = function() {
    Song.discover().then(function(data) {
      Playlist.songList = data;
      $location.path('play/'+_.first(Playlist.songList));
    });
  }
  $scope.genre = function(genre) {
    Song.discover().then(function(data) {
      Playlist.songList = data;
      $location.path('play/'+_.first(Playlist.songList));
    }); 
  }
})

.controller('SearchCtrl', function($scope, $rootScope, $location) {
  
})

.controller('NearestCtrl', function($scope, Geolocation){
  Geolocation.init($scope);

})

.controller('RegisterCtrl', function($scope){

})

.controller('MapCtrl', function($scope, $ionicLoading, $timeout, Geolocation, uiGmapGoogleMapApi) {
  
  Geolocation.init($scope);

  $ionicLoading.show({
    template: '<div class="loading"></div>'
  });

  uiGmapGoogleMapApi.then(function(maps) {
    $timeout(function() {
      console.log('loaded');
      $ionicLoading.hide();  
    }, 2000);
  });
})

.controller('ToiletCtrl', function($scope, Geolocation) {
  Geolocation.init($scope);
})

.controller('ToiletAddCtrl', function($scope, Geolocation) {
  Geolocation.init($scope);
});
