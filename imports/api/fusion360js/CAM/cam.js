/*global console*/
/*global define*/
/*global window*/
/*jslint vars: true, nomen: true, plusplus: true*/

(function (root, factory) {

    'use strict';

    if (typeof define === 'function' && define.amd) {
        // using require.js
        define(['./application.js'], factory);
    } else {
        root.adsk = factory(root.adsk);
    }
}(this, function (adsk) {

    'use strict';

    if (adsk === undefined) {
        adsk = {
            objectTypes: {}
        };
    }
    if (adsk.cam === undefined) {
        adsk.cam = {};
    }

    //=========== CAM ============
    // Object that represents the CAM environment of a Fusion document.
    adsk.cam.CAM = function CAM(handle) {
        if (!(this instanceof adsk.cam.CAM)) {
            return adsk.cam.CAM.cast(handle);
        }
        adsk.core.Product.call(this, handle);
    };
    adsk.cam.CAM.prototype = Object.create(adsk.core.Product.prototype);
    adsk.cam.CAM.prototype.constructor = adsk.cam.CAM;
    adsk.cam.CAM.classType = function classType () {
        return 'adsk::cam::CAM';
    };
    adsk.cam.CAM.interfaceId = 'adsk.cam.CAM';
    adsk.objectTypes['adsk.cam.CAM'] = adsk.cam.CAM;
    adsk.cam.CAM.cast = function (object) {
        return object instanceof adsk.cam.CAM ? object : null;
    };

    // Returns the Setups collection that provides access to existing setups
    Object.defineProperty(adsk.cam.CAM.prototype, 'setups', {
        get : function () {
            var result = this._execute('setups');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.Setups) : null;
        }
    });

    // Gets a collection containing all of the operations in the document. This includes all operations nested in folders and patterns.
    Object.defineProperty(adsk.cam.CAM.prototype, 'allOperations', {
        get : function () {
            var result = this._execute('allOperations');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.ObjectCollection) : null;
        }
    });

    // Gets the installation folder with the posts.
    Object.defineProperty(adsk.cam.CAM.prototype, 'genericPostFolder', {
        get : function () {
            var result = this._execute('genericPostFolder');
            return result ? result.value : undefined;
        }
    });

    // Gets the personal post folder.
    Object.defineProperty(adsk.cam.CAM.prototype, 'personalPostFolder', {
        get : function () {
            var result = this._execute('personalPostFolder');
            return result ? result.value : undefined;
        }
    });

    // Gets the folder for temporary files.
    Object.defineProperty(adsk.cam.CAM.prototype, 'temporaryFolder', {
        get : function () {
            var result = this._execute('temporaryFolder');
            return result ? result.value : undefined;
        }
    });

    // Generates/Regenerates all of the toolpaths (including those nested in sub-folders or patterns) for the specified objects.
    // operations : An Operation, Setup, Folder or Pattern object for which to generate the toolpath/s for. You can also specify a collection of any combination of these object types.
    // Return GenerateToolpathFuture that includes the status of toolpath generation.
    adsk.cam.CAM.prototype.generateToolpath = function (operations) {
        if (operations !== null && !(operations instanceof adsk.core.Base)) { throw new TypeError('operations must be a adsk.core.Base'); }
        var args = {
            operations : (operations === null ? operations : operations.handle)
        };
        var result = this._execute('generateToolpath', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.GenerateToolpathFuture) : null;
    };

    // Generates/Regenerates all toolpaths (includes those nested in sub-folders or patterns) in the document.
    // skipValid : Option to skip valid toolpaths and only regenerate invalid toolpaths.
    // Return GenerateToolpathFuture that includes the status of toolpath generation.
    adsk.cam.CAM.prototype.generateAllToolpaths = function (skipValid) {
        if (typeof skipValid !== 'boolean') { throw new TypeError('skipValid must be a boolean'); }
        var args = {
            skipValid : skipValid
        };
        var result = this._execute('generateAllToolpaths', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.GenerateToolpathFuture) : null;
    };

    // Clears all of the toolpaths (including those nested in sub-folders or patterns) for the specified objects.
    // operations : An Operation, Setup, Folder or Pattern object for which to clear the toolpath/s for. You can also specify a collection of any combination of these object types.
    // Return true if successful.
    adsk.cam.CAM.prototype.clearToolpath = function (operations) {
        if (operations !== null && !(operations instanceof adsk.core.Base)) { throw new TypeError('operations must be a adsk.core.Base'); }
        var args = {
            operations : (operations === null ? operations : operations.handle)
        };
        var result = this._execute('clearToolpath', args);
        return result ? result.value : undefined;
    };

    // Clears all the toolpaths (includes those nested in sub-folders or patterns) in the document
    // Return true if successful.
    adsk.cam.CAM.prototype.clearAllToolpaths = function () {
        var result = this._execute('clearAllToolpaths');
        return result ? result.value : undefined;
    };

    // Checks if toolpath operations (including those nested in sub-folders or patterns) are valid for the specified objects.
    // operations : An Operation, Setup, Folder or Pattern object for which to check the toolpath/s of. You can also specify a collection of any combination of these object types.
    // Returns true if the toolpath operations are valid
    adsk.cam.CAM.prototype.checkToolpath = function (operations) {
        if (operations !== null && !(operations instanceof adsk.core.Base)) { throw new TypeError('operations must be a adsk.core.Base'); }
        var args = {
            operations : (operations === null ? operations : operations.handle)
        };
        var result = this._execute('checkToolpath', args);
        return result ? result.value : undefined;
    };

    // Checks if all the toolpath operations (includes those nested in sub-folders or patterns) in the document are valid
    // Returns true if the all toolpath operations are valid
    adsk.cam.CAM.prototype.checkAllToolpaths = function () {
        var result = this._execute('checkAllToolpaths');
        return result ? result.value : undefined;
    };

    // Post all of the toolpaths (including those nested in sub-folders or patterns) for the specified objects
    // operations : An Operation, Setup, Folder or Pattern object for which to post the toolpath/s of. You can also specify a collection of any combination of these object types.
    // input : The PostProcessInput object that defines the post options and parameters.
    // Returns true if successful
    adsk.cam.CAM.prototype.postProcess = function (operations, input) {
        if (operations !== null && !(operations instanceof adsk.core.Base)) { throw new TypeError('operations must be a adsk.core.Base'); }
        if (input !== null && !(input instanceof adsk.cam.PostProcessInput)) { throw new TypeError('input must be a adsk.cam.PostProcessInput'); }
        var args = {
            operations : (operations === null ? operations : operations.handle),
            input : (input === null ? input : input.handle)
        };
        var result = this._execute('postProcess', args);
        return result ? result.value : undefined;
    };

    // Post all of the toolpaths (includes those nested in sub-folders or patterns)in the document
    // input : The PostProcessInput object that defines the post options and parameters.
    // Returns true if successful
    adsk.cam.CAM.prototype.postProcessAll = function (input) {
        if (input !== null && !(input instanceof adsk.cam.PostProcessInput)) { throw new TypeError('input must be a adsk.cam.PostProcessInput'); }
        var args = {
            input : (input === null ? input : input.handle)
        };
        var result = this._execute('postProcessAll', args);
        return result ? result.value : undefined;
    };

    // Generate the setup sheets for the specified objects
    // operations : An Operation, Setup, Folder or Pattern object for which to generate the setup sheet/s for. You can also specify a collection of any combination of these object types.
    // format : The document format for the setup sheet. Valid options are HTMLFormat and ExcelFormat. Limitation: "ExcelFormat" can be used in windows OS only.
    // folder : The destination folder to locate the setup sheet documents in.
    // openDocument : An option to allow to open the document instantly after the generation. By default, the document is opened.
    // Returns true if successful
    adsk.cam.CAM.prototype.generateSetupSheet = function (operations, format, folder, openDocument) {
        if (operations !== null && !(operations instanceof adsk.core.Base)) { throw new TypeError('operations must be a adsk.core.Base'); }
        if (!isFinite(format)) { throw new TypeError('format must be a number'); }
        if (folder === undefined || folder === null || folder.constructor !== String) { throw new TypeError('folder must be a string'); }
        if (openDocument === null || (openDocument !== undefined && typeof openDocument !== 'boolean')) { throw new TypeError('openDocument must be a boolean'); }
        var args = {
            operations : (operations === null ? operations : operations.handle),
            format : Number(format),
            folder : folder
        };
        if (openDocument !== undefined) {
            args.openDocument = openDocument;
        }
        var result = this._execute('generateSetupSheet', args);
        return result ? result.value : undefined;
    };

    // Generates all of the setup sheets for all of the operations in the document
    // format : The document format for the setup sheet. Valid options are HTMLFormat and ExcelFormat. Limitation: "ExcelFormat" can be used in windows OS only.
    // folder : The destination folder to locate the setup sheet documents in.
    // openDocument : An option to allow to open the document instantly after the generation. By default, the document is opened.
    // Returns true if successful
    adsk.cam.CAM.prototype.generateAllSetupSheets = function (format, folder, openDocument) {
        if (!isFinite(format)) { throw new TypeError('format must be a number'); }
        if (folder === undefined || folder === null || folder.constructor !== String) { throw new TypeError('folder must be a string'); }
        if (openDocument === null || (openDocument !== undefined && typeof openDocument !== 'boolean')) { throw new TypeError('openDocument must be a boolean'); }
        var args = {
            format : Number(format),
            folder : folder
        };
        if (openDocument !== undefined) {
            args.openDocument = openDocument;
        }
        var result = this._execute('generateAllSetupSheets', args);
        return result ? result.value : undefined;
    };

    //=========== CAMFolder ============
    // Object that represents a folder in an existing Setup, Folder or Pattern.
    adsk.cam.CAMFolder = function CAMFolder(handle) {
        if (!(this instanceof adsk.cam.CAMFolder)) {
            return adsk.cam.CAMFolder.cast(handle);
        }
        adsk.cam.OperationBase.call(this, handle);
    };
    adsk.cam.CAMFolder.prototype = Object.create(adsk.cam.OperationBase.prototype);
    adsk.cam.CAMFolder.prototype.constructor = adsk.cam.CAMFolder;
    adsk.cam.CAMFolder.classType = function classType () {
        return 'adsk::cam::CAMFolder';
    };
    adsk.cam.CAMFolder.interfaceId = 'adsk.cam.CAMFolder';
    adsk.objectTypes['adsk.cam.CAMFolder'] = adsk.cam.CAMFolder;
    adsk.cam.CAMFolder.cast = function (object) {
        return object instanceof adsk.cam.CAMFolder ? object : null;
    };

    // Gets if this folder is active.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'isActive', {
        get : function () {
            var result = this._execute('isActive');
            return result ? result.value : undefined;
        }
    });

    // Returns the Operations collection that provides access to existing individual operations in this folder.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'operations', {
        get : function () {
            var result = this._execute('operations');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.Operations) : null;
        }
    });

    // Returns the Folders collection that provides access to existing folders in this folder.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'folders', {
        get : function () {
            var result = this._execute('folders');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMFolders) : null;
        }
    });

    // Returns the Patterns collection that provides access to existing patterns in this folder.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'patterns', {
        get : function () {
            var result = this._execute('patterns');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMPatterns) : null;
        }
    });

    // Returns a collection containing all of the immediate (top level) child operations, folders and patterns in this folder in the order they appear in the browser.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'children', {
        get : function () {
            var result = this._execute('children');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.ChildOperationList) : null;
        }
    });

    // Returns the parent Setup, Folder or Pattern for this Folder.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'parent', {
        get : function () {
            var result = this._execute('parent');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Base) : null;
        }
    });

    // Gets a collection containing all of the operations in this folder. This includes all operations nested in folders and patterns.
    Object.defineProperty(adsk.cam.CAMFolder.prototype, 'allOperations', {
        get : function () {
            var result = this._execute('allOperations');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.ObjectCollection) : null;
        }
    });

    //=========== CAMFolders ============
    // Collection that provides access to the folders within an existing setup, folder or pattern.
    adsk.cam.CAMFolders = function CAMFolders(handle) {
        if (!(this instanceof adsk.cam.CAMFolders)) {
            return adsk.cam.CAMFolders.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.cam.CAMFolders.prototype = Object.create(adsk.core.Base.prototype);
    adsk.cam.CAMFolders.prototype.constructor = adsk.cam.CAMFolders;
    adsk.cam.CAMFolders.classType = function classType () {
        return 'adsk::cam::CAMFolders';
    };
    adsk.cam.CAMFolders.interfaceId = 'adsk.cam.CAMFolders';
    adsk.objectTypes['adsk.cam.CAMFolders'] = adsk.cam.CAMFolders;
    adsk.cam.CAMFolders.cast = function (object) {
        return object instanceof adsk.cam.CAMFolders ? object : null;
    };

    // The number of items in the collection.
    Object.defineProperty(adsk.cam.CAMFolders.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Function that returns the specified folder using an index into the collection.
    // index : The index of the item within the collection to return. The first item in the collection has an index of 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.cam.CAMFolders.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMFolder) : null;
    };

    // Returns the folder of the specified name (as appears in the browser).
    // name : The name (as it appears in the browser) of the folder.
    // Returns the specified folder or null in the case where there is no folder with the specified name.
    adsk.cam.CAMFolders.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMFolder) : null;
    };

    //=========== CAMPatterns ============
    // Collection that provides access to the patterns within an existing setup, folder or pattern.
    adsk.cam.CAMPatterns = function CAMPatterns(handle) {
        if (!(this instanceof adsk.cam.CAMPatterns)) {
            return adsk.cam.CAMPatterns.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.cam.CAMPatterns.prototype = Object.create(adsk.core.Base.prototype);
    adsk.cam.CAMPatterns.prototype.constructor = adsk.cam.CAMPatterns;
    adsk.cam.CAMPatterns.classType = function classType () {
        return 'adsk::cam::CAMPatterns';
    };
    adsk.cam.CAMPatterns.interfaceId = 'adsk.cam.CAMPatterns';
    adsk.objectTypes['adsk.cam.CAMPatterns'] = adsk.cam.CAMPatterns;
    adsk.cam.CAMPatterns.cast = function (object) {
        return object instanceof adsk.cam.CAMPatterns ? object : null;
    };

    // The number of items in the collection.
    Object.defineProperty(adsk.cam.CAMPatterns.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Function that returns the specified pattern using an index into the collection.
    // index : The index of the item within the collection to return. The first item in the collection has an index of 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.cam.CAMPatterns.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMPattern) : null;
    };

    // Returns the pattern of the specified name (as appears in the browser).
    // name : The name (as it appears in the browser) of the pattern.
    // Returns the specified pattern or null in the case where there is no pattern with the specified name.
    adsk.cam.CAMPatterns.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMPattern) : null;
    };

    //=========== ChildOperationList ============
    // Provides access to the collection of child operations, folders and patterns of an existing setup.
    adsk.cam.ChildOperationList = function ChildOperationList(handle) {
        if (!(this instanceof adsk.cam.ChildOperationList)) {
            return adsk.cam.ChildOperationList.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.cam.ChildOperationList.prototype = Object.create(adsk.core.Base.prototype);
    adsk.cam.ChildOperationList.prototype.constructor = adsk.cam.ChildOperationList;
    adsk.cam.ChildOperationList.classType = function classType () {
        return 'adsk::cam::ChildOperationList';
    };
    adsk.cam.ChildOperationList.interfaceId = 'adsk.cam.ChildOperationList';
    adsk.objectTypes['adsk.cam.ChildOperationList'] = adsk.cam.ChildOperationList;
    adsk.cam.ChildOperationList.cast = function (object) {
        return object instanceof adsk.cam.ChildOperationList ? object : null;
    };

    // Gets the number of objects in the collection.
    Object.defineProperty(adsk.cam.ChildOperationList.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified item using an index into the collection.
    // index : The index of the item within the collection to return. The first item in the collection has an index of 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.cam.ChildOperationList.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Base) : null;
    };

    // Returns the operation, folder or pattern of the specified name (the name seen in the browser).
    // name : The name of the operation, folder or pattern as seen in the browser.
    // Returns the specified item or null in the case where there is no item with the specified name.
    adsk.cam.ChildOperationList.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Base) : null;
    };

    //=========== GenerateToolpathFuture ============
    // Used to check the state and get back the results of toolpath generation.
    adsk.cam.GenerateToolpathFuture = function GenerateToolpathFuture(handle) {
        if (!(this instanceof adsk.cam.GenerateToolpathFuture)) {
            return adsk.cam.GenerateToolpathFuture.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.cam.GenerateToolpathFuture.prototype = Object.create(adsk.core.Base.prototype);
    adsk.cam.GenerateToolpathFuture.prototype.constructor = adsk.cam.GenerateToolpathFuture;
    adsk.cam.GenerateToolpathFuture.classType = function classType () {
        return 'adsk::cam::GenerateToolpathFuture';
    };
    adsk.cam.GenerateToolpathFuture.interfaceId = 'adsk.cam.GenerateToolpathFuture';
    adsk.objectTypes['adsk.cam.GenerateToolpathFuture'] = adsk.cam.GenerateToolpathFuture;
    adsk.cam.GenerateToolpathFuture.cast = function (object) {
        return object instanceof adsk.cam.GenerateToolpathFuture ? object : null;
    };

    // Returns a number of operations need to be generated.
    Object.defineProperty(adsk.cam.GenerateToolpathFuture.prototype, 'numberOfOperations', {
        get : function () {
            var result = this._execute('numberOfOperations');
            return result ? result.value : undefined;
        }
    });

    // Returns a number of operations whose toolpath generation are completed.
    Object.defineProperty(adsk.cam.GenerateToolpathFuture.prototype, 'numberOfCompleted', {
        get : function () {
            var result = this._execute('numberOfCompleted');
            return result ? result.value : undefined;
        }
    });

    // Returns all operations that need to be generated.
    Object.defineProperty(adsk.cam.GenerateToolpathFuture.prototype, 'operations', {
        get : function () {
            var result = this._execute('operations');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.Operations) : null;
        }
    });

    // Returns true if all operations are generated.
    Object.defineProperty(adsk.cam.GenerateToolpathFuture.prototype, 'isGenerationCompleted', {
        get : function () {
            var result = this._execute('isGenerationCompleted');
            return result ? result.value : undefined;
        }
    });

    //=========== PostOutputUnitOptions ============
    // List of the valid options for the outputUnit property on a PostProcessInput object .
    adsk.cam.PostOutputUnitOptions = {
        DocumentUnitsOutput : 0,
        InchesOutput : 1,
        MillimetersOutput : 2
    };

    //=========== PostProcessInput ============
    // This class defines the properties that pertain to the settings and options required for posting a toolpath to generate a CNC file. A PostProcessInput object is a required parameter for the postProcessAll() and postProcess() methods on the CAM class.
    adsk.cam.PostProcessInput = function PostProcessInput(handle) {
        if (!(this instanceof adsk.cam.PostProcessInput)) {
            return adsk.cam.PostProcessInput.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.cam.PostProcessInput.prototype = Object.create(adsk.core.Base.prototype);
    adsk.cam.PostProcessInput.prototype.constructor = adsk.cam.PostProcessInput;
    adsk.cam.PostProcessInput.classType = function classType () {
        return 'adsk::cam::PostProcessInput';
    };
    adsk.cam.PostProcessInput.interfaceId = 'adsk.cam.PostProcessInput';
    adsk.objectTypes['adsk.cam.PostProcessInput'] = adsk.cam.PostProcessInput;
    adsk.cam.PostProcessInput.cast = function (object) {
        return object instanceof adsk.cam.PostProcessInput ? object : null;
    };

    // Gets and sets the program name or number. If the post configuration specifies the parameter programNameIsInteger = true, then the program name must be a number.
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'programName', {
        get : function () {
            var result = this._execute('programName');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('programName', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the program comment. The default value for this property is an empty string ("").
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'programComment', {
        get : function () {
            var result = this._execute('programComment');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('programComment', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the full filename (including the path) for the post configuration file (.cps)
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'postConfiguration', {
        get : function () {
            var result = this._execute('postConfiguration');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('postConfiguration', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the path for the output folder where the .cnc files will be located.
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'outputFolder', {
        get : function () {
            var result = this._execute('outputFolder');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('outputFolder', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the units option for the cnc output. Valid options are DocumentUnitsOutput, InchesOutput or MillimetersOutput
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'outputUnits', {
        get : function () {
            var result = this._execute('outputUnits');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (!isFinite(value)) { throw new TypeError('value must be a number'); }
            var args = {
                value : Number(value)
            };
            var result = this._execute('outputUnits', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the option if opening the cnc file with the editor after it is created. The default value for this property is true.
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'isOpenInEditor', {
        get : function () {
            var result = this._execute('isOpenInEditor');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (typeof value !== 'boolean') { throw new TypeError('value must be a boolean'); }
            var args = {
                value : value
            };
            var result = this._execute('isOpenInEditor', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets that operations may be reordered between setups to minimize the number of tool changes. Operations within each setup will still be executed in the programmed order. This is commonly used for tombstone machining where you have multiple setups. The default value for this property is false.
    Object.defineProperty(adsk.cam.PostProcessInput.prototype, 'areToolChangesMinimized', {
        get : function () {
            var result = this._execute('areToolChangesMinimized');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (typeof value !== 'boolean') { throw new TypeError('value must be a boolean'); }
            var args = {
                value : value
            };
            var result = this._execute('areToolChangesMinimized', args);
            return result ? result.value : undefined;
        }
    });

    // Creates a new PostProcessInput object to be used as an input arguement by the postProcess() and postProcessAll() methods on the CAM class for posting toolpaths and generating CNC files.
    // programName : The program name or number. If the post configuration specifies the parameter programNameIsInteger = true, then the program name must be a number.
    // postConfiguration : The full filename (including the path) for the post configuration file (.cps) The post config file can be stored in any path but for convenience you can use the genericPostFolder or the personalPostFolder property on the CAM class to specify the path if your .cps file is stored in either of those locations. You must add a forward slash (this works for Mac or Windows) to the path defined by these folder properties before the filename (i.e. postConfiguration = cam.genericPostFolder + '/' + 'fanuc.cps')
    // outputFolder : The path for the existing output folder where the .cnc files will be located. This method will create the specified output folder if it does not already exist. It is not necessary to add a slash to the end of the outputFolder path. You should use forward slashes in your path definition if you want your script to run on both Mac and Windows.
    // outputUnits : The units option for the cnc output. Valid options are DocumentUnitsOutput, InchesOutput or MillimetersOutput
    // Returns the newly created PostProcessInput object or null if the creation failed.
    adsk.cam.PostProcessInput.create = function (programName, postConfiguration, outputFolder, outputUnits) {
        if (programName === undefined || programName === null || programName.constructor !== String) { throw new TypeError('programName must be a string'); }
        if (postConfiguration === undefined || postConfiguration === null || postConfiguration.constructor !== String) { throw new TypeError('postConfiguration must be a string'); }
        if (outputFolder === undefined || outputFolder === null || outputFolder.constructor !== String) { throw new TypeError('outputFolder must be a string'); }
        if (!isFinite(outputUnits)) { throw new TypeError('outputUnits must be a number'); }
        var args = {
            programName : programName,
            postConfiguration : postConfiguration,
            outputFolder : outputFolder,
            outputUnits : Number(outputUnits)
        };
        var result = adsk.core.Base._executeStatic('adsk.cam.PostProcessInput', 'create', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.PostProcessInput) : null;
    };

    //=========== Setup ============
    // Object that represents an existing Setup.
    adsk.cam.Setup = function Setup(handle) {
        if (!(this instanceof adsk.cam.Setup)) {
            return adsk.cam.Setup.cast(handle);
        }
        adsk.cam.OperationBase.call(this, handle);
    };
    adsk.cam.Setup.prototype = Object.create(adsk.cam.OperationBase.prototype);
    adsk.cam.Setup.prototype.constructor = adsk.cam.Setup;
    adsk.cam.Setup.classType = function classType () {
        return 'adsk::cam::Setup';
    };
    adsk.cam.Setup.interfaceId = 'adsk.cam.Setup';
    adsk.objectTypes['adsk.cam.Setup'] = adsk.cam.Setup;
    adsk.cam.Setup.cast = function (object) {
        return object instanceof adsk.cam.Setup ? object : null;
    };

    // Gets the Operation Type (MillingOperation or TurningOperation).
    Object.defineProperty(adsk.cam.Setup.prototype, 'operationType', {
        get : function () {
            var result = this._execute('operationType');
            return result ? result.value : undefined;
        }
    });

    // Gets if this setup is active.
    Object.defineProperty(adsk.cam.Setup.prototype, 'isActive', {
        get : function () {
            var result = this._execute('isActive');
            return result ? result.value : undefined;
        }
    });

    // Returns the Operations collection that provides access to existing operations in this setup.
    Object.defineProperty(adsk.cam.Setup.prototype, 'operations', {
        get : function () {
            var result = this._execute('operations');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.Operations) : null;
        }
    });

    // Returns the Folders collection that provides access to existing folders in this setup.
    Object.defineProperty(adsk.cam.Setup.prototype, 'folders', {
        get : function () {
            var result = this._execute('folders');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMFolders) : null;
        }
    });

    // Returns the Patterns collection that provides access to existing patterns in this setup.
    Object.defineProperty(adsk.cam.Setup.prototype, 'patterns', {
        get : function () {
            var result = this._execute('patterns');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.CAMPatterns) : null;
        }
    });

    // Returns a collection containing all of the immediate (top level) child operations, folders and patterns in this setup in the order they appear in the browser.
    Object.defineProperty(adsk.cam.Setup.prototype, 'children', {
        get : function () {
            var result = this._execute('children');
            return (result && result.value) ? adsk.createObject(result.value, adsk.cam.ChildOperationList) : null;
        }
    });

    // Gets a collection containing all of the operations in this setup. This includes all operations nested in folders and patterns.
    Object.defineProperty(adsk.cam.Setup.prototype, 'allOperations', {
        get : function () {
            var result = this._execute('allOperations');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.ObjectCollection) : null;
        }
    });

    //=========== Setups ============
    // Collection that provides access to all of the existing setups in a document.
    adsk.cam.Setups = function Setups(handle) {
        if (!(this instanceof adsk.cam.Setups)) {
            return adsk.cam.Setups.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.cam.Setups.prototype = Object.create(adsk.core.Base.prototype);
    adsk.cam.Setups.prototype.constructor = adsk.cam.Setups;
    adsk.cam.Setups.classType = function classType () {
        return 'adsk::cam::Setups';
    };
    adsk.cam.Setups.interfaceId = 'adsk.cam.Setups';
    adsk.objectTypes['adsk.cam.Setups'] = adsk.cam.Setups;
    adsk.cam.Setups.cast = function (object) {
        return object instanceof adsk.cam.Setups ? object : null;
    };

    // The number of setups in the collection.
    Object.defineProperty(adsk.cam.Setups.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Function that returns the specified setup using an index into the collection.
    // index : The index of the item within the collection to return. The first item in the collection has an index of 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.cam.Setups.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.Setup) : null;
    };

    // Returns the setup of the specified name.
    // name : The name (as it appears in the browser) of the operation.
    // Returns the specified setup or null in the case where there is no setup with the specified name.
    adsk.cam.Setups.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.cam.Setup) : null;
    };

    //=========== SetupSheetFormats ============
    // List of the formats to choose from when generating setup sheets
    adsk.cam.SetupSheetFormats = {
        HTMLFormat : 0,
        ExcelFormat : 1
    };

    //=========== CAMPattern ============
    // Object that represents a pattern in an existing Setup, Folder or Pattern.
    adsk.cam.CAMPattern = function CAMPattern(handle) {
        if (!(this instanceof adsk.cam.CAMPattern)) {
            return adsk.cam.CAMPattern.cast(handle);
        }
        adsk.cam.CAMFolder.call(this, handle);
    };
    adsk.cam.CAMPattern.prototype = Object.create(adsk.cam.CAMFolder.prototype);
    adsk.cam.CAMPattern.prototype.constructor = adsk.cam.CAMPattern;
    adsk.cam.CAMPattern.classType = function classType () {
        return 'adsk::cam::CAMPattern';
    };
    adsk.cam.CAMPattern.interfaceId = 'adsk.cam.CAMPattern';
    adsk.objectTypes['adsk.cam.CAMPattern'] = adsk.cam.CAMPattern;
    adsk.cam.CAMPattern.cast = function (object) {
        return object instanceof adsk.cam.CAMPattern ? object : null;
    };

    return adsk;
}));