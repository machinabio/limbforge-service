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
    if (adsk.core === undefined) {
        adsk.core = {};
    }

    //=========== Data ============
    // The Data class provides access to data files
    adsk.core.Data = function Data(handle) {
        if (!(this instanceof adsk.core.Data)) {
            return adsk.core.Data.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Data.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Data.prototype.constructor = adsk.core.Data;
    adsk.core.Data.classType = function classType () {
        return 'adsk::core::Data';
    };
    adsk.core.Data.interfaceId = 'adsk.core.Data';
    adsk.objectTypes['adsk.core.Data'] = adsk.core.Data;
    adsk.core.Data.cast = function (object) {
        return object instanceof adsk.core.Data ? object : null;
    };

    // Gets and sets the active DataProject. This is the project currently displayed in the Fusion Data Panel.
    Object.defineProperty(adsk.core.Data.prototype, 'activeProject', {
        get : function () {
            var result = this._execute('activeProject');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProject) : null;
        },
        set : function (value) {
            if (value !== null && !(value instanceof adsk.core.DataProject)) { throw new TypeError('value must be a adsk.core.DataProject'); }
            var args = {
                value : value
            };
            var result = this._execute('activeProject', args);
            return result ? result.value : undefined;
        }
    });

    // Gets the collection of DataProjects associated with the active Hub.
    Object.defineProperty(adsk.core.Data.prototype, 'dataProjects', {
        get : function () {
            var result = this._execute('dataProjects');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProjects) : null;
        }
    });

    // Returns a collection of accessible hubs for the current user. A DataHub represents an A360 Team or Personal hub.
    Object.defineProperty(adsk.core.Data.prototype, 'dataHubs', {
        get : function () {
            var result = this._execute('dataHubs');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataHubs) : null;
        }
    });

    // Gets the active DataHub.
    Object.defineProperty(adsk.core.Data.prototype, 'activeHub', {
        get : function () {
            var result = this._execute('activeHub');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataHub) : null;
        },
        set : function (value) {
            if (value !== null && !(value instanceof adsk.core.DataHub)) { throw new TypeError('value must be a adsk.core.DataHub'); }
            var args = {
                value : value
            };
            var result = this._execute('activeHub', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets if the data panel is visible within Fusion.
    Object.defineProperty(adsk.core.Data.prototype, 'isDataPanelVisible', {
        get : function () {
            var result = this._execute('isDataPanelVisible');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (typeof value !== 'boolean') { throw new TypeError('value must be a boolean'); }
            var args = {
                value : value
            };
            var result = this._execute('isDataPanelVisible', args);
            return result ? result.value : undefined;
        }
    });

    // Refreshes the contents of the data panel to ensure what is displayed reflects the latest state.
    // Returns true if the refresh was successful.
    adsk.core.Data.prototype.refreshDataPanel = function () {
        var result = this._execute('refreshDataPanel');
        return result ? result.value : undefined;
    };

    //=========== DataFile ============
    // A data file in a data folder.
    adsk.core.DataFile = function DataFile(handle) {
        if (!(this instanceof adsk.core.DataFile)) {
            return adsk.core.DataFile.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataFile.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataFile.prototype.constructor = adsk.core.DataFile;
    adsk.core.DataFile.classType = function classType () {
        return 'adsk::core::DataFile';
    };
    adsk.core.DataFile.interfaceId = 'adsk.core.DataFile';
    adsk.objectTypes['adsk.core.DataFile'] = adsk.core.DataFile;
    adsk.core.DataFile.cast = function (object) {
        return object instanceof adsk.core.DataFile ? object : null;
    };

    // Gets and sets the displayed name of this item.
    Object.defineProperty(adsk.core.DataFile.prototype, 'name', {
        get : function () {
            var result = this._execute('name');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('name', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the description information associated with this item.
    Object.defineProperty(adsk.core.DataFile.prototype, 'description', {
        get : function () {
            var result = this._execute('description');
            return result ? result.value : undefined;
        }
    });

    // Returns the parent folder this item is contained within.
    Object.defineProperty(adsk.core.DataFile.prototype, 'parentFolder', {
        get : function () {
            var result = this._execute('parentFolder');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
        }
    });

    // Returns the parent project that this item is in.
    Object.defineProperty(adsk.core.DataFile.prototype, 'parentProject', {
        get : function () {
            var result = this._execute('parentProject');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProject) : null;
        }
    });

    // Returns the unique ID for this DataFile. This is the same id used in the Forge Data Management API for an Item and is in the unencoded form and will look similar to this: "urn:adsk.wipprod:dm.lineage:hC6k4hndRWaeIVhIjvHu8w"
    Object.defineProperty(adsk.core.DataFile.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Gets the version number of this DataFile.
    Object.defineProperty(adsk.core.DataFile.prototype, 'versionNumber', {
        get : function () {
            var result = this._execute('versionNumber');
            return result ? result.value : undefined;
        }
    });

    // Gets the other version of this item.
    Object.defineProperty(adsk.core.DataFile.prototype, 'versions', {
        get : function () {
            var result = this._execute('versions');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFiles) : null;
        }
    });

    // Gets the latest version number for this DataFile.
    Object.defineProperty(adsk.core.DataFile.prototype, 'latestVersionNumber', {
        get : function () {
            var result = this._execute('latestVersionNumber');
            return result ? result.value : undefined;
        }
    });

    // Returns the latest version of the DataFile. It can return a reference to the same DataFile is this DataFile is the latest version.
    Object.defineProperty(adsk.core.DataFile.prototype, 'latestVersion', {
        get : function () {
            var result = this._execute('latestVersion');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFile) : null;
        }
    });

    // Gets the file extension for this data file. The file type can be inferred from this.
    Object.defineProperty(adsk.core.DataFile.prototype, 'fileExtension', {
        get : function () {
            var result = this._execute('fileExtension');
            return result ? result.value : undefined;
        }
    });

    // Gets if this DataFile is currently in use (opened for edit) by any other user.
    Object.defineProperty(adsk.core.DataFile.prototype, 'isInUse', {
        get : function () {
            var result = this._execute('isInUse');
            return result ? result.value : undefined;
        }
    });

    // Returns the array of users that are currently using (have open for edit) this data file.
    Object.defineProperty(adsk.core.DataFile.prototype, 'inUseBy', {
        get : function () {
            var result = this._execute('inUseBy');
            if (!result || !Array.isArray(result.value)) {
                return undefined
            }
            var resultIter;
            var resultValue = [];
            for (resultIter = 0; resultIter < result.value.length; ++resultIter) {
                resultValue[resultIter] = (result.value[resultIter] !== undefined) ? adsk.createObject(result.value[resultIter], adsk.core.User) : null;
            }
            return resultValue
        }
    });

    // Returns the User that created this data file.
    Object.defineProperty(adsk.core.DataFile.prototype, 'createdBy', {
        get : function () {
            var result = this._execute('createdBy');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.User) : null;
        }
    });

    // Returns the User that last updated this data file
    Object.defineProperty(adsk.core.DataFile.prototype, 'lastUpdatedBy', {
        get : function () {
            var result = this._execute('lastUpdatedBy');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.User) : null;
        }
    });

    // Gets if this datafile has Children (referenced components) that are out of date (not the latest version).
    Object.defineProperty(adsk.core.DataFile.prototype, 'hasOutofDateChildReferences', {
        get : function () {
            var result = this._execute('hasOutofDateChildReferences');
            return result ? result.value : undefined;
        }
    });

    // Gets if this datafile has children, (i.e. a Fusion Design containing referenced components).
    Object.defineProperty(adsk.core.DataFile.prototype, 'hasChildReferences', {
        get : function () {
            var result = this._execute('hasChildReferences');
            return result ? result.value : undefined;
        }
    });

    // Gets if this datafile has parents, (i.e. this is a child being referenced in another Fusion design).
    Object.defineProperty(adsk.core.DataFile.prototype, 'hasParentReferences', {
        get : function () {
            var result = this._execute('hasParentReferences');
            return result ? result.value : undefined;
        }
    });

    // Returns a collection of DataFiles that are the children (referenced designs) this datafile references.
    Object.defineProperty(adsk.core.DataFile.prototype, 'childReferences', {
        get : function () {
            var result = this._execute('childReferences');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFiles) : null;
        }
    });

    // Returns a collection DataFiles collection that are the parents (designs that reference) this datafile.
    Object.defineProperty(adsk.core.DataFile.prototype, 'parentReferences', {
        get : function () {
            var result = this._execute('parentReferences');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFiles) : null;
        }
    });

    // Deletes this DataFile. This can fail if this file is referenced by another file or is currently open.
    // Returns true if the deletion was successful.
    adsk.core.DataFile.prototype.deleteMe = function () {
        var result = this._execute('deleteMe');
        return result ? result.value : undefined;
    };

    // Moves this DataFile to the specified folder.
    // targetFolder : The folder to move this DataFile to.
    // Returns true if the move was successful.
    adsk.core.DataFile.prototype.move = function (targetFolder) {
        if (targetFolder !== null && !(targetFolder instanceof adsk.core.DataFolder)) { throw new TypeError('targetFolder must be a adsk.core.DataFolder'); }
        var args = {
            targetFolder : (targetFolder === null ? targetFolder : targetFolder.handle)
        };
        var result = this._execute('move', args);
        return result ? result.value : undefined;
    };

    // Copies this DataFile to the specified folder.
    // targetFolder : The folder to copy this DataFile to.
    // Returns the copied DataFile if the copy was successful.
    adsk.core.DataFile.prototype.copy = function (targetFolder) {
        if (targetFolder !== null && !(targetFolder instanceof adsk.core.DataFolder)) { throw new TypeError('targetFolder must be a adsk.core.DataFolder'); }
        var args = {
            targetFolder : (targetFolder === null ? targetFolder : targetFolder.handle)
        };
        var result = this._execute('copy', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFile) : null;
    };

    // Promotes this version to be the latest version. If this is the latest version, nothing happens.
    // Returns true if successful.
    adsk.core.DataFile.prototype.promote = function () {
        var result = this._execute('promote');
        return result ? result.value : undefined;
    };

    //=========== DataFileFuture ============
    // Used to check the state and get back the results of a file upload.
    adsk.core.DataFileFuture = function DataFileFuture(handle) {
        if (!(this instanceof adsk.core.DataFileFuture)) {
            return adsk.core.DataFileFuture.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataFileFuture.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataFileFuture.prototype.constructor = adsk.core.DataFileFuture;
    adsk.core.DataFileFuture.classType = function classType () {
        return 'adsk::core::DataFileFuture';
    };
    adsk.core.DataFileFuture.interfaceId = 'adsk.core.DataFileFuture';
    adsk.objectTypes['adsk.core.DataFileFuture'] = adsk.core.DataFileFuture;
    adsk.core.DataFileFuture.cast = function (object) {
        return object instanceof adsk.core.DataFileFuture ? object : null;
    };

    // Returns the DataFile when the upload is complete (uplodeState returns UploadFinished). Returns null if the upload is still running or has failed.
    Object.defineProperty(adsk.core.DataFileFuture.prototype, 'dataFile', {
        get : function () {
            var result = this._execute('dataFile');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFile) : null;
        }
    });

    // Returns the current state of the upload.
    Object.defineProperty(adsk.core.DataFileFuture.prototype, 'uploadState', {
        get : function () {
            var result = this._execute('uploadState');
            return result ? result.value : undefined;
        }
    });

    //=========== DataFiles ============
    // Returns the items within a folder. This includes everything in a folder except for other folders.
    adsk.core.DataFiles = function DataFiles(handle) {
        if (!(this instanceof adsk.core.DataFiles)) {
            return adsk.core.DataFiles.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataFiles.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataFiles.prototype.constructor = adsk.core.DataFiles;
    adsk.core.DataFiles.classType = function classType () {
        return 'adsk::core::DataFiles';
    };
    adsk.core.DataFiles.interfaceId = 'adsk.core.DataFiles';
    adsk.objectTypes['adsk.core.DataFiles'] = adsk.core.DataFiles;
    adsk.core.DataFiles.cast = function (object) {
        return object instanceof adsk.core.DataFiles ? object : null;
    };

    // The number of data items in this collection.
    Object.defineProperty(adsk.core.DataFiles.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified data file.
    // index : The index of the file to return. The first file in the list has an index of 0.
    // Returns the specified file or null if an invalid index was specified.
    adsk.core.DataFiles.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFile) : null;
    };

    //=========== DataFolder ============
    // A data folder that contains a collection of data items.
    adsk.core.DataFolder = function DataFolder(handle) {
        if (!(this instanceof adsk.core.DataFolder)) {
            return adsk.core.DataFolder.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataFolder.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataFolder.prototype.constructor = adsk.core.DataFolder;
    adsk.core.DataFolder.classType = function classType () {
        return 'adsk::core::DataFolder';
    };
    adsk.core.DataFolder.interfaceId = 'adsk.core.DataFolder';
    adsk.objectTypes['adsk.core.DataFolder'] = adsk.core.DataFolder;
    adsk.core.DataFolder.cast = function (object) {
        return object instanceof adsk.core.DataFolder ? object : null;
    };

    // Gets and sets the displayed name of this folder.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'name', {
        get : function () {
            var result = this._execute('name');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('name', args);
            return result ? result.value : undefined;
        }
    });

    // Returns a collection containing all of the items within this folder, excluding folders. Use the dataFolders property to get the folders.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'dataFiles', {
        get : function () {
            var result = this._execute('dataFiles');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFiles) : null;
        }
    });

    // Returns a collection containing all of the folders within this folder.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'dataFolders', {
        get : function () {
            var result = this._execute('dataFolders');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolders) : null;
        }
    });

    // Returns the parent folder this folder is contained within. Returns null if this is the project's root folder.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'parentFolder', {
        get : function () {
            var result = this._execute('parentFolder');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
        }
    });

    // Returns the parent project that owns this folder.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'parentProject', {
        get : function () {
            var result = this._execute('parentProject');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProject) : null;
        }
    });

    // Indicates if this folder is the root folder within the parent project.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'isRoot', {
        get : function () {
            var result = this._execute('isRoot');
            return result ? result.value : undefined;
        }
    });

    // Returns the unique ID for this folder. This is the same id used in the Forge Data Management API.
    Object.defineProperty(adsk.core.DataFolder.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Uploads a single file to this directory.
    // filename : The full filename of the file to upload.
    // The upload process is asynchronous which means that this method will return before the upload process had completed. The returned DataFileFuture object can be used to check on the current state of the upload to determine if it is still uploading, is complete, or has failed. If it is complete the final DataFinal can be retrieved through the DataFileFuture object.
    adsk.core.DataFolder.prototype.uploadFile = function (filename) {
        if (filename === undefined || filename === null || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename : filename
        };
        var result = this._execute('uploadFile', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFileFuture) : null;
    };

    // Uploads a set of files that represent an assembly There should only be a single top-level assembly file but there can be any number of other files that represent subassemblies.
    // filenames : An array of strings that contains the list of all of the files that are part of the assembly. The name of the the top-level assembly file must be the first file in the array.
    // The upload process is asynchronous which means that this method will return before the upload process had completed. The returned DataFileFuture object can be used to check on the current state of the upload to determine if it is still uploading, is complete, or has failed. If it is complete the final DataFinal can be retrieved through the DataFileFuture object.
    adsk.core.DataFolder.prototype.uploadAssembly = function (filenames) {
        if (!Array.isArray(filenames)) { throw new TypeError('filenames must be an array'); }
        var filenamesLength = filenames.length;
        var filenamesIt;
        for (filenamesIt = 0; filenamesIt < filenamesLength; ++filenamesIt) {
            if (filenames[filenamesIt] === undefined || filenames[filenamesIt] === null || filenames[filenamesIt].constructor !== String) { throw new TypeError('filenames[filenamesIt] must be a string'); }
        }
        var args = {
            filenames : filenames
        };
        var result = this._execute('uploadAssembly', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFileFuture) : null;
    };

    // Deletes this folder item.
    // Returns true if the deletion was successful.
    adsk.core.DataFolder.prototype.deleteMe = function () {
        var result = this._execute('deleteMe');
        return result ? result.value : undefined;
    };

    //=========== DataFolders ============
    // Collection object the provides a list of data folders.
    adsk.core.DataFolders = function DataFolders(handle) {
        if (!(this instanceof adsk.core.DataFolders)) {
            return adsk.core.DataFolders.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataFolders.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataFolders.prototype.constructor = adsk.core.DataFolders;
    adsk.core.DataFolders.classType = function classType () {
        return 'adsk::core::DataFolders';
    };
    adsk.core.DataFolders.interfaceId = 'adsk.core.DataFolders';
    adsk.objectTypes['adsk.core.DataFolders'] = adsk.core.DataFolders;
    adsk.core.DataFolders.cast = function (object) {
        return object instanceof adsk.core.DataFolders ? object : null;
    };

    // The number of folders in this collection.
    Object.defineProperty(adsk.core.DataFolders.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified folder.
    // index : The index of the folder to return. The first folder in the list has an index of 0.
    // Returns the item or null if an invalid index was specified.
    adsk.core.DataFolders.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
    };

    // Returns the folder specified using the name of the folder.
    // name : The name of the folder to return.
    // Returns the folder or null if a folder of the specified name is not found.
    adsk.core.DataFolders.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
    };

    // Returns the folder specified using the ID of the folder.
    // id : The ID of the folder to return. This is the same ID used by the Forge Data Management API.
    // Returns the folder or null if a folder with the specified ID is not found.
    adsk.core.DataFolders.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
    };

    // Creates a new folder within the parent folder.
    // name : The name of the folder. This must be unique with respect to the other folders within the parent folder.
    // Returns the created DataFolder or null if the creation failed.
    adsk.core.DataFolders.prototype.add = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('add', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
    };

    //=========== DataHub ============
    // Represents a hub within the data.
    adsk.core.DataHub = function DataHub(handle) {
        if (!(this instanceof adsk.core.DataHub)) {
            return adsk.core.DataHub.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataHub.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataHub.prototype.constructor = adsk.core.DataHub;
    adsk.core.DataHub.classType = function classType () {
        return 'adsk::core::DataHub';
    };
    adsk.core.DataHub.interfaceId = 'adsk.core.DataHub';
    adsk.objectTypes['adsk.core.DataHub'] = adsk.core.DataHub;
    adsk.core.DataHub.cast = function (object) {
        return object instanceof adsk.core.DataHub ? object : null;
    };

    // Returns the name of the hub.
    Object.defineProperty(adsk.core.DataHub.prototype, 'name', {
        get : function () {
            var result = this._execute('name');
            return result ? result.value : undefined;
        }
    });

    // Returns the projects within this hub.
    Object.defineProperty(adsk.core.DataHub.prototype, 'dataProjects', {
        get : function () {
            var result = this._execute('dataProjects');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProjects) : null;
        }
    });

    // Gets if this hub is a Personal (PersonalHubType) or Team (TeamHubType) type hub.
    Object.defineProperty(adsk.core.DataHub.prototype, 'hubType', {
        get : function () {
            var result = this._execute('hubType');
            return result ? result.value : undefined;
        }
    });

    //=========== DataHubs ============
    // Collection object that provides a list of all available hubs.
    adsk.core.DataHubs = function DataHubs(handle) {
        if (!(this instanceof adsk.core.DataHubs)) {
            return adsk.core.DataHubs.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataHubs.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataHubs.prototype.constructor = adsk.core.DataHubs;
    adsk.core.DataHubs.classType = function classType () {
        return 'adsk::core::DataHubs';
    };
    adsk.core.DataHubs.interfaceId = 'adsk.core.DataHubs';
    adsk.objectTypes['adsk.core.DataHubs'] = adsk.core.DataHubs;
    adsk.core.DataHubs.cast = function (object) {
        return object instanceof adsk.core.DataHubs ? object : null;
    };

    // The number of hubs in this collection.
    Object.defineProperty(adsk.core.DataHubs.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified hub.
    // index : The index of the hub to return. The first hub in the list has an index of 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.core.DataHubs.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataHub) : null;
    };

    //=========== DataProject ============
    // Represents the master branch project within a hub.
    adsk.core.DataProject = function DataProject(handle) {
        if (!(this instanceof adsk.core.DataProject)) {
            return adsk.core.DataProject.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataProject.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataProject.prototype.constructor = adsk.core.DataProject;
    adsk.core.DataProject.classType = function classType () {
        return 'adsk::core::DataProject';
    };
    adsk.core.DataProject.interfaceId = 'adsk.core.DataProject';
    adsk.objectTypes['adsk.core.DataProject'] = adsk.core.DataProject;
    adsk.core.DataProject.cast = function (object) {
        return object instanceof adsk.core.DataProject ? object : null;
    };

    // Gets and sets the name of the project.
    Object.defineProperty(adsk.core.DataProject.prototype, 'name', {
        get : function () {
            var result = this._execute('name');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('name', args);
            return result ? result.value : undefined;
        }
    });

    // Returns the project's root folder. This provides access to all of the folders and the files in the top level of the project.
    Object.defineProperty(adsk.core.DataProject.prototype, 'rootFolder', {
        get : function () {
            var result = this._execute('rootFolder');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataFolder) : null;
        }
    });

    // Returns the unique ID for this project. This is the same id used in the Forge Data Management API in an unencoded form and will look something like this: "a.45637".
    Object.defineProperty(adsk.core.DataProject.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Returns the parent DataHub of this project.
    Object.defineProperty(adsk.core.DataProject.prototype, 'parentHub', {
        get : function () {
            var result = this._execute('parentHub');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataHub) : null;
        }
    });

    //=========== DataProjects ============
    // Collection object that provides a list of all available projects.
    adsk.core.DataProjects = function DataProjects(handle) {
        if (!(this instanceof adsk.core.DataProjects)) {
            return adsk.core.DataProjects.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.DataProjects.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.DataProjects.prototype.constructor = adsk.core.DataProjects;
    adsk.core.DataProjects.classType = function classType () {
        return 'adsk::core::DataProjects';
    };
    adsk.core.DataProjects.interfaceId = 'adsk.core.DataProjects';
    adsk.objectTypes['adsk.core.DataProjects'] = adsk.core.DataProjects;
    adsk.core.DataProjects.cast = function (object) {
        return object instanceof adsk.core.DataProjects ? object : null;
    };

    // The number of projects in this collection.
    Object.defineProperty(adsk.core.DataProjects.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified project.
    // index : The index of the project to return. The first project in the list has an index of 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.core.DataProjects.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProject) : null;
    };

    // Creates a new project in the parent hub.
    // name : The name of the project. This is the name visible to the user.
    // purpose : Optional description of the purpose of the project. An empty string can be used to not specify a purpose.
    // contributors : Optional list of contributors where the list consists of email addresses separated by a comma. An empty string can be used to not specify any contributors.
    // Returns the created DataProject object or null if the creation failed.
    adsk.core.DataProjects.prototype.add = function (name, purpose, contributors) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        if (purpose === null || (purpose !== undefined && purpose.constructor !== String)) { throw new TypeError('purpose must be a string'); }
        if (contributors === null || (contributors !== undefined && contributors.constructor !== String)) { throw new TypeError('contributors must be a string'); }
        var args = {
            name : name
        };
        if (purpose !== undefined) {
            args.purpose = purpose;
        }
        if (contributors !== undefined) {
            args.contributors = contributors;
        }
        var result = this._execute('add', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.DataProject) : null;
    };

    //=========== HubTypes ============
    // The different types of hubs.
    adsk.core.HubTypes = {
        PersonalHubType : 0,
        TeamHubType : 1
    };

    //=========== UploadStates ============
    // The different states of a file upload process.
    adsk.core.UploadStates = {
        UploadProcessing : 0,
        UploadFinished : 1,
        UploadFailed : 2
    };

    return adsk;
}));