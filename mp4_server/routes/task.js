var secrets = require('../config/secrets');
var Task = require('../models/task');

module.exports = function (router) {

    var tasksRoute = router.route('/tasks');

    //create new task
    tasksRoute.post(function (req, res) {

        var task = new Task();
        var data = req.body;

        task.name = data.name;
        task.description = data.description;
        task.deadline = data.deadline;
        task.completed = data.completed;
        task.assignedUserName = data.assignedUserName;
        task.assignedUser = data.assignedUser;
        task.dateCreated = new Date();

        if (task.name === "undefined" || task.deadline === "undefined" || task.name === undefined || task.deadline === undefined) {
            return res.status(500).send({
                'message': 'Please fill out all required fields with valid characters.',
                'data': []
            });
        }

        if (task.assignedUserName === "" || task.assignedUserName === "undefined" || task.assignedUserName === undefined)
            task.assignedUserName = "unassigned";

        if (task.assignedUser === "undefined" || task.assignedUser === undefined)
            task.assignedUser = "";

        if (task.description === "undefined" || task.description === undefined)
            task.description = "none";

        if (task.completed === undefined || task.completed === "undefined")
            task.completed = false;

        task.save(function (err, savedTask) {
            if (err)
                return res.status(500).send({
                    'message': 'Failed to save task to the database.',
                    'data': []
                });
            else
                return res.status(201).send({
                    'message': 'Task successfully created!',
                    'data': task
                });
        });
    });

    // get all task
    tasksRoute.get(function (req, res) {

        var where = eval("(" + req.query.where + ")");
        var sort = eval("(" + req.query.sort + ")");
        var select = eval("(" + req.query.select + ")");
        var skip = eval("(" + req.query.skip + ")");
        var limit = eval("(" + req.query.limit + ")");
        var count = eval("(" + req.query.count + ")");

        if (limit === undefined || limit === "undefined")
            limit = 100;

        if (count === true) {
            Task.count(where, function (err, list) {
                if (err)
                    return res.status(500).send({
                        'message': 'Failed to retrieve tasks.',
                        'data': []
                    });
                else
                    return res.status(200).send({
                        'message': "OK",
                        'data': list
                    });
            }).limit(limit).skip(skip).sort(sort);
        } else {
            Task.find(where, select, function (err, list) {
                if (err)
                    return res.status(500).send({
                        'message': 'Failed to retrieve tasks.',
                        'data': []
                    });
                else
                    return res.status(200).send({
                        'message': "OK",
                        'data': list
                    });
            }).limit(limit).skip(skip).sort(sort);
        }
    });

    var taskDetailsRoute = router.route('/tasks/:id');

    // GET a single task
    taskDetailsRoute.get(function (req, res) {

        var id = req.params.id;

        Task.findOne({
            '_id': id
        }, function (err, task) {
            if (err || task === null)
                return res.status(404).send({
                    'message': 'Task not found.',
                    'data': []
                });
            else
                return res.status(200).send({
                    'message': "OK",
                    'data': task
                });
        });
    });

    // UPDATE task
    taskDetailsRoute.put(function (req, res) {

        var id = req.params.id;
        var data = req.body;

        if (data.name === "undefined" || data.deadline === "undefined" || data.name === undefined || data.deadline === undefined)
            return res.status(500).send({
                'message': 'Please fill out all required fields with valid characters.',
                'data': []
            });

        if (data.assignedUserName === "undefined" || data.assignedUserName == undefined || data.assignedUserName === "")
            data.assignedUserName = "unassigned";

        if (data.assignedUser === "undefined" || data.assignedUser === undefined || data.assignedUser === "")
            data.assignedUser = "";

        if (data.description === "undefined" || data.description === undefined || data.description === "")
            data.description = "none";

        var oldAssignedUser = "";

        Task.findOne({
            '_id': id
        }, function (err, oldTask) {
            Task.update({
                    '_id': id
                }, {
                    $set: {
                        "name": data.name,
                        "description": data.description,
                        "deadline": data.deadline,
                        "completed": data.completed,
                        "assignedUser": data.assignedUser,
                        "assignedUserName": data.assignedUserName
                    }
                },
                function (err, person) {
                    if (err)
                        return res.status(400).send({
                            'message': 'User not found.',
                            'data': []
                        });
                    else {
                        Task.findOne({
                            '_id': id
                        }, function (err, newTask) {
                            if (err || person === null)
                                return res.status(404).send({
                                    'message': 'Task not found.',
                                    'data': []
                                });
                            else
                                return res.status(200).send({
                                    'message': "Task succesfully updated!",
                                    'data': newTask
                                });
                        });
                    }
                }
            );
        });
    });


    // Delete a task
    taskDetailsRoute.delete(function (req, res) {

        var id = req.params.id;

        Task.findOne({
            '_id': id
        }, function (err, task) {
            if (err || task === null)
                return res.status(404).send({
                    'message': 'Task not found.',
                    'data': []
                });
            else {
                var user = task.assignedUser;
                Task.remove({
                    '_id': id
                }, function (err) {
                    if (err)
                        return res.status(404).send({
                            'message': 'Task not found.',
                            'data': []
                        });
                    else {
                        return res.status(200).send({
                            'message': 'Task successfully deleted.',
                            'data': []
                        });
                    }
                });
            }
        });
    });

    return router;
}
