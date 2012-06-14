(function (global) {
  var Backbone = global.Backbone
    , _ = global._;

  if (!_) {
    _ = typeof require !== 'undefined' && require('underscore');
    if (!_) throw new Error('Can\'t find underscore');
  }

  if (!Backbone) {
    Backbone = typeof require !== 'undefined' && require('backbone');
    if (!Backbone) throw new Error('Can\'t find Backbone');
  }

  // Helper function to get a value from a Backbone object as a property
  // or as a function.
  var getValue = function(object, prop) {
    if (!(object && object[prop])) return null;
    return _.isFunction(object[prop]) ? object[prop]() : object[prop];
  };

  var _View = Backbone.View
    , modelEventSplitter = /^(\S+)\s*(.*)$/
    , viewMethods = {
        model: {}
      , collection: {}
      };

  Backbone.View = _View.extend({
    constructor: function () {
      _View.apply(this, Array.prototype.slice.call(arguments));
      this.bindModelEvents();
    }

  , _bindDeclarativeEvents: function (prop, events) {
      var methods = (viewMethods[prop][this.cid] || (viewMethods[prop][this.cid] = []));
      for (var eventName in events) {
        var method = events[eventName];
        if (!_.isFunction(method)) method = this[events[eventName]];
        if (!method) throw new Error('Method "' + events[eventName] + '" does not exist');
        methods.push(method);
        this[prop].on(eventName, method, this);
      }
    }

  , _unbindDeclarativeEvents: function (prop) {
      var methods = viewMethods[prop][this.cid];
      if (!methods) return;
      while (method = methods.pop()) this[prop].off(null, method, this);
      delete viewMethods[prop][this.cid];
    }

  , bindModelEvents: function (modelEvents) {
      if (!(modelEvents || (modelEvents = getValue(this, 'modelEvents')))) return;
      if (!this.model) throw new Erorr('View model does not exist');
      this.unBindModelEvents();
      this.bindDeclarativeEvents('model', modelEvents);
    }

  , unBindModelEvents: function () {
      this._unbindDeclarativeEvents('model')
    }

  , bindCollectionEvents: function (collectionEvents) {
      if (!(collectionEvents || (collectionEvents = getValue(this, 'collectionEvents')))) return;
      if (!this.collection) throw new Erorr('View collection does not exist'); 
      this.unBindCollectionEvents();
      this.bindDeclerativeEvents('collection', collectionEvents);
    }
    
  , unBindCollectionEvents: function () {
      this._unbindDeclarativeEvents('collection');
    }
  });

})(this);