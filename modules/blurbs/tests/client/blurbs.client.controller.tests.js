(function () {
  'use strict';

  describe('Blurbs Controller Tests', function () {
    // Initialize global variables
    var BlurbsController,
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

      // create mock Blurb
      mockBlurb = new BlurbsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Blurb Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Blurbs controller.
      BlurbsController = $controller('BlurbsController as vm', {
        $scope: $scope,
        blurbResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleBlurbPostData;

      beforeEach(function () {
        // Create a sample Blurb object
        sampleBlurbPostData = new BlurbsService({
          name: 'Blurb Name'
        });

        $scope.vm.blurb = sampleBlurbPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (BlurbsService) {
        // Set POST response
        $httpBackend.expectPOST('api/blurbs', sampleBlurbPostData).respond(mockBlurb);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Blurb was created
        expect($state.go).toHaveBeenCalledWith('blurbs.view', {
          blurbId: mockBlurb._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/blurbs', sampleBlurbPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Blurb in $scope
        $scope.vm.blurb = mockBlurb;
      });

      it('should update a valid Blurb', inject(function (BlurbsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/blurbs\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('blurbs.view', {
          blurbId: mockBlurb._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (BlurbsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/blurbs\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Blurbs
        $scope.vm.blurb = mockBlurb;
      });

      it('should delete the Blurb and redirect to Blurbs', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/blurbs\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('blurbs.list');
      });

      it('should should not delete the Blurb and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
