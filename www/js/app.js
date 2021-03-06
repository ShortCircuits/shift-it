// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'satellizer', 'ionic-datepicker', 'ionic-timepicker', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    if (window.plugin) {
      map = window.plugin.google.maps.Map;//.getMap(div);
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, ionicTimePickerProvider, $authProvider) {

  var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2012, 8, 1),
      to: new Date(2018, 8, 1),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: false,
      disableWeekdays: []
    };
    ionicDatePickerProvider.configDatePicker(datePickerObj);

  var timePickerObj = {
      inputTime: (((new Date()).getHours() * 60 * 60) + ((new Date()).getMinutes() * 60)),
      format: 12,
      step: 15,
      setLabel: 'Set',
      closeLabel: 'Close'
    };
    ionicTimePickerProvider.configTimePicker(timePickerObj);

    //this is for Satellizer and providing our authorization functionality
    var commonConfig = {
        popupOptions: {
        location: 'no',
        toolbar: 'yes',
        width: window.screen.width,
        height: window.screen.height
                        }
    };

    if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
        commonConfig.redirectUri = 'http://localhost:8100/';
    }
    $authProvider.facebook(angular.extend({}, commonConfig, {
        clientId: '1169374106434305',
        url: 'http://localhost:4000/auth/facebook'
    }));

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the menu directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('app.cover', {
    url: '/cover',
    views: {
      'menuContent': {
        templateUrl: 'templates/cover.html',
        controller: 'CoverCtrl'
      }
    }
  })

  .state('app.friends', {
    url: '/friends',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-friends.html',
        controller: 'FriendsCtrl'
      }
    }
  })

  .state('app.friend-detail', {
    url: '/friend/:friendId',
    views: {
      'menuContent': {
        templateUrl: 'templates/friend-detail.html',
        controller: 'FriendDetailCtrl'
      }
    }
  })

  .state('app.partner', {
    url: '/partner',
    views: {
      'menuContent': {
        templateUrl: 'templates/partner.html',
        controller: 'PartnerCtrl'
      }
    }
  })

  .state('app.tab', {
    url: "/tab",
    views: {
      'menuContent': {
        templateUrl: "templates/tabs.html"
      }
    }
  })

  .state('app.tab.pickup-list', {
    url: '/pickup-list',
    views: {
      'tab-pickup-list': {
        templateUrl: 'templates/pickup-list.html',
        controller: 'PickupCtrl'
      }
    }
  })
  // Each tab has its own nav history stack:

  .state('app.tab.cover', {
    url: '/cover2',
    views: {
      'tab-cover': {
        templateUrl: 'templates/cover.html',
        controller: 'CoverCtrl'
      }
    }
  })

  .state('app.tab.map', {
    url: '/map',
    views: {
      'tab-map': {
        templateUrl: 'templates/map.html',
        controller: 'MapCtrl'
      }
    }
  })

  .state('app.tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/settings.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('app.tab.myshifts', {
    url: '/myshifts',
    views: {
      'tab-myshifts': {
        templateUrl: 'templates/myshifts.html',
        controller: 'MyShiftsCtrl'
      }
    }
  })


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('app/tab/map');

});