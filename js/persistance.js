/**
 * Created by Yuliia_Hryhorieva on 9/15/2016.
 */
var workersPersistence = function(){
    var getWorkers = function(){
        var w1 = {
            name: 'Base',
            rate: 15,
            type: 'worker'
        };
        var w2 = {
            name: 'Hour',
            rate: 2,
            type: 'hour'
        };
        var w3 = {
            name: 'Fixed',
            rate: 22,
            type: 'fixed'
        };
        return workers = [w1, w2, w3];
    };
    return {
        getWorkers: getWorkers
    };
};

