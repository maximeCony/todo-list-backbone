$(function(){

    // Create a model for the tasks
    var Task = Backbone.Model.extend({

        // Will contain three attributes.
        // These are their default values

        defaults:{
            title: 'New task',
            checked: false,
            importance: 0
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

        // Set up the local storage
        localStorage: new Backbone.LocalStorage("todolistApp"),

        // Return an array only with the checked tasks
        getChecked: function(){
            return this.where({checked:true});
        }
    });

    // This view turns a Task model into HTML. Will create LI elements.
    var TaskView = Backbone.View.extend({
        tagName: 'div',
        className: 'alert',
        
        template: _.template($('#taskTemplate').html()),

        events:{
            'click .taskCheckbox': 'toggleTask',
            'click .removeTask': 'removeTask',
            "keypress .taskEdit"  : "taskInputKeypress",
            "dblclick"  : "editMode"
        },

        initialize: function(){

            // Set up event listeners. The change backbone event
            // is raised when a property changes (like the checked field)
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function(){

            var className = '';

            if(this.model.get('checked')){
                className = 'alert alert-success';
            } else {

                var classNames = ["alert alert-info", "alert alert-warning", "alert alert-error"];
                className = classNames[this.model.get('importance')];
            }

            // Create the HTML
            this.$el.attr('class', className).html(this.template(this.model.toJSON()));

            this.$('input').prop('checked', this.model.get('checked'));

            // Keep the edit input in the task object
            this.input = this.$('.taskEdit');

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        editMode: function(){
            
            this.$el.addClass('editMode');
        },

        toggleTask: function(){
            
            this.model.toggle();
        },

        removeTask: function(){

            this.model.destroy();
        },

        closeEditMode: function(){

            this.$el.removeClass('editMode');
        },

        taskInputKeypress: function(e) {

            // on press Enter
            if (e.keyCode == 13) {
                
                var title = this.input.val();
                // Prevent empty validation
                if (!title) return;

                // Edit the task
                tasks.create({
                    title: this.input.val(),
                    importance: $('input[name=importance]:checked').val()
                }); 
                this.closeEditMode();
            }

            // on press Escape
            if (e.keyCode == 27) {
                
                this.closeEditMode();
            }            

        }

    });


    var TaskListView = Backbone.View.extend({

        tagName: 'div',

        el: $('#tasks'),

        initialize: function(){
            //listen the add event
            this.collection.on('add', this.addOne, this);
        },

        addOne: function(model){

            //create a new collection view
            var taskView = new TaskView({model: model});
            //render the collection
            this.$el.prepend(taskView.render().el);
        },

        render: function(){
            //render all collection's elements
            this.collection.forEach(this.addOne, this);
            return this;
        }
    });

    // The main view of the application
    var App = Backbone.View.extend({

        // Base the view on an existing element
        el: $('#app'),

        events: {
          "submit #taskForm":  "createOnEnter"
        },

        initialize: function(){

            this.tasks = new TaskList();
            var taskListView = new TaskListView({collection: this.tasks});
            this.tasks.fetch();
        },

        createOnEnter: function(e) {

            e.preventDefault();

            var titleInput = $('#newTask');

            if (!titleInput.val()) return;

            // Create a new task
            this.tasks.create({
                title: titleInput.val(),
                importance: $('#taskForm input[name=importance]:checked').val()
            });
            titleInput.val('');
        },
    });

    new App();

});