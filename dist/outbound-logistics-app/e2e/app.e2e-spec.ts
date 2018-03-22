import { AngularTestPage } from './app.po';
import { browser, element, by } from 'protractor';

describe('Starting tests for outbound-logistics-app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be outbound-logistics-app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('outbound-logistics-app');
    })
  });

  it('navbar-brand should be outbound-logistics@0.0.1',() => {
    var navbarBrand = element(by.css('.navbar-brand')).getWebElement();
    expect(navbarBrand.getText()).toBe('outbound-logistics@0.0.1');
  });

  
    it('Car component should be loadable',() => {
      page.navigateTo('/Car');
      var assetName = browser.findElement(by.id('assetName'));
      expect(assetName.getText()).toBe('Car');
    });

    it('Car table should have 8 columns',() => {
      page.navigateTo('/Car');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });

  

});
