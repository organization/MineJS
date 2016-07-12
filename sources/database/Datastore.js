'use strict';

/* global minejs*/
module.exports = {
    onLoad : ()=>{
        var datastoreInstance = null;
        
        minejs.database.Datastore = class Datastore{
            constructor(){
                if(datastoreInstance != null)
                    return datastoreInstance;
                this._db = require('memored');
                datastoreInstance = this;
            }
            
            static getInstance(){
                if(!datastoreInstance)
                    new this();
                return datastoreInstance;
            }
            
            /**
             * This function is used to configure memored.
             * @param {purgeInterval:Integer, logger: console} options
             **/
            setup(options){
                this._db.setup(options);
            }
            
            /**
             * This function stores a value in the cache.
             * It is intended to be called from a worker process.
             * @param {String} key
             * @param {Object} value
             * @param {Integer} ttl
             * @param {function(err, expirationTime){}} callback
             **/
            store(key, value, ttl, callback){
                console.log(this._db.store);
                this._db.store(key, value, ttl, callback);
            }
            
            /**
             * This function reads a value from the cache.
             * It is intended to be called from a worker process.
             * @param {String} key
             * @param {function(error, value, expirationTime){}} callback
             **/
            read(key, callback){
                this._db.read(key, callback);
            }
            
            /**
             * This function removes all the entries from the cache.
             * It is intended to be called from a worker process.
             * @param {Function} callback
             **/
            clean(callback){
                this._db.clean(callback);
            }
            
            /**
             * This function returns the number of entries in the cache.
             * @param {function(error, size){}}
             **/
            size(callback){
                this._db.size(callback);
            }
            
            /**
             * This function returns an array of the keys for objects in the cache.
             * @param {function(error, keys){}}
             **/
            keys(callback){
                this._db.keys(callback);
            }
        }
    }
}