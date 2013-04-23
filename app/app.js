$(function(){

	var Task = Backbone.Model.extend({

    defaults: function() {
      return {
        title: "new task",
        order: Todos.nextOrder(),
        done: false
      };
    },

    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });



});