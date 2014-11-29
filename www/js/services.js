angular.module('inklusik.services', ['ngAudio', 'ngCordova'])

.factory('Player', function(ngAudio, ngAudioObject, $cordovaMedia, $q) {
  var app = document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
  var self = this;
   self.arrayku = [
     'music/SomeoneLikeYou.mp3',
     'music/SetFireToTheRain.mp3',
   ];
  self.ctr = 0;

  // self.player = angular.element('#player');
  self.my_media = null;

  self.play = function(url) {
    // self.player[0].src = url;
    // self.player[0].load();
    // self.player[0].play(url);

    // var src = "/android_asset/www/sound/sunda/"+name+"/"+url+".mp3";
    var src = url;
    if (app) {
      if (self.my_media) {
        self.my_media.stop();
        self.my_media.release();
      }
      self.my_media = new Media(src, 
          function() { my_media.stop(); my_media.release();},
          function() { my_media.stop(); my_media.release();}); 
      self.my_media.play();
    } else {
      if (self.player) {
        self.player.stop();
      }
      self.my_media = ngAudio.play(src);
    }
    // self.ctr = +!self.ctr;
  }
  self.getPlayer = function() {
    // return self.player[0];
    // console.log(self.my_media);
    // return self.my_media;
    var def = $q.defer();
    if (app) {
      self.my_media.is_app = app;
      def.resolve(self.my_media);
    } else {
      setTimeout(function() {
        self.my_media.audio.is_app = app;
        def.resolve(self.my_media.audio);
      }, 1000);
    }
    return def.promise
  }
  return self;
    // function Player (url) {

    //   return ngAudio.play(url);
    // }
    // return Player;
})

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

.factory('Song', function($http, serverUrl, $q, User) {
  var self = this;
  self.getById = function(song_id) {
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
  self.like = function(song_id) {
    // like/{type}/{user_id}/{song_id}
    $http.get(serverUrl+'like/'+User.type+'/'+User.user_id+'/'+song_id);
    $http.get(serverUrl+'music/'+song_id+'/details').success(function(data) {
      if (data.data) {
        var song = data.data;
        if (song)
          song.CoverArtFilename = 'http://images.gs-cdn.net/static/albums/' + song.CoverArtFilename;
        $http.get(serverUrl+'music/'+song_id+'/stream').success(function(data2) {
          song.filename = data2.data.url;
        });
        $http.post(serverUrl+ 'migme_post' + '/' + User.migme_id + '?body=likes ' + song.ArtistName + ' - ' + song.SongName + '&privacy=0&reply_permission=0&originality=1');
      }
    });
    
    
  }
  self.unlike = function(song_id) {
    // like/{type}/{user_id}/{song_id}
    $http.get(serverUrl+'unlike/'+User.type+'/'+User.user_id+'/'+song_id);
  }
  self.dislike = function(song_id) {
    $http.get(serverUrl+'dislike/'+User.type+'/'+User.user_id+'/'+song_id); 
  }
  self.undislike = function(song_id) {
    $http.get(serverUrl+'undislike/'+User.type+'/'+User.user_id+'/'+song_id); 
  }
  self.likeStatus = function(song_id) {
    var def = $q.defer();
    $http.get(serverUrl+'like/status/'+User.type+'/'+User.user_id+'/'+song_id).success(function(data) {
      def.resolve(data.data);
    });
    return def.promise;
  }
  self.discover = function() {
    var def = $q.defer();
    $http.get(serverUrl+'music/discover').success(function(data) {
      if (data.data) {
        def.resolve(data.data);
      }
    });
    return def.promise;
  }
  self.getLikedSong = function(){
    var def = $q.defer();
    $http.get(serverUrl+'like/my/'+User.type+'/'+User.user_id).success(function(data) {
      var list = data.data;
      var dataLengkap = [];
      for (var i=0;i<list.length;i++){
        $http.get(serverUrl+'music/'+list[i].song_id+'/details').success(function(data){
          var song = data.data;
          console.log(data);
          if (song.CoverArtFilename != null && song.CoverArtFilename != "")
            song.CoverArtFilename = 'http://images.gs-cdn.net/static/albums/' + song.CoverArtFilename;
          else 
            song.CoverArtFilename = 'img/album.jpg';
          dataLengkap.push(data.data);
        });
      }
      def.resolve(dataLengkap);
      //def.resolve(data.data);
    });
    return def.promise;
  }
  return self;
})

.factory('Lyric', function($http, serverUrl, $q) {
  var self = this;
  self.get = function(artist, title) {
    var def = $q.defer();
    console.log(serverUrl+'lyric/'+artist+'/'+title);
    $http.get(serverUrl+'lyric/'+artist+'/'+title).success(function(data) {
      var parser = $.parseHTML(data);
      // var text = parser.find('pre');
      // console.log($(parser[7]).text());
      if (parser) {
        var text = $(parser[7]).html();
        text = text.replace(/\n/g, "<br>");
        def.resolve(text);
      } else {
        def.resolve('');
      }
    });
    return def.promise;
  }
  return self;
})

.factory('Trend', function($http, serverUrl, $q){
  var self = this;
  self.getToday = function(){
    var def = $q.defer();
    $http.get(serverUrl+'music/popular/today?limit=8').success(function(data){
      var song = data.data;
      for (var i=0;i<song.length;i++){
        if (song[i].CoverArtFilename != null && song[i].CoverArtFilename != "")
          song[i].CoverArtFilename = 'http://images.gs-cdn.net/static/albums/' + song[i].CoverArtFilename;
        else 
          song[i].CoverArtFilename = 'img/album.jpg';
      }
      def.resolve(song);
    });
    return def.promise;
  }
  self.getThisMonth = function(){
    var def = $q.defer();
    $http.get(serverUrl+'music/popular/month?limit=8').success(function(data){
      var song = data.data;
      for (var i=0;i<song.length;i++){
        if (song[i].CoverArtFilename != null && song[i].CoverArtFilename != "")
          song[i].CoverArtFilename = 'http://images.gs-cdn.net/static/albums/' + song[i].CoverArtFilename;
        else 
          song[i].CoverArtFilename = 'img/album.jpg';
      }
      def.resolve(song);
    });
    return def.promise;
  }
  return self;
})

.factory('Search', function($http, serverUrl, $q){
  var self = this;
  self.search = function(query){
    var def = $q.defer();
    console.log(serverUrl+'music/search/song?query='+query);
    $http.get(serverUrl+'music/search/song?query='+query).success(function(data){
      console.log(data);
      var song = data.data;
      for (var i=0;i<song.length;i++){
        if (song[i].CoverArtFilename != null && song[i].CoverArtFilename != "")
          song[i].CoverArtFilename = 'http://images.gs-cdn.net/static/albums/' + song[i].CoverArtFilename;
        else 
          song[i].CoverArtFilename = 'img/album.jpg';
      }
      def.resolve(song);
    });
    return def.promise;
  }
  return self;
});