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

        // Set up the local storage
        localStorage: new Backbone.LocalStorage("todolistApp"),

        // Return an array only with the checked tasks
        getChecked: function(){
            return this.where({checked:true});
        }
    });

    var tasks = new TaskList();

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

            //bootestrap alert class (green, blue)
            var classNames = ['alert-success', 'alert-info'];

            if(this.model.get('checked')) {
                //reverse the order of the array
                classNames.reverse();
            }

            // Create the HTML
            this.$el.removeClass(classNames[0])
            .addClass(classNames[1])
            .html(this.template(this.model.toJSON()));

            this.$('input').prop('checked', this.model.get('checked'));

            // Keep the edit input in the task object
            this.input = this.$('.taskEdit');

            // Returning the object is a good practice
            // that makes chaining possible
            return this;
        },

        editMode: function(){
            
            this.$el.addClass('edit');
        },

        toggleTask: function(){
            
            this.model.toggle();
        },

        removeTask: function(){

            this.model.destroy();
        },

        closeEditMode: function(){

            this.$el.removeClass('edit');
        },

        taskInputKeypress: function(e) {

            // on press Enter
            if (e.keyCode == 13) {
                
                var title = this.input.val();
                // Prevent empty validation
                if (!title) return;

                // Create a new task
                this.model.save({title: title});
                this.closeEditMode();
            }

            // on press Escape
            if (e.keyCode == 27) {
                
                this.closeEditMode();
            }            

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

            tasks.fetch();
        },

        addOne: function(task) {
            var view = new TaskView({model: task});
            this.taskList.append(view.render().el);
        },

        createOnEnter: function(e) {

            // Check the enter keycode
            if (e.keyCode != 13) return;
            // Prevent empty validation
            if (!this.input.val()) return;

            // Create a new task
            tasks.create({title: this.input.val()});
                this.input.val('');
            },
        });

    new App();

});