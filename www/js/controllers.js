angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('FriendsCtrl', function($scope, Friends) {
		$scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
		$scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {

})

.controller('MapCtrl', function($scope, $state, $location, $http, $window, Maps, $timeout, AvailableShifts) {

		$scope.map;
		$scope.infowindow;
		$scope.location = Maps.getLocation();

		document.getElementById("pickupshift").style.display = 'none';
		document.getElementById("covermyshift").style.display = 'none';

		$timeout(function(){
			document.getElementById("pickupshift").style.display = 'block';
			document.getElementById("covermyshift").style.display = 'block';
			document.getElementById("loading").style.display = 'none';
		},6000)


		// Cover shift page
		$scope.cover = function() {
				$location = "app.tab.friends"
		};

		$scope.pickupShiftPage = function(){
			$location = "app.pickup-list"

		};
		// Pickup a shift page
		$scope.pickup = function() {
				// $location = "app.tab.pickup"
				document.getElementById("pickupshift").style.display = 'none';
				document.getElementById("covermyshift").style.display = 'none';
				$http({
						method: 'GET',
						url: 'https://shift-it.herokuapp.com/shifts/lat/'+$scope.location.lat+'/lng/'+$scope.location.lng+'/rad/5000'
						}).then(function successCallback(response) {
							console.log("got response", response.data)
						  callback(response.data)
						}, function errorCallback(response) {
							alert("Could not get stores from the server, please try again later")
						});
		};

		var onSuccess = function(position) {
				console.log(position.coords.latitude, position.coords.longitude)
				//Use factory to store location
				$scope.location = {lat: position.coords.latitude, lng:position.coords.longitude};
				// Maps.setLocation({lat: position.coords.latitude, lng:position.coords.longitude})
				var mapOptions = {
						center: {
								lat: position.coords.latitude,
								lng: position.coords.longitude
						},
						zoom: 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				// Create new google map obj and hook it up to the html element
				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions)
				console.log("map obj", $scope.map)
				$scope.infowindow = new google.maps.InfoWindow();
				// Use factory to store the map
				Maps.setMap($scope.map)
				// var service = new google.maps.places.PlacesService($scope.map);

				// service.nearbySearch({
				// 		location: {
				// 				lat: position.coords.latitude,
				// 				lng: position.coords.longitude
				// 		},
				// 		radius: 5000,
				// 		name: ['starbucks']
				// }, callback);

				// If at pickup page initiate api call to server to get stores
				if($location.url() === '/app/tab/pickup'){
					$http({
						method: 'GET',
						url: 'http://localhost:4000/shifts/lat/'+position.coords.latitude+'/lng/'+position.coords.longitude+'/rad/5000'
						}).then(function successCallback(response) {
							console.log("got response", response.data)
						  callback(response.data)
						}, function errorCallback(response) {
							alert("Could not get stores from the server, please try again later")
						});
					}
				}

		var onError = function(error) {
			if(error.code === 3){
				alert("Sorry, we are having trouble using your geolocation. Try refreshing the page to fix the problem");
				$window.location.href = '#/'+$location.url()	;
			}else{
				alert('code: ' + error.code + '\n' +
						'message: ' + error.message + '\n');
			}
		}

		// Location is not set yet? => find location
		if($scope.location === undefined){
			console.log('getting location for the first time')
			// get geolocation of the device
			navigator.geolocation.getCurrentPosition(onSuccess,
					onError, {
						maximumAge: 3000,
						timeout: 10000,
						enableHighAccuracy: true
			});
		// Create a map with existing location
		}else{
			console.log('using existing location from scope')
			var mapOptions = {
						center: {
								lat: $scope.location.lat,
								lng: $scope.location.lng
						},
						zoom: 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				// Create new google map obj and hook it up to the html element
				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
				// var mapsich = new google.maps.latlng()
				// $scope.map.control.refresh({latitude: 32.779680, longitude: -79.935493})
				// $scope.map.render();
				// google.maps.event.trigger($scope.map, 'resize');
				// $route.reload();
				// Map.init()
				$scope.infowindow = new google.maps.InfoWindow();

				// If at pickup page initiate api call to server to get stores
				if($location.url() === '/app/tab/pickup'){
					$http({
						method: 'GET',
						url: 'https://shift-it.herokuapp.com/shifts/lat/'+$scope.location.lat+'/lng/'+$scope.location.lng+'/rad/5000'
						}).then(function successCallback(response) {
							console.log("got response", response.data)
						  callback(response.data)
						}, function errorCallback(response) {
							alert("Could not get stores from the server, please try again later")
						});
				}
		}

		//add meaningfuller name
		function callback(results, status) {
				// if (status === google.maps.places.PlacesServiceStatus.OK) { // TODO
						for (var i = 0; i < results.results.length; i++) {
								console.log(results.results[i])
								createMarker(results.results[i]);
						}
				// }
		}

		function createMarker(place) {
				var loc = place.geometry.location;
				var icons = ''
				if(!place.shifts){
				 icons = '../img/marker-gray.png'
				}
				var marker = new google.maps.Marker({
						position: {
								lat: place.geometry.location.lat,
								lng: place.geometry.location.lng
						},
						animation: google.maps.Animation.DROP,
						icon: icons
				});

				marker.setMap($scope.map);
				google.maps.event.addListener(marker, 'click', function() {
						// if (marker.getAnimation() !== null) {
						// 		marker.setAnimation(null);
						// } else {
						// 		marker.setAnimation(google.maps.Animation.BOUNCE);
						// }

						//jasjs
						var info = "";
						if(place.shifts){
							place.shifts.forEach(function(shift){
								var shiftObj = {};
								shiftObj.store = place.vicinity;
								shiftObj.start = shift.shift_start;
								shiftObj.end = shift.shift_end;
								shiftObj.postedby = shift.submitted_by;
								shiftObj.prize = shift.prize;
								AvailableShifts.addShift(shiftObj);

								info += `<li> ${place.name} <br />  ${place.vicinity} </li>
											<li> Shifts available: </li>
											<li id="listElement"> <span style="font-size:9"> ${shift.submitted_by} needs someone to cover a shift</span> <br/>
												<strong> ${shift.shift_start} to ${shift.shift_end}</strong>
												<span style="color:green">Prize: ${shift.prize}</span>
												<button onclick="window.location = '#/app/tab/pickup-list'"> Take shift</button>
											</li>`
								});
						}else{
							info = "<li>No shifts available for this store</li>"
						}
						
						// marker popup window
						$scope.infowindow.setContent(

							// back-ticks not working for testing suite
							 // "<ul>\n<li> " + place.name + " <br />  " + place.vicinity + " </li>\n<li> Shifts available: </li>\n<li> <span style=\"font-size:9\"> " + place.shifts[0].submitted_by + " needs someone to cover a shift</span> <br/>\n<strong> " + place.shifts[0].shift_start + " to " + place.shifts[0].shift_end + "</strong>\n<span style=\"color:green\">Prize: " + place.shifts[0].prize + "</span>\n<button> Take this shift</button>\n</li>\n<li> <span style=\"font-size:9\">Mark needs someone to cover a shift</span> <br/>\n<strong> 09.23 => from 8am to 12pm </strong>\n<span style=\"color:green\">Prize: $20</span>\n<button> Take this shift</button>\n</li>\n</ul>"
							`<ul>${info}</ul>`

						);
						$scope.infowindow.open($scope.map, this);
				});
		}
})

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout, UserService) {

		// With the new view caching in Ionic, Controllers are only called
		// when they are recreated or on app start, instead of every page change.
		// To listen for when this page is active (for example, to refresh data),
		// listen for the $ionicView.enter event:
		//$scope.$on('$ionicView.enter', function(e) {
		//});

		// Form data for the login modal
		$scope.loginData = {};

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/login.html', {
				scope: $scope
		}).then(function(modal) {
				$scope.modal = modal;
		});

		// Triggered in the login modal to close it
		$scope.closeLogin = function() {
				$scope.modal.hide();
		};

		// Open the login modal
		$scope.login = function() {
				$scope.modal.show();
		};

		 $scope.authenticate = function(provider) {
    UserService.authenticate(provider);
  	};

	  $rootScope.$on('userLoggedIn', function(data){
	    // here we will recieve the logged in user
	    console.log(data);
	    $scope.closeLogin();
	  });

	  // will fire in case authentication failed
	  $rootScope.$on('userFailedLogin', function(){

	  });

		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {

				// Simulate a login delay. Remove this and replace with your login
				// code if using a login system
				$timeout(function() {
						$scope.closeLogin();
				}, 100);
		};

		// Hamburger button active state switcher
		// There is a bug when clicking on tab buttons while sidemenu is open,
		// the menu gets closed but the class doesnt toggle
		$scope.isActive = false;
		$scope.activeButton = function() {
				$scope.isActive = !$scope.isActive;
		}

})

.controller('ProfileCtrl', function($scope, $ionicModal, Profile) {

		// Form data for the login modal
		$scope.profileData = {
				// "name": "Alice Bobinsky",
				// "email": "alice@gmail.com",
				// "phone": "(512) 123-4567",
				// "mainshop": "nearest",
				// "secondary": "some other"
		};

		// Create the login modal that we will use later
		$ionicModal.fromTemplateUrl('templates/editProfile.html', {
				scope: $scope
		}).then(function(modal) {
				$scope.modal = modal;
		});

		// Triggered in the edit profile modal to close it
		$scope.closeEditProfile = function() {
				$scope.modal.hide();
		};

		// Open the edit profile modal
		$scope.openEditProfile = function() {
				$scope.modal.show();
		};
})

.controller('CoverCtrl', function($scope, ionicDatePicker, ionicTimePicker){
  $scope.shiftData = {};
  $scope.$on('$ionicView.enter', function() {
	   // Code you want executed every time view is opened
	   $scope.openDatePicker();
	   console.log('Opened!')
	})
	var ipObj1 = {
      callback: function (val) {  //Mandatory
      	$scope.shiftData.shift_start = new Date(val);
      	console.log("shiftData is: ", $scope.shiftData);
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.openTimePicker();
      },
      disabledDates: [            //Optional
        new Date(2016, 2, 16),
        new Date(2015, 3, 16),
        new Date(2015, 4, 16),
        new Date(2015, 5, 16),
        new Date('Wednesday, August 12, 2015'),
        new Date("08-16-2016"),
        new Date(1439676000000)
      ],
      from: new Date(2012, 1, 1), //Optional
      to: new Date(2016, 10, 30), //Optional
      inputDate: new Date(),      //Optional
      mondayFirst: true,          //Optional
      disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };
  var ipObj2 = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };

  var ipObj3 = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var selectedTime = new Date(val * 1000);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };

  // ionicTimePicker.openTimePicker(ipObj1);
  $scope.openTimePicker = function(){
    ionicTimePicker.openTimePicker(ipObj3);
  };

  // ionicTimePicker.openTimePicker(ipObj1);
  $scope.openTimePicker = function(){
    ionicTimePicker.openTimePicker(ipObj2);
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.openProzePicker = function(){

  }
})

.controller('PickupCtrl', function($scope, AvailableShifts, $location, $state) {
		
		$scope.availableShifts = AvailableShifts.getShifts();
		$scope.callFriend = function(friend){
			var friendo = 0;
			if(friend === 111 || friend === 222){
				friendo = 1;
			}else if(friend === 333 || friend === 444){
				friendo = 2
			}
			window.location = "#/app/friend/"+friendo;
			console.log("calling friend")
		}

});






