/* Filters */

angular.module('inklusik.filters', [])
   .filter('interpolate', ['version', function(version) {
      return function(text) {
         return String(text).replace(/\%VERSION\%/mg, version);
      }
   }])
   
   .filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
   })

   .filter('cut', function() {
    return function(text) {
      return String(text).substr(0, 25);
    }
  })

    .filter('cutspace', function() {
      return function(text) {
        var idx = 0;
        for (var i=0;i<text.length;i++){
          if (text[i] == ' '){
            idx = i;
            break;
          }
        }
        return String(text).substr(0, idx);
      }

   })

   .filter('capitalize', function() {
      return function(text) {
         return String(text).replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
      }
   })

   .filter('reverse', function() {
      function toArray(list) {
         var k, out = [];
         if( list ) {
            if( angular.isArray(list) ) {
               out = list;
            }
            else if( typeof(list) === 'object' ) {
               for (k in list) {
                  if (list.hasOwnProperty(k)) { out.push(list[k]); }
               }
            }
         }
         return out;
      }
      return function(items) {
         return toArray(items).slice().reverse();
      };
   });
