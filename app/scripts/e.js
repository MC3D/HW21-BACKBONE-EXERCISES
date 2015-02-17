/* global Backbone, _, $, alert */

(function() {
  'use strict';

  // ==================================================================== ROUTER

  var TodoRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
    },

    // some people do this in the document ready; not sure where Jake does it;
    // this is where I throw it so it's easy for me to see what generates
    // on each url route

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

    // this is a form; there is a template in my html for it

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

    // taking in the value of the input when the submit button is clicked
    // if it's empty ... pops up an alert
    // if text is found an new todo item is added

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

  // TodoListView is almost complete.

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

    renderChild: function(todo) { // pass in each todo from the collection.each (see initialize)
      var todoItemView = new TodoItemView({model: todo, $container: $('.todo-list')});
      todoItemView.render();
    },
  });

  // this is where I stopped working ...

  var TodoItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'todo-item',
    template: _.template($('#todo-item-template').text()),

    render: function() {
      $('.todo-list').prepend(this.el); // adds this to the ul created in TodoListView
      this.$el.append(this.template(this.model.toJSON()));
    }
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
