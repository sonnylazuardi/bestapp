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

.controller('HomeCtrl', function($scope, $rootScope, simpleLogin, Song, Playlist, $location) {
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

.controller('TimelineCtrl', function($scope, $rootScope, simpleLogin) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
  $scope.likeStatus = [];
  $scope.numberOfLike = [];
  $scope.showFriends = 0;
    $scope.toggleLike = function(rID) {
    	if ($scope.likeStatus[rID] == null){
    		$scope.likeStatus[rID] = 0;
    		$scope.numberOfLike[rID] = 0;
    	}
    	console.log('Hello ' + rID + ' ' + $scope.likeStatus[rID]);
        $scope.likeStatus[rID] = +!$scope.likeStatus[rID];
        if ($scope.likeStatus[rID]) {
            $scope.numberOfLike[rID]++;
        } else {
            $scope.numberOfLike[rID]--;
        }
    }
    $scope.showFriendsFunc = function(val){
    	$scope.showFriends = val;
    }
})

.controller('FriendsCtrl', function($scope, $rootScope, simpleLogin) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
  $scope.showFollowers = 0;
  $scope.showFollowersFunc = function(val){
  	console.log("oit");
  	$scope.showFollowers = val;
  }
})

.controller('SearchCtrl', function($scope, $rootScope, simpleLogin,Search,Playlist, $location) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
  $scope.search = function(){
  	console.log($scope.search.query);
  	Search.search($scope.search.query).then(function(data){
		$scope.data = data;
  	});
  }
  $scope.go = function(song_id) {
    Playlist.songList = _.shuffle(_.map($scope.data, function(item) {
        return item.SongID;
    }));
    Playlist.songList.shift(song_id);
    $location.path('/play/'+song_id);
  }
})

.controller('PlaylistCtrl', function($scope, $rootScope, simpleLogin, Song,Playlist, $location) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
  Song.getLikedSong().then(function(data){
  	$scope.data = data;
  });
  $scope.go = function(song_id) {
    Playlist.songList = _.shuffle(_.map($scope.data, function(item) {
        return item.SongID;
    }));
    Playlist.songList.shift(song_id);
    $location.path('/play/'+song_id);
  }
})

.controller('TrendingCtrl', function($scope, $rootScope, simpleLogin, Trend, $location, Playlist) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
 
  Trend.getToday().then(function(data){
  	$scope.dataToday = data;
  });
  Trend.getThisMonth().then(function(data){
  	$scope.dataThisMonth = data; 
  });

  $scope.go = function(song_id, type) {
    if (type == 'today') {
        Playlist.songList = _.shuffle(_.map($scope.dataToday, function(item) {
            return item.SongID;
        }));
        Playlist.songList.shift(song_id);
    } else {
        Playlist.songList = _.shuffle(_.map($scope.dataThisMonth, function(item) {
            return item.SongID;
        }));
        Playlist.songList.shift(song_id);
    }
    $location.path('/play/'+song_id);
  }
})

.controller('FavoriteCtrl', function($scope, $rootScope, simpleLogin) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
})

.controller('StatCtrl', function($scope, $rootScope, simpleLogin) {
  if (!$rootScope.auth)
  	$rootScope.loginShow = true;
  $scope.showStats = 0;
  $scope.showStatsFunc = function(val){
  	$scope.showStats = val;
  }
})

.controller('NearestCtrl', function($scope){

})

.controller('RegisterCtrl', function($scope){

})

.controller('MapCtrl', function($scope, uiGmapGoogleMapApi, $cordovaGeolocation, $ionicLoading, $timeout) {
  
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

        $scope.marker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };
      }
    }
  };

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

        $scope.marker.options = {
          draggable: true,
          labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
          labelAnchor: "100 0",
          labelClass: "marker-labels"
        };
      }
    }
  };
});
