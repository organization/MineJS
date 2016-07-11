'use strict';

module.exports = {
    /* global minejs */
    onLoad : ()=>{
        minejs.utils.Logger = class Logger{
            constructor(){}
            emergency(message){};
            alert(message){};
            critical(message){};
            error(message){};
            warning(message){};
            notice(message){};
            info(message){};
            debug(message){};
            log(level, message){};
        }
    }
}