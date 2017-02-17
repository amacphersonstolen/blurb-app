(function () {
  'use strict';

  angular
    .module('blurbs')
    .controller('BlurbsListController', BlurbsListController);

  BlurbsListController.$inject = ['BlurbsService'];

  function BlurbsListController(BlurbsService) {
    var vm = this;

    vm.blurbs = BlurbsService.query();
  }
}());
