/* global Backbone, _, $ */

// clear form after post is submitted

(function() {
  'use strict';

  $.fn.serializeObject = function() {
    return this.serializeArray().reduce(function(acum, i) {
      acum[i.name] = i.value;
      return acum;
    }, {});
  };

  var Posts = Backbone.Collection.extend({
    url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
  });

  var Post = Backbone.Model.extend({
    idAttribute: '_id',
    defaults: {
      title: '',
      body: ''
    },

    url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
  });

  var CreatePostView = Backbone.View.extend({
    tagName: 'form',
    template: _.template($('#template-create-post').html()),

    events: {
      'submit': 'submitPost'
    },

    initialize: function(data) {
      var options = _.defaults({}, data, {
        $container: $('.container')
      });
      options.$container.append(this.el);
      this.render();
    },

    render: function() {
      this.$el.html(this.template());
    },

    submitPost: function(event) {
      event.preventDefault();
      var postDetails = $(event.currentTarget).serializeObject();

      this.model.set(postDetails);
      this.model.save();
      alert('You said it!');
    },

  });

  $(document).ready(function() {

    window.post = new Post();

    window.createPostView = new CreatePostView({
      model: post
    });

    createPostView.render();

  });

})();
