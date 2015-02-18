/* global Backbone, _, $, alert */

(function() {
  'use strict';

  // ==================================================================== ROUTER

  var TodoRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
    },

    initialize: function(){
      this.todoCollection = new TodoCollection();
      this.todoInputView = new TodoInputView({collection: this.todoCollection});
      this.todoListView = new TodoListView({collection: this.todoCollection});
    },
    
    index: function() {
      this.todoInputView.render();
      this.todoListView.render();
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
      $('#container').append(this.el);
      this.$el.append(this.template);
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
      this.listenTo(this.collection, 'add', this.renderChild);
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
      'click .btn-delete': 'deleteTodo',
      'click .btn-mark-complete': 'markComplete',
    },

    initialize: function() {
      this.listenTo(this.model, 'destroy', this.remove);
    },

    render: function() {
      $('.todo-list').prepend(this.el);
      this.$el.prepend(this.template(this.model.toJSON()));
    },

    deleteTodo: function() {
      this.model.destroy();
      this.$el.remove();
    },

    markComplete: function() {
      this.$el.toggleClass('complete');
    }
  });

  // ==================================================================== MODELS

  var TodoModel = Backbone.Model.extend({
    idAttribute: '_id',

    defaults: function() {
      return {
        title: '',
        dueDate: 'unassigned',
        details: 'Add todo details ...',
        completed: false
      };
    },
  });

  // =============================================================== COLLECTIONS

  var TodoCollection = Backbone.Collection.extend({

    model: TodoModel,
    url: 'http://tiny-pizza-server.herokuapp.com/collections/mady-todo-app',

    initialize: function() {
      this.fetch();
    }
  });

  // ====================================================================== GLUE

  $(document).ready(function(){
    window.router = new TodoRouter();
    Backbone.history.start();
  });

})();

// QUESTIONS FOR JAKE
// SYNC ISSUES
// $CONTAINER ISSUES
