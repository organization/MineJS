/* global minejs */

class TextFormat {
    static get ESCAPE() {
        return '§'
    };
    static get BLACK() {
        return this.ESCAPE + '0'
    };
    static get DARK_BLUE() {
        return this.ESCAPE + '1'
    };
    static get DARK_GREEN() {
        return this.ESCAPE + '2'
    };
    static get DARK_AQUA() {
        return this.ESCAPE + '3'
    };
    static get DARK_RED() {
        return this.ESCAPE + '4'
    };
    static get DARK_PURPLE() {
        return this.ESCAPE + '5'
    };
    static get GOLD() {
        return this.ESCAPE + '6'
    };
    static get GRAY() {
        return this.ESCAPE + '7'
    };
    static get DARK_GRAY() {
        return this.ESCAPE + '8'
    };
    static get BLUE() {
        return this.ESCAPE + '9'
    };
    static get GREEN() {
        return this.ESCAPE + 'a'
    };
    static get AQUA() {
        return this.ESCAPE + 'b'
    };
    static get RED() {
        return this.ESCAPE + 'c'
    };
    static get LIGHT_PURPLE() {
        return this.ESCAPE + 'd'
    };
    static get YELLOW() {
        return this.ESCAPE + 'e'
    };
    static get WHITE() {
        return this.ESCAPE + 'f'
    };

    static get OBFUSCATED() {
        return this.ESCAPE + 'k'
    };
    static get BOLD() {
        return this.ESCAPE + 'l'
    };
    static get STRIKETHROUGH() {
        return this.ESCAPE + 'm'
    };
    static get UNDERLINE() {
        return this.ESCAPE + 'n'
    };
    static get ITALIC() {
        return this.ESCAPE + 'o'
    };
    static get RESET() {
        return this.ESCAPE + 'r'
    };

    static replaceAll(str, search, replace) {
        if (replace === undefined) {
            return str.toString();
        }
        return str.replace(new RegExp(search, 'g'), replace);
    }

    /**
     * @return {String}
     */
    static clean(message, removeFormat) {
        if (!removeFormat)
            removeFormat = true;

        message = this.replaceAll(message,  String.fromCharCode(0x1b) + "[0-9;\\[\\(]+[Bm]", '');
        return removeFormat ? this.replaceAll(message, (this.ESCAPE + "[0123456789abcdefklmnor]"), '') : message;
    }

    /**
     * @return {String}
     */
    static toANSI(string) {
        string = this.replaceAll(string, TextFormat.BOLD, "");
        string = this.replaceAll(string, TextFormat.OBFUSCATED, TextFormat.wrapAnsi('8'));
        string = this.replaceAll(string, TextFormat.ITALIC, TextFormat.wrapAnsi('3'));
        string = this.replaceAll(string, TextFormat.UNDERLINE, TextFormat.wrapAnsi('4'));
        string = this.replaceAll(string, TextFormat.STRIKETHROUGH, TextFormat.wrapAnsi('9'));
        string = this.replaceAll(string, TextFormat.RESET, TextFormat.wrapAnsi('0'));
        string = this.replaceAll(string, TextFormat.BLACK, TextFormat.wrapAnsi('0;30'));
        string = this.replaceAll(string, TextFormat.DARK_BLUE, TextFormat.wrapAnsi('0;34'));
        string = this.replaceAll(string, TextFormat.DARK_GREEN, TextFormat.wrapAnsi('0;32'));
        string = this.replaceAll(string, TextFormat.DARK_AQUA, TextFormat.wrapAnsi('0;36'));
        string = this.replaceAll(string, TextFormat.DARK_RED, TextFormat.wrapAnsi('0;31'));
        string = this.replaceAll(string, TextFormat.DARK_PURPLE, TextFormat.wrapAnsi('0;35'));
        string = this.replaceAll(string, TextFormat.GOLD, TextFormat.wrapAnsi('0;33'));
        string = this.replaceAll(string, TextFormat.GRAY, TextFormat.wrapAnsi('0;37'));
        string = this.replaceAll(string, TextFormat.DARK_GRAY, TextFormat.wrapAnsi('30;1'));
        string = this.replaceAll(string, TextFormat.BLUE, TextFormat.wrapAnsi('34;1'));
        string = this.replaceAll(string, TextFormat.GREEN,TextFormat.wrapAnsi('32;1'));
        string = this.replaceAll(string, TextFormat.AQUA, Textformat.wrapAnsi('36;1'));
        string = this.replaceAll(string, TextFormat.RED, TextFormat.wrapAnsi('31;1'));
        string = this.replaceAll(string, TextFormat.LIGHT_PURPLE, TextFormat.wrapAnsi('35;1'));
        string = this.replaceAll(string, TextFormat.YELLOW, TextFormat.wrapAnsi('33;1'));
        string = this.replaceAll(string, TextFormat.WHITE, TextFormat.wrapAnsi('37;1'));
        return string;
    }

    /**
     * @return {String}
     */
    static colorize(textToColorize) {
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
    static getLastColors(input) {
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
    static isColor(c) {
        c = String(c);
        let colors = "0123456789AaBbCcDdEeFf";
        return colors.indexOf(c) != -1;
    }

    /**
     * @return {String}
     */
    static wrapAnsi(s) {
        return'\u001b['+ s + 'm';
    }
}

minejs.utils.TextFormat = TextFormat;
