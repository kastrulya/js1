/**
 * Created by Yuliia_Hryhorieva on 9/15/2016.
 */
var workersPersistence = function(){
    var data = [];

    var mock = (function(){
        var w1 = {
            id: 1,
            name: 'Base',
            rate: 15,
            type: 'worker'
        };
        var w2 = {
            id: 2,
            name: 'Hour',
            rate: 2,
            type: 'hour'
        };
        var w3 = {
            id: 3,
            name: 'Fixed',
            rate: 22,
            type: 'fixed'
        };
        var w4 = {
            id: 4,
            name: 'Hour2',
            rate: 0.5,
            type: 'hour'
        };
        var w5 = {
            id: 5,
            name: 'Fixed2',
            rate: 122,
            type: 'fixed'
        };
        var w6 = {
            id: 6,
            name: 'Fixed3',
            rate: 222,
            type: 'fixed'
        };
        data.push(...[w1, w2, w3, w4, w5, w6]);
    })();

    var addNewWorker = function(worker){
        data.push(worker);
        return worker;
    };
    var getWorkers = function(){
        return data;
    };
    return {
        getWorkers: getWorkers,
        addNewWorker: addNewWorker
    };
};

