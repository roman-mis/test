'use strict';
angular.module('origApp.services')
  .factory('MsgService', function($timeout, $rootScope, $interpolate, $modal, notify) {
    var defaultDuration = 2500;
    var messages = {
      'RegisterError': 'There was a problem registering candidate, please try again',
      'LoginError': 'Email address or Password is incorrect.'
    };
    var _MsgSrv = {
      /**
       returns all alerts

       @function
       @name alerts
       @return {Array} alerts array
       */
      alerts: function() {
        return messages;
      },
      /*
       Show an alert message                 
       Example:
       MessageService.alert( 'error', 'User name or password is incorrect', '');

       @function
       @name alert
       @param {String} messageType in ["danger","warning","info","success"]
       @param {String} msgText
       @param {String} cssClass                 
       @param {object} scope
       */
      alert: function(msgText, messageType, cssClass, scope, duration) {
        messageType = messageType || 'info';
        var msg = {message: msgText, templateUrl: 'views/partials/alert_' + messageType.toLowerCase() + '.html'};
        if (scope !== null) {
          msg.scope = scope;
        }
        if (cssClass !== null) {
          msg.classes = cssClass;
        }
        duration = duration || defaultDuration;
        notify.config({duration: duration});
        notify(msg);
      },
      /**
       gets the text for a message and fills the template with data                 
       Example:
       @function
       @name getAlertText
       @param {String} key
       @param {Object} params - value object that contains variables to format msg
       */
      getAlertText: function(key) {
        return messages[key];
      },
      alertByKey: function(messageType, key, params) {
        return _MsgSrv.alert(_MsgSrv.getAlertText(key, params), messageType);
      },
      danger: function(msgText, cssClass, scope, duration){
        return _MsgSrv.alert(msgText, 'danger', cssClass, scope, duration);
      },
      info: function(msgText, cssClass, scope, duration){
        return _MsgSrv.alert(msgText, 'info', cssClass, scope, duration);
      },
      warn: function(msgText, cssClass, scope, duration){
        return _MsgSrv.alert(msgText, 'warning', cssClass, scope, duration);
      },
      success: function(msgText, cssClass, scope, duration){
        return _MsgSrv.alert(msgText, 'success', cssClass, scope, duration);
      }
      
    };

    return _MsgSrv;
  });
