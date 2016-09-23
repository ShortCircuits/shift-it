angular.module('starter.services', [])
/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {

  // Some fake testing data
  var friends = [
    { id: 0, name: 'mr. Doug' },
    { id: 1, name: 'Jimmy' },
    { id: 2, name: 'Chad le Griff' },
    { id: 3, name: 'Anjum Ketchum' },
    { id: 4, name: 'turbo ninja' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('Maps',  function(){

  var locations = undefined;
  var map = undefined;
    return {
      getLocation: function (){
        return locations;
      },
      setLocation: function (loc){
        locations = loc;
      },
      getMap: function(){
        return map;
      },
      setMap: function(mapObj){
        map = mapObj;
      }
    }

})

.factory('Profile', function() {

  // profile data
  var profileInfo = {
      "name": 'Oscar',
      "email": 'Oscar@gmail.com',
      "phone": '555-555-5555',
      "mainshop": '23',
      "secondaryShop": '44'
  };

  return {
    all: function() {
      return profileInfo;
    },
    get: function() {
      return profileInfo;
    },
    set: function(profileData) {
      profileInfo.name          = profileData.name
      profileInfo.phone         = profileData.phone
      profileInfo.email         = profileData.email
      profileInfo.mainshop      = profileData.mainshop
      profileInfo.secondaryShop = profileData.secondaryShop
    },
    retrieveProfile: function() {
      console.log("retrieveProfileData: ", profileData);
      profileInfo = profileData;
      console.log("profileInfo: ", profileInfo);
    }
  }

})

.factory('AvailableShifts', function(){

  //simplified version of the factory / currently all shifts cramed into one array
  var availableShifts = [];

  return {
    // no select by store for now :: TODO
    getShifts: function(store){
      return availableShifts;
    },
    addShift: function(shift){
      // each shift should have UUID so we can eliminate duplicates from the list
      availableShifts.push(shift)
    }
  }
})


