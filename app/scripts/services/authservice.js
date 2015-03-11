'use strict';
angular.module('origApp.services')
  .factory('AuthService', function($location, HttpResource, $window, $cookieStore, $rootScope, $q, $filter) {
    var user = {};
    var lastPath = '/';
    function setLastPath(p) {
      if (p === '/login') {
        lastPath = '/';
      } else {
        lastPath = p;
      }
    }

    function clearSession() {
      $window.sessionStorage.isLoggedIn = 0;
      $window.sessionStorage.removeItem('token');
      $window.sessionStorage.removeItem('currentUser');
    }

    function initUser() {
      if ($window.sessionStorage.currentUser) {
        user = JSON.parse($window.sessionStorage.currentUser);
      } else {
        user = {};
      }
    }
    return {
      user: user,
      getUser: function() {
        return user;
      },
      isLoggedIn: function() {
        return  $window.sessionStorage.isLoggedIn === '1';
      },
      getCurrentUser: function() {
        initUser();
        return user;
      },
      doLogin: function(emailAddress, password) {
        var defer = $q.defer();
        HttpResource.model('authenticate').customPost('', {emailAddress: emailAddress, password: password}).then(
          function(response) {
            
            var data = response.data;
            if (data.result === true) {
              $window.sessionStorage.isLoggedIn = 1;
              $window.sessionStorage.token = data.token;
              $window.sessionStorage.currentUser = $filter('json')(data.object);
              user = data.object;
              defer.resolve(data);
              $location.path(lastPath);
            } else {
              clearSession();
              defer.reject(data);
            }
          },
          function(response) {
            clearSession();
            defer.reject(response);
          });
        return defer.promise;
      },
      doLogout: function() {
        clearSession();
        setLastPath('/');
        $location.path('/register/home');
      },
      redirectToLogin: function() {
        clearSession();
        setLastPath('' + $location.path());
        $location.path('/register/home');
      }
    };
  })
  .factory('authInterceptor', function($q, $window, $location) {
    return {
      request: function(config) {
        config.headers = config.headers || {};
        if ($window.sessionStorage.token && config.url && config.url.indexOf('amazonaws.com') === -1) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      response: function(response) {
        if (response.status === 401) {
          $location.path('/register/home');
        }
        return response || $q.when(response);
      },
      responseError: function(response) {
        if (response.status === 401) {
          $location.path('/register/home');
        }
        return response || $q.when(response);
      }
    };
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });