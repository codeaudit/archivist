'use strict';

// i18n
require('./i18n/load');

var $ = window.$ = require('jquery');
var MapBrowser = require('./map_browser');
var Component = require('substance/ui/component');
var $$ = Component.$$;

// Specify a backend
// ---------------
//

var Backend = require("./backend");
var backend = new Backend();

// React Components
// ---------------
//

var hash = window.location.hash || "";
var hash = hash.replace('#', '');

$(function() {

  var mapBrowser = $$(MapBrowser, {
    backend: backend,
    locationId: hash
  });

  Component.mount(mapBrowser, $('#map_container'));
});