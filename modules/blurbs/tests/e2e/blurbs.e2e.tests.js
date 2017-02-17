'use strict';

describe('Blurbs E2E Tests:', function () {
  describe('Test Blurbs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/blurbs');
      expect(element.all(by.repeater('blurb in blurbs')).count()).toEqual(0);
    });
  });
});
