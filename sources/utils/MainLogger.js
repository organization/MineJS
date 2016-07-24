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
                this.messgaeFormat = "%rcolor[%time][%tag] [%level] %msg";
                this.pastRequest = null;
                this.tooMuchFastRequestCount = 0;
                
                if(minejs.Server.getServer().getCluster().isMaster){
                    let now = new Date();
                    let timeFormat = String();
                    timeFormat += now.getFullYear();
                    timeFormat += '-' + (String(now.getMonth()).length > 1 ? now.getMonth() : '0' + now.getMonth());
                    timeFormat += '-' + (String(now.getDate()).length > 1 ? now.getDate() : '0' + now.getDate() + "");
                    
                    try{ minejs.Server.getServer().getFs().mkdirSync(path + '/log/'); } catch(e) {}
                    if(!logFile) logFile = require('iconv-lite').encode(String(timeFormat + '.log'), 'utf8');
                    this.logStream = require('fs').createWriteStream(path + '/log/' + logFile, {flags: 'a'});
                    this.duplicateCheck = {};
                    
                    logStreams[logFile] = this.logStream;
                    loggers[logFile] = this;
                }
            }
            
            emergency(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.EMERGENCY, null, needDuplicate) };
            alert(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.ALERT, null, needDuplicate) };
            critical(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.CRITICAL, null, needDuplicate) };
            error(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.ERROR, null, needDuplicate) };
            warning(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.WARNING, null, needDuplicate) };
            notice(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.NOTICE, null, needDuplicate) };
            info(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.INFO, null, needDuplicate) };
            debug(message, needDuplicate){ this.__send(message, minejs.utils.LogLevel.DEBUG, null, needDuplicate) };
            log(level, message, tag, needDuplicate){ this.__send(message, level, tag, needDuplicate, null, needDuplicate) };
            
            __send(message){ this.__send(message, -1, null, null); }
            __send(message, level, tag, needDuplicate){
                /** Prevent an abnormal speed logging **/
                if(minejs.Server.getServer().getCluster().isWorker && level != minejs.utils.LogLevel.DEBUG){
                    if(this.pastRequest == null){
                        this.pastRequest = new Date().getTime();
                    }else{
                        if( (new Date().getTime() - this.pastRequest) < 10){
                            this.pastRequest = new Date().getTime();
                            if(++this.tooMuchFastRequestCount >= 50) return;
                        }else{
                            this.pastRequest = new Date().getTime();
                            this.tooMuchFastRequestCount = 0;
                        }
                    }
                }
                
                if(level == minejs.utils.LogLevel.DEBUG && !this.logDebug) return;
                if(tag == null) tag = this.tag;
                
                if(minejs.Server.getServer().getCluster().isWorker){
                    /** 메시지가 중복되지 않게 해달라는 요청이 있을경우
                    해당 메시지를 전송한 소스파일의 이름과 줄을 해시화해서
                    비교할 대상값으로 needDuplicate 값에 넣어 전달합니다.**/
                    if(needDuplicate == null){
                        let defaultPath = minejs.Server.getServer().getDatapath();
                        let trace = require('stack-trace').parse(new Error());
                        let filePath = (trace[2].fileName + ':' + trace[2].lineNumber).replace(defaultPath, '');
                        filePath += (':' + trace[3].fileName + ':' + trace[3].lineNumber).replace(defaultPath, '');
                        
                        /** MD4 is fast http://stackoverflow.com/a/33618940/6382433 **/
                        let fileHash = require('crypto').createHash('md4').update(filePath).digest("hex");
                        needDuplicate = fileHash;
                    }
                    process.send([minejs.network.ProcessProtocol.LOG, level, message, process.pid, needDuplicate]);
                    return;
                }
                
                /** 중복되지 않는 메시지의 경우 모든 인스턴스에서 작동된 메시지가
                중복되지 않게 출력해달라는 요청이므로, 개별적으로 붙은 PID는
                의미가 없으므로 출력되는 PID 태그는 INSTANCE 로 교체해서 출력합니다.**/
                if(needDuplicate != null && needDuplicate != false){ tag = "INSTANCE"; }
                
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
                
                message = minejs.utils.TextFormat.WHITE + message;
                let cleanMessage = this.messgaeFormat
                .replace('%lcolor', '')
                .replace('%time', timeFormat)
                .replace('%tag', tag)
                .replace('%rcolor', '')
                .replace('%level', levelMsg)
                .replace('%msg', minejs.utils.TextFormat.clean(message));
                
                let colorMessage = this.messgaeFormat
                .replace('%lcolor', this.lcolor)
                .replace('%time', timeFormat)
                .replace('%tag', tag)
                .replace('%rcolor', rcolor)
                .replace('%level', levelMsg)
                .replace('%msg', message);
                
                let sendMessage = (minejs.ANSI) ? colorMessage : cleanMessage;
                
                if(!needDuplicate){
                    console.log( minejs.utils.TextFormat.toANSI(sendMessage));
                    this.logStream.write(cleanMessage + '\r\n');
                }else{
                    if(! this.duplicateCheck[needDuplicate]){
                        console.log( minejs.utils.TextFormat.toANSI(sendMessage));
                        this.logStream.write(cleanMessage + '\r\n');
                        this.duplicateCheck[needDuplicate] = 1;
                    }else{
                        /** 모든 인스턴스에서 해당 메시지를 보냈다면,
                        해당 해시를 삭제처리합니다. => 메모리 낭비 방지 **/
                        if(++this.duplicateCheck[needDuplicate] == minejs.Server.getServer().getOs().cpus().length)
                            delete this.duplicateCheck[needDuplicate];
                    }
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