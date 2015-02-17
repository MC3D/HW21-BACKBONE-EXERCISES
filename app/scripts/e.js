/* global Backbone, _, $, alert */

(function() {
  'use strict';

  // ==================================================================== ROUTER

  var TodoRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
    },

    index: function(){
      var todoCollection = new TodoCollection();

      var todoInputView = new TodoInputView({collection: todoCollection});
      todoInputView.render();

      var todoListView = new TodoListView({collection: todoCollection});
      todoListView.render();
    }

  });

  // ===================================================================== VIEWS

  var TodoInputView = Backbone.View.extend({

    tagName: 'form',
    className: 'todo-form',

    template: _.template($('#todo-form-template').text()),

    events: {
      'submit': 'addTodo',
    },

    initialize: function() {
      $('#container').append(this.el); // adds form .todo-form to html
      this.$el.append(this.template); // appends template to form .todo-form
    },

    addTodo: function(event) {
      event.preventDefault();
      var title = $('.todo-input').val().trim();
      if (title.length !== 0){
        this.collection.create({title: title});
        $('.todo-input').val('');
      } else {
        alert('What needs to be done?');
      }
    }
  });

  var TodoListView = Backbone.View.extend({
    tagName: 'ul',
    className: 'todo-list',

    initialize: function() {
      $('#container').append(this.el);
      // sync: triggers a change event when server state differs from current attributes
      this.listenTo(this.collection, 'sync', function(collection) {
        collection.each(this.renderChild);
      });
    },

    renderChild: function(todo) {
      var todoItemView = new TodoItemView({model: todo, $container: $('.todo-list')});
      todoItemView.render();
    },
  });

  var TodoItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'todo-item',
    template: _.template($('#todo-item-template').text()),

    events: {
      'click .btn-delete': 'deleteTodo'
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      $('.todo-list').prepend(this.el); // adds this to the ul created in TodoListView
      this.$el.prepend(this.template(this.model.toJSON()));
    },

    deleteTodo: function() {
      this.model.destroy();
      this.$el.remove();
    },
  });

  // ==================================================================== MODELS

  var TodoModel = Backbone.Model.extend({
    idAttribute: '_id', // implemented b/c tiny pizza server uses _id not id

    defaults: function() {
      return {
        title: '',
        dueDate: '',
        details: '',
        completed: false
      };
    },
  });

  // =============================================================== COLLECTIONS

  var TodoCollection = Backbone.Collection.extend({

    model: TodoModel,
    url: 'http://tiny-pizza-server.herokuapp.com/collections/mady-todo-app',

    initialize: function() {
      this.fetch(); // return default set of models for this collection from the server
    }
  });

  // ====================================================================== GLUE

  $(document).ready(function(){
    var router = new TodoRouter();
    Backbone.history.start();
  });

})();
