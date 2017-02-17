(function () {
  'use strict';

  angular
    .module('blurbs')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Blurbs',
      state: 'blurbs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'blurbs', {
      title: 'List Blurbs',
      state: 'blurbs.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'blurbs', {
      title: 'Create Blurb',
      state: 'blurbs.create',
      roles: ['user']
    });

    Menus.addSubMenuItem('topbar', 'blurbs', {
      title: 'About',
      state: 'blurbs.about'
    });
  }
}());
