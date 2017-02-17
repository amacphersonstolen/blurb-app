(function () {
  'use strict';

  angular
    .module('blurbs')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('blurbs', {
        abstract: true,
        url: '/blurbs',
        template: '<ui-view/>'
      })
      .state('blurbs.list', {
        url: '',
        templateUrl: 'modules/blurbs/client/views/list-blurbs.client.view.html',
        controller: 'BlurbsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Blurbs List'
        }
      })
      .state('blurbs.create', {
        url: '/create',
        templateUrl: 'modules/blurbs/client/views/form-blurb.client.view.html',
        controller: 'BlurbsController',
        controllerAs: 'vm',
        resolve: {
          blurbResolve: newBlurb
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Blurbs Create'
        }
      })
      .state('blurbs.edit', {
        url: '/:blurbId/edit',
        templateUrl: 'modules/blurbs/client/views/form-blurb.client.view.html',
        controller: 'BlurbsController',
        controllerAs: 'vm',
        resolve: {
          blurbResolve: getBlurb
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Blurb {{ blurbResolve.name }}'
        }
      })
      .state('blurbs.view', {
        url: '/:blurbId',
        templateUrl: 'modules/blurbs/client/views/view-blurb.client.view.html',
        controller: 'BlurbsController',
        controllerAs: 'vm',
        resolve: {
          blurbResolve: getBlurb
        },
        data: {
          pageTitle: 'Blurb {{ blurbResolve.name }}'
        }
      })
      .state('blurbs.boards', {
        url: '/boards',
        templateUrl: 'modules/blurbs/client/views/boards/blurb-boards.html',
        controller: 'BlurbBoards',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Boards'
        }
      })
       .state('blurbs.about', {
        url: '/about',
        templateUrl: 'modules/blurbs/client/views/profile/blurb-profile.html',
        controller: 'BlurbProfile',
        controllerAs: 'vm',
        data: {
          pageTitle: 'About'
        }
      });
  }

  getBlurb.$inject = ['$stateParams', 'BlurbsService'];

  function getBlurb($stateParams, BlurbsService) {
    return BlurbsService.get({
      blurbId: $stateParams.blurbId
    }).$promise;
  }

  newBlurb.$inject = ['BlurbsService'];

  function newBlurb(BlurbsService) {
    return new BlurbsService();
  }
}());
