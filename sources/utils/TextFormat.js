'use strict';

module.exports = {
    /* global minejs */
    onLoad: ()=>{
        minejs.utils.TextFormat = class TextFormat{
            static get ESCAPE(){ return '\u00a7'; }
            static get BLACK(){ return this.ESCAPE + '0'; }
            static get DARK_BLUE(){ return this.ESCAPE + '1'; }
            static get DARK_GREEN(){ return this.ESCAPE + '2'; }
            static get DARK_AQUA(){ return this.ESCAPE + '3'; }
            static get DARK_RED(){ return this.ESCAPE + '4'; }
            static get DARK_PURPLE(){ return this.ESCAPE + '5'; }
            static get GOLD(){ return this.ESCAPE + '6'; }
            static get GRAY(){ return this.ESCAPE + '7'; }
            static get DARK_GRAY(){ return this.ESCAPE + '8'; }
            static get BLUE(){ return this.ESCAPE + '9'; }
            static get GREEN(){ return this.ESCAPE + 'a'; }
            static get AQUA(){ return this.ESCAPE + 'b'; }
            static get RED(){ return this.ESCAPE + 'c'; }
            static get LIGHT_PURPLE(){ return this.ESCAPE + 'd'; }
            static get YELLOW(){ return this.ESCAPE + 'e'; }
            static get WHITE(){ return this.ESCAPE + 'f'; }
            
            static get OBFUSCATED(){ return this.ESCAPE + 'k'; }
            static get BOLD(){ return this.ESCAPE + 'l'; }
            static get STRIKETHROUGH(){ return this.ESCAPE + 'm'; }
            static get UNDERLINE(){ return this.ESCAPE + 'n'; }
            static get ITALIC(){ return this.ESCAPE + 'o'; }
            static get RESET(){ return this.ESCAPE + 'r'; }
            
            static replaceAll(str, search, replace){
                if (replace === undefined) {
                    return str.toString();
                }
                return str.replace(new RegExp('[' + search + ']', 'g'), replace);
            };
            
            /**
             * @return {String}
            */
            static clean(message, removeFormat){
                if(!removeFormat)
                    removeFormat = true;
                    
                message = this.replaceAll(message, String.fromCharCode(0x1b) + "[0-9;\\[\\(]+[Bm]", '');
                return removeFormat ? this.replaceAll(message, this.ESCAPE + "\\[0123456789abcdefklmnor\\]", '') : message;
            }
            
            /**
             * @return {String}
            */
            static toANSI(string){
                string = string.replace(TextFormat.BOLD, "");
                string = string.replace(TextFormat.OBFUSCATED, String.fromCharCode(0x1b) + "[8m");
                string = string.replace(TextFormat.ITALIC, String.fromCharCode(0x1b) + "[3m");
                string = string.replace(TextFormat.UNDERLINE, String.fromCharCode(0x1b) + "[4m");
                string = string.replace(TextFormat.STRIKETHROUGH, String.fromCharCode(0x1b) + "[9m");
                string = string.replace(TextFormat.RESET, String.fromCharCode(0x1b) + "[0m");
                string = string.replace(TextFormat.BLACK, String.fromCharCode(0x1b) + "[0;30m");
                string = string.replace(TextFormat.DARK_BLUE, String.fromCharCode(0x1b) + "[0;34m");
                string = string.replace(TextFormat.DARK_GREEN, String.fromCharCode(0x1b) + "[0;32m");
                string = string.replace(TextFormat.DARK_AQUA, String.fromCharCode(0x1b) + "[0;36m");
                string = string.replace(TextFormat.DARK_RED, String.fromCharCode(0x1b) + "[0;31m");
                string = string.replace(TextFormat.DARK_PURPLE, String.fromCharCode(0x1b) + "[0;35m");
                string = string.replace(TextFormat.GOLD, String.fromCharCode(0x1b) + "[0;33m");
                string = string.replace(TextFormat.GRAY, String.fromCharCode(0x1b) + "[0;37m");
                string = string.replace(TextFormat.DARK_GRAY, String.fromCharCode(0x1b) + "[30;1m");
                string = string.replace(TextFormat.BLUE, String.fromCharCode(0x1b) + "[34;1m");
                string = string.replace(TextFormat.GREEN, String.fromCharCode(0x1b) + "[32;1m");
                string = string.replace(TextFormat.AQUA, String.fromCharCode(0x1b) + "[36;1m");
                string = string.replace(TextFormat.RED, String.fromCharCode(0x1b) + "[31;1m");
                string = string.replace(TextFormat.LIGHT_PURPLE, String.fromCharCode(0x1b) + "[35;1m");
                string = string.replace(TextFormat.YELLOW, String.fromCharCode(0x1b) + "[33;1m");
                string = string.replace(TextFormat.WHITE, String.fromCharCode(0x1b) + "[37;1m");
                return string;
            }
            
            /**
             * @return {String}
            */
            static colorize(textToColorize){
                for (let i = 0; i < textToColorize.length - 1; i++) {
                    if ((textToColorize[i] == '&') && ("0123456789AaBbCcDdEeFfKkLlMmNnOoRr".indexOf(textToColorize[(i + 1)]) > -1)) {
                        textToColorize[i] = this.ESCAPE;
                        textToColorize[(i + 1)] = String(textToColorize[(i + 1)]).toLowerCase();
                    }
                }
                return textToColorize;
            }
            
            /**
             * @return {String}
            */
            static getLastColors(input){
                input = String(input);
                let result = String();
                for (let index = input.length() - 1; index > -1; index--) {
                    let section = input.charAt(index);
                    if (section == this.ESCAPE && index < input.length() - 1) {
                        let c = input.charAt(index + 1);
                        let color = this.ESCAPE + c + "";
                        result = color + result;

                        if (this.isColor(c) || c == 'r' || c == 'R') {
                            break;
                        }
                    }
                }
                return result;
            }
            
            /**
             * @return {Boolean}
            */
            static isColor(c){
                c = String(c);
                let colors = "0123456789AaBbCcDdEeFf";
                return colors.indexOf(c) != -1;
            }
        }
    }
}