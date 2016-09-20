describe('Controllersss', function(){
    var scope;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        $controller('AppCtrl', {$scope: scope});
    }));

    // tests start here
    // it('should be defined', function(){

    //     expect(scope.loginData).toBeUndefined();
    //     expect(scope.loginData).toEqual(profileData.name);
    // });
});