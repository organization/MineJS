'use strict';

var logStreams = {};
var loggers = {};

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.utils.MainLogger = class MainLogger extends minejs.utils.Logger{
            constructor(logFile, path, debug){
                super();
                    
                if(loggers[logFile] != null)
                    return loggers[logFile];
                
                this.logDebug = debug;
                this.tag = process.pid;
                this.lcolor = minejs.utils.TextFormat.YELLOW;
                
                if(minejs.Server.getServer().getCluster().isMaster){
                    let now = new Date();
                    let timeFormat = String();
                    timeFormat += now.getFullYear();
                    timeFormat += '-' + (String(now.getMonth()).length > 1 ? now.getMonth() : '0' + now.getMonth());
                    timeFormat += '-' + (String(now.getDate()).length > 1 ? now.getDate() : '0' + now.getDate() + "");
                    
                    if(!logFile) logFile = require('iconv-lite').encode(String(timeFormat + '.log'), 'utf8');
                    this.logStream = require('fs').createWriteStream(path + '/log/' + logFile, {flags: 'a'});
                    
                    logStreams[logFile] = this.logStream;
                    loggers[logFile] = this;
                }
            }
            
            emergency(message){ this.__send(message, minejs.utils.LogLevel.EMERGENCY) };
            alert(message){ this.__send(message, minejs.utils.LogLevel.ALERT) };
            critical(message){ this.__send(message, minejs.utils.LogLevel.CRITICAL) };
            error(message){ this.__send(message, minejs.utils.LogLevel.ERROR) };
            warning(message){ this.__send(message, minejs.utils.LogLevel.WARNING) };
            notice(message){ this.__send(message, minejs.utils.LogLevel.NOTICE) };
            info(message){ this.__send(message, minejs.utils.LogLevel.INFO) };
            debug(message){ this.__send(message, minejs.utils.LogLevel.DEBUG) };
            log(level, message){ this.__send(message, level) };
            
            __send(message){ this.__send(message, -1); }
            __send(message, level){
                if(level == minejs.utils.LogLevel.DEBUG && !this.logDebug) return;
                
                let now = new Date();
                let timeFormat = String();
                timeFormat += (String(now.getHours()).length > 1 ? now.getHours() : '0' + now.getHours());
                timeFormat += ':' + (String(now.getMinutes()).length > 1 ? now.getMinutes() : '0' + now.getMinutes());
                timeFormat += ':' + (String(now.getSeconds()).length > 1 ? now.getSeconds() : '0' + now.getSeconds()) + "";
                
                let rcolor;
                let levelMsg;
                switch(level){
                    case minejs.utils.LogLevel.EMERGENCY:
                        rcolor = minejs.utils.TextFormat.RED;
                        levelMsg = 'EMERGENCY';
                        break;
                    case minejs.utils.LogLevel.ALERT:
                        rcolor = minejs.utils.TextFormat.RED;
                        levelMsg = 'ALERT';
                        break;
                    case minejs.utils.LogLevel.CRITICAL:
                        rcolor = minejs.utils.TextFormat.RED;
                        levelMsg = 'CRITICAL';
                        break;
                    case minejs.utils.LogLevel.ERROR:
                        rcolor = minejs.utils.TextFormat.DARK_RED;
                        levelMsg = 'ERROR';
                        break;
                    case minejs.utils.LogLevel.WARNING:
                        rcolor = minejs.utils.TextFormat.YELLOW;
                        levelMsg = 'WARNING';
                        break;
                    case minejs.utils.LogLevel.INFO:
                        rcolor = minejs.utils.TextFormat.WHITE;
                        levelMsg = 'INFO';
                        break;
                    case minejs.utils.LogLevel.DEBUG:
                        rcolor = minejs.utils.TextFormat.GRAY;
                        levelMsg = 'DEBUG';
                        break;
                    default:
                    case minejs.utils.LogLevel.NOTICE:
                        rcolor = minejs.utils.TextFormat.AQUA;
                        levelMsg = 'NOTICE';
                        break;
                }
                
                let messgaeFormat = "%rcolor[%time][%tag] [%level] %msg";
                message = minejs.utils.TextFormat.WHITE + message;
                
                let cleanMessage = messgaeFormat
                .replace('%lcolor', '')
                .replace('%time', timeFormat)
                .replace('%tag', this.tag)
                .replace('%rcolor', '')
                .replace('%level', levelMsg)
                .replace('%msg', minejs.utils.TextFormat.clean(message));
                
                let colorMessage = messgaeFormat
                .replace('%lcolor', this.lcolor)
                .replace('%time', timeFormat)
                .replace('%tag', this.tag)
                .replace('%rcolor', rcolor)
                .replace('%level', levelMsg)
                .replace('%msg', message);
                
                let sendMessage = (minejs.ANSI) ? colorMessage : cleanMessage;
                
                if(minejs.Server.getServer().getCluster().isMaster){
                    console.log( minejs.utils.TextFormat.toANSI(sendMessage));
                    this.logStream.write(cleanMessage + '\r\n');
                }else{
                    process.send([minejs.network.ProcessProtocol.LOG, sendMessage]);
                }
            }
        }
    },
    onDisable: ()=>{
        for(let logStream in logStreams){
            if(!logStream) logStream.end();
        }
    }
}