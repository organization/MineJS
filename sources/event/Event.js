'use strict';

/* global minejs */
module.exports = {
    onLoad: () => {
        minejs.event.Event = class Event{
            constructor(isSupportCancellable) {
                this.__eventName = null;
                this._isCancelled = false;
                this._isSupportCancellable = (isSupportCancellable != null)
                    ? isSupportCancellable : true;
            }

            getEventName() {
                return this.__eventName == null ?
                    __filename
                    .replace(__dirname, '')
                    .replace('/', '')
                    .replace('\\', '')
                    .replace('.js', '') :
                    this.__eventName;
            }

            getEventFilePath() {
                return __filename;
            }

            static getEventFilePath() {
                return __filename;
            }

            isCancelled() {
                if(!this._isSupportCancellable) return false;
                return this._isCancelled;
            }

            /**
             * @param {boolean} value
             */
            setCancelled(value) {
                if(!this._isSupportCancellable) return;
                if (value == null) value = true;
                this._isCancelled = value;
            }
        };
    }
};