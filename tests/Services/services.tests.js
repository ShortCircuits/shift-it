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