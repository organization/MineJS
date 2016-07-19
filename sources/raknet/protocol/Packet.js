'use strict';

/* global minejs */
module.exports = {
    onLoad: ()=>{
        minejs.raknet.protocol.Packet = class Packet{
            constructor(){
                this.__offset=0;
                this.buffer = [];
                this.sendTime;
            }
            
            getID(){}
            
            __get(len){
                if(len < 0){
                    this.__offset = this.buffer.length - 1;
                    return null;
                }
                
                let buffer = [];
                for(let i=0; i < len; i++)
                    buffer[i] = this.buffer[this.__offset++];
                return buffer;
            }
            
            __getAll(){
                return this.__get();
            }
            
            __get(){
                let copy = [];
                for(let key in this.buffer)
                    copy[key] = this.buffer[key];
                return copy;
            }
            
            __getLong(){
                return minejs.utils.Binary.readLong(this.__get(8));
            }
            
            __getInt(){
                return minejs.utils.Binary.readInt(this.__get(4));
            }
            
            __getSignedShort(){
                return this.__getShort();
            }
            
            __getShort(){
                return minejs.utils.Binary.readShort(this.__get(2));
            }
            
            __getTriad(){
                return minejs.utils.Binary.readTriad(this.__get(3));
            }
            
            __getLTriad(){
                return minejs.utils.Binary.readLTriad(this.__get(3));
            }
            
            __getByte(){
                return this.buffer[this.__offset++];
            }
            
            __getString(){
                return String(this.__get(this.__getSignedShort()));
            }
            
            __getAddress(){
                let version = this.getByte();
                if (version == 4) {
                    let addr = ((~this.__getByte()) & 0xff) + "." + ((~this.__getByte()) & 0xff) + "." + ((~this.__getByte()) & 0xff) + "." + ((~this.__getByte()) & 0xff);
                    let port = this.__getShort();
                    return [addr, port];
                }else{
                    //TODO IPV6 SUPPORT
                    return null;
                }
            }
            
            __feof(){
                return !(this.__offset >= 0 && this.__offset + 1 <= this.buffer.length);
            }
            
            __put(b){
                this.buffer = minejs.utils.Binary.appendBytes(this.buffer, b);
            }
            
            __putLong(v){
                this.__put(minejs.utils.Binary.writeLong(v));
            }
            
            __putInt(v){
                this.__put(minejs.utils.Binary.writeInt(v));
            }
            
            __putShort(v){
                this.__put(minejs.utils.Binary.writeShort(v));
            }
            
            __putSignedShort(v){
                this.__put(minejs.utils.Binary.writeShort(v & 0xffff));
            }
            
            __putTriad(v){
                this.__put(minejs.utils.Binary.writeTriad(v));
            }
            
            __putLTriad(v){
                this.__put(minejs.utils.Binary.writeLTriad(v));
            }
            
            __putByte(b){
                let newBytes = [];
                for(let v in this.buffer)
                    newBytes.push(v);
                newBytes.push(b);
                return newBytes;
            }
            
            __putString(str){
                this.__putShort(str.length);
                this.__put(str);
            }
            
            __putAddress(addr, port){
                this.__putAddress(addr, port, 4);
            }
            
            __putAddress(addr, port, version){
                this.__putByte(version);
                if(version == 4){
                    for(let b in addr.split("\\."))
                        this.__putByte((b & 0xff));
                    this.__putShort(port);
                }else{
                    // TODO ipv6
                }
            }
            
            encode(){
                this.buffer = [this.getID()];
            }
            
            decode(){
                this.__offset = 1;
            }
            
            clean(){
                this.buffer = null;
                this.__offset = null;
                this.sendTime = null;
                return this;
            }
            
            clone(){
                let clone = require('clone');
                return clone(this);
            }
            
            static create(){
                return new this();
            }
        }
    }
}