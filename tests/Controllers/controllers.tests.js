describe('Controllersss', function(){
    var scope, controller, modal;

    // load the controller's module
    beforeEach(module('starter.controllers'));

    beforeEach(inject(function($rootScope, $controller) {
        scope = $rootScope.$new();
        modal = jasmine.createSpyObj('modal', ['show', 'hide']);
        controller = $controller('ProfileCtrl', {$scope: scope});
    }));

    // tests start here
    //it('should show the modal', function () {
    //    scope.openEditProfile();
    //    expect(modal.show).toHaveBeenCalled();
    //});
});

