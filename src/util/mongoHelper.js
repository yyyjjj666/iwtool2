const mongoose = require('mongoose');

class mongoClass {
    constructor(connStr, log) {
        mongoose.connect(connStr, {useNewUrlParser: true});
        let db = mongoose.connection;
        //连接失败
        db.on('error', (err) => {
            log.writeErr(`mongo ${err.message}`)
        });
        //连接成功
        db.on('open', (err) => {
            log.writeDebug(`数据库链接成功`);
        });
        db.on('disconnected', (err) => {
            log.writeErr(`数据库断开`)
        });
    }

    Schame(item, item_name) {
        // 模型骨架
        let Schema = new mongoose.Schema(item, {versionKey: false});
        // 由schema构造生成Model
        this.Model = mongoose.model(item_name, Schema);
    }

    mFind(condition) {
        return new Promise(async (resolve, reject) => {
            let result = [];
            if (condition)
                result = await this.Model.find(condition).catch(err => reject(err));
            else {
                result = await this.Model.find().catch(err => reject(err));
            }
            if (result.length) {
                let list = [];
                result.forEach(value => {
                    list.push(value._doc);
                });
                resolve(result)
            } else {
                resolve(null);
            }
        });
    }

    mFindOne(condition) {
        return new Promise(async (resolve, reject) => {
            let result = [];
            if (condition)
                result = await this.Model.find(condition).catch(err => reject(err));
            else {
                result = await this.Model.find().catch(err => reject(err));
            }
            if (result.length) {
                resolve(result[0]._doc)
            } else {
                resolve(null);
            }
        });
    }

    mCreate(item) {
        return new Promise(async (resolve, reject) => {
            let result = await this.Model.create(item).catch(err => reject(err));
            resolve(true);
        });
    }

    mUpdate(item) {
        return new Promise(async (resolve, reject) => {
            let result = await this.Model.save(item).catch(err => reject(err));
            resolve(true);
        });
    }

    mDeleteOne(condition) {
        return new Promise(async (resolve, reject) => {
            let result = await this.Model.deleteOne(condition).catch(err => reject(err));
            resolve(result.n > 0);
        });
    }

    mDeleteMany(condition) {
        return new Promise(async (resolve, reject) => {
            let result = await this.Model.deleteMany(condition).catch(err => reject(err));
            resolve(result.n > 0);
        });
    }

    Model() {
        return this.Model;
    }
}

module.exports = mongoClass;
