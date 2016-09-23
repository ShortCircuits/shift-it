angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('FriendsCtrl', function($scope, Friends) {
		$scope.friends = Friends.all();
		$scope.name = "jimmy";

		$scope.obj1 = {"name": "joe"};
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
		$scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
})

.controller('MapCtrl', function($scope, $state, $location, $http, $window, Maps, $timeout, AvailableShifts, $ionicLoading) {

		$scope.map;
		$scope.infowindow;
		$scope.location = Maps.getLocation();

		$scope.show = function() {
	    $ionicLoading.show({
	      template: '<p>Loading please wait..</p><ion-spinner icon="lines"></ion-spinner>',
	      noBackdrop: true
	    });
	  };

  $scope.hide = function(){
      $ionicLoading.hide();
  };

  	$scope.show($ionicLoading);

		document.getElementById("pickupshift").style.display = 'none';
		document.getElementById("covermyshift").style.display = 'none';
		document.getElementById("loading").style.display = 'none';

		$timeout(function() {
				document.getElementById("pickupshift").style.display = 'block';
				document.getElementById("covermyshift").style.display = 'block';
				$scope.hide($ionicLoading);
				//document.getElementById("loading").style.display = 'none';

		}, 4000)

		// Cover shift page
		$scope.cover = function() {

			// make request to the server too see if there shotul be notification for the user
			$http({
						method: 'GET',
						url: 'https://shift-it.herokuapp.com/pickup'
				}).then(function successCallback(response) {
						console.log("got response", response.data)
						// TODO
						// wishfull programing
						if(response){
							// user has notification
							document.getElementById("notification").style.display = 'block';
							// store data in the factory for view to use

							// relocate the user
							window.location = "#/app/tab/cover2"
						}
				}, function errorCallback(response) {
						alert("Could not get notifications from server, suprise")
				});
				document.getElementById("notification").style.display = 'none';
		};

		$scope.pickupShiftPage = function() {
				$location = "app.pickup-list"

		};
		// Pickup a shift page
		$scope.pickup = function() {
				// $location = "app.tab.pickup"
				document.getElementById("pickupshift").style.display = 'none';
				document.getElementById("covermyshift").style.display = 'none';
				$scope.show($ionicLoading);
				$http({
						method: 'GET',
						url: 'https://shift-it.herokuapp.com/shifts/lat/' + $scope.location.lat + '/lng/' + $scope.location.lng + '/rad/5000'
				}).then(function successCallback(response) {
						console.log("got response", response.data)
						callback(response.data)
				$scope.hide($ionicLoading);
				}, function errorCallback(response) {
						alert("Could not get stores from the server, please try again later")
				});
				$scope.show($ionicLoading);

		};

		var onSuccess = function(position) {
				console.log(position.coords.latitude, position.coords.longitude)
						//Use factory to store location
				$scope.location = {
						lat: position.coords.latitude,
						lng: position.coords.longitude
				};
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
				$scope.infowindow = new google.maps.InfoWindow();
				// Use factory to store the map
				Maps.setMap($scope.map)
		}

		var onError = function(error) {
				if (error.code === 3) {
						alert("Sorry, we are having trouble using your geolocation. Try refreshing the page to fix the problem");
						$window.location.href = '#/' + $location.url();
				} else {
						alert('code: ' + error.code + '\n' +
								'message: ' + error.message + '\n');
				}
		}

		// Location is not set yet? => find location
		if ($scope.location === undefined) {
				console.log('getting location for the first time')
						// get geolocation of the device
				navigator.geolocation.getCurrentPosition(onSuccess,
						onError, {
								maximumAge: 3000,
								timeout: 10000,
								enableHighAccuracy: true
						});
				// Create a map with existing location
		} else {
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
				$scope.infowindow = new google.maps.InfoWindow();
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
				if (!place.shifts) {
						icons = 'img/marker-gray.png'
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

						var info = "";
						if (place.shifts) {
								place.shifts.forEach(function(shift) {
										var shiftObj = {};
										shiftObj.store = place.vicinity;
										shiftObj.start = shift.shift_start;
										shiftObj.end = shift.shift_end;
										shiftObj.postedby = shift.submitted_by;
										shiftObj.prize = shift.prize;
										shiftObj.id = shift._id;
										AvailableShifts.addShift(shiftObj);

										info += "<li> " + place.name + " <br />  " + place.vicinity + " </li>\n<li> Shifts available: </li>\n<li id=\"listElement\"> <span style=\"font-size:9\"> " + shift.submitted_by + " needs someone to cover a shift</span> <br/>\n<strong> " + shift.shift_start + " to " + shift.shift_end + "</strong>\n<span style=\"color:green\">Prize: " + shift.prize + "</span>\n<button onclick=\"window.location = '#/app/tab/pickup-list'\"> Take shift</button>\n</li>"
										
										// `<li> ${place.name} <br />  ${place.vicinity} </li>
										// 	<li> Shifts available: </li>
										// 	<li id="listElement"> <span style="font-size:9"> ${shift.submitted_by} needs someone to cover a shift</span> <br/>
										// 		<strong> ${shift.shift_start} to ${shift.shift_end}</strong>
										// 		<span style="color:green">Prize: ${shift.prize}</span>
										// 		<button onclick="window.location = '#/app/tab/pickup-list'"> Take shift</button>
										// 	</li>`
								});
						} else {
								info = "<li>No shifts available for this store</li>"
						}

						// marker popup window
						$scope.infowindow.setContent(
								"<ul>"+info+"</ul>"
							//	`<ul>${info}</ul>`
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

		$scope.logout = function() {
				UserService.logOut();
		};

		$rootScope.$on('userLoggedIn', function(data) {
				// here we will recieve the logged in user
				console.log(data);
				$scope.closeLogin();
		});

		// will fire in case authentication failed
		$rootScope.$on('userFailedLogin', function() {

		});

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

// This controller handles the functionality for creating and posting a new shift.
.controller('CoverCtrl', function($scope, $ionicModal, ionicDatePicker, ionicTimePicker, $http){
  // change storeId and submitted_by to be dynamically loaded in when that is available.
  $scope.shiftData = {storeId      : "ChIJPXmIAnW1RIYRRwVbIcKT_Cw", covered: false, submitted_by: 555};
  $scope.$on('$ionicView.enter', function() {
	   // Code you want executed every time view is opened
	   $scope.openDatePicker();
	   console.log('Opened!')
	})
	
  // This is the Date picker modal popout, that initializes the shift_start and shift_end keys in the shift object
  // On a chosen date it sets both values to the chosen date with no time, and then it shows the first time picker
  var ipObj1 = {
      callback: function (val) {  //Mandatory
      	$scope.shiftData.shift_start = new Date(val);
        $scope.shiftData.shift_end = new Date(val);
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      	console.log("shiftData is: ", $scope.shiftData);
        console.log('Return value from the datepicker popup is : ' + val, new Date(val));
        $scope.openTimePicker1();
        $scope.shiftDate = "Date: " + $scope.shiftData.shift_start.getUTCDate() + " " + monthNames[$scope.shiftData.shift_start.getUTCMonth()] + " " + $scope.shiftData.shift_start.getUTCFullYear()

        // var month = dateObj.getUTCMonth() + 1; //months from 1-12
        // var day = dateObj.getUTCDate();
        // var year = dateObj.getUTCFullYear();

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
      // disableWeekdays: [0],       //Optional
      closeOnSelect: false,       //Optional
      templateType: 'popup'       //Optional
    };

  // This function converts the minutes into a 2 digit number if 0 is chosen
  function convertMinutes(minutes){
    if (minutes === 0){
      return "00"
    }
    return minutes;
  }

  // This is the modal for the end shift time picker, it will update the shift object with the correct time in the
  // current time zone for the user. On submit it opens the prize picker modal.
  var ipObj2 = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var splitStart = $scope.shiftData.shift_start.toString().split(' ');
        var selectedTime = new Date(val * 1000);
        splitStart[4] = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes()) + ":00";
        $scope.shiftData.shift_end = new Date(splitStart.join(' '));
        console.log($scope.shiftData);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
      $scope.prizePicker();
      $scope.endTime = "Start Time: " + selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };

  // This is the modal for the start shift time picker, it will update the shift object with the correct time in the
  // current time zone for the user. On submit it opens the end shift time picker modal.
  var ipObj3 = {
    callback: function (val) {      //Mandatory
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        var splitStart = $scope.shiftData.shift_start.toString().split(' ');
        var selectedTime = new Date(val * 1000);
        splitStart[4] = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes()) + ":00";
        $scope.shiftData.shift_start = new Date(splitStart.join(' '));
        console.log("our built time is: ", splitStart);
        console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
      }
      $scope.openTimePicker2();
      $scope.startTime = "End Time: " + selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
    },
    inputTime: 50400,   //Optional
    format: 12,         //Optional
    step: 15,           //Optional
    setLabel: 'Set2'    //Optional
  };

  // This shows the prize picker modal
  $ionicModal.fromTemplateUrl('templates/prizeModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

  // Function for the end shift time picker
  $scope.openTimePicker1 = function(){
    ionicTimePicker.openTimePicker(ipObj3);
  };

  // Function for the start shift time picker
  $scope.openTimePicker2 = function(){
    ionicTimePicker.openTimePicker(ipObj2);
  };

  // Function for the date picker
  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

  // Function to show the prize picker
  $scope.prizePicker = function(){
    $scope.modal.show();
  }

  // Function to submit the prize to the shift object
  $scope.addPrize = function() {
    console.log($scope.shiftData);
    $scope.closePrize();
  };

  // Function to close the prize modal
  $scope.closePrize = function() {
    $scope.modal.hide();
  };

  // Setting a variable to the fully fleshed out shiftData
  var shift = $scope.shiftData;

  // Server call to insert the shift data into the database.
  $scope.postShift = function() {
    $http({
      method: 'POST',
      url: 'https://shift-it.herokuapp.com/shifts',
      data: shift
    }).then(function(response){
      console.log("shift submitted to database with shift data: ", shift);
    }, function(error){
      console.log("error posting shift to db")
    })
  }
  // if(shift.shift_start && shift.shift_end && shift.prize){}
})

.controller('PickupCtrl', function($scope, AvailableShifts, $location, $state, $http) {

		$scope.availableShifts = AvailableShifts.getShifts();
		var user = 222;

		$scope.doRefresh2 = function() {
			console.log("refreshing");
			window.location = "#/app/tab/map"
		}


		$scope.callFriend = function(postedBy, shiftId) {
			var theData = { 
				// needs to be user got from the Auth factory
				user_requested: user.toString(),
				shift_id: shiftId,
				shift_owner: postedBy,
			};
			user++;
			var notifyUser = function(){

				//Needs to go to different page
				window.location = "#/app/friends";
				console.log("shift requested")
			}

			$http({
						method: 'POST',
						url: 'https://shift-it.herokuapp.com/pickup',
						data: theData
				}).then(function successCallback(response) {
						console.log("got response", response.data)
						notifyUser();
				}, function errorCallback(response) {
						alert("Could not post shift to server, please try again later")
				});

		}

})

.controller('PartnerCtrl', function($scope) {
	// possible get request to db to fetch facebook profile data
		$scope.partnerInfo = {};
		console.log("partner info from fb");
});
