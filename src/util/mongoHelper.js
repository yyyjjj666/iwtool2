const MongoClient = require('mongodb').MongoClient;

let default_log = require('./default_log');

let rebuildProjection = (Param) => {
    if (Object.prototype.toString.call(Param) === '[object Array]') {
        let projection = {};
        Param.forEach(value => {
            if (Object.prototype.toString.call(value) === '[object String]') {
                projection[value.trim()] = 1;
            }
        });
        return projection;
    } else {
        return null;
    }
};

class mongoClass {
    constructor(mongo_conf, log) {
        this._mongoConf = mongo_conf;
        this._mongoUrl = `mongodb://${mongo_conf.username}:${mongo_conf.password}@${mongo_conf.host}:${mongo_conf.port}/${mongo_conf.database}`;
        if (log !== undefined && log !== null) {
            default_log = log;
        }
    }

    Add(collectionName, docs) {
        return new Promise(async (resolve, reject) => {
            let that = this;
            await this.Collection(collectionName).catch(err => reject(err));
            try {
                let action = "insertOne";
                if (Object.prototype.toString.call(docs) === "[object Array]") {
                    action = "insertMany";
                }
                that._collection[action](docs, {forceServerObjectId: true}, function (err, result) { // 返回集合中所有数据
                        if (err) {
                            default_log.writeErr(err.message);
                            reject(err);
                        }
                        that._db.close();
                        if (result)
                            if (result.result.n > 0)
                                resolve(true);
                            else
                                resolve(false);
                    }
                );
            } catch (err) {
                default_log.writeErr(err.message);
                reject(err);
            }
        })
    }

    Delete(collectionName, condition) {
        return new Promise(async (resolve, reject) => {
            let that = this;
            await this.Collection(collectionName).catch(err => reject(err));
            try {
                if (Object.prototype.toString.call(condition) === "[object Array]") {
                    let new_condition = [];
                    condition.forEach(val => {
                        new_condition.push(val);
                    });
                    condition = {
                        $or: new_condition
                    };
                }
                that._collection.deleteMany(condition, function (err, result) { // 返回集合中所有数据
                        if (err) {
                            default_log.writeErr(err.message);
                            reject(err);
                        }
                        that._db.close();
                        if (result)
                            if (result.result.ok > 0)
                                resolve(true);
                            else
                                resolve(false);
                    }
                );
            } catch (err) {
                default_log.writeErr(err.message);
                reject(err);
            }
        })
    }

    Update(collectionName, condition) {
        return new Promise(async (resolve, reject) => {
            let that = this;
            await this.Collection(collectionName).catch(err => reject(err));
            try {
                if (Object.prototype.toString.call(condition) === "[object Array]") {
                    let new_condition = [];
                    condition.forEach(val => {
                        new_condition.push(val);
                    });
                    condition = {
                        $or: new_condition
                    };
                }
                that._collection.updateMany(condition, function (err, result) { // 返回集合中所有数据
                        if (err) {
                            default_log.writeErr(err.message);
                            reject(err);
                        }
                        that._db.close();
                        if (result)
                            if (result.result.ok > 0)
                                resolve(true);
                            else
                                resolve(false);
                    }
                );
            } catch (err) {
                default_log.writeErr(err.message);
                reject(err);
            }
        })
    }

    Query(collectionName, condition, nameList) {
        return new Promise(async (resolve, reject) => {
            let that = this;
            await this.Collection(collectionName).catch(err => reject(err));
            try {
                that._collection.find(condition, {projection: rebuildProjection(nameList)}).toArray(
                    function (err, result) { // 返回集合中所有数据
                        if (err) {
                            default_log.writeErr(err.message);
                            reject(err);
                        }
                        that._db.close();
                        if (result)
                            resolve(result);
                        else
                            resolve(null);
                    }
                );
            } catch (err) {
                default_log.writeErr(err.message);
                reject(err);
            }
        })
    }

    QuerySingle(collectionName, condition, nameList) {
        return new Promise(async (resolve, reject) => {
            let that = this;
            await this.Collection(collectionName).catch(err => reject(err));
            try {
                that._collection.findOne(condition, {projection: rebuildProjection(nameList)},
                    function (err, result) { // 返回集合中所有数据
                        if (err) {
                            default_log.writeErr(err.message);
                            reject(err);
                        }
                        that._db.close();
                        if (result)
                            resolve(result);
                        else
                            resolve(null);
                    }
                );
            } catch (err) {
                default_log.writeErr(err.message);
                reject(err);
            }
        })
    }

    Collection(collectionName) {
        return new Promise((resolve, reject) => {
            let that = this;
            MongoClient.connect(that._mongoUrl, {useNewUrlParser: true}, function (err, db) {
                if (err) {
                    default_log.writeErr(err.message);
                    reject(err);
                }
                try {
                    let dbo = db.db(that._mongoConf.database);
                    that._collection = dbo.collection(collectionName);
                    that._db = db;
                    resolve({db: that._db, collection: that._collection});
                } catch (err) {
                    default_log.writeErr(err.message);
                    reject(err);
                }
            });
        })
    }
}

module.exports = mongoClass;
