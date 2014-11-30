angular.module('inklusik.services', ['ngCordova', 'ngCordova', 'uiGmapgoogle-maps'])

.factory('User', function() {
  var self = this;
  self.user_id = '4567';
  self.type = 'migme';
  self.migme_id = '211282416';
  return self;
})

.factory('Playlist', function() {
  var self = this;
  self.songList = [];
  return self;
})

.factory('Geolocation', function($cordovaGeolocation, Toilet) {
  var self = this;
  self.init = function($scope) {
    
    $cordovaGeolocation
      .getCurrentPosition()
      .then(function (position) {
        var lat  = position.coords.latitude;
        var long = position.coords.longitude;
        $scope.marker.coords.latitude = lat;
        $scope.marker.coords.longitude = long;
        $scope.map = {center: {latitude: lat, longitude: long }, zoom: 20, bounds: {} };

        $scope.$watch(function() {
          return $scope.map.bounds;
        }, function(nv, ov) {
          if (!ov.southwest && nv.southwest) {
            var markers = [];
            for (var i = 0; i < 5; i++) {
              markers.push(createRandomMarker(i+1, $scope.map.bounds))
            }
            $scope.randomMarkers = markers;
          }
        }, true);
      }, function(err) {
        // error
        alert('Error fetching position');
      });
    $scope.windowOptions = {
      visible: true
    };
    $scope.toilets = [];
    Toilet.getAll().then(function(data) {
      console.log(data);
      $scope.toilets = data;
    })

    var createRandomMarker = function(i, bounds, idKey) {
      var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

      if (idKey == null) {
        idKey = "id";
      }

      var latitude = lat_min + (Math.random() * lat_range);
      var longitude = lng_min + (Math.random() * lng_range);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        toiletId: $scope.toilets[i].id,
        title: $scope.toilets[i].name,
        options: { draggable: true },
        description: $scope.toilets[i].description,
        icon: 'http://sonnylazuardi.github.io/bestapp/www/img/marker.png',
        show: false,
        events: {
          dragend: function (marker, eventName, args) {
            console.log('marker dragend');
            var lat = marker.getPosition().lat();
            var lon = marker.getPosition().lng();
            console.log(lat);
            console.log(lon);
          }
        }
      };
      ret.onClick = function() {
        ret.show = !ret.show;
      };
      ret[idKey] = i;
      return ret;
    };

    $scope.randomMarkers = [];

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
          console.log('marker dragend');
          var lat = marker.getPosition().lat();
          var lon = marker.getPosition().lng();
          console.log(lat);
          console.log(lon);
        }
      }
    };
  }
  return self;
})

.factory('Comment', function($http, serverUrl, $q){
  var self = this;
  self.getByToiletId = function(toilet_id){
    var def = $q.defer();
    $http.get(serverUrl+'api/toilet/' + toilet_id +'/comments').success(function(data) {
      if (data.data) {
        var comments = data.data;
        def.resolve(comments);
      }
    });
    return def.promise;
  }
  self.postNewComment = function(toilet_id,cmnt){
    var def = $q.defer();
    var msg = {
      toilet_id :  toilet_id,
      title : "Alif Raditya",
      content : cmnt,
      user_id : 1, //sample
      email : "alifradityar@gmail.com", // sample
      date : Date.now()
    };
    $http.post(serverUrl+'api/' + msg.user_id + '/toilet/' + toilet_id + '/comments',msg).success(function(data) {
      if (data.data) {
        var comments = data.data;
        def.resolve(comments);
      }
    });
    return def.promise
  }

  return self;
})

.factory('Report',function($http,serverUrl, $q){
  var self = this;
  self.getByUser = function(user_id){
    $http.get(serverUrl+'api/user/' + user_id + '/reports' + toilet_id).success(function(data) {
      if (data.data) {
        var reports = data.data;
        def.resolve(reports);
      }
    });
    
  }
  self.postReport = function(user_id,toilet_id,comment,cat){
    var def = $q.defer();
    var msg = {
      user_id : 1, //sample
      subject : "Judul Rata",
      category : cat,
      content : comment
    };
    $http.post(serverUrl+'api/toilet/'+'toilet_id'+'/report',msg).success(function(data) {
      if (data.data) {
        var comments = data.data;
        def.resolve(comments);
      }
    });
    return def.promise
  }

  return self;
})

.factory('Toilet', function($http, serverUrl, $q, $cordovaGeolocation){
  var self = this;
  self.getById = function(toilet_id){
    var def = $q.defer();
    $http.get(serverUrl+'api/toilet/' + toilet_id).success(function(data) {
      if (data.data) {
        var toilets = data.data;
        def.resolve(toilets);
      }
    });
    return def.promise;
  }
  self.getNearest = function(){
    var def = $q.defer();
    $http.get(serverUrl+'api/toilet/nearest').success(function(data) {
      if (data.data) {
        var toilets = data.data;
        def.resolve(toilets);
      }
    });
    return def.promise;
  }
  self.getPopular = function(){
    var def = $q.defer();
    $http.get(serverUrl+'api/toilet/popular').success(function(data) {
      if (data.data) {
        var toilets = data.data;
        def.resolve(toilets);
      }
    });
    return def.promise;
  }
  self.getAll = function(){
    var def = $q.defer();
    $http.get(serverUrl+'api/toilet/all').success(function(data) {
      if (data.data) {
        var toilets = data.data;
        def.resolve(toilets);
      }
    });
    return def.promise;
  }
  self.search = function(query){
    var def = $q.defer();
    $http.get(serverUrl+'api/toilet/search/' + query).success(function(data) {
      if (data.data) {
        var toilets = data.data;
        def.resolve(toilets);
      }
    });
    return def.promise;
  }
  return self;
})

.factory('Song', function($http, serverUrl, $q, User) {
  var self = this;
  self.all = function() {
    var def = $q.defer();
    console.log(serverUrl+'music/'+song_id+'/details');
    $http.get(serverUrl+'music/'+song_id+'/details').success(function(data) {
      if (data.data) {
        var song = data.data;
        if (song)
          song.CoverArtFilename = 'http://images.gs-cdn.net/static/albums/' + song.CoverArtFilename;
        $http.get(serverUrl+'music/'+song_id+'/stream').success(function(data2) {
          song.filename = data2.data.url;
          def.resolve(song);
        });
      }
    });
    return def.promise;
  }
  return self;
});