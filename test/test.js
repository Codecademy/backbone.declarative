$(function () {

  var model, collection, view;
  module('Backbone.declarative', {
    setup: function () {
      model = new Backbone.Model({
        foo: ''
      });
      
      collection = new Backbone.Collection({
        model: Backbone.Model
      });
      collection.add(model);

      view = new Backbone.View({
        model: model
      , collection: collection
      });
    }
  });

  test('View: bindModelEvents', function () {
    var count = 0;
    view.bindModelEvents({
      'change:foo': function (m, v, options) {
          var changed = m.changedAttributes();
          equal(this, view);
          equal(m, model);
          equal(v, 'bar');
          deepEqual(changed, {foo: 'bar'});
          count++;
        }
      , 'change': function () {
          count++;
        }
      , 'fooEvent': function () {
          count++;
        }
    });

    model.set('foo', 'bar');
    model.trigger('fooEvent');
    equal(count, 3);
  });

  test('View: unbindModelEvents', function () {
    var count = 0;
    view.bindModelEvents({
      'fooEvent': function () {
        count++;
      }
    })
    model.trigger('fooEvent')

    view.unbindModelEvents();
    model.trigger('fooEvent');

    equal(count, 1);
  });

  test('View: bindCollectionEvents', function () {
    var count = 0;
    view.bindCollectionEvents({
      'change:foo': function (m, v, options) {
          var changed = m.changedAttributes();
          equal(this, view);
          equal(m, model);
          equal(v, 'bar');
          deepEqual(changed, {foo: 'bar'});
          count++;
        }
      , 'change': function () {
          count++;
        }
      , 'fooEvent': function () {
          count++;
        }
    });

    model.set('foo', 'bar');
    model.trigger('fooEvent');
    collection.trigger('fooEvent');
    equal(count, 4);
  });

  test('View: unbindModelEvents', function () {
    var count = 0;
    view.bindCollectionEvents({
      'fooEvent': function () {
        count++;
      }
    })
    collection.trigger('fooEvent')

    view.unbindCollectionEvents();
    model.trigger('fooEvent');

    equal(count, 1);
  });

  test('Use in declarative format', function () {
    var ThrowerView = Backbone.View.extend({
      collectionEvents: {
        'change:foo': 'onFooChange'
      }
    , modelEvents: {
        'change:foo': 'onFooChange'
      }
    });

    raises(function () {
      new ThrowerView();
    });

    raises(function () {
      new ThrowerView({
        model: model
      });
    });
    
    raises(function () {
      new ThrowerView({
        model: model
      , collection: collection
      })
    });

    var count = 0;
    var SomeView = Backbone.View.extend({
      collectionEvents: {
        'change:foo': 'onFooChange'
      }
    , modelEvents: {
        'change:foo': 'onFooChange'
      }

    , onFooChange: function () {
        count++;
      }
    });

    new SomeView({
      model: model
    , collection: collection
    })
    model.set('foo', 'bar');
    equal(count, 2);
  });

});
