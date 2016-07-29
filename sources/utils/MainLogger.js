'use strict';

var logStreams = {};
var loggers = {};

module.exports = {
    /* global minejs */
    onLoad: () => {
        /**
         * @description
         * This class do logs to the screen and file.
         * 화면과 파일에 로그를 기록하는 클래스입니다.
         */
        minejs.utils.MainLogger = class MainLogger extends minejs.utils.Logger {
            constructor(logFile, path, debug) {
                super();

                /**
                 * @description
                 * If already declaration logger
                 * file name, Return the logger instance.
                 * 
                 * 해당 파일명을 쓰는 로거가 이미
                 * 선언되어 있으면 해당 로거 인스턴스를 반환합니다.
                 */
                if (loggers[logFile] != null)
                    return loggers[logFile];

                /**
                 * @description
                 * This variable stored whether to show debug messages.
                 * 디버그 메시지를 표시할지 여부가 이 변수에 저장됩니다.
                 * @return {boolean}
                 */
                this.logDebug = debug;

                /**
                 * @description
                 * The default path to store the log is stored in this variable.
                 * 로그를 저장할 기본경로가 이 변수에 저장됩니다.
                 */
                this.logDefaultPath = path;

                /**
                 * @Description
                 * The string used as the output primary tag is stored in the variable.
                 * 출력시 기본태그로 사용할 문자열이 이 변수에 저장됩니다.
                 */
                this.tag = process.pid;

                /**
                 * @description
                 * The primary colors used on the left side (the time and level name)
                 * of the log format is stored in this variable.
                 * 로그포멧중 좌측(시간 및 레벨명)에 쓰일 기본 색상이 이 변수에 저장됩니다.
                 */
                this.lcolor = minejs.utils.TextFormat.YELLOW;

                /**
                 * @description
                 * The message format to use when logging is stored in this variable.
                 * 로깅시 사용할 메시지 포멧이 이 변수에 저장됩니다.
                 */
                this.messageFormat = "%rcolor[%time][%tag] [%level] %msg";

                /**
                 * @description
                 * The previous time(timestamp) logging of
                 * incoming requests is stored in this variable.
                 * 이전에 들어온 로깅요청의 시간이(타임스탬프) 이 변수에 저장됩니다.
                 */
                this.pastRequest = null;

                /**
                 * @description
                 * If the logging progresses too fast,
                 * the count of elapsed is stored in this variable.
                 * 너무빠른 로깅이 진행될 경우, 경과횟수가 이 변수에 저장됩니다.
                 */
                this.tooMuchFastRequestCount = 0;

                /**
                 * @description
                 * If the code is running on the master server, open the log file stream.
                 * 마스터 서버에서 코드가 실행되었을 경우 파일 로깅 스트림을 엽니다.
                 */
                if (minejs.Server.getServer().getCluster().isMaster)
                    this.createDefaultLogStream(logFile, path);
            }

            /**
             * @description
             * This function create a log file stream that is used by default.
             * 이 함수는 기본적으로 사용되는 로그파일 스트림을 생성합니다.
             * @param {string} logFile
             * @param {string} path
             */
            createDefaultLogStream(logFile, path) {
                let now = new Date();

                /**
                 * @description
                 * The date in the form of [2XXX:: 12 21] is stored in the variable as a string.
                 * [2XXX:12:21] 의 형태로 날짜가 문자열로 이 변수에 저장됩니다.
                 */
                let timeFormat = String();
                timeFormat += now.getFullYear();
                timeFormat += '-' + (String(now.getMonth()).length > 1 ? now.getMonth() : '0' + now.getMonth());
                timeFormat += '-' + (String(now.getDate()).length > 1 ? now.getDate() : '0' + now.getDate() + "");

                /**
                 * @description
                 * It creates a log folders on a given path.
                 * 주어진 경로에 log폴더를 생성합니다.
                 */
                let logPath = path + '/log/';
                try {
                    minejs.Server.getServer().getFs().mkdirSync(logPath);
                }
                catch (e) {}

                /**
                 * @description
                 * Create a folder under the log folder year name as log/20XX.
                 * log/20XX 와 같이 log 폴더 아래에 년도명으로 폴더를 생성합니다.
                 */
                logPath += now.getFullYear() + '/';
                try {
                    minejs.Server.getServer().getFs().mkdirSync(logPath);
                }
                catch (e) {}

                /**
                 * @description
                 * Create a folder. 20XX folder as under the month names folder as like 'log/20XX/12'
                 * log/20XX/12 와 같이 년도 폴더 아래에 월명으로 폴더를 생성합니다.
                 */
                logPath += (String(now.getMonth()).length > 1 ? now.getMonth() : '0' + now.getMonth()) + '/';
                try {
                    minejs.Server.getServer().getFs().mkdirSync(logPath);
                }
                catch (e) {}

                /**
                 * @description
                 * If the log file name is not given, it creates a file name using the current time.
                 * 로그파일명이 주어지지 않았을 경우, 현재시간을 이용해 파일명을 생성합니다.
                 */
                if (!logFile) logFile = require('iconv-lite').encode(String(timeFormat + '.log'), 'utf8');

                /**
                 * @description
                 * If the log file path is not given, the log file will use the default path.
                 * 로그파일 경로가 주어지지 않을 경우 기본 로그파일 주소를 이용합니다.
                 */
                if (!path) path = this.logDefaultPath;

                /**
                 * @description
                 * Create a file stream and save in this variables.
                 * 파일스트림을 생성해서 이 변수에 저장합니다.
                 */
                this.logStream = require('fs').createWriteStream(logPath + logFile, {
                    flags: 'a'
                });

                /**
                 * @description
                 * Redundancy check hash it is stored in this variable.
                 * Using a hash check whether a duplicate message.
                 * 
                 * 메시지가 여러 인스턴스에서 출력되서 마스터로 전될되나,
                 * 한번만 출력되야하는 메시지의 경우 해시를 이용해서 메시지의
                 * 중복여부를 가려냅니다. 중복검사용 해시가 이 변수에 저장됩니다.
                 */
                this.duplicateCheck = {};

                /**
                 * @description
                 * Save the date when the started logging.
                 * 로깅을 시작한 일자 수를 저장합니다.
                 */
                this.logDate = now.getDate();

                /**
                 * @description
                 * Save the stream created from this function to a global variable.
                 * 글로벌 변수에 이 함수에서 생성한 스트림을 저장합니다.
                 */
                logStreams[logFile] = this.logStream;

                /**
                 * @description
                 * Save the logger instance generated from this function to global variable.
                 * 글로벌 변수에 이 함수에서 생성한 로거인스턴스를 저장합니다.
                 */
                loggers[logFile] = this;
            }

            /**
             * @description
             * This function is used to record that an emergency situation.
             * 긴급한 상황임을 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            emergency(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.EMERGENCY, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to record the alert.
             * 경고를 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            alert(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.ALERT, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to record the critical issue.
             * 치명적 문제사항을 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            critical(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.CRITICAL, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to record the error.
             * 오류를 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            error(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.ERROR, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to record the warning.
             * 주의사항을 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            warning(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.WARNING, null, needDuplicate);
            }

            /**
             * @description
             *This function is used to record the notice.
             * 알림사항을 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            notice(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.NOTICE, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to record the information.
             * 정보를 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            info(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.INFO, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to write debugging messages.
             * 디버깅 메시지를 기록할때 사용하는 함수입니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            debug(message, needDuplicate) {
                this.__send(message, minejs.utils.LogLevel.DEBUG, null, needDuplicate);
            }

            /**
             * @description
             * This function is used to record log messages.
             * If you set the level to null, the default format does not apply.
             * 로그 메시지를 기록할때 사용하는 함수입니다.
             * level을 null 로 설정하면 기본 포멧이 적용되지 않습니다.
             * @param {string} message
             * @param {boolean} needDuplicate
             */
            log(level, message, tag, needDuplicate) {
                this.__send(message, level, tag, needDuplicate, null, needDuplicate);
            }

            /**
             * @description
             * The internal function to deliver a message to the logger.
             * 메시지를 로거에 전달하기 위한 내부 함수입니다.
             * @param {string} message
             */
            __send(message) {
                this.__send(message, -1, null, null);
            }

            /**
             * @description
             * The internal function to deliver a message to the logger.
             * 메시지를 로거에 전달하기 위한 내부 함수입니다.
             * @param {string} message
             * @param {integer} level
             * @param {string} tag
             * @param {string} needDuplicate
             */
            __send(message, level, tag, needDuplicate) {
                /**
                 * @description
                 * Prevent an abnormal speed logging
                 * 비정상적인 속도의 기록을 방지합니다.
                 */
                if (minejs.Server.getServer().getCluster().isWorker && level != minejs.utils.LogLevel.DEBUG) {
                    if (this.pastRequest == null) {
                        this.pastRequest = new Date().getTime();
                    }
                    else {
                        if ((new Date().getTime() - this.pastRequest) < 10) {
                            this.pastRequest = new Date().getTime();
                            if (++this.tooMuchFastRequestCount >= 50) return;
                        }
                        else {
                            this.pastRequest = new Date().getTime();
                            this.tooMuchFastRequestCount = 0;
                        }
                    }
                }

                if (level == minejs.utils.LogLevel.DEBUG && !this.logDebug) return;
                if (tag == null) tag = this.tag;

                if (minejs.Server.getServer().getCluster().isWorker) {
                    /**
                     * @description
                     * If requested prevent duplicate message.
                     * Create hash using file name and code
                     * line number to sent the message source.
                     * And puts the hash value in needDuplicate variable.
                     * 
                     * 메시지가 중복되지 않게 해달라는 요청이 있을경우
                     * 해당 메시지를 전송한 소스파일의 이름과 줄을 해시화해서
                     * 비교할 대상값으로 needDuplicate 값에 넣어 전달합니다.
                     */
                    if (needDuplicate != true) {
                        let defaultPath = minejs.Server.getServer().getDatapath();
                        let trace = require('stack-trace').parse(new Error());
                        let filePath = (trace[2].fileName + ':' + trace[2].lineNumber).replace(defaultPath, '');
                        filePath += (':' + trace[3].fileName + ':' + trace[3].lineNumber).replace(defaultPath, '');

                        /**
                         * @description
                         * MD4 is the fastest to hash generate.
                         * MD4가 해시 생성에 더 빠릅니다.
                         * 
                         * @example
                         * http://stackoverflow.com/a/33618940/6382433
                         */
                        let fileHash = require('crypto').createHash('md4').update(filePath).digest("hex");
                        needDuplicate = fileHash;
                    }
                    process.send([minejs.network.ProcessProtocol.LOG, level, message, process.pid, needDuplicate]);
                    return;
                }

                /**
                 * @description
                 * The meaning of the request not to duplicate
                 * message is, please display only once it not
                 * overlap the sented messages in all instances.
                 * In this case can be omitted PID label individually.
                 * (Because every instances sent that message)
                 * So pid tag is replaced by 'INSTANCE'.
                 * 
                 * 메시지를 중복하지 말라는 요청의 의미는
                 * 모든 인스턴스에서 작동된 메시지가 중복되지 않게
                 * 한번만 출력해달라는 의미입니다.
                 * 개별적으로 붙은 PID는 의미가 없으므로 출력되는
                 * PID 태그는 INSTANCE 로 교체해서 출력합니다.
                 */
                if (needDuplicate != true && needDuplicate != null) {
                    tag = "INSTANCE";
                }

                /**
                 * @description
                 * Time is converted to a string form of
                 * [TT:: MM SS] and stored in this variable.
                 * [24:59:59] 의 형태로 시간이 문자열로 이 변수에 저장됩니다.
                 */
                let now = new Date();
                let timeFormat = String();
                timeFormat += (String(now.getHours()).length > 1 ? now.getHours() : '0' + now.getHours());
                timeFormat += ':' + (String(now.getMinutes()).length > 1 ? now.getMinutes() : '0' + now.getMinutes());
                timeFormat += ':' + (String(now.getSeconds()).length > 1 ? now.getSeconds() : '0' + now.getSeconds()) + "";

                let rcolor;
                let levelMsg;
                switch (level) {
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
                        rcolor = minejs.utils.TextFormat.AQUA;
                        levelMsg = 'INFO';
                        break;
                    case minejs.utils.LogLevel.DEBUG:
                        rcolor = minejs.utils.TextFormat.GRAY;
                        levelMsg = 'DEBUG';
                        break;
                    case minejs.utils.LogLevel.NOTICE:
                        rcolor = minejs.utils.TextFormat.AQUA;
                        levelMsg = 'NOTICE';
                        break;
                    default:
                        break;
                }

                let cleanMessage, colorMessage;
                if (level != null) {
                    cleanMessage = this.messageFormat
                        .replace('%lcolor', '')
                        .replace('%time', timeFormat)
                        .replace('%tag', tag)
                        .replace('%rcolor', '')
                        .replace('%level', levelMsg)
                        .replace('%msg', minejs.utils.TextFormat.clean(message));

                    colorMessage = this.messageFormat
                        .replace('%lcolor', this.lcolor)
                        .replace('%time', timeFormat)
                        .replace('%tag', tag)
                        .replace('%rcolor', rcolor)
                        .replace('%level', levelMsg)
                        .replace('%msg', minejs.utils.TextFormat.WHITE + message);
                }
                else {
                    cleanMessage = colorMessage = message;
                }
                let sendMessage = (minejs.ANSI) ? colorMessage : cleanMessage;

                /**
                 * @description
                 * If the date is changed during server operation,
                 * save the old log file and open new log file.
                 * 서버 동작중 날짜가 변경된 경우
                 * 이전 로그파일을 저장하고, 새 로그파일을 엽니다.
                 */
                if (this.logDate != (new Date()).getDate()) {
                    this.logStream.end();
                    this.createDefaultLogStream();
                }

                if (needDuplicate == true || needDuplicate == null) {
                    console.log(minejs.utils.TextFormat.toANSI(sendMessage));
                    this.logStream.write(cleanMessage + '\r\n');
                }
                else {
                    if (!this.duplicateCheck[needDuplicate]) {
                        console.log(minejs.utils.TextFormat.toANSI(sendMessage));
                        this.logStream.write(cleanMessage + '\r\n');
                        this.duplicateCheck[needDuplicate] = 1;
                    }
                    else {
                        /**
                         * @description
                         * If received all worker's messages,
                         * deletes the hash. => Memory waste prevention
                         * 모든 워커에서 해당 메시지를 보냈다면,
                         * 해당 해시를 삭제처리합니다. => 메모리 낭비 방지
                         */
                        if (++this.duplicateCheck[needDuplicate] == minejs.Server.getServer().getOs().cpus().length)
                            delete this.duplicateCheck[needDuplicate];
                    }
                }
            }
        };
    },
    onDisable: () => {
        for (let logStream in logStreams)
            if (!logStream) logStream.end();
    }
};