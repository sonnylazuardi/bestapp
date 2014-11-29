// Declare app level module which depends on filters, and services
angular.module('inklusik.config', [])
   .constant('version', '0.1')
   .constant('serverUrl', 'http://diora.suitdev.com/')
   .constant('loginRedirectPath', '/login')
   .constant('FBURL', 'https://inklusik.firebaseio.com');