/* global minejs */
let eventEmitterInstance = null;
class EventEmitter {
    constructor() {
        if (eventEmitterInstance != null)
            return eventEmitterInstance;
        this._eventListeners = {};
        eventEmitterInstance = this;
    }

    static getInstance() {
        if (eventEmitterInstance == null)
            new this();
        return eventEmitterInstance;
    }

    /**
     * @param {minejs.event.Event} event
     * @param {function} process
     * @param {integer} priority
     */
    on(event, process, priority) {
        if (typeof(event.getEventFilePath) != 'function' || event.getEventFilePath() == null) return false;
        if (priority == null) priority = 0;
        if (!this._eventListeners[event.getEventFilePath()])
            this._eventListeners[event.getEventFilePath()] = {};
        if (!this._eventListeners[event.getEventFilePath()][String(priority)])
            this._eventListeners[event.getEventFilePath()][String(priority)] = [];
        this._eventListeners[event.getEventFilePath()][String(priority)].push(process);
        return true;
    }

    /**
     * @param {minejs.event.Event} event
     */
    call(event) {
        if (!(event instanceof minejs.event.Event)) return false;
        if (!this._eventListeners[event.getEventFilePath()]) return true;

        let listeners = this._eventListeners[event.getEventFilePath()];
        for (let index = 5; index >= 0; index--) {
            if (!listeners[index])
                continue;
            for (let key in listeners[index])
                listeners[index][key](event);
            if (event.isCancelled()) break;
        }
        return true;
    }
}

minejs.event.EventEmitter = EventEmitter;
