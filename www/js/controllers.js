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

.controller('MapCtrl', function($scope, $state, $location, $http, $window) {

		$scope.map;
		$scope.infowindow;

		// Cover shift page
		$scope.cover = function() {
				$location = "app.tab.friends"
		};

		// Pickup a shift page
		$scope.pickup = function() {
				$location = "app.tab.pickup"
		};

		var onSuccess = function(position) {
				console.log(position.coords.latitude, position.coords.longitude)
				var mapOptions = {
						center: {
								lat: position.coords.latitude,
								lng: position.coords.longitude
						},
						zoom: 15,
						mapTypeId: google.maps.MapTypeId.ROADMAP
				};
				// Create new google map obj and hook it up to the html element
				$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
				$scope.infowindow = new google.maps.InfoWindow();
				// var service = new google.maps.places.PlacesService($scope.map);

				// service.nearbySearch({
				// 		location: {
				// 				lat: position.coords.latitude,
				// 				lng: position.coords.longitude
				// 		},
				// 		radius: 5000,
				// 		name: ['starbucks']
				// }, callback);
				console.log($location.url(),"url")
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

		// get geolocation of the device
		navigator.geolocation.getCurrentPosition(onSuccess,
				onError, {
						maximumAge: 3000,
						timeout: 10000,
						enableHighAccuracy: true
				});

		//add meaningfuller name
		function callback(results, status) {
				// if (status === google.maps.places.PlacesServiceStatus.OK) {
						for (var i = 0; i < results.results.length; i++) {
								console.log(results.results[i])
								createMarker(results.results[i]);
						}
				// }
		}


		function createMarker(place) {
				var loc = place.geometry.location;
				var marker = new google.maps.Marker({
						position: {
								lat: place.geometry.location.lat,
								lng: place.geometry.location.lng
						},
						animation: google.maps.Animation.DROP
				});

				marker.setMap($scope.map);
				google.maps.event.addListener(marker, 'click', function() {
						if (marker.getAnimation() !== null) {
								marker.setAnimation(null);
						} else {
								marker.setAnimation(google.maps.Animation.BOUNCE);
						}

						// marker popup window
						$scope.infowindow.setContent(
								`<ul>
									<li> ${place.name} <br />  ${place.vicinity} </li>
									<li> Shifts available: </li>
									<li> <span style="font-size:9">Mark needs someone to cover a shift</span> <br/>
										<strong> 09.23 => from 8am to 12pm </strong>
										<span style="color:green">Prize: $20</span>
										<button> Take this shift</button>
									</li>
									<li> <span style="font-size:9">Mark needs someone to cover a shift</span> <br/>
										<strong> 09.23 => from 8am to 12pm </strong>
										<span style="color:green">Prize: $20</span>
										<button> Take this shift</button>
									</li>
								</ul>`
						);
						$scope.infowindow.open($scope.map, this);
				});
		}
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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

		// Perform the login action when the user submits the login form
		$scope.doLogin = function() {
				console.log('Doing login', $scope.loginData);

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

.controller('ProfileCtrl', function($scope, $ionicModal) {

		// Form data for the login modal
		$scope.profileData = {
				"name": "Alice Bobinsky",
				"email": "alice@gmail.com",
				"phone": "(512) 123-4567",
				"mainshop": "nearest",
				"secondary": "some other"
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