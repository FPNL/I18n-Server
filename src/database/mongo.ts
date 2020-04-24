import Mongodb = require('mongodb');

import Config from '../config';

const client = new Mongodb.MongoClient(Config.MONGO_DB_URI, {useNewUrlParser: true,  useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("MongoDB 連線成功...");

        const db = client.db('test');
        insertDocuments(db, function() {
            client.close();
        });

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        // await client.close();
    }
}

const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('people');
    // Insert some documents
    collection.insertMany([{a: {en: 'hi', cht: '不要'} }], function(err, result) {
        console.log(err, result);
        callback(result);
    });
}
export default { client, run };
