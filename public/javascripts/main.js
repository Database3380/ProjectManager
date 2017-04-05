document.getElementById('complete').addEventListener('mouseup', function (event) {
    var task = !{JSON.stringify(task)}
    
    var req = new Promise(function (resolve, reject) {
        superagent
            .post(`/tasks/${task.id}/complete`)
            .set('Accept', 'application/json')
            .end(function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res.body)
                }
            });
    });

    req.then(function(result) {
        var circle = document.getElementById('complete');
        circle.classList.toggle('completed')
        if (circle.classList.contains('completed')) {
            circle.setAttribute('data-original-title', 'Mark task incomplete')
        } else {
            circle.setAttribute('data-original-title', 'Mark task complete')
        }
        document.getElementById('check').classList.toggle('completed')
    }).catch(function(err) {
        console.error(err);
    });
});

if (document.getElementById('timer')) {
    document.getElementById('timer').addEventListener('mouseup', function (event) {
        var el = this;
        var taskId = this.getAttribute('data-taskId');
        var projectId = this.getAttribute('data-projectId');
        
        var req = new Promise(function (resolve, reject) {
            superagent
                .post(`/time-blocks`)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .send({taskId, projectId})
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                });
        });

        req.then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.error(err);
        });
    });
}


if (document.getElementById('stoptimer')) {
    document.getElementById('stoptimer').addEventListener('mouseup', function (event) {
        var el = this;
        var taskId = this.getAttribute('data-taskId');
        var projectId = this.getAttribute('data-projectId');
        var timeBlock = !{JSON.stringify(timeBlock)};
        
        var req = new Promise(function (resolve, reject) {
            superagent
                .post(`/time-blocks/${timeBlock.id}`)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res.body);
                    }
                });
        });

        req.then(function (result) {
            console.log(result);
        }).catch(function (err) {
            console.error(err);
        });
    });
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})