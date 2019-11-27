const { readFileSync } = require('fs');
const vertArraybuffer = readFileSync('./docs/resources/models/bun_zipper.f32verts').buffer;
const masterArray = new Float32Array(vertArraybuffer);
const anArray = new Float32Array(vertArraybuffer);
const objArray = [];

const {
    Worker, isMainThread, parentPort, workerData
} = require('worker_threads');

for(var i = 0; i < anArray.length; i += 9) {
    objArray.push([
        {x:anArray[i + 0], y:anArray[i + 1], z:anArray[i + 2]},
        {x:anArray[i + 3], y:anArray[i + 4], z:anArray[i + 5]},
        {x:anArray[i + 6], y:anArray[i + 7], z:anArray[i + 8]}
    ]);
}
function newWorker(type, data) {
    return new Promise((res, rej) => {
        const worker = new Worker("./bin/perf_worker.js", {
            workerData: {
                type: type,
                data: data,
            },
        });
        worker.on('message', res);
        worker.on('error', rej);
        worker.on('exit', (code) => {
        });
    });
}

(async function() {
    let speedArray = [];
    for(let i = 0; i < 10; i++) {
        speedArray.push(await newWorker("new", objArray));
    }
    console.log(speedArray);
    let speedArray2 = [];
    for(let i = 0; i < 10; i++) {
        speedArray2.push(await newWorker("old", objArray));
    }
    console.log(speedArray2);
    let speedArray3 = [];
    for(let i = 0; i < 10; i++) {
        speedArray3.push(await newWorker("new_stuff", anArray));
    }
    console.log(speedArray3);
})();
