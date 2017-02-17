// Blurbs service used to communicate Blurbs REST endpoints
(function () {
  'use strict';

  angular
    .module('blurbs')
    .factory('BlurbsService', BlurbsService);

  BlurbsService.$inject = ['$resource'];

  function BlurbsService($resource) {
    return $resource('api/blurbs/:blurbId', {
      blurbId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
