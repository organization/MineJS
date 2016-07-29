'use strict';

/* global minejs */
module.exports = {
    onLoad : ()=>{
        minejs.permission.PermissionRemovedExecutor = class PermissionRemovedExecutor{
            /**
             * @param {minejs.permission.PermissionAttachment} attachment
             */
            attachmentRemoved(attachment){}
        }
    }
}