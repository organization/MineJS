'use strict';

/* global minejs */
module.exports = {
    onLoad: () => {
        minejs.loader.requireLoader("minejs.permission.Permissible");
        minejs.command.CommandSender = class CommandSender extends minejs.permission.Permissible {
            /**
             * Sends a message to the command sender.
             * 명령전달자에게 메시지를 보냅니다.
             * 给命令发送者返回信息。
             * @param {string} message
             */
            sendMessage(message) {}

            /**
             * Returns the server of the command sender.
             * 명령전달자가 가진 서버 인스턴스를 반환합니다.
             * 返回命令发送者所在的服务器。
             * @return {minejs.Server}
             */
            getServer() {}

            /**
             * Returns the name of the command sender.
             * 명령전달자의 이름을 반환합니다.
             * 返回命令发送者的名称。
             * @return {string}
             */
            getName() {}

            /**
             * @return {boolean}
             */
            isPlayer() {}
        };
    }
};