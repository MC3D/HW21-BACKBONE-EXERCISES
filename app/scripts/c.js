/* global Backbone, _, $ */

(function() {
  'use strict';

  $.fn.serializeObject = function() {
    return this.serializeArray().reduce(function(acum, i) {
      acum[i.name] = i.value;
      return acum;
    }, {});
  };

  var Posts = Backbone.Collection.extend({
    model: Post,
    url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
  });

  var Post = Backbone.Model.extend({
    defaults: {
      title: '',
      body: ''
    },
    idAttribute: '_id',
    url: 'http://tiny-pizza-server.herokuapp.com/collections/posts'
  });

  var CreateMenuView = Backbone.Model.extend({
    tagName: 'ul',
    className: 'menuView',

    initialize: function(data) {
      var options = _.defaults({}, data, {
        $container: $('.container')
      });
      options.$container.append(this.el);
      this.render();
      this.listenTo(this.collection, 'sync', this.render);
      // this.listenTo(this.collection, 'add remove', this.renderChild);
    },

    render: function() {
      /////////////////////////////////////////////////////
      // this.el.empty();
      $('.container').append(this.el);
      this.collection.each(_.bind(this.renderChild, this));
    },

    renderChild: function(model) {
      var createItemsView = new CreateItemsView({
        model: model,
        $container: this.$el
      });
    }
    //HOW DO I REFERENCE MY GLOBAL VARIABLE INSTEAD///////
    //////////////////////////////////////////////////////
  });

  var CreateItemsView = Backbone.Model.extend({
    tagName: 'li',
    template: _.template($('#template-view-posts').html()),

    events: {
      'click': 'viewPostDetails'
    },

    initialize: function(options){
      options = options || {};
      this.$container = options.$container;
      this.$container.append(this.el);
      this.render();
    },

    render: function() {
      this.$el.html(this.template({collection: posts}));
    }

  });

  // Router = Backbone.Router.extend ({
    // initialize: function(){
    //   this.collection = new Posts();
    //
    //   new CreateItemsView({
    //     collection: this.collection
    //   });
    // },
    //
    // routes: {
    //   ':id': 'viewPostDetails'
    // },
    //
    // viewPostDetails: function(id){
    //   $('.container').empty();
    //   var that = this;
    //   this.collection.fetch().done(function (posts){
    //     var post = that.collection.get(id);
    //
    //   });
    // },
  // });

  $(document).ready(function() {

    window.posts = new Posts();

    window.post = new Post();

    window.createMenuView = new CreateMenuView({
      $container: $('.container'),
      collection: posts
    });
    createMenuView.render();

    window.createItemsView = new CreateItemsView({
      $container: $('.menuView'),
      collection: posts
    });

  });

})();
