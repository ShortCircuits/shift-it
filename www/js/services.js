angular.module('starter.services', [])
/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {

  // Some fake testing data
  var friends = [
    { id: 0, name: 'mr. Doug' },
    { id: 1, name: 'Jimmmmmmmmmy' },
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
