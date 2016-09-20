describe('Friends Unit Tests', function(){
    var Friends;
    beforeEach(module('starter.services'));

    beforeEach(inject(function (_Friends_) {
        Friends = _Friends_;
    }));

    it('can get an instance of my factory', inject(function(Friends) {
        expect(Friends).toBeDefined();
    }));


    it('has Jimmmy as friend with id 1', inject(function(Friends) {
        var oneFriend = {
            id: 1,
            name: 'Jimmy'
        };

        expect(Friends.get(1).name).toEqual(oneFriend.name);
    }));

    it('should have mr. Doug with id of 0', inject(function(Friends) {
        expect(Friends.all().length).toEqual(5);
    }))

});


describe('Profile Unit Tests', function(){
    var Profile;
    beforeEach(module('starter.services'));

    beforeEach(inject(function (_Profile_) {
        Profile = _Profile_;
    }));

    //test to see if profile name matches test data
  it('should have valid profile data', inject(function(Profile){
        var testProfile = {
            name: 'Oscar',
            email: '',
            phone: '',
            mainshop: '',
            secondaryShop: ''
        };
        expect(Profile.get().name).toEqual(testProfile.name);
  }))

  // test to see if set function is working in Profile factory
  it('should set new values to profile', inject(function(Profile) {
      var profileInfoTest = {
          "name": 'Bill',
          "phone": '819-202-2000',
          "email": 'Bill@gmail.com',
          "mainshop": 'austin',
          "secondaryShop": 'houston'
      };
        
      Profile.set(profileInfoTest);

      expect(Profile.get()).toEqual(profileInfoTest);
  }))




});

