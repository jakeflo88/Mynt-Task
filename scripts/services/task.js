'use strict';

app.factory('Task', function(FURL, $firebase, Auth) {

	var ref = new Firebase(FURL);
	var tasks = $firebase(ref.child('tasks')).$asArray();
	var user = Auth.user;

	var Task = {
		all: tasks,

		getTask: function(taskId) {
			return $firebase(ref.child('tasks').child(taskId));
		},

		createTask: function(task) {
			task.datetime = Firebase.ServerValue.TIMESTAMP;
			return tasks.$add(task);
		},

		editTask: function(task) {
			var t = this.getTask(task.$id);
			return t.$update({title: task.title, description: task.description, total: task.total});
		},

		cancelTask: function(taskId) {
			var t = this.getTask(taskId);
			return t.$update({status: "cancelled"});
		},

		isCreator: function(task) {
			return (user && user.provider && user.uid === task.poster);
		},

		isOpen: function(task) {
			return task.status === "open";
		},

		completeTask: function(taskId) {
			var t = this.getTask(taskId);
			return t.$update({status: "completed"});
		},

		isAssignee: function(task) {
			return (user && user.provider && user.uid === task.runner);
		},

		isCompleted: function(task) {
			return task.status === "completed";
		} 
	};

	return Task;

});