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

		$scope.myStoreInfo = {};
    $scope.map;
		$scope.infowindow;
		$scope.location = Maps.getLocation();
		$scope.user = {
			message: "Your request for a shift has been approved!",
			link: "#/app/tab/firends"
		};

		$scope.$on('$ionicView.enter', function() {
	    $scope.notification();
	    console.log('Opened!')
	})

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

		// cover is back - hack for manipulating the accepto button destination
		window.cover = function(){
			window.location = "#/app/tab/pickup-list"
		}

		window.approve = function(shiftId){
			console.log("window.approve is running here!")
			$http({
						method: 'PATCH',
						url: 'http://localhost:4000/pickup',								
						data: {shift_id: "57e6b0ed1c3a043e94624a87"}
				}).then(function successCallback(response) {
					  console.log("aprove return: ", response.data)

				}, function errorCallback(response) {
						alert("Could not aprove the shift", response)
				});
		}

		// sets the store the user works at :: TODO
		window.setMyStore = function(storeId, address){
      var myStoreObj = {storeId: storeId, address: address}
			console.log(myStoreObj);
      var confirmation = confirm("Set your home store as " + address + "?");
      if (confirmation){
        $http({
          method: 'PATCH',
          url: 'http://localhost:4000/users',
          data: {home_store: myStoreObj}
        }).then(function successCallback(response){
          console.log("home store set as: ", response.data)
        }, function errorCallback(response) {
          alert("Please log in to set your home store.")
        })
      } else {
        alert("this should be something other than an alert");
      }
		}

		// Notifications
		$scope.notification = function() {
			// Get user Id from server
			
			$http({
						method: 'GET',
						url: 'http://localhost:4000/whoami'
				}).then(function successCallback(response) {
						Maps.setUser(response.data);
						console.log("this is me", response.data)
				
				}, function errorCallback(response) {
						alert("Could not get user Id from server, suprise")
				});

			// make request to the server too see if there shotul be notification for the user
			$http({
						method: 'GET',
						url: 'http://localhost:4000/pickup'
				}).then(function successCallback(response) {
						console.log("got response", response)
						Maps.setApprovals(response.data);
						// TODO
						// wishfull programing
						if(response.data[0] && response.data[0].approved === true){
							document.getElementById("noticeMsg").innerHTML = 'You have a shift approved';
							document.getElementById("accepto").setAttribute("onclick", "cover()")
						}else if(response.data[0] && response.data[0].approved === false){
							document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
							document.getElementById("accepto").setAttribute("onclick", "approve()")
						}
						if(response.data.length > 0){
							// user has notification
							document.getElementById("notification").style.display = 'block';

						}
				}, function errorCallback(response) {
						alert("Could not get notifications from server, suprise")
				});
				document.getElementById("notification").style.display = 'none';
		};

		window.approve = function() {
			window.location = "#/app/partner";
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
						url: 'http://localhost:4000/shifts/lat/' + $scope.location.lat + '/lng/' + $scope.location.lng + '/rad/5000'
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
								`<ul><li><button onclick="setMyStore('${place.place_id}', '${place.vicinity}')">Set this store as my store</button></li>${info}</ul>`
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

.controller('ProfileCtrl', function($scope, $http, $ionicModal, Profile, Maps) {

	$scope.profileData = {};

	$scope.$on('$ionicView.enter', function() {

    if (!Maps.getUser()) {
    	// Need to decide -- how to handle not-logged-in
    	alert("Not logged in, friend!");
    } else {
		  // Code you want executed every time view is opened
		  $http({
		  	method: 'GET',
		  	url: 'http://localhost:4000/getProfileInfo'
		  }).then(function successCallback(response){
		  	$scope.profileData = response.data[0];
		  }, function errorCallback(response){
		  	// redirect to login page if user tries to reach profile page when not logged in
		  });
    }


		$scope.editProfileTempData = {
			firstName:'',
			lastName: '',
			email: '',
			phone: ''
		};

		$scope.fillEditTemp = function(){
			$scope.editProfileTempData.firstName = $scope.profileData.firstName;
			$scope.editProfileTempData.lastName = $scope.profileData.lastName;
			$scope.editProfileTempData.email = $scope.profileData.email;
			$scope.editProfileTempData.phone = $scope.profileData.phone || '';
		};

		$scope.clearEditTemp = function(){
			$scope.editProfileTempData.firstName = '';
			$scope.editProfileTempData.lastName = '';
			$scope.editProfileTempData.email = '';
			$scope.editProfileTempData.phone = '';
		};

    // Functionality for editProfile modal
    $scope.submitProfile = function(){
    	$http({
        method: 'PATCH',
        url: 'http://localhost:4000/users',
        data: $scope.editProfileTempData,
      }).then(function successCallback(response){
        $scope.profileData = response.data;
      	$scope.closeEditProfile();
      }, function errorCallback(response) {
        alert("Failure to update profile");
      	$scope.closeEditProfile();
      })
    }

    // Open and close the modal to edit Profile
		$ionicModal.fromTemplateUrl('templates/editProfile.html', {
				scope: $scope
		}).then(function(modal) {
				$scope.modal = modal;
		});

		// Triggered in the edit profile modal to close it
		$scope.closeEditProfile = function() {
			$scope.modal.hide();
			$scope.clearEditTemp();
		};

		// Open the edit profile modal
		$scope.openEditProfile = function() {
			$scope.fillEditTemp();
			$scope.modal.show();
		};

	})
})

// This controller handles the functionality for creating and posting a new shift.
.controller('CoverCtrl', function($scope, $ionicModal, ionicDatePicker, ionicTimePicker, $http){
  // change storeId and submitted_by to be dynamically loaded in when that is available.
  $scope.shiftData = {storeId: "ChIJPXmIAnW1RIYRRwVbIcKT_Cw", covered: false};
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
        $scope.shiftDate = $scope.shiftData.shift_start.getUTCDate() + " " + monthNames[$scope.shiftData.shift_start.getUTCMonth()] + " " + $scope.shiftData.shift_start.getUTCFullYear()

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
      $scope.endTime = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
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
      $scope.startTime = selectedTime.getUTCHours() + ":" + convertMinutes(selectedTime.getUTCMinutes());
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
      url: 'http://localhost:4000/shifts',
      data: shift
    }).then(function(response){
      console.log("shift submitted to database with shift data: ", shift);
    }, function(error){
      console.log("error posting shift to db")
    })
  }
  // if(shift.shift_start && shift.shift_end && shift.prize){}
})

.controller('PickupCtrl', function($scope, AvailableShifts, $location, $state, $http, Maps) {

		$scope.availableShifts = AvailableShifts.getShifts();
		$scope.myId =  Maps.getUser();
		console.log("my ID:", $scope.myId);

		$scope.callFriend = function(postedBy, shiftId) {
			var theData = { 
				// needs to be user got from the Auth factory
				shift_id: shiftId,
				shift_owner: postedBy,
				// shift owner gets inserted into restricted array on server side
			};
			var notifyUser = function(){

				//Needs to go to different page
				window.location = "#/app/friends";
				console.log("shift requested")
			}
			// test if shift owner is claiming their own shift
			if($scope.myId != postedBy) {

				$http({
							method: 'POST',
							url: 'http://localhost:4000/pickup',
							data: theData
					}).then(function successCallback(response) {
							console.log("got response", response.data)
							notifyUser();
					}, function errorCallback(response) {
							alert("Could not post shift to server, please try again later")
					});

			} else {
				alert("Sorry, you cannot claim this shift.")
			}

		};

})

.controller('PartnerCtrl', function($scope, $http, Maps) {
	// possible get request to db to fetch facebook profile data
		var data = Maps.getApprovals();
		var userId = data[0].user_requested;
		var shiftId = data[0].shift_id;
		console.log("userId : ", userId);
		console.log("this is the shiftId: ", shiftId);
		$scope.approve = function() {
			console.log("this is the shiftId inside the approve: ", shiftId);
			document.getElementById("noticeMsg").innerHTML = 'A shift is waiting your approval';
			document.getElementById("approveShift").style.display = "none";

			$http({
						method: 'PATCH',
						url: 'http://localhost:4000/pickup',									
						data: {shift_id: shiftId}
				}).then(function successCallback(response) {
					  console.log("aprove return: ", response.data);
					  alert("You have successfully approved the shift.");

				}, function errorCallback(response) {
						alert("Could not aprove the shift", response)
				});
		};
		$scope.partnerInfo = {
			name: "",
			email: "",
			phone: "",
			userRep: "",
			facebookPic: "",
			shiftId: shiftId
		};
		$http({
					method: 'GET',
					url: 'http://localhost:4000/user/id/' + userId,
		}).then(function (data) {
			console.log("this is the data: ", data);
			var data = data.data;
			$scope.partnerInfo.name = data.firstName + ' ' + data.lastName;
			$scope.partnerInfo.email = data.email;
			$scope.partnerInfo.facebookPic = data.profilePicture;
			$scope.partnerInfo.phone = "555-867-5309";
			$scope.partnerInfo.userRep = "Awesome!";
			console.log("partner info : ", $scope.partnerInfo);
		}).catch(function(err) {
			alert("Could not get partner profile.")
		});
		
})

.controller('MyShiftsCtrl', function($scope, $http, Maps) {
	$scope.shifts;
	$scope.needApproval = Maps.getApprovals();

	$http({
		method: 'GET',
		url: 'http://localhost:4000/myshifts'
	}).then(function(data) {
		$scope.shifts = data.data;
		console.log("Here are the shifts: ", $scope.shifts);

		$scope.needApproval.forEach(function(pshift){
			$scope.shifts.forEach(function(shift){
				if(pshift.shift_id===shift._id){
					pshift.shift = shift;
				}
			})
		})
		console.log("this is our stuff, ", $scope.needApproval)

	}).catch(function(err) {
		alert("Could not get your shifts from the server.")
	})
});











