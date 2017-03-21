/*global console*/
/*global define*/
/*global window*/
/*global ArrayBuffer, Uint8Array, btoa, atob*/
/*jslint vars: true, nomen: true, plusplus: true, bitwise: true*/

(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // using require.js
        define(['./core/application.js'], factory);
    } else {
        root.adsk = factory(root.adsk);
    }
}(this, function (adsk) {

    'use strict';

    if (adsk === undefined) {
        adsk = {};
    }
    
    adsk.toBase64 = function (buffer) {
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        var binary = new [].constructor(len);
        var i;
        for (i = 0; i < len; i++) {
            binary[i] = String.fromCharCode(bytes[i]);
        }
        return btoa(binary.join(''));
    };

    adsk.fromBase64 = function (encoded) {
        var binary = atob(encoded);
        var len = binary.length;
        var bytes = new Uint8Array(len);
        var i;
        for (i = 0; i < len; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    };
    
    adsk.utf8ToString = function (buffer) {
        var array = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        var out, i, len, c;
        var char2, char3;

        out = '';
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                    // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                                           ((char2 & 0x3F) << 6) |
                                           ((char3 & 0x3F) << 0));
                break;
            }
        }

        return out;
    };

    adsk.readFile = function (filename) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename: filename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'readFile', args);
        if (!result || !result.value) {
            return undefined;
        }
        if (result.value.encoding !== 'base64') {
            throw new Error('unsupported encoding type');
        }
        var buffer = adsk.fromBase64(result.value.data);
        if (result.value.chunk === true) {
            var fileBuffer = new ArrayBuffer(result.value.filesize);
            var fileBytes = new Uint8Array(fileBuffer);
            fileBytes.set(new Uint8Array(buffer));
            while (result.value.chunk === true) {
                args.start = result.value.nextstart;
                result = adsk.core.Base._executeStatic('adsk', 'readFile', args);
                if (!result || !result.value) {
                    return undefined;
                }
                if (result.value.encoding !== 'base64') {
                    throw new Error('unsupported encoding type');
                }
                buffer = adsk.fromBase64(result.value.data);
                fileBytes.set(new Uint8Array(buffer), args.start);
            }
            return fileBuffer;
        }
        return buffer;
    };

    adsk.writeFile = function (filename, data, mode) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        if (mode !== undefined && mode.constructor !== String) { throw new TypeError('mode must be a string'); }
        var args = {
            filename: filename
        };
        if (mode !== undefined) {
            args.mode = mode;
        }
        var result;
        if (data instanceof ArrayBuffer) {
            args.encoding = 'base64';
            var bytes = new Uint8Array(data);
            var len = bytes.length;
            var chunkLimit = 1024 * 100;
            var written = 0;
            while (written < len) {
                var writelen = Math.min(len - written, chunkLimit);
                args.data = adsk.toBase64(bytes.subarray(written, written + writelen));
                result = adsk.core.Base._executeStatic('adsk', 'writeFile', args);
                if (result === undefined || result.value !== true) {
                    return false;
                }
                args.mode = 'append';
                written += writelen;
            }
            return true;
        } else if (data && data.constructor === String) {
            args.encoding = 'utf8';
            args.data = data;
            result = adsk.core.Base._executeStatic('adsk', 'writeFile', args);
            return (result && result.value !== undefined) ? result.value : false;
        } else {
            throw new TypeError('data must be an ArrayBuffer or a String');
        }
    };

    adsk.copyFile = function (fromFilename, toFilename) {
        if (!fromFilename || fromFilename.constructor !== String) { throw new TypeError('fromFilename must be a string'); }
        if (!toFilename || toFilename.constructor !== String) { throw new TypeError('toFilename must be a string'); }
        var args = {
            fromFilename: fromFilename,
            toFilename: toFilename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'copyFile', args);
        return result ? result.value : false;
    };

    adsk.renameFile = function (fromFilename, toFilename) {
        if (!fromFilename || fromFilename.constructor !== String) { throw new TypeError('fromFilename must be a string'); }
        if (!toFilename || toFilename.constructor !== String) { throw new TypeError('toFilename must be a string'); }
        var args = {
            fromFilename: fromFilename,
            toFilename: toFilename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'renameFile', args);
        return result ? result.value : false;
    };

    adsk.removeFile = function (filename) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename: filename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'removeFile', args);
        return result ? result.value : false;
    };

    adsk.createDirectory = function (filename) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename: filename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'createDirectory', args);
        return result ? result.value : false;
    };

    adsk.listDirectoryFiles = function (filename, regularFilesOnly, recursive) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        if (regularFilesOnly !== undefined && typeof regularFilesOnly !== 'boolean') { throw new TypeError('regularFilesOnly must be a boolean'); }
        if (recursive !== undefined && typeof recursive !== 'boolean') { throw new TypeError('recursive must be a boolean'); }
        var args = {
            filename: filename
        };
        if (regularFilesOnly !== undefined) {
            args.regularFilesOnly = regularFilesOnly;
        }
        if (recursive !== undefined) {
            args.recursive = recursive;
        }
        var result = adsk.core.Base._executeStatic('adsk', 'listDirectoryFiles', args);
        return result ? result.value : undefined;
    };

    adsk.fileExists = function (filename) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename: filename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'fileExists', args);
        return result ? result.value : false;
    };

    adsk.fileIsDirectory = function (filename) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename: filename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'fileIsDirectory', args);
        return result ? result.value : false;
    };

    adsk.fileSize = function (filename) {
        if (!filename || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename: filename
        };
        var result = adsk.core.Base._executeStatic('adsk', 'fileSize', args);
        return result ? result.value : undefined;
    };

    adsk.tempDirectory = function () {
        var result = adsk.core.Base._executeStatic('adsk', 'tempDirectory');
        return result ? result.value : undefined;
    };

    return adsk;
}));
