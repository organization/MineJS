'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.EncapsulatedPacket = class EncapsulatedPacket{
            constructor(){
                this.reliability = null;
                this.hasSplit = null;
                this.length = 0;
                this.messageIndex = null;
                this.orderIndex = null;
                this.orderChannel = null;
                this.splitCount = null;
                this.splitID = null;
                this.splitIndex = null;
                this.buffer = [];
                this.needACK = false;
                this.identifierACK = null;
                this._offset = null;
            }
            
            getOffset(){
                return this._offset;
            }
            
            fromBinary(binary){
                return this.fromBinary(binary, false);
            }
            
            fromBinary(binary, internal){
                let packet = new minejs.raknet.protocol.EncapsulatedPacket();
                let flags = binary[0] & 0xff;
                
                packet.reliability = ((flags & 0b11100000) >> 5);
                packet.hasSplit = (flags & 0b00010000) > 0;
                
                let length, offset;
                if (internal) {
                    length = minejs.utils.Binary.readInt(minejs.utils.Binary.subBytes(binary, 1, 4));
                }else{
                    
                }
            }
        }
    }
}