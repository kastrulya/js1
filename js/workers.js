var workersModule = function(){
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

    function loadData(){
        var data = workersPersistence().getWorkers();
        var workers = data.map(function(item){
            switch(item.type){
                case 'hour': return new HourWorker(item.name, item.rate);
                case 'fixed': return new FixedWorker(item.name, item.rate);
                case 'worker':
                default: return new Worker(item.name, item.rate);
            }
        });
        return workers;
    }

    function loadWorkers(where) {
        var workers = loadData();
        var trWorkers = workers.map(function (worker) {
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
        });

        where.append(...trWorkers);
    }

    return {
        'loadWorkers': loadWorkers
    };
};

function start(){
    var table = document.querySelector('table');
    workersModule().loadWorkers(table);
};

start();