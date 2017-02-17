(function () {
  'use strict';

  angular
    .module('boards')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Boards',
      state: 'boards',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'boards', {
      title: 'List Boards',
      state: 'boards.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'boards', {
      title: 'Create Board',
      state: 'boards.create',
      roles: ['user']
    });
  }
}());
