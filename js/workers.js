var WorkersModule = function(){
    var lastID = 0;
    function Worker(name, rate, id) {
        this.id = id || ++lastID;
        this.name = name;
        this.rate = +rate || 0;
        lastID = lastID < id? id : lastID;

        this.setRate = function (rate) {
            var rate = +rate;
            this.rate = rate || this.rate;
        };

        this.calcMonthSalary = function () {
            return this.rate;
        };
    }

    function HourWorker(name, rate, id) {
        Worker.call(this, name, rate, id);
        this.calcMonthSalary = function () {
            return 20.8 * 8 * this.rate;
        }
    }

    function FixedWorker(name, rate, id) {
        Worker.call(this, name, rate, id);
    }

    return {
        'Worker': Worker,
        'HourWorker': HourWorker,
        'FixedWorker': FixedWorker
    };
};