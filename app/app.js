$(function(){

  //Create Task model
	var Task = Backbone.Model.extend({

    defaults: function() {
      return {
        title: "new task",
        done: false
      };
    },
    //Make the task done or not
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });



});