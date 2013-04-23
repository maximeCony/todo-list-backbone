$(function(){

    // Create a model for the tasks
    var Task = Backbone.Model.extend({

        // Will contain three attributes.
        // These are their default values

        defaults:{
            title: 'New task',
            checked: false
        },

        // Helper function for checking/unchecking a task
        toggle: function(){
            this.save('checked', !this.get('checked'));
        }
    });

    // Create a collection of tasks
    var TaskList = Backbone.Collection.extend({

        // Will hold objects of the Task model
        model: Task,

        localStorage: new Backbone.LocalStorage("todolistApp"),

        // Return an array only with the checked tasks
        getChecked: function(){
            return this.where({checked:true});
        }
    });

    // Prefill the collection with a number of tasks.
    var tasks = new TaskList();

    // This view turns a Task model into HTML. Will create LI elements.
    var TaskView = Backbone.View.extend({
        tagName: 'div',
        className: 'alert alert-info',

        events:{
            'click': 'toggleTask'
        },

        initialize: function(){

            // Set up event listeners. The change backbone event
            // is raised when a property changes (like the checked field)

            //this.listenTo(this.model, 'change', this.render);
        },

        render: function(){

            // Create the HTML

            this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('title') + '" /> ' + this.model.get('title'));
            this.$('input').prop('checked', this.model.get('checked'));

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        toggleTask: function(task){
            this.model.toggle();
            console.log(this);
            console.log(task);
        }
    });

    // The main view of the application
    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $('#app'),

        events: {
          "keypress #newTask":  "createOnEnter"
        },

        initialize: function(){

            this.taskList = $('#tasks');
            this.input = $('#newTask');

            this.listenTo(tasks, 'add', this.addOne);
      

            // Create views for every one of the tasks in the
            // collection and add them to the page

            tasks.each(function(task){

                var view = new TaskView({ model: task });
                this.taskList.append(view.render().el);

            }, this);   // "this" is the context in the callback

            tasks.fetch();
        },

        addOne: function(task) {
            var view = new TaskView({model: task});
            this.taskList.append(view.render().el);
        },

        createOnEnter: function(e) {

              if (e.keyCode != 13) return;
              if (!this.input.val()) return;

              tasks.create({title: this.input.val()});
              this.input.val('');
            },
        });

    new App();

});