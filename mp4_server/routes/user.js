var secrets = require('../config/secrets');
var User = require('../models/user');

module.exports = function (router) {

    var usersRoute = router.route('/users');

    usersRoute.post(function (req, res) {

        var user = new User();
        var data = req.body;

        user.name = data.name;
        user.email = data.email;
        user.pendingTasks = [];
        user.dateCreated = new Date();

        if (user.name === "undefined" || user.email === "undefined" || user.name === undefined || user.email === undefined) {
            return res.status(500).send({
                'message': 'Please fill out all fields with valid characters.',
                'data': []
            });
        }

        User.findOne({
            'email': user.email
        }, function (err, person) {
            if (err) {
                return res.status(500).send({
                    'message': 'Please fill out all fields with valid characters.',
                    'data': []
                });
            }
            if (person === null) {
                user.save(function (err) {
                    if (err)
                        return res.status(500).send({
                            'message': 'Failed to save user to the database.',
                            'data': []
                        });
                    else
                        return res.status(201).send({
                            'message': 'User successfully created!',
                            'data': user
                        });
                });
            } else
                return res.status(500).send({
                    'message': 'The email provided is already in use!',
                    'data': []
                });
        });
    });

    usersRoute.get(function (req, res) {

        var where = eval("(" + req.query.where + ")");
        var sort = eval("(" + req.query.sort + ")");
        var select = eval("(" + req.query.select + ")");
        var skip = eval("(" + req.query.skip + ")");
        var limit = eval("(" + req.query.limit + ")");
        var count = eval("(" + req.query.count + ")");

        if (count === true) {
            User.count(where, function (err, list) {
                if (err)
                    return res.status(500).send({
                        'message': 'Failed to retrieve users.',
                        'data': []
                    });
                else
                    return res.status(200).send({
                        'message': "OK",
                        'data': list
                    });
            }).limit(limit).skip(skip).sort(sort);
        } else {
            User.find(where, select, function (err, list) {
                if (err)
                    return res.status(500).send({
                        'message': 'Failed to retrieve users.',
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

    var userDetailsRoute = router.route('/users/:id');

    //Get a single user
    userDetailsRoute.get(function (req, res) {

        var id = req.params.id;

        User.findOne({
            '_id': id
        }, function (err, person) {
            if (err || person === null)
                return res.status(404).send({
                    'message': 'User not found.',
                    'data': []
                });
            else
                return res.status(200).send({
                    'message': "OK",
                    'data': person
                });
        });
    });

    // update user
    userDetailsRoute.put(function (req, res) {

        var id = req.params.id;
        var data = req.body;

        if (data.name === "undefined" || data.email === "undefined" || data.name === undefined || data.email === undefined) {
            return res.status(500).send({
                'message': 'Please fill out all fields with valid characters.',
                'data': []
            });
        }

        if (data.pendingTasks === "undefined" || data.pendingTasks === undefined)
            data.pendingTasks = [];

        User.update({
                '_id': id
            }, {
                $set: {
                    "email": data.email,
                    "name": data.name,
                    "pendingTasks": data.pendingTasks
                }
            },
            function (err, person) {
                if (err)
                    return res.status(400).send({
                        'message': 'User not found.',
                        'data': []
                    });
                else {
                    User.findOne({
                        '_id': id
                    }, function (err, person) {
                        if (err || person === null)
                            return res.status(404).send({
                                'message': 'User not found.',
                                'data': []
                            });
                        else
                            return res.status(200).send({
                                'message': "User succesfully updated!",
                                'data': person
                            });
                    });
                }
            }
        );
    });


    // remove user
    userDetailsRoute.delete(function (req, res) {

        var id = req.params.id;

        User.findOne({
            '_id': id
        }, function (err, person) {
            if (err || person === null)
                return res.status(404).send({
                    'message': 'User not found.',
                    'data': []
                });
            else {
                var tasks = person.pendingTasks;
                User.remove({
                    '_id': id
                }, function (err) {
                    if (err)
                        return res.status(404).send({
                            'message': 'User not found.',
                            'data': []
                        });
                    else
                        return res.status(200).send({
                            'message': 'User successfully deleted.',
                            'data': []
                        });
                });
            }
        });
    });


    return router;
}
