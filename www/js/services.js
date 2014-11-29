angular.module('inklusik.services', ['ngCordova'])

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