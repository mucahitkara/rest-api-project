const { MongoClient } = require('mongodb');
const uri = "mongodb://testuser:lszsSAa81Ukb9BoJ@ac-wq7akiz-shard-00-00.xlycdhm.mongodb.net:27017,ac-wq7akiz-shard-00-01.xlycdhm.mongodb.net:27017,ac-wq7akiz-shard-00-02.xlycdhm.mongodb.net:27017/?ssl=true&authSource=admin";

async function run() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const info = await client.db().admin().command({ isMaster: 1 });
        console.log("ReplicaSet:", info.setName);
    } catch (e) {
        console.error("Error finding replica set:", e.message);
    } finally {
        await client.close();
    }
}
run();
