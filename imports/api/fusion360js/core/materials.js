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

    //=========== Appearance ============
    // An appearance.
    adsk.core.Appearance = function Appearance(handle) {
        if (!(this instanceof adsk.core.Appearance)) {
            return adsk.core.Appearance.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Appearance.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Appearance.prototype.constructor = adsk.core.Appearance;
    adsk.core.Appearance.classType = function classType () {
        return 'adsk::core::Appearance';
    };
    adsk.core.Appearance.interfaceId = 'adsk.core.Appearance';
    adsk.objectTypes['adsk.core.Appearance'] = adsk.core.Appearance;
    adsk.core.Appearance.cast = function (object) {
        return object instanceof adsk.core.Appearance ? object : null;
    };

    // The unique internal ID of this Appearance.
    Object.defineProperty(adsk.core.Appearance.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Returns true if this Appearance is used in the Design.
    Object.defineProperty(adsk.core.Appearance.prototype, 'isUsed', {
        get : function () {
            var result = this._execute('isUsed');
            return result ? result.value : undefined;
        }
    });

    // Returns a collection of the entities currently using this appearance. This property is only valid for an appearance in a Design and where the IsUsed property returns true. The collection returned can contain
    Object.defineProperty(adsk.core.Appearance.prototype, 'usedBy', {
        get : function () {
            var result = this._execute('usedBy');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.ObjectCollection) : null;
        }
    });

    // Returns the name of this Appearance. This is the localized name shown in the UI.
    Object.defineProperty(adsk.core.Appearance.prototype, 'name', {
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

    // Property that returns the Parent object of this Appearance (a MaterialLibrary, Design, or AppearanceFavorites collection).
    Object.defineProperty(adsk.core.Appearance.prototype, 'parent', {
        get : function () {
            var result = this._execute('parent');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Base) : null;
        }
    });

    // Property that indicates if this appearance has a texture associated with it.
    Object.defineProperty(adsk.core.Appearance.prototype, 'hasTexture', {
        get : function () {
            var result = this._execute('hasTexture');
            return result ? result.value : undefined;
        }
    });

    // returns the collection of Properties that define this appearance
    Object.defineProperty(adsk.core.Appearance.prototype, 'appearanceProperties', {
        get : function () {
            var result = this._execute('appearanceProperties');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Properties) : null;
        }
    });

    // Deletes the Appearance from the Design. This method is only valid for appearances that are in a Design and are unused.
    // Returns true if the delete was successful.
    adsk.core.Appearance.prototype.deleteMe = function () {
        var result = this._execute('deleteMe');
        return result ? result.value : undefined;
    };

    // Copies this appearance to the specified target. ***Depricated Method: Use the addByCopyMethod on the Appearances object instead, where you can rename the copied Appearance and the return type is Appearance rather than bool.***
    // target : The target can be a Design or MaterialFavorites object.
    // Returns true if the copy was successful.
    adsk.core.Appearance.prototype.copyTo = function (target) {
        if (target !== null && !(target instanceof adsk.core.Base)) { throw new TypeError('target must be a adsk.core.Base'); }
        var args = {
            target : (target === null ? target : target.handle)
        };
        var result = this._execute('copyTo', args);
        return result ? result.value : undefined;
    };

    //=========== Appearances ============
    // A collection of appearances.
    adsk.core.Appearances = function Appearances(handle) {
        if (!(this instanceof adsk.core.Appearances)) {
            return adsk.core.Appearances.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Appearances.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Appearances.prototype.constructor = adsk.core.Appearances;
    adsk.core.Appearances.classType = function classType () {
        return 'adsk::core::Appearances';
    };
    adsk.core.Appearances.interfaceId = 'adsk.core.Appearances';
    adsk.objectTypes['adsk.core.Appearances'] = adsk.core.Appearances;
    adsk.core.Appearances.cast = function (object) {
        return object instanceof adsk.core.Appearances ? object : null;
    };

    // The number of Materials in the collection.
    Object.defineProperty(adsk.core.Appearances.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified Appearance using an index into the collection.
    // index : The index of the appearance to return where the first item in the collection is 0.
    // Returns the specified appearance or null if an invalid index is specified.
    adsk.core.Appearances.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    // Returns the specified Appearance using the name as seen in the user interface. This often isn't a reliable way of accessing a specific appearance because appearances are not required to be unique.
    // name : The name of the appearance to return,.
    // Returns the specified appearance or null if there isn't a matching name.
    adsk.core.Appearances.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    // Returns the Appearance by it's internal unique ID.
    // id : The ID of the appearance to return.
    // Returns the specified appearance or null if there isn't a matching ID.
    adsk.core.Appearances.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    // Add an Appearance to a Design by copying an existing Appearance from Favorites, a Library or from the appearances stored in the Design. This method currently only applies to the Appearances collection from a Design and cannot be used to copy an Appearance to a library.
    // appearanceToCopy : The Appearance you want to copy. The Appearance to copy can be from Favorites, a Library or from the appearances stored in the Design.
    // name : The Appearnce name to apply to the copy.
    // Returns the newly created Appearance or null if the copy operation failed.
    adsk.core.Appearances.prototype.addByCopy = function (appearanceToCopy, name) {
        if (appearanceToCopy !== null && !(appearanceToCopy instanceof adsk.core.Appearance)) { throw new TypeError('appearanceToCopy must be a adsk.core.Appearance'); }
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            appearanceToCopy : (appearanceToCopy === null ? appearanceToCopy : appearanceToCopy.handle),
            name : name
        };
        var result = this._execute('addByCopy', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    //=========== AppearanceSourceTypes ============
    // The different types of sources for an appearance.
    adsk.core.AppearanceSourceTypes = {
        MaterialAppearanceSource : 0,
        BodyAppearanceSource : 1,
        OccurrenceAppearanceSource : 2,
        FaceAppearanceSource : 3,
        OverrideAppearanceSource : 4
    };

    //=========== AppearanceTexture ============
    // Provides access to a list of properties that define a texture.
    adsk.core.AppearanceTexture = function AppearanceTexture(handle) {
        if (!(this instanceof adsk.core.AppearanceTexture)) {
            return adsk.core.AppearanceTexture.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.AppearanceTexture.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.AppearanceTexture.prototype.constructor = adsk.core.AppearanceTexture;
    adsk.core.AppearanceTexture.classType = function classType () {
        return 'adsk::core::AppearanceTexture';
    };
    adsk.core.AppearanceTexture.interfaceId = 'adsk.core.AppearanceTexture';
    adsk.objectTypes['adsk.core.AppearanceTexture'] = adsk.core.AppearanceTexture;
    adsk.core.AppearanceTexture.cast = function (object) {
        return object instanceof adsk.core.AppearanceTexture ? object : null;
    };

    // Returns a collection of the properties associated with this texture.
    Object.defineProperty(adsk.core.AppearanceTexture.prototype, 'properties', {
        get : function () {
            var result = this._execute('properties');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Properties) : null;
        }
    });

    // Gets the type of texture this appearance currently is.
    Object.defineProperty(adsk.core.AppearanceTexture.prototype, 'textureType', {
        get : function () {
            var result = this._execute('textureType');
            return result ? result.value : undefined;
        }
    });

    // Changes the image of this texture.
    // imageFilename : Input String specifying the full filename of the texture file to use.
    // Returns true if the change was successful.
    adsk.core.AppearanceTexture.prototype.changeTextureImage = function (imageFilename) {
        if (imageFilename === undefined || imageFilename === null || imageFilename.constructor !== String) { throw new TypeError('imageFilename must be a string'); }
        var args = {
            imageFilename : imageFilename
        };
        var result = this._execute('changeTextureImage', args);
        return result ? result.value : undefined;
    };

    //=========== FavoriteAppearances ============
    // Collection of the favorite appearances.
    adsk.core.FavoriteAppearances = function FavoriteAppearances(handle) {
        if (!(this instanceof adsk.core.FavoriteAppearances)) {
            return adsk.core.FavoriteAppearances.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.FavoriteAppearances.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.FavoriteAppearances.prototype.constructor = adsk.core.FavoriteAppearances;
    adsk.core.FavoriteAppearances.classType = function classType () {
        return 'adsk::core::FavoriteAppearances';
    };
    adsk.core.FavoriteAppearances.interfaceId = 'adsk.core.FavoriteAppearances';
    adsk.objectTypes['adsk.core.FavoriteAppearances'] = adsk.core.FavoriteAppearances;
    adsk.core.FavoriteAppearances.cast = function (object) {
        return object instanceof adsk.core.FavoriteAppearances ? object : null;
    };

    // The number of Appearances in the collection.
    Object.defineProperty(adsk.core.FavoriteAppearances.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified Appearance using an index into the collection.
    // index : The index of the appearance to return where the first item in the collection is 0.
    // Returns the specified appearance or null if an invalid index is specified.
    adsk.core.FavoriteAppearances.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    // Returns the specified appearance using the name as seen in the user interface. This often isn't a reliable way of accessing a specific appearance because appearances are not required to be unique.
    // name : The name of the appearance to return,.
    // Returns the specified appearance or null if there isn't a matching name.
    adsk.core.FavoriteAppearances.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    // Returns the Appearance by it's internal unique ID.
    // id : The ID of the appearance to return.
    // Returns the specified appearance or null if there isn't a matching ID.
    adsk.core.FavoriteAppearances.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    // Adds an existing appearance to the Favorites list
    // appearance : The appearance to be added to the favorites list. This can come from a Library or from a Design.
    // Returns the Appearance added to the favorites list or null if the operation failed.
    adsk.core.FavoriteAppearances.prototype.add = function (appearance) {
        if (appearance !== null && !(appearance instanceof adsk.core.Appearance)) { throw new TypeError('appearance must be a adsk.core.Appearance'); }
        var args = {
            appearance : (appearance === null ? appearance : appearance.handle)
        };
        var result = this._execute('add', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
    };

    //=========== FavoriteMaterials ============
    // Collection of the favorite materials.
    adsk.core.FavoriteMaterials = function FavoriteMaterials(handle) {
        if (!(this instanceof adsk.core.FavoriteMaterials)) {
            return adsk.core.FavoriteMaterials.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.FavoriteMaterials.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.FavoriteMaterials.prototype.constructor = adsk.core.FavoriteMaterials;
    adsk.core.FavoriteMaterials.classType = function classType () {
        return 'adsk::core::FavoriteMaterials';
    };
    adsk.core.FavoriteMaterials.interfaceId = 'adsk.core.FavoriteMaterials';
    adsk.objectTypes['adsk.core.FavoriteMaterials'] = adsk.core.FavoriteMaterials;
    adsk.core.FavoriteMaterials.cast = function (object) {
        return object instanceof adsk.core.FavoriteMaterials ? object : null;
    };

    // The number of Materials in the collection.
    Object.defineProperty(adsk.core.FavoriteMaterials.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified Material using an index into the collection.
    // index : The index of the material to return where the first item in the collection is 0.
    // Returns the specified material or null if an invalid index is specified.
    adsk.core.FavoriteMaterials.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    // Returns the specified Material using the name as seen in the user interface. This often isn't a reliable way of accessing a specific material because materials are not required to be unique.
    // name : The name of the material to return,.
    // Returns the specified material or null if there isn't a matching name.
    adsk.core.FavoriteMaterials.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    // Returns the Material by it's internal unique ID.
    // id : The ID of the material to return.
    // Returns the specified material or null if there isn't a matching ID.
    adsk.core.FavoriteMaterials.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    // Adds an existing material to the Favorites list
    // material : The material to be added to the favorites list. This can come from a Library or from a Design.
    // Returns the Material added to the favorites list or null if the operation failed.
    adsk.core.FavoriteMaterials.prototype.add = function (material) {
        if (material !== null && !(material instanceof adsk.core.Material)) { throw new TypeError('material must be a adsk.core.Material'); }
        var args = {
            material : (material === null ? material : material.handle)
        };
        var result = this._execute('add', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    //=========== Material ============
    // A material.
    adsk.core.Material = function Material(handle) {
        if (!(this instanceof adsk.core.Material)) {
            return adsk.core.Material.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Material.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Material.prototype.constructor = adsk.core.Material;
    adsk.core.Material.classType = function classType () {
        return 'adsk::core::Material';
    };
    adsk.core.Material.interfaceId = 'adsk.core.Material';
    adsk.objectTypes['adsk.core.Material'] = adsk.core.Material;
    adsk.core.Material.cast = function (object) {
        return object instanceof adsk.core.Material ? object : null;
    };

    // Gets the Appearance of this material.
    Object.defineProperty(adsk.core.Material.prototype, 'appearance', {
        get : function () {
            var result = this._execute('appearance');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearance) : null;
        }
    });

    // Returns the unique internal ID of this material.
    Object.defineProperty(adsk.core.Material.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Returns true if this material is used in the Design
    Object.defineProperty(adsk.core.Material.prototype, 'isUsed', {
        get : function () {
            var result = this._execute('isUsed');
            return result ? result.value : undefined;
        }
    });

    // Returns the collection of material properties associated with this material.
    Object.defineProperty(adsk.core.Material.prototype, 'materialProperties', {
        get : function () {
            var result = this._execute('materialProperties');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Properties) : null;
        }
    });

    // Returns the name of this Material. This is the name of the material as seen in the user interface. The name can only be edited if the material is in a Design or the favorites list.
    Object.defineProperty(adsk.core.Material.prototype, 'name', {
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

    // Returns the Parent object (a Library or a Design).
    Object.defineProperty(adsk.core.Material.prototype, 'parent', {
        get : function () {
            var result = this._execute('parent');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Base) : null;
        }
    });

    // Deletes the material from the Design. This method only applies to materials in a Design that are unused
    // Returns true if the delete was successful.
    adsk.core.Material.prototype.deleteMe = function () {
        var result = this._execute('deleteMe');
        return result ? result.value : undefined;
    };

    // Copies this material to the specified target. ***Depricated Method: Use the addByCopyMethod on the Materials object instead, where you can rename the copied Material***
    // target : The target can be a Design or MaterialFavorites object.
    // Returns the new copy of the material or null if the copy failed.
    adsk.core.Material.prototype.copyTo = function (target) {
        if (target !== null && !(target instanceof adsk.core.Base)) { throw new TypeError('target must be a adsk.core.Base'); }
        var args = {
            target : (target === null ? target : target.handle)
        };
        var result = this._execute('copyTo', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    //=========== MaterialLibraries ============
    // The MaterialLibraries collection object provides access to currently loaded Material and Appearance libraries
    adsk.core.MaterialLibraries = function MaterialLibraries(handle) {
        if (!(this instanceof adsk.core.MaterialLibraries)) {
            return adsk.core.MaterialLibraries.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.MaterialLibraries.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.MaterialLibraries.prototype.constructor = adsk.core.MaterialLibraries;
    adsk.core.MaterialLibraries.classType = function classType () {
        return 'adsk::core::MaterialLibraries';
    };
    adsk.core.MaterialLibraries.interfaceId = 'adsk.core.MaterialLibraries';
    adsk.objectTypes['adsk.core.MaterialLibraries'] = adsk.core.MaterialLibraries;
    adsk.core.MaterialLibraries.cast = function (object) {
        return object instanceof adsk.core.MaterialLibraries ? object : null;
    };

    // The number of Material Libraries in the collection.
    Object.defineProperty(adsk.core.MaterialLibraries.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Method that returns the specified Material Library using an index into the collection.
    // index : The index of the item within the collection. The first item has an index of 0.
    // Returns the specified material library or null if an invalid index was specified.
    adsk.core.MaterialLibraries.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.MaterialLibrary) : null;
    };

    // Returns the specified Material Library using the name as seen in the user interface.
    // name : The name of the library to return.
    // Returns the specified material library or null if there's no match on the name.
    adsk.core.MaterialLibraries.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.MaterialLibrary) : null;
    };

    // Returns the Material Library at the specified ID.
    // id : The ID of the library to return.
    // Returns the specified material library or null if there's no match on the ID.
    adsk.core.MaterialLibraries.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.MaterialLibrary) : null;
    };

    // Loads the specified existing local material library. Fusion remembers which libraries have been loaded from one session to the next so you should check to see if the local library is already loaded or not before loading it again.
    // filename : The full filename of the .adsklib material file.
    // Returns the MaterialLibrary object representing the opened library or null in the case of failure.
    adsk.core.MaterialLibraries.prototype.load = function (filename) {
        if (filename === undefined || filename === null || filename.constructor !== String) { throw new TypeError('filename must be a string'); }
        var args = {
            filename : filename
        };
        var result = this._execute('load', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.MaterialLibrary) : null;
    };

    //=========== MaterialLibrary ============
    // A material library.
    adsk.core.MaterialLibrary = function MaterialLibrary(handle) {
        if (!(this instanceof adsk.core.MaterialLibrary)) {
            return adsk.core.MaterialLibrary.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.MaterialLibrary.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.MaterialLibrary.prototype.constructor = adsk.core.MaterialLibrary;
    adsk.core.MaterialLibrary.classType = function classType () {
        return 'adsk::core::MaterialLibrary';
    };
    adsk.core.MaterialLibrary.interfaceId = 'adsk.core.MaterialLibrary';
    adsk.objectTypes['adsk.core.MaterialLibrary'] = adsk.core.MaterialLibrary;
    adsk.core.MaterialLibrary.cast = function (object) {
        return object instanceof adsk.core.MaterialLibrary ? object : null;
    };

    // Property that gets the name of this Library. This is the localized name shown in the user interface.
    Object.defineProperty(adsk.core.MaterialLibrary.prototype, 'name', {
        get : function () {
            var result = this._execute('name');
            return result ? result.value : undefined;
        }
    });

    // The unique internal ID of this Library.
    Object.defineProperty(adsk.core.MaterialLibrary.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Returns the appearances defined within this library.
    Object.defineProperty(adsk.core.MaterialLibrary.prototype, 'appearances', {
        get : function () {
            var result = this._execute('appearances');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Appearances) : null;
        }
    });

    // Returns the materials defined within this library.
    Object.defineProperty(adsk.core.MaterialLibrary.prototype, 'materials', {
        get : function () {
            var result = this._execute('materials');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Materials) : null;
        }
    });

    // Gets if this is a native material library. Native libraries are those that are delivered with Fusion and are always available. And non-native libraries are user created. If This returns True then there are some limitations to what can be done with the library. For example, if this is a native material library it cannot be unloaded.
    Object.defineProperty(adsk.core.MaterialLibrary.prototype, 'isNative', {
        get : function () {
            var result = this._execute('isNative');
            return result ? result.value : undefined;
        }
    });

    // Unloads this material from Fusion. Only non-native material libraries can be unloaded. You can determine this by checking the isNative property.
    // Returns True if the library was successfully unloaded.
    adsk.core.MaterialLibrary.prototype.unload = function () {
        var result = this._execute('unload');
        return result ? result.value : undefined;
    };

    //=========== Materials ============
    // Collection of materials within a Library or Design.
    adsk.core.Materials = function Materials(handle) {
        if (!(this instanceof adsk.core.Materials)) {
            return adsk.core.Materials.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Materials.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Materials.prototype.constructor = adsk.core.Materials;
    adsk.core.Materials.classType = function classType () {
        return 'adsk::core::Materials';
    };
    adsk.core.Materials.interfaceId = 'adsk.core.Materials';
    adsk.objectTypes['adsk.core.Materials'] = adsk.core.Materials;
    adsk.core.Materials.cast = function (object) {
        return object instanceof adsk.core.Materials ? object : null;
    };

    // The number of Materials in the collection.
    Object.defineProperty(adsk.core.Materials.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified Material using an index into the collection.
    // index : The index of the material to return where the first item in the collection is 0.
    // Returns the specified material or null if an invalid index is specified.
    adsk.core.Materials.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    // Returns the specified Material using the name as seen in the user interface. This often isn't a reliable way of accessing a specific material because materials are not required to be unique.
    // name : The name of the material to return,.
    // Returns the specified material or null if there isn't a matching name.
    adsk.core.Materials.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    // Returns the Material by it's internal unique ID.
    // id : The ID of the material to return.
    // Returns the specified material or null if there isn't a matching ID.
    adsk.core.Materials.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    // Add a Material to a Design by copying an existing Material from Favorites, a Library or from the Materials stored in the Design. This method currently only applies to the Materials collection from a Design and cannot be used to copy a Material to a library.
    // materialToCopy : The Material you want to copy. The Material to copy can be from Favorites, a Library or from the materials stored in the Design.
    // name : The Material name to apply to the copy.
    // Returns the newly created Material or null if the copy operation failed.
    adsk.core.Materials.prototype.addByCopy = function (materialToCopy, name) {
        if (materialToCopy !== null && !(materialToCopy instanceof adsk.core.Material)) { throw new TypeError('materialToCopy must be a adsk.core.Material'); }
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            materialToCopy : (materialToCopy === null ? materialToCopy : materialToCopy.handle),
            name : name
        };
        var result = this._execute('addByCopy', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Material) : null;
    };

    //=========== Properties ============
    // A collection of properties that are associated with a material or appearance.
    adsk.core.Properties = function Properties(handle) {
        if (!(this instanceof adsk.core.Properties)) {
            return adsk.core.Properties.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Properties.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Properties.prototype.constructor = adsk.core.Properties;
    adsk.core.Properties.classType = function classType () {
        return 'adsk::core::Properties';
    };
    adsk.core.Properties.interfaceId = 'adsk.core.Properties';
    adsk.objectTypes['adsk.core.Properties'] = adsk.core.Properties;
    adsk.core.Properties.cast = function (object) {
        return object instanceof adsk.core.Properties ? object : null;
    };

    // Returns the number of properties within the collection.
    Object.defineProperty(adsk.core.Properties.prototype, 'count', {
        get : function () {
            var result = this._execute('count');
            return result ? result.value : undefined;
        }
    });

    // Returns the specified property from the collection using an index into the collection.
    // index : The index of the property within the collection where the first item is 0.
    // Returns the specified item or null if an invalid index was specified.
    adsk.core.Properties.prototype.item = function (index) {
        if (!isFinite(index)) { throw new TypeError('index must be a number'); }
        var args = {
            index : Number(index)
        };
        var result = this._execute('item', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Property) : null;
    };

    // Returns the specified property from the collection using the unique ID of the property.
    // id : The unique ID of the property.
    // Returns the specified property or null if the ID doesn't match a property within the collection.
    adsk.core.Properties.prototype.itemById = function (id) {
        if (id === undefined || id === null || id.constructor !== String) { throw new TypeError('id must be a string'); }
        var args = {
            id : id
        };
        var result = this._execute('itemById', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Property) : null;
    };

    // Returns the specified Property using the name of the property.
    // name : The name of the property to return. This is the name as seen in the user interface.
    // Returns the specified property or null if the name doesn't match a property within the collection.
    adsk.core.Properties.prototype.itemByName = function (name) {
        if (name === undefined || name === null || name.constructor !== String) { throw new TypeError('name must be a string'); }
        var args = {
            name : name
        };
        var result = this._execute('itemByName', args);
        return (result && result.value) ? adsk.createObject(result.value, adsk.core.Property) : null;
    };

    //=========== Property ============
    // The base class for the specific property types used by materials and appearances.
    adsk.core.Property = function Property(handle) {
        if (!(this instanceof adsk.core.Property)) {
            return adsk.core.Property.cast(handle);
        }
        adsk.core.Base.call(this, handle);
    };
    adsk.core.Property.prototype = Object.create(adsk.core.Base.prototype);
    adsk.core.Property.prototype.constructor = adsk.core.Property;
    adsk.core.Property.classType = function classType () {
        return 'adsk::core::Property';
    };
    adsk.core.Property.interfaceId = 'adsk.core.Property';
    adsk.objectTypes['adsk.core.Property'] = adsk.core.Property;
    adsk.core.Property.cast = function (object) {
        return object instanceof adsk.core.Property ? object : null;
    };

    // Returns the name of this property as seen in the user interface. This name is localized and can change based on the current language
    Object.defineProperty(adsk.core.Property.prototype, 'name', {
        get : function () {
            var result = this._execute('name');
            return result ? result.value : undefined;
        }
    });

    // Indicates if this property is read-only. If True any attempted edits will fail.
    Object.defineProperty(adsk.core.Property.prototype, 'isReadOnly', {
        get : function () {
            var result = this._execute('isReadOnly');
            return result ? result.value : undefined;
        }
    });

    // Returns the unique ID of this property.
    Object.defineProperty(adsk.core.Property.prototype, 'id', {
        get : function () {
            var result = this._execute('id');
            return result ? result.value : undefined;
        }
    });

    // Returns the parent of this property.
    Object.defineProperty(adsk.core.Property.prototype, 'parent', {
        get : function () {
            var result = this._execute('parent');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Base) : null;
        }
    });

    //=========== TextureTypes ============
    // The different types of textures.
    adsk.core.TextureTypes = {
        UnknownTexture : 0,
        ImageTexture : 1,
        CheckerTexture : 2,
        GradientTexture : 3,
        MarbleTexture : 4,
        NoiseTexture : 5,
        SpeckleTexture : 6,
        TileTexture : 7,
        WaveTexture : 8,
        WoodTexture : 9
    };

    //=========== AppearanceTextureProperty ============
    // A texture value property associated with a material or appearance.
    adsk.core.AppearanceTextureProperty = function AppearanceTextureProperty(handle) {
        if (!(this instanceof adsk.core.AppearanceTextureProperty)) {
            return adsk.core.AppearanceTextureProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.AppearanceTextureProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.AppearanceTextureProperty.prototype.constructor = adsk.core.AppearanceTextureProperty;
    adsk.core.AppearanceTextureProperty.classType = function classType () {
        return 'adsk::core::AppearanceTextureProperty';
    };
    adsk.core.AppearanceTextureProperty.interfaceId = 'adsk.core.AppearanceTextureProperty';
    adsk.objectTypes['adsk.core.AppearanceTextureProperty'] = adsk.core.AppearanceTextureProperty;
    adsk.core.AppearanceTextureProperty.cast = function (object) {
        return object instanceof adsk.core.AppearanceTextureProperty ? object : null;
    };

    // Gets and sets this property value.
    Object.defineProperty(adsk.core.AppearanceTextureProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.AppearanceTexture) : null;
        },
        set : function (value) {
            if (value !== null && !(value instanceof adsk.core.AppearanceTexture)) { throw new TypeError('value must be a adsk.core.AppearanceTexture'); }
            var args = {
                value : value
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    // Specifies if this AppearanceTexture is being used. This is the equivalent of the check box in the Appearance dialog to enable the use of a text for an appearance or not. if this is False, then the value property should not be used because there isn't an associated. AppearanceTexture.
    Object.defineProperty(adsk.core.AppearanceTextureProperty.prototype, 'isUsed', {
        get : function () {
            var result = this._execute('isUsed');
            return result ? result.value : undefined;
        }
    });

    //=========== BooleanProperty ============
    // A material or appearance property that is a Boolean value.
    adsk.core.BooleanProperty = function BooleanProperty(handle) {
        if (!(this instanceof adsk.core.BooleanProperty)) {
            return adsk.core.BooleanProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.BooleanProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.BooleanProperty.prototype.constructor = adsk.core.BooleanProperty;
    adsk.core.BooleanProperty.classType = function classType () {
        return 'adsk::core::BooleanProperty';
    };
    adsk.core.BooleanProperty.interfaceId = 'adsk.core.BooleanProperty';
    adsk.objectTypes['adsk.core.BooleanProperty'] = adsk.core.BooleanProperty;
    adsk.core.BooleanProperty.cast = function (object) {
        return object instanceof adsk.core.BooleanProperty ? object : null;
    };

    // Gets and sets the value of this property.
    Object.defineProperty(adsk.core.BooleanProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (typeof value !== 'boolean') { throw new TypeError('value must be a boolean'); }
            var args = {
                value : value
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    //=========== ChoiceProperty ============
    // A material or appearance property that is a pre-defined list of choices.
    adsk.core.ChoiceProperty = function ChoiceProperty(handle) {
        if (!(this instanceof adsk.core.ChoiceProperty)) {
            return adsk.core.ChoiceProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.ChoiceProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.ChoiceProperty.prototype.constructor = adsk.core.ChoiceProperty;
    adsk.core.ChoiceProperty.classType = function classType () {
        return 'adsk::core::ChoiceProperty';
    };
    adsk.core.ChoiceProperty.interfaceId = 'adsk.core.ChoiceProperty';
    adsk.objectTypes['adsk.core.ChoiceProperty'] = adsk.core.ChoiceProperty;
    adsk.core.ChoiceProperty.cast = function (object) {
        return object instanceof adsk.core.ChoiceProperty ? object : null;
    };

    // Gets and sets the which choice is selected from the set of choices. The value is a string that matches one of the pre-defined choices. The names of the available choices can be obtained using GetChoices method.
    Object.defineProperty(adsk.core.ChoiceProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    // Method that returns the list of available choices.
    // names : An array of the names of the choices. These coincide with the array of choices returned by the choices argument.
    // choices : An array of the choices. These coincide with the array of names returned by the names argument.
    // Returns true if the call was successful.
    adsk.core.ChoiceProperty.prototype.getChoices = function (names, choices) {
        if (typeof names !== 'object') { throw new TypeError('names must be an object'); }
        if (typeof choices !== 'object') { throw new TypeError('choices must be an object'); }
        var args = {
            names : null,
            choices : null
        };
        var result = this._execute('getChoices', args);
        if (result && result.outargs) {
            if (Array.isArray(result.outargs.names)) {
                var namesIter;
                names.value = [];
                for (namesIter = 0; namesIter < result.outargs.names.length; ++namesIter) {
                    names.value[namesIter] = (result.outargs.names[namesIter] !== undefined) ? result.outargs.names[namesIter] : undefined;
                }
            }
            if (Array.isArray(result.outargs.choices)) {
                var choicesIter;
                choices.value = [];
                for (choicesIter = 0; choicesIter < result.outargs.choices.length; ++choicesIter) {
                    choices.value[choicesIter] = (result.outargs.choices[choicesIter] !== undefined) ? result.outargs.choices[choicesIter] : undefined;
                }
            }
        }
        return result ? result.value : undefined;
    };

    //=========== ColorProperty ============
    // A color property associated with an appearance.
    adsk.core.ColorProperty = function ColorProperty(handle) {
        if (!(this instanceof adsk.core.ColorProperty)) {
            return adsk.core.ColorProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.ColorProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.ColorProperty.prototype.constructor = adsk.core.ColorProperty;
    adsk.core.ColorProperty.classType = function classType () {
        return 'adsk::core::ColorProperty';
    };
    adsk.core.ColorProperty.interfaceId = 'adsk.core.ColorProperty';
    adsk.objectTypes['adsk.core.ColorProperty'] = adsk.core.ColorProperty;
    adsk.core.ColorProperty.cast = function (object) {
        return object instanceof adsk.core.ColorProperty ? object : null;
    };

    // Gets the associated texture, if one exists. The HasConnectedTexture property controls if there is an associated texture or not. If the parent is writable you can edit the texture. If no texture exists, this property will return null.
    Object.defineProperty(adsk.core.ColorProperty.prototype, 'connectedTexture', {
        get : function () {
            var result = this._execute('connectedTexture');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.AppearanceTexture) : null;
        }
    });

    // Specifies if this color is specified using a simple color or a texture. If this returns true the color is defined using a texture. If the parent is writable, this property can be set to true to change the definition from a simple color to a texture. You can then use the ConnectedTexture property to get the associated texture and modify it.
    Object.defineProperty(adsk.core.ColorProperty.prototype, 'hasConnectedTexture', {
        get : function () {
            var result = this._execute('hasConnectedTexture');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (typeof value !== 'boolean') { throw new TypeError('value must be a boolean'); }
            var args = {
                value : value
            };
            var result = this._execute('hasConnectedTexture', args);
            return result ? result.value : undefined;
        }
    });

    // Indicates if this property has multiple values or not.
    Object.defineProperty(adsk.core.ColorProperty.prototype, 'hasMultipleValues', {
        get : function () {
            var result = this._execute('hasMultipleValues');
            return result ? result.value : undefined;
        }
    });

    // Gets and sets this property value if there is a color and not a texture defining this color . If a texture is used, this property returns null. Setting this property when a texture is used removes the texture and changes the color definition to a simple color.
    Object.defineProperty(adsk.core.ColorProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.Color) : null;
        },
        set : function (value) {
            if (value !== null && !(value instanceof adsk.core.Color)) { throw new TypeError('value must be a adsk.core.Color'); }
            var args = {
                value : value
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the values associated with this property. The HasMultipleValues property indicates if this property will be returning more than one value.
    Object.defineProperty(adsk.core.ColorProperty.prototype, 'values', {
        get : function () {
            var result = this._execute('values');
            if (!result || !Array.isArray(result.value)) {
                return undefined
            }
            var resultIter;
            var resultValue = [];
            for (resultIter = 0; resultIter < result.value.length; ++resultIter) {
                resultValue[resultIter] = (result.value[resultIter] !== undefined) ? adsk.createObject(result.value[resultIter], adsk.core.Color) : null;
            }
            return resultValue
        },
        set : function (value) {
            if (!Array.isArray(value)) { throw new TypeError('value must be an array'); }
            var valueLength = value.length;
            var valueIt;
            for (valueIt = 0; valueIt < valueLength; ++valueIt) {
                if (value[valueIt] !== null && !(value[valueIt] instanceof adsk.core.Color)) { throw new TypeError('value[valueIt] must be a adsk.core.Color'); }
            }
            var args = {
                value : value
            };
            var result = this._execute('values', args);
            return result ? result.value : undefined;
        }
    });

    //=========== FilenameProperty ============
    // A file name property associated with an appearance.
    adsk.core.FilenameProperty = function FilenameProperty(handle) {
        if (!(this instanceof adsk.core.FilenameProperty)) {
            return adsk.core.FilenameProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.FilenameProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.FilenameProperty.prototype.constructor = adsk.core.FilenameProperty;
    adsk.core.FilenameProperty.classType = function classType () {
        return 'adsk::core::FilenameProperty';
    };
    adsk.core.FilenameProperty.interfaceId = 'adsk.core.FilenameProperty';
    adsk.objectTypes['adsk.core.FilenameProperty'] = adsk.core.FilenameProperty;
    adsk.core.FilenameProperty.cast = function (object) {
        return object instanceof adsk.core.FilenameProperty ? object : null;
    };

    // Gets the boolean flag that indicates if this property has multiple values or not.
    Object.defineProperty(adsk.core.FilenameProperty.prototype, 'hasMultipleValues', {
        get : function () {
            var result = this._execute('hasMultipleValues');
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the value of this property.
    Object.defineProperty(adsk.core.FilenameProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the values associated with this property. HasMultipleValues property indicates if this property will be returning more than one value.
    Object.defineProperty(adsk.core.FilenameProperty.prototype, 'values', {
        get : function () {
            var result = this._execute('values');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (!Array.isArray(value)) { throw new TypeError('value must be an array'); }
            var valueLength = value.length;
            var valueIt;
            for (valueIt = 0; valueIt < valueLength; ++valueIt) {
                if (value[valueIt] === undefined || value[valueIt] === null || value[valueIt].constructor !== String) { throw new TypeError('value[valueIt] must be a string'); }
            }
            var args = {
                value : value
            };
            var result = this._execute('values', args);
            return result ? result.value : undefined;
        }
    });

    //=========== FloatProperty ============
    // A float or real value property associated with a material or appearance.
    adsk.core.FloatProperty = function FloatProperty(handle) {
        if (!(this instanceof adsk.core.FloatProperty)) {
            return adsk.core.FloatProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.FloatProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.FloatProperty.prototype.constructor = adsk.core.FloatProperty;
    adsk.core.FloatProperty.classType = function classType () {
        return 'adsk::core::FloatProperty';
    };
    adsk.core.FloatProperty.interfaceId = 'adsk.core.FloatProperty';
    adsk.objectTypes['adsk.core.FloatProperty'] = adsk.core.FloatProperty;
    adsk.core.FloatProperty.cast = function (object) {
        return object instanceof adsk.core.FloatProperty ? object : null;
    };

    // Gets and sets the boolean flag that indicates if the float value has been overridden using a texture. Setting this property to False will remove the texture so that a float value is used. Setting this property to True will connect a texture to this float value.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'hasConnectedTexture', {
        get : function () {
            var result = this._execute('hasConnectedTexture');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (typeof value !== 'boolean') { throw new TypeError('value must be a boolean'); }
            var args = {
                value : value
            };
            var result = this._execute('hasConnectedTexture', args);
            return result ? result.value : undefined;
        }
    });

    // Gets the associated texture, if one exists. The HasConnectedTexture property controls if there is an associated texture or not. If it's parent writable you can edit the texture. If no texture exists, this property will return Nothing.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'connectedTexture', {
        get : function () {
            var result = this._execute('connectedTexture');
            return (result && result.value) ? adsk.createObject(result.value, adsk.core.AppearanceTexture) : null;
        }
    });

    // Gets the boolean flag that indicates if the value of this property has any limits it must be within to be valid. If True, use the GetLimits method to get the limit values.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'hasLimits', {
        get : function () {
            var result = this._execute('hasLimits');
            return result ? result.value : undefined;
        }
    });

    // Gets the boolean flag that indicates if this property has multiple values or not.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'hasMultipleValues', {
        get : function () {
            var result = this._execute('hasMultipleValues');
            return result ? result.value : undefined;
        }
    });

    // Gets the boolean flag that indicates that this property represents a percentage value so the valid values must be in the range of 0.0 to 1.0 unless they’re further limited by additional limits which can be determined with the HasLimits property.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'isPercentage', {
        get : function () {
            var result = this._execute('isPercentage');
            return result ? result.value : undefined;
        }
    });

    // Gets the units that the value of this property is returned in. The String returned is a valid Fusion unit string.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'units', {
        get : function () {
            var result = this._execute('units');
            return result ? result.value : undefined;
        }
    });

    // Gets and sets this property value. The value of this property should be ignored if the HasConnectedTexture property is true. Setting this will remove any associated texture, if there is one.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (!isFinite(value)) { throw new TypeError('value must be a number'); }
            var args = {
                value : Number(value)
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the values associated with this property. HasMultipleValues property indicates if this property will be returning more than one value.
    Object.defineProperty(adsk.core.FloatProperty.prototype, 'values', {
        get : function () {
            var result = this._execute('values');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (!Array.isArray(value)) { throw new TypeError('value must be an array'); }
            var valueLength = value.length;
            var valueIt;
            for (valueIt = 0; valueIt < valueLength; ++valueIt) {
                if (!isFinite(value[valueIt])) { throw new TypeError('value[valueIt] must be a number'); }
            }
            var args = {
                value : value
            };
            var result = this._execute('values', args);
            return result ? result.value : undefined;
        }
    });

    // Method that returns any limits for the value of this property. The HasLimits property can be used to see if there are any limits or not.
    // hasLowLimit : Output Boolean that indicates if there is a low limit or not.
    // lowLimit : If the hasLowLimit argument is true, this argument returns the low limit.
    // hasHighLimit : Output Boolean that indicates if there is a high limit or not.
    // highLimit : If the hasHighLimit argument is true, this argument returns the high limit.
    // Returns true if the method call was successful.
    adsk.core.FloatProperty.prototype.getLimits = function (hasLowLimit, lowLimit, hasHighLimit, highLimit) {
        if (typeof hasLowLimit !== 'object') { throw new TypeError('hasLowLimit must be an object'); }
        if (typeof lowLimit !== 'object') { throw new TypeError('lowLimit must be an object'); }
        if (typeof hasHighLimit !== 'object') { throw new TypeError('hasHighLimit must be an object'); }
        if (typeof highLimit !== 'object') { throw new TypeError('highLimit must be an object'); }
        var args = {
            hasLowLimit : null,
            lowLimit : null,
            hasHighLimit : null,
            highLimit : null
        };
        var result = this._execute('getLimits', args);
        if (result && result.outargs) {
            hasLowLimit.value = (result.outargs.hasLowLimit !== undefined) ? result.outargs.hasLowLimit : undefined;
            lowLimit.value = (result.outargs.lowLimit !== undefined) ? result.outargs.lowLimit : undefined;
            hasHighLimit.value = (result.outargs.hasHighLimit !== undefined) ? result.outargs.hasHighLimit : undefined;
            highLimit.value = (result.outargs.highLimit !== undefined) ? result.outargs.highLimit : undefined;
        }
        return result ? result.value : undefined;
    };

    //=========== IntegerProperty ============
    // An integer value property associated with a material or appearance.
    adsk.core.IntegerProperty = function IntegerProperty(handle) {
        if (!(this instanceof adsk.core.IntegerProperty)) {
            return adsk.core.IntegerProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.IntegerProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.IntegerProperty.prototype.constructor = adsk.core.IntegerProperty;
    adsk.core.IntegerProperty.classType = function classType () {
        return 'adsk::core::IntegerProperty';
    };
    adsk.core.IntegerProperty.interfaceId = 'adsk.core.IntegerProperty';
    adsk.objectTypes['adsk.core.IntegerProperty'] = adsk.core.IntegerProperty;
    adsk.core.IntegerProperty.cast = function (object) {
        return object instanceof adsk.core.IntegerProperty ? object : null;
    };

    // Gets the boolean flag that indicates if the value of this property has any limits it must be within to be valid. If True, use the GetLimits method to get the limit values.
    Object.defineProperty(adsk.core.IntegerProperty.prototype, 'hasLimits', {
        get : function () {
            var result = this._execute('hasLimits');
            return result ? result.value : undefined;
        }
    });

    // Gets the boolean flag that indicates if this property has multiple values or not.
    Object.defineProperty(adsk.core.IntegerProperty.prototype, 'hasMultipleValues', {
        get : function () {
            var result = this._execute('hasMultipleValues');
            return result ? result.value : undefined;
        }
    });

    // Gets and sets this property value. The value of this property should be ignored if the HasConnectedTexture property is true. Setting this will remove any associated texture, if there is one.
    Object.defineProperty(adsk.core.IntegerProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (!isFinite(value)) { throw new TypeError('value must be a number'); }
            var args = {
                value : Number(value)
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    // Gets and sets the values associated with this property. HasMultipleValues property indicates if this property will be returning more than one value.
    Object.defineProperty(adsk.core.IntegerProperty.prototype, 'values', {
        get : function () {
            var result = this._execute('values');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (!Array.isArray(value)) { throw new TypeError('value must be an array'); }
            var valueLength = value.length;
            var valueIt;
            for (valueIt = 0; valueIt < valueLength; ++valueIt) {
                if (!isFinite(value[valueIt])) { throw new TypeError('value[valueIt] must be a number'); }
            }
            var args = {
                value : value
            };
            var result = this._execute('values', args);
            return result ? result.value : undefined;
        }
    });

    // Method that returns any limits for the value of this property. The HasLimits property can be used to see if there are any limits or not.
    // hasLowLimit : Output Boolean that indicates if there is a low limit or not.
    // lowLimit : If the hasLowLimit argument is true, this argument returns the low limit.
    // hasHighLimit : Output Boolean that indicates if there is a high limit or not.
    // highLimit : If the hasHighLimit argument is true, this argument returns the high limit.
    // Returns true if the method call was successful.
    adsk.core.IntegerProperty.prototype.getLimits = function (hasLowLimit, lowLimit, hasHighLimit, highLimit) {
        if (typeof hasLowLimit !== 'object') { throw new TypeError('hasLowLimit must be an object'); }
        if (typeof lowLimit !== 'object') { throw new TypeError('lowLimit must be an object'); }
        if (typeof hasHighLimit !== 'object') { throw new TypeError('hasHighLimit must be an object'); }
        if (typeof highLimit !== 'object') { throw new TypeError('highLimit must be an object'); }
        var args = {
            hasLowLimit : null,
            lowLimit : null,
            hasHighLimit : null,
            highLimit : null
        };
        var result = this._execute('getLimits', args);
        if (result && result.outargs) {
            hasLowLimit.value = (result.outargs.hasLowLimit !== undefined) ? result.outargs.hasLowLimit : undefined;
            lowLimit.value = (result.outargs.lowLimit !== undefined) ? result.outargs.lowLimit : undefined;
            hasHighLimit.value = (result.outargs.hasHighLimit !== undefined) ? result.outargs.hasHighLimit : undefined;
            highLimit.value = (result.outargs.highLimit !== undefined) ? result.outargs.highLimit : undefined;
        }
        return result ? result.value : undefined;
    };

    //=========== StringProperty ============
    // A string value property associated with a material or appearance.
    adsk.core.StringProperty = function StringProperty(handle) {
        if (!(this instanceof adsk.core.StringProperty)) {
            return adsk.core.StringProperty.cast(handle);
        }
        adsk.core.Property.call(this, handle);
    };
    adsk.core.StringProperty.prototype = Object.create(adsk.core.Property.prototype);
    adsk.core.StringProperty.prototype.constructor = adsk.core.StringProperty;
    adsk.core.StringProperty.classType = function classType () {
        return 'adsk::core::StringProperty';
    };
    adsk.core.StringProperty.interfaceId = 'adsk.core.StringProperty';
    adsk.objectTypes['adsk.core.StringProperty'] = adsk.core.StringProperty;
    adsk.core.StringProperty.cast = function (object) {
        return object instanceof adsk.core.StringProperty ? object : null;
    };

    // Gets and sets the property value.
    Object.defineProperty(adsk.core.StringProperty.prototype, 'value', {
        get : function () {
            var result = this._execute('value');
            return result ? result.value : undefined;
        },
        set : function (value) {
            if (value === undefined || value === null || value.constructor !== String) { throw new TypeError('value must be a string'); }
            var args = {
                value : value
            };
            var result = this._execute('value', args);
            return result ? result.value : undefined;
        }
    });

    return adsk;
}));