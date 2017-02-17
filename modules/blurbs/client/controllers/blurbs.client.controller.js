(function () {
  'use strict';

  // Blurbs controller
  angular
    .module('blurbs')
    .controller('BlurbsController', BlurbsController);

  BlurbsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'blurbResolve'];

  function BlurbsController ($scope, $state, $window, Authentication, blurb) {
    var vm = this;

    vm.authentication = Authentication;
    vm.blurb = blurb;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Blurb
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.blurb.$remove($state.go('blurbs.list'));
      }
    }

    // Save Blurb
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.blurbForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.blurb._id) {
        vm.blurb.$update(successCallback, errorCallback);
      } else {
        vm.blurb.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('blurbs.view', {
          blurbId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
