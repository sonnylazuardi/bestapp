angular.module('inklusik.controllers', ['ui.knob', 'ngCordova', 'uiGmapgoogle-maps', 'highcharts-ng'])

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

.controller('ListReportCtrl', function($scope, Report) {
  var id = 1;
  Report.getByUser(id).then(function(data){
    $scope.reports = data;
  });
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

.controller('ReportCtrl', function($scope,$stateParams, Toilet, Report,$location){
  var id = $stateParams.id;
  var usid = 1;
  $scope.form = {
    category:"Fasilitas",
    comment:""
  };
  $scope.report = function(){
    Report.postReport(usid,1,$scope.form.comment,$scope.form.category).then(function(data){
      console.log(data);
      $location.path('nearest');
    });
  }
})

.controller('SearchCtrl', function($scope, $rootScope, $location, Toilet, Geolocation) {
  Geolocation.init($scope);
  $scope.search = function(){
    Toilet.search($scope.search.query).then(function(data){
      console.log(data);
      $scope.toilets = data;
    });
  }
  $scope.goToToilet = function(toiletId){
    $location.path('toilet/'+toiletId);
  }
})

.controller('NearestCtrl', function($scope, Geolocation, Toilet, $location){
  Geolocation.init($scope);
  Toilet.getNearest().then(function(data){
    console.log(data);
    $scope.toilets = data;

  });

  $scope.goToToilet = function(toiletId){
    $location.path('toilet/'+toiletId);
  }
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

.controller('TimelineCtrl', function($scope) {

})

.controller('ToiletCtrl', function($scope, $cordovaGeolocation, $location, $stateParams, Toilet, Comment) {
    var id = $stateParams.id;
    Toilet.getById(id).then(function(data){
      $scope.toilet = data;
    });
    Comment.getByToiletId(id).then(function(data){
      $scope.comments = data
    });
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

  $scope.statistic = function() {
    $location.path('/toilet/statistic');
  }
  $scope.report = function() {
    $location.path('/report/' + id);
  }

  $scope.like = function() {

  }
  $scope.dislike = function() {

  }
  $scope.male = function() {

  }
  $scope.female = function() {

  }
  $scope.form = {
    newComment:""
  };
  $scope.comment = function(){
      console.log($scope.form.newComment);
      Comment.postNewComment(id,$scope.form.newComment).then(function(){
        Comment.getByToiletId(id).then(function(data){
          $scope.comments = data
        });
      });
      $scope.form.newComment = "";
  }
})

.controller('PopularCtrl', function($scope, Geolocation, Toilet, $location){
  Geolocation.init($scope);
  Toilet.getPopular().then(function(data){
    console.log(data);
    $scope.toilets = data;
  });
  $scope.goToToilet = function(toiletId){
    $location.path('toilet/'+toiletId);
  }
})

.controller('ToiletAddCtrl', function($scope, Geolocation) {
  Geolocation.init($scope);
  $scope.name = 'Toilet Name';
  $scope.description = 'Toilet Description';
})

.controller('ToiletStatisticCtrl', function($scope) {
  $scope.chartConfig = {
    title: {
      text: '',
      x: -20 //center
    },
    subtitle: {
        // text: 'Source: WorldClimate.com',
        x: -20
    },
    xAxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        title: {
            text: 'Ammonia Level (ppm)'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        valueSuffix: 'ppm'
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        borderWidth: 0
    },
    series: [{
      name: 'Toilet Labtek V',
      data: [7.0,  9.5,  18.2, 21.5, 25.2, 26.5, 23.3]
    }]
  };
});
