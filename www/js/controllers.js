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

.controller('TimelineCtrl', function($scope) {

})

.controller('ToiletCtrl', function($scope, $cordovaGeolocation) {
    $cordovaGeolocation
    .getCurrentPosition()
    .then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
      $scope.map = {center: {latitude: lat, longitude: long }, zoom: 14 };
      $scope.marker.coords.latitude = lat;
      $scope.marker.coords.longitude = long;
    }, function(err) {
      // error
      alert('Error fetching position');
    });

  $scope.options = {scrollwheel: false};
  $scope.marker = {
    id: 0,
    coords: {
      latitude: 40.1451,
      longitude: -99.6680
    },
    options: { draggable: true },
    events: {
      dragend: function (marker, eventName, args) {
        $log.log('marker dragend');
        var lat = marker.getPosition().lat();
        var lon = marker.getPosition().lng();
        $log.log(lat);
        $log.log(lon);
      }
    }
  }
})

.controller('ToiletAddCtrl', function($scope, Geolocation) {
  Geolocation.init($scope);
});
