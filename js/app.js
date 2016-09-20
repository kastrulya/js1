/**
 * Created by Yuliia_Hryhorieva on 9/20/2016.
 */
var WorkerApp = function () {
    var persistence = workersPersistence();
    var models = WorkersModule();

    function createWorker(worker) {
        switch (worker.type) {
            case 'hour':
                return new models.HourWorker(worker.name, worker.rate, worker.id);
            case 'fixed':
                return new models.FixedWorker(worker.name, worker.rate, worker.id);
            case 'worker':
            default:
                return new models.Worker(worker.name, worker.rate, worker.id);
        }
    }

    function loadData() {
        var data = persistence.getWorkers();
        var workers = data.map(function (item) {
            return createWorker(item);
        });
        return workers;
    }

    function renderIdNameSalary(worker) {
        var row = document.createElement("tr");
        var td = document.createElement("td");

        var tdName = td.cloneNode();
        tdName.innerHTML = worker.id;

        var tdRate = td.cloneNode();
        tdRate.innerHTML = worker.name;

        var tdSalary = td.cloneNode();
        tdSalary.innerHTML = worker.calcMonthSalary();

        row.appendChild(tdName);
        row.appendChild(tdRate);
        row.appendChild(tdSalary);
        return row;
    }

    function renderNameSalary(worker) {
        var row = document.createElement("tr");
        var td = document.createElement("td");

        var tdName = td.cloneNode();
        tdName.innerHTML = worker.name;

        var tdSalary = td.cloneNode();
        tdSalary.innerHTML = worker.calcMonthSalary();

        row.appendChild(tdName);
        row.appendChild(tdSalary);
        return row;
    }

    function renderId(worker) {
        var row = document.createElement("tr");
        var td = document.createElement("td");
        td.innerHTML = worker.id;
        row.appendChild(td);
        return row;
    }

    function renderDefaultWorker(worker) {
        var row = document.createElement("tr");
        var td = document.createElement("td");

        var tdName = td.cloneNode();
        tdName.innerHTML = worker.name;

        var tdRate = td.cloneNode();
        tdRate.innerHTML = worker.rate;

        var tdSalary = td.cloneNode();
        tdSalary.innerHTML = worker.calcMonthSalary();

        row.appendChild(tdName);
        row.appendChild(tdRate);
        row.appendChild(tdSalary);
        return row;
    }

    function renderWorker(worker, typeOfTable) {
        switch (typeOfTable) {
            case 'id-name-salary-view':
                return renderIdNameSalary(worker);
            case 'name-salary-view':
                return renderNameSalary(worker);
            case 'id-view':
                return renderId(worker);
            default:
                return renderDefaultWorker(worker);
        }
    }

    function renderAll(workers, typeOfTable) {
        switch (typeOfTable) {
            case 'name-salary-view':
            {
                workers = workers.slice(0, 5);
                break;
            }
            case 'id-view':
            {
                workers = workers.slice(-3, workers.length);
                break;
            }
            default:
                break;
        }
        var trWorkers = workers.map(function (worker) {
            return renderWorker(worker, typeOfTable);
        });
        return trWorkers;
    }

    function renderHeaderOfTable(typeOfTable) {
        var theader = document.createElement('thead');
        var headerRow = document.createElement('tr');
        theader.appendChild(headerRow);
        var th = document.createElement('th');

        /*set header due to the type of table*/
        switch (typeOfTable) {
            case 'id-name-salary-view':
            {
                var thID = th.cloneNode();
                thID.innerHTML = 'ID';

                var thName = th.cloneNode();
                thName.innerHTML = 'Name';

                var thSalary = th.cloneNode();
                thSalary.innerHTML = 'Salary';

                headerRow.appendChild(thID);
                headerRow.appendChild(thName);
                headerRow.appendChild(thSalary);
                break;
            }
            case 'name-salary-view':
            {
                var thName = th.cloneNode();
                thName.innerHTML = 'Name';

                var thSalary = th.cloneNode();
                thSalary.innerHTML = 'Salary';

                headerRow.appendChild(thName);
                headerRow.appendChild(thSalary);
                break;
            }
            case 'id-view':
            {
                var thID = th.cloneNode();
                thID.innerHTML = 'ID';

                headerRow.appendChild(thID);
                break;
            }
            default:
            {
                var thName = th.cloneNode();
                thName.innerHTML = 'Name';

                var thRate = th.cloneNode();
                thRate.innerHTML = 'Rate';

                var thSalary = th.cloneNode();
                thSalary.innerHTML = 'Salary';

                headerRow.appendChild(thName);
                headerRow.appendChild(thRate);
                headerRow.appendChild(thSalary);
                break;
            }
        }
        return theader;
    }

    function loadWorkers(where, typeOfTable) {
        var workers = loadData();
        var trWorkers = renderAll(workers, typeOfTable);
        where.append(...trWorkers);
    }

    function addNewWorker(from, typeOfTable) {
        var where = document.querySelector('table tbody');
        var name = from.querySelector('#name').value || '';
        var rate = +from.querySelector('#rate').value || '';
        var type = from.querySelector('#type').selectedOptions[0].value || 'worker';
        var worker = {
            name: name,
            rate: rate,
            type: type
        };
        if (name && rate && type) {
            var worker = createWorker(worker);
            worker.type = type;
            persistence.addNewWorker({
                name: worker.name,
                rate: worker.rate,
                type: worker.type,
                id: worker.id
            });

            where.append(renderWorker(worker, typeOfTable));
            from.querySelector('#name').value = '';
            from.querySelector('#rate').value = '';
        }
        else {
            alert("Fill all the fields with valid data");
        }
    }

    function orderBySalary() {
        var workers = loadData();
        workers.sort(function (worker1, worker2) {
            var salary1 = worker1.calcMonthSalary();
            var salary2 = worker2.calcMonthSalary();
            if (salary1 == salary2) {
                var name1 = worker1.name.toUpperCase(); // ignore upper and lowercase
                var name2 = worker2.name.toUpperCase(); // ignore upper and lowercase
                if (name1 < name2) {
                    return 1;
                }
                if (name1 > name2) {
                    return -1;
                }
                if (name1 == name2) {
                    return 0;
                }
            }
            else return salary2 - salary1;
        });
        return workers;
    }

    function sort(where, typeOfTable) {
        var workers = orderBySalary();
        where.innerHTML = '';
        renderAll(workers, typeOfTable).forEach(function (worker) {
            where.append(worker);
        });
    }

    function showTable(typeOfTable) {
        var table = document.querySelector('table');
        table.innerHTML = '';
        table.appendChild(renderHeaderOfTable(typeOfTable));

        var tbody = document.createElement('tbody');
        loadWorkers(tbody, typeOfTable);
        table.appendChild(tbody);
        table.querySelector('thead').onclick = sort.bind(this, tbody, typeOfTable); //click header => sort by salary
        var newWorkerForm = document.querySelector('.new-worker');
        document.querySelector('.new-worker #submit').onclick = addNewWorker.bind(this, newWorkerForm, typeOfTable);
    }

    function start() {
        showTable();

        var buttons = document.getElementsByClassName('change-view');
        [].forEach.call(buttons, function (item) {
            item.onclick = showTable.bind(this, item.id);
        });
    }

    return {
        'start': start
    };
};

WorkerApp().start();