(function () {
  'use strict';

  describe('Blurbs List Controller Tests', function () {
    // Initialize global variables
    var BlurbsListController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      BlurbsService,
      mockBlurb;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _BlurbsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      BlurbsService = _BlurbsService_;

      // create mock article
      mockBlurb = new BlurbsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Blurb Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Blurbs List controller.
      BlurbsListController = $controller('BlurbsListController as vm', {
        $scope: $scope
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockBlurbList;

      beforeEach(function () {
        mockBlurbList = [mockBlurb, mockBlurb];
      });

      it('should send a GET request and return all Blurbs', inject(function (BlurbsService) {
        // Set POST response
        $httpBackend.expectGET('api/blurbs').respond(mockBlurbList);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.blurbs.length).toEqual(2);
        expect($scope.vm.blurbs[0]).toEqual(mockBlurb);
        expect($scope.vm.blurbs[1]).toEqual(mockBlurb);

      }));
    });
  });
}());
