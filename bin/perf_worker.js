const { BVHBuilder } = require("../dist/BVHBuilder");
const { BVH } = require('../dist/bvhtree_old');

const {
    parentPort, workerData
} = require('worker_threads');

let sDate = Date.now();
if(workerData.type === "new") {
    new BVHBuilder(workerData.data, 10);
} else if (workerData.type === "new_stuff") {
    new BVHBuilder(workerData.data, 10);
} else {
    new BVH(workerData.data, 10);
}
parentPort.postMessage(Date.now() - sDate);
