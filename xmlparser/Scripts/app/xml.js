define(["knockout", "linq"], function (ko, linq) {

    ko.virtualElements.allowedBindings.xmlDoc = true;
    ko.bindingHandlers.xmlDoc = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements
            var error = ko.observable();
            xmlDoc = ko.pureComputed(function () {
                try {
                    var ret;
                    error(undefined);
                    if (window.DOMParser) {

                        var parser = new DOMParser();
                        ret = parser.parseFromString(ko.utils.unwrapObservable(valueAccessor()), "text/xml");

                        return ret;
                    } else {
                        ret = new ActiveXObject("Microsoft.XMLDOM");
                        ret.async = false;
                        ret.loadXML(ko.utils.unwrapObservable(valueAccessor()));

                        return ret;
                    }
                    
                } catch (ex) {
                    error(ex);
                    return {};
                }
            });

            var innerBindingContext = bindingContext.extend(
                {
                    $xmlDoc: xmlDoc,
                    $xmlDocError: error
                }
            );
            ko.applyBindingsToDescendants(innerBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };

    ko.virtualElements.allowedBindings.xpath = true;
    ko.bindingHandlers.xpath = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements
            var error = ko.observable();
            xpath = ko.pureComputed(function () {
                try {
                    error(undefined);
                    var ret = $(ko.utils.unwrapObservable(valueAccessor().xmlDoc)).xpath(ko.utils.unwrapObservable(valueAccessor().xpath), function (prefix) {
                        return bindingContext.$xpathNamespaces ? bindingContext.$xpathNamespaces[prefix] : undefined
                    });
                    return ret;
                } catch (ex) {
                    error(ex);
                    return undefined;
                }
            });

            var innerBindingContext = bindingContext.extend(
                {
                    $xpath: xpath,
                    $xpathError: error
                }
            );
            ko.applyBindingsToDescendants(innerBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };

    ko.virtualElements.allowedBindings.addXpath = true;
    ko.bindingHandlers.addXpath = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements
            
            
            linq.From(valueAccessor().attributes)
                .Where(function (attr) {
                    return attr.namespaceURI === "http://www.w3.org/2000/xmlns/"
                })
                .ToArray()
                .map(function (attr) {
                    bindingContext.$xpathNamespaces[attr.localName] = attr.nodeValue;
                });
            var innerBindingContext = bindingContext.extend(
                {
                    $xpathToHere: (bindingContext.$xpathToHere || '') + (valueAccessor().nodeType === 1 ? '/' + valueAccessor().nodeName : '')
                }
            );
            ko.applyBindingsToDescendants(innerBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };

    ko.virtualElements.allowedBindings.xpathDestination = true;
    ko.bindingHandlers.xpathDestination = {
        init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            // Make a modified binding context, with a extra properties, and apply it to descendant elements

            var innerBindingContext = bindingContext.extend(
                {
                    $xpathDestination: valueAccessor(),
                    $xpathNamespaces: {}
                }
            );
            ko.applyBindingsToDescendants(innerBindingContext, element);

            // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
            return { controlsDescendantBindings: true };
        }
    };


});