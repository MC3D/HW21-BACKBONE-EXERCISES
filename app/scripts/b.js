/* global Backbone, _, $ */

// todo: select location of invalid error; render confirmation message if no errors; consolidate validation rules, e.g. zipcode; clear form after post is submitted

(function() {
  'use strict';

  $.fn.serializeObject = function() {
    return this.serializeArray().reduce(function(acum, i) {
      acum[i.name] = i.value;
      return acum;
    }, {});
  };

  var People = Backbone.Collection.extend({
    url: 'http://tiny-pizza-server.herokuapp.com/collections/people'
  });

  var Person = Backbone.Model.extend({
    idAttribute: '_id',

    validate: function(attributes) {

      if (!attributes.firstname) {
        return 'Please enter first name.';
      }
      if (!attributes.lastname) {
        return 'Please enter last name.';
      }
      if (!attributes.address) {
        return 'Please enter address.';
      }
      if (!attributes.city) {
        return 'Please enter city.';
      }
      if (attributes.state.length != 2) {
        return 'Please enter 2 letter state abbreviation, e.g. TN.';
      }
      if (attributes.zipcode.length != 5) {
        return 'Please enter 5 digit zip code.';
      }
      if (typeof + attributes.phonenumber != 'number' || attributes.phonenumber.length != 10) {
        return 'Please enter 10 digit phone number. Use numbers only.';
      }
    },

    url: 'http://tiny-pizza-server.herokuapp.com/collections/people'
  });

  var CreatePersonView = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#template-create-person').html()),

    events: {
      'submit': 'submitContactData'
    },

    initialize: function(data) {
      var options = _.defaults({}, data, {
        $container: $('.container')
      });
      options.$container.append(this.el);
      this.render();
      this.listenTo(this.model, 'invalid', this.invalidInput);

    },

    render: function() {
      this.$el.html(this.template());
    },

    submitContactData: function(event) {
      event.preventDefault();
      var postDetails = $(event.currentTarget).serializeObject();

      this.model.set(postDetails);
      this.model.save();
      // alert('Contact Information Saved!');
    },

    invalidInput: function(model, error) {
      this.$('form').addClass('invalid');
      alert(error);
    },

  });

  $(document).ready(function() {

    window.person = new Person();

    window.createPersonView = new CreatePersonView({
      model: person
    });

    createPersonView.render();

  });

})();
