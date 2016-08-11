/* global minejs */

var datastoreInstance = null;

class Datastore {
    constructor() {
        if (datastoreInstance != null)
            return datastoreInstance;
        this._db = minejs.database.Memored.getData();
        datastoreInstance = this;
    }

    static getInstance() {
        if (!datastoreInstance)
            new this();
        return datastoreInstance;
    }

    /**
     * @description
     * This function is used to configure Memored.
     * 이 함수는 Memored를 구성하는 데 사용됩니다.
     * @param {purgeInterval:Integer, logger: console} options
     **/
    setup(options) {
        this._db.setup(options);
    }

    /**
     * This function stores a value in the cache.
     * 이 함수는 캐시에 값을 저장합니다.
     * @param {String} key
     * @param {Object} value
     * @param {Integer} ttl
     * @param {function(err, expirationTime){}} callback
     **/
    store(key, value, ttl, callback) {
        this._db.store(key, value, ttl, callback);
    }

    /**
     * This function reads a value from the cache.
     * 이 함수는 캐시로부터 값을 읽어옵니다.
     * @param {String} key
     * @param {function(error, value, expirationTime){}} callback
     **/
    read(key, callback) {
        this._db.read(key, callback);
    }

    /**
     * This function removes an entry from the cache.
     * 이 함수는 캐시에서 항목을 제거합니다.
     * @param {String} key
     * @param {function(){}} callback
     **/
    remove(key, callback) {
        this._db.remove(key, callback);
    }

    /**
     * This function removes all the entries from the cache.
     * 이 함수는 캐시에서 모든 항목을 제거합니다.
     * @param {Function} callback
     **/
    clean(callback) {
        this._db.clean(callback);
    }

    /**
     * This function returns the number of entries in the cache.
     * 이 함수는 캐시의 항목 수를 반환합니다.
     * @param {function(error, size){}}
     **/
    size(callback) {
        this._db.size(callback);
    }

    /**
     * This function returns an array of the keys for objects in the cache.
     * 이 함수는 캐시에 개체에 대한 키의 배열을 반환합니다.
     * @param {function(error, keys){}}
     **/
    keys(callback) {
        this._db.keys(callback);
    }
}

minejs.database.Datastore = Datastore;
