requirejs.config({
    baseUrl: 'Scripts',
    paths: {
        jquery: 'jquery-2.1.4.min',
        knockout: 'knockout-3.3.0',
        punches: "knockout.punches.min",
        linq: "linq.amd",
        xpath:"jquery.xpath",
        "ko-xml": "app/xml"

    },
    "shim": {
        "xpath": ["jquery"]
    }

});

require(["jquery", "knockout","linq", "punches", "ko-xml", "xpath"], function ($, ko, linq) {

    function SomeComponentViewModel(params) {
        // 'params' is an object whose key/value pairs are the parameters
        // passed from the component binding or custom element.
        this.params = params;
    }
 
    ko.components.register('xml', {
        template: { require: 'text!components/xml.html' },
        viewModel: SomeComponentViewModel
    });
    ko.components.register('xpath-picker', {
        template: { require: 'text!components/xpath-picker.html' },
        viewModel: SomeComponentViewModel
    });
    ko.components.register('xnode-display', {
        template: { require: 'text!components/xnode-display.html' },
        viewModel: SomeComponentViewModel
    });


    ko.punches.enableAll();
    var viewModel = {
        xpath:ko.observable('/xml'),
        xml: ko.observable('<xml xmlns:oh="giles" hello="oh" goodbye="ah">xml text  <oh:morexml>some more text <and>some <and>some <and>some more<and>some more<and>some more</and></and></and> more</and> more</and></oh:morexml><evenmorexml>some more text</evenmorexml> and some text hee</xml>')
    };
    ko.applyBindings(viewModel);
    
});