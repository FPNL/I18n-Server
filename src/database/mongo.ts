import Mongodb from 'mongodb';

import * as config from '../config';

const mongoClient = new Mongodb.MongoClient(
    config.MONGO_DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true }
);

async function mongoConnect() {
    try {
        await mongoClient.connect();
        console.log("MongoDB 連線成功...");
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        // await client.close();
    }
}

export { mongoClient, mongoConnect };
