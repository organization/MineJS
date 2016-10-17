/* global minejs */

var cluster = require('cluster');

var logger = {
	log: function() {},
	warn: function() {}
};

var messagesCounter = 0;

var activeMessages = {};

var purgeIntervalObj;

/*
 message
 - workerPid
 - type
 - requestParams
 */

var cache = {};

function CacheEntry(data) { // ttl -> milliseconds
	this.key = data.key;
	this.value = data.value;
	this.creationTime = Date.now();
	if (data.ttl) {
		this.ttl = data.ttl;
		this.expirationTime = this.creationTime + data.ttl;
	}
}
CacheEntry.prototype.isExpired = function() {
	return this.expirationTime && Date.now() > this.expirationTime;
};
CacheEntry.prototype.toString = function() {
	return "Key: " + this.key + "; Value: " + this.value + "; Ttl: " + this.ttl;
};

function _findWorkerByPid(workerPid) {
	var i = 0,
		workerIds = Object.keys(cluster.workers),
		len = workerIds.length,
		worker;

	for (; i < len; i++) {
		if (cluster.workers[workerIds[i]].process.pid == workerPid) {
			worker = cluster.workers[workerIds[i]];
			break;
		}
	}

	return worker;
}

function _getResultParamsValues(paramsObj) {
	var result = [null],
		prop;
	if (paramsObj) {
		for (prop in paramsObj) {
			result.push(paramsObj[prop]);
		}
	}
	return result;
}

function _sendMessageToWorker(message) {
    if(!message.workerPid) {
        _masterIncomingMessagesHandler(message);
        return;
    }
	var worker = _findWorkerByPid(message.workerPid);
	worker.send(message);
}

function _sendMessageToMaster(message) {
	message.channel = 'memored';
	message.workerPid = process.pid;
	message.id = process.pid + '::' + messagesCounter++;
	process.send(message);
	if (message.callback) {
		activeMessages[message.id] = message;
	}
}

function _readCacheValue(message) {
	var cacheEntry = cache[message.requestParams.key];
	if (!cacheEntry) return _sendMessageToWorker(message);
	if (cacheEntry.isExpired()) {
		process.nextTick(function() {
			delete cache[message.requestParams.key];
		});
		cacheEntry = null;
	}

	if (cacheEntry) {
		message.responseParams = {
			value: cacheEntry.value
		};
		if (cacheEntry.expirationTime) {
			message.responseParams.expirationTime = cacheEntry.expirationTime;
		}
	}

	_sendMessageToWorker(message);
}

function _storeCacheValue(message) {
	cache[message.requestParams.key] = new CacheEntry(message.requestParams);
	if (message.requestParams.ttl) {
		message.responseParams = {
			expirationTime: cache[message.requestParams.key].expirationTime
		};
	}
	_sendMessageToWorker(message);
}

function _removeCacheValue(message) {
	delete cache[message.requestParams.key];
	_sendMessageToWorker(message);
}

function _cleanCache(message) {
	cache = {};
	_sendMessageToWorker(message);
}

function _getCacheSize(message) {
	message.responseParams = {
		size: Object.keys(cache).length
	};
	_sendMessageToWorker(message);
}

function _getCacheKeys(message) {
	message.responseParams = {
		keys: Object.keys(cache)
	};
	_sendMessageToWorker(message);
}

function _purgeCache() {
	var now = Date.now();
	Object.keys(cache).forEach(function(cacheKey) {
		if (cache[cacheKey].expirationTime && cache[cacheKey].expirationTime < now) {
			delete cache[cacheKey];
		}
	});
}

function _masterIncomingMessagesHandler(message) {
	logger.log('Master received message:', message);

	if (!message || message.channel !== 'memored') return false;

	switch (message.type) {
		case 'read':
			_readCacheValue(message);
			break;
		case 'store':
			_storeCacheValue(message);
			break;
		case 'remove':
			_removeCacheValue(message);
			break;
		case 'clean':
			_cleanCache(message);
			break;
		case 'size':
			_getCacheSize(message);
			break;
		case 'keys':
			_getCacheKeys(message);
			break;
		case 'reset':
			clearInterval(purgeIntervalObj);
			_sendMessageToWorker(message);
			break;
		default:
			logger.warn('Received an invalid message type:', message.type);
	}
}

function _workerIncomingMessagesHandler(message) {
	logger.log('Worker received message:', message);

	var pendingMessage;

	if (!message || message.channel !== 'memored') return false;

	pendingMessage = activeMessages[message.id];
	if (pendingMessage && pendingMessage.callback) {
		pendingMessage.callback.apply(null, _getResultParamsValues(message.responseParams));
		delete activeMessages[message.id];
	}

}

if (cluster.isMaster) {

	Object.keys(cluster.workers).forEach(function(workerId) {
		cluster.workers[workerId].on('message', _masterIncomingMessagesHandler);
	});

	// Listen for new workers so we can listen to its messages
	cluster.on('fork', function(worker) {
		worker.on('message', _masterIncomingMessagesHandler);
	});

	// TODO: Only for testing purposes
	// setInterval(function() {
	//	logger.log('\n------------------------------------------');
	//	logger.log(cache);
	//	logger.log('------------------------------------------\n');
	// }, 2000).unref();

}
else {

	process.on('message', _workerIncomingMessagesHandler);

}

function _setup(options) {
	options = options || {};
	logger = options.logger || logger;

	if (cluster.isMaster) {

		if (options.mockData) {
			options.mockData.forEach(function(mock) {
				// key, value, ttl
				cache[mock.key] = new CacheEntry(mock);
			});
		}

		if (options.purgeInterval) {
			purgeIntervalObj = setInterval(function() {
				_purgeCache();
			}, options.purgeInterval).unref();
		}
	}
}

function _read(key, callback) {
	if (cluster.isWorker) {
		_sendMessageToMaster({
			type: 'read',
			requestParams: {
				key: key
			},
			callback: callback
		});
	}
	else {
		_readCacheValue({
			type: 'read',
			requestParams: {
				key: key
			},
			callback: callback
		});
	}
}

function _store(key, value, ttl, callback) {
	if (cluster.isWorker) {
		if (callback === undefined) {
			callback = ttl;
			ttl = undefined;
		}

		_sendMessageToMaster({
			type: 'store',
			requestParams: {
				key: key,
				value: value,
				ttl: ttl
			},
			callback: callback
		});
	}
	else {
		_storeCacheValue({
			type: 'store',
			requestParams: {
				key: key,
				value: value,
				ttl: ttl
			},
			callback: callback
		});
	}
}

function _remove(key, callback) {
	if (cluster.isWorker) {
		_sendMessageToMaster({
			type: 'remove',
			requestParams: {
				key: key
			},
			callback: callback
		});
	}
	else {
		_removeCacheValue({
			type: 'remove',
			requestParams: {
				key: key
			},
			callback: callback
		});
	}
}

function _clean(callback) {
	if (cluster.isWorker) {
		_sendMessageToMaster({
			type: 'clean',
			callback: callback
		});
	}
	else {
		_cleanCache({
			type: 'clean',
			callback: callback
		});
	}
}

function _size(callback) {
	if (cluster.isWorker) {
		_sendMessageToMaster({
			type: 'size',
			callback: callback
		});
	}
	else {
		setImmediate(callback, {
			size: Object.keys(cache).length
		});
	}
}

function _reset(callback) {
	if (cluster.isMaster) {
		clearInterval(purgeIntervalObj);
		setImmediate(callback);
	}
	else {
		_sendMessageToMaster({
			type: 'reset',
			callback: callback
		});
	}
}

function _keys(callback) {
	if (cluster.isWorker) {
		_sendMessageToMaster({
			type: 'keys',
			callback: callback
		});
	}
	else {
		setImmediate(callback, {
			keys: Object.keys(cache)
		});
	}
}

class Memored {
	static getData() {
		return {
			setup: _setup,
			read: _read,
			store: _store,
			remove: _remove,
			clean: _clean,
			size: _size,
			reset: _reset,
			keys: _keys
		};
	}
};

minejs.database.Memored = Memored;
