angular.module('inklusik.controllers', ['ionic.contrib.ui.tinderCards', 'ui.knob', 'ngCordova'])

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

.controller('PlayCtrl', function($scope, $rootScope, TDCardDelegate, Player, Playlist, Song, Lyric, $location, $stateParams) {
    $rootScope.loginShow = false;
    $rootScope.playShow = true;

    $scope.nextSong = function() {
        Playlist.songList = _.rest(Playlist.songList);
        if (_.first(Playlist.songList) == undefined) {
            $location.path('home');
            Player.getPlayer().stop();
        } else {
            $location.path('play/'+_.first(Playlist.songList));
        }
    }

    $scope.songInfo = {
        song_id: $stateParams.song_id, 
        nextSong: $scope.nextSong
    }
    $scope.audioPlaying = null;
    $scope.lyric = '';
    $scope.likeStatus = {love:0, hate:0};
    $scope.toggleLike = function() {
        $scope.likeStatus.love = +!$scope.likeStatus.love;
        if ($scope.likeStatus.love) {
            Song.like($scope.songInfo.song_id);
        } else {
            Song.unlike($scope.songInfo.song_id);
        }
    };

    $scope.toggleDislike = function() {
        $scope.likeStatus.hate = +!$scope.likeStatus.hate;
        if ($scope.likeStatus.hate) {
            Song.dislike($scope.songInfo.song_id);
        } else {
            Song.undislike($scope.songInfo.song_id);
        }
    };

    $scope.mediaTimer = null;

    Song.getById($scope.songInfo.song_id).then(function(data) {
        $scope.song = data;
        Player.play($scope.song.filename);

        Player.getPlayer().then(function(my_player) {
          $scope.audioPlaying = my_player;
          console.log('audio : ');
          console.log($scope.audioPlaying);
          if (my_player.is_app) {
            $scope.mediaTimer = setInterval(function () {
              my_player.getCurrentPosition(
                function (position) {
                  if (position > -1) {
                    $scope.progressBar = parseInt(position / my_player.getDuration() * 100);
                    $scope.$apply();
                  }
                }
              );
            }, 800);
          } else {
            $scope.audioPlaying.ontimeupdate = function() {
              $scope.progressBar = parseInt($scope.audioPlaying.currentTime / $scope.audioPlaying.duration * 100);
              $scope.$apply();
            }

            $scope.audioPlaying.onended = function() {
              console.log('beres');
              $scope.nextSong();
            }
          }

          $scope.isPlaying = true;
        });


        Lyric.get(data.ArtistName, data.SongName).then(function(data2) {
            console.log(data2);
            $scope.lyric = data2;
        });
        Song.likeStatus($scope.songInfo.song_id).then(function(data3) {
            $scope.likeStatus = data3;
        });
    });
    
    var cardTypes = [
        { title: 0 },
    ];

    $scope.cards = Array.prototype.slice.call(cardTypes, 0);

    $scope.cardDestroyed = function(index) {
        // $scope.cards.splice(index, 1);
        $scope.nextSong();
    };

    $scope.addCard = function() {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.progressBar = 0;
    $scope.isPlaying = false;
    $scope.control = function() {
        $scope.isPlaying = !$scope.isPlaying;
        if ($scope.isPlaying) {
            $scope.audioPlaying.play();
        } else {
            $scope.audioPlaying.pause();
        }
    }
    console.log($scope.audioPlaying);

    $scope.changeProgress = function(val) {
      console.log(val);
      if ($scope.audioPlaying.duration) {
        $scope.audioPlaying.currentTime = ((parseInt(val)/100) * $scope.audioPlaying.duration);
      }
    }
})

.controller('CardCtrl', function($scope, TDCardDelegate, Song) {
  $scope.cardSwipedLeft = function(index) {
    console.log('LEFT SWIPE');
    Song.dislike($scope.songInfo.song_id);
    $scope.songInfo.nextSong();
    // $scope.addCard();
  };
  $scope.cardSwipedRight = function(index) {
    console.log('RIGHT SWIPE');
    Song.like($scope.songInfo.song_id);
    $scope.songInfo.nextSong();
    // $scope.addCard();
  };
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
});
