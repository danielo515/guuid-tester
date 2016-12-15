// Retrieve
var MongoClient = require('mongodb').MongoClient;
const HOST = 'localhost'
const PORT = '27017';
// Connect to the db
console.info('Trying to connect to ${HOST}:${PORT}')
MongoClient.connect(`mongodb://${HOST}:${PORT}/uuid`)
    .then(db => {

        console.log('Connected to DB');
        const guuid = db.collection('guuid');
        const dups = db.collection('duplicates');
        guuid.ensureIndex({ "key": 1 }, { unique: true , w:1 })
            .then(indexname => {

                console.log('Index created! ', indexname);
                const testingLibrary = require('./cryptojs');
                startTesting(guuid, dups, testingLibrary);
            }).catch( err =>{

                console.log('Error during index creation', err );
                db.close();
                process.exit();
            });
    }).catch( err => {
        console.log( 'Error during initialization: ', err );
        process.exit();
    });


function startTesting(uuidDB, dupsDB, testingLibrary) {

    let i = 0, duplicates = 0;
    const startTime = process.hrtime();
    const stats = { max: 0, min: null, avg: 0 };

    const iterate = (previousTime) => {

        ++i;
        if (i % 1000 === 0) console.log('We have generated ', i, ' GUUIDs so far. ' + JSON.stringify(stats));
        const key = testingLibrary.generateUUID();

        uuidDB.insertOne({ key, library: testingLibrary.name })
            .catch(err => {

                if (err.code === 11000) {
                    console.log('Found a duplicated GUUID: ', key, '!!!, at iteration: ', i);
                    ++duplicates;
                    return dupsDB.insertOne({ key, iteration: i, library: testingLibrary.name });
                }

                console.error('Weird undhandled error: ', err);
            })
            .then(() => {

                const hrdiff = process.hrtime(previousTime);
                const timeDiff = hrdiff[0] + hrdiff[1] / 1e9; // nanoseconds to seconds
                stats.max = timeDiff > stats.max ? timeDiff : stats.max;
                stats.min = (timeDiff < stats.min) || stats.min === null ? timeDiff : stats.min;
                const hrfromstart = process.hrtime(startTime);
                stats.avg = (hrfromstart[0] + hrfromstart[1] / 1e9) / i;
                stats.elapsed = (hrfromstart[0] + hrfromstart[1] / 1e9)
                iterate(process.hrtime());
            });
    }
    console.log(`Starting GUUID benchmarking with library ${testingLibrary.name}...`);
    iterate(process.hrtime());
}
