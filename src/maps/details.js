'use strict';

var _ = require('substance/basics/helpers');
var Component = require('substance/ui/component');
var $$ = Component.$$;
var util = require('./util');

var Details = Component.extend({
	render: function() {
    var el = $$('div').addClass('details');
    if(this.props.location) {
      var location = this.props.location;
      if(location.type == 'toponym') {
        el.append(this.renderToponym(location));
      } else if (location.type == 'prison') {
        el.append(this.renderPrison(location));
      }
      el.append(this.renderReferences(location.docs));
    } else {
      //renderDefaultContent
    }
    return el;
  },

  didReceiveProps: function(props) {
    this.rerender();
  },

  renderPrison: function(entity) {
    var className = ["entity prison"];
    var prisonType = (entity.prison_type instanceof Array ? entity.prison_type.join(', ') : '');
    var name = entity.name.toLowerCase().indexOf("неизвестно") >= 0 ? i18n.t('entity.unknown_name') : entity.name;
    var location = entity.country;
    if (entity.nearest_locality) location = location + ', ' + entity.nearest_locality;
    if (this.props.active) className.push("active");
    
    return $$("div").attr({"data-id": entity.id, class: className.join(" ")}).append([
      $$("div").attr({class: "resource-header"}).append([
        $$("div").attr({class: "entity-type"}).append(prisonType),
        $$("div").attr({class: "location"}).append(location)
      ]),
      $$("div").attr({class: "name"}).append(name),
      $$("div").attr({class: "stats"}).append([
        $$("i").addClass("fa fa-book"),
        entity.stats
      ]),
      $$("div").attr({class: "description"}).append(entity.description)
    ]);
  },

  renderToponym: function(entity) {
    var className = ["entity location"];
    if (this.props.active) className.push("active");

    var location = entity.country;

    if(entity.name !== entity.current_name && entity.current_name) location = location + ", " + entity.current_name;

    return $$("div").attr({"data-id": entity.id, class: className.join(" ")}).append([
      $$("div").attr({class: "resource-header"}).append([
        $$("div").attr({class: "name"}).append(entity.name),
        $$("div").attr({class: "location"}).append(location)
      ]), 
      $$("div").attr({class: "stats"}).append([
        $$("i").addClass("fa fa-book"),
        entity.stats
      ]),
      $$("div").attr({class: "description"}).append(entity.description)
    ]);
  },

  renderReferences: function(docs) {
    var storage = window.storage || window.localStorage;
    var locale = storage.getItem('locale') || "ru";

    var references = $$("div").addClass('references');
    _.each(docs, function(doc){
      var metadata = doc.nodes.document;
      var date = util.formatDate(metadata.interview_date);
      var iconClass = metadata.record_type === 'video' ? 'fa-video-camera' : 'fa-volume-up';
      var preview = $$("a").addClass('document preview').attr({href: "/documents/" + doc.id, "target": "_blank"}).append([
        $$("div").attr({class: "meta-info"}).append([
          $$("div").attr({class: "length"}).append(metadata.interview_duration + " " + i18n.t("interview.minutes")),
          $$("div").attr({class: "date"}).append(date),
          $$("div").attr({class: "type"}).append($$("i").addClass('fa ' + iconClass))
        ]),
        $$("div").attr({class: "title"}).append(metadata.title)
      ]);
      references.append(preview);
    });
    return references;
  }
});

module.exports = Details;