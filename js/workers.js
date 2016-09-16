var WorkersModule = function(){
    var persistence = workersPersistence();

    function Worker(name, rate) {
        var id = new Date();
        this.name = name;
        this.rate = +rate || 0;

        this.setRate = function (rate) {
            var rate = +rate;
            this.rate = rate || this.rate;
        };

        this.calcMonthSalary = function () {
            return this.rate;
        };
    }

    function HourWorker(name, rate) {
        Worker.call(this, name, rate);
        this.calcMonthSalary = function () {
            return 20.8 * 8 * this.rate;
        }
    }

    function FixedWorker(name, rate) {
        Worker.call(this, name, rate);
    }

    function createWorker(worker) {
        switch(worker.type){
            case 'hour': return new HourWorker(worker.name, worker.rate);
            case 'fixed': return new FixedWorker(worker.name, worker.rate);
            case 'worker':
            default: return new Worker(worker.name, worker.rate);
        }
    }

    function loadData(){
        var data = persistence.getWorkers();
        var workers = data.map(function(item){
            return createWorker(item);
        });
        return workers;
    }

    function renderWorker(worker){
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

    function renderAll(workers) {
        var trWorkers = workers.map(function (worker) {
            return renderWorker(worker);
        });
        return trWorkers;
    }

    function loadWorkers(where) {
        var workers = loadData();
        var trWorkers = renderAll(workers);
        where.append(...trWorkers);
    }

    function addNewWorker(from, where){
        var name = from.querySelector('#name').value || '';
        var rate = +from.querySelector('#rate').value || '';
        var type = from.querySelector('#type').selectedOptions[0].value || 'worker';
        var worker = {
            name: name,
            rate: rate,
            type: type
        };
        if (name && rate && type){
            persistence.addNewWorker(worker);
            var worker = createWorker(worker);
            where.append(renderWorker(worker));
            from.querySelector('#name').value = '';
            from.querySelector('#rate').value = '';
        }
    }

    function orderBySalary(){
        var workers = loadData();
        workers.sort(function (worker1, worker2) {
            var salary1 = worker1.calcMonthSalary();
            var salary2 = worker2.calcMonthSalary();
            if (salary1 == salary2) {
                var name1 = worker1.name.toUpperCase(); // ignore upper and lowercase
                var name2 = worker2.name.toUpperCase(); // ignore upper and lowercase
                if (name1 < name2) {
                    return -1;
                }
                if (name1 > name2) {
                    return 1;
                }
                if (name1 == name2) {
                    return 0;
                }
            }
            else return worker2.calcMonthSalary() - worker1.calcMonthSalary();
        });
        return workers;
    }

    function sort(where){
        var workers = orderBySalary();
        where.innerHTML(renderAll(workers).join(''));
    }

    return {
        'loadWorkers': loadWorkers,
        'addNewWorker': addNewWorker,
        'sort': sort
    };
};

function start(){
    var workersModule = WorkersModule();
    var table = document.querySelector('table');
    var newWorkerForm = document.querySelector('.new-worker');
    workersModule.loadWorkers(table);
    document.querySelector('.new-worker #submit').onclick = workersModule.addNewWorker.bind(this, newWorkerForm, table);
    table.querySelector('#order-by-salary').onclick = workersModule.sort.bind(this, table);

};

start();