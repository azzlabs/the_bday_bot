import mongo from 'mongodb';

class BotDatabaseFunctions {
    constructor(config) {
        // Load config
        this.mongo_url = config.mongo_url;
        this.mongo_db_name = config.mongo_db_name;
        
        // Collection names
        this.setting_collection = 'bot_settings';
    }

    // Executes a database transaction with MongoDB
    async mongoTransaction(coll_name, callback) {
        const Client = mongo.MongoClient(this.mongo_url, { useUnifiedTopology: true });
        var res = [];

        try {
            await Client.connect();
            const database = Client.db(this.mongo_db_name);
            const collection = database.collection(coll_name);
            
            res = await callback(collection);
        } finally {
            await Client.close();
        }

        return res;
    }

    // Finds data from a collection
    async find(coll_name, filters) {
        return await this.mongoTransaction(coll_name, async function(coll) {
            return await coll.find(filters).toArray();
        });
    }
}

export default BotDatabaseFunctions;