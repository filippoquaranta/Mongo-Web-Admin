var db = 
{
  __context: function(type, context)
  {
    if (type == 'new') { db.__clear(); return }
    if (type != 'database') { return; }
    db.__clear();
    if (context.collections == null) { return; }
    for(var i = 0; i < context.collections.length; ++i)
    {
      db[context.collections[i]] = new collection(context.collections[i]);
    }
  },
  __clear: function()
  {
    for(var property in db)
    {
      if (typeof db[property] == 'object') { delete db[property]; }
    }
  },
};

context.register(db.__context)

function collection(name)
{
  this._name = name;
  this.find = function(selector, fields)
  {
    return new mongo_find(selector, fields, this);
  };
  this.count = function(selector)
  {
    return new mongo_count(selector, this);
  };
  this.info = function()
  {
    return new mongo_info(this);
  }
};

function mongo_find(selector, fields, collection)
{
  this._selector = selector;
  this._fields = fields;
  this._collection = collection;
  
  this.limit = function(limit)
  {
    this._limit = limit;
    return this;
  };
  
  this.mongo_serialize = function()
  {
    return {endpoint: 'collections', command: 'find', collection: this._collection._name, selector: this._selector, fields: this._fields, limit: this._limit};
  };
  
  this.response = function(r)
  {
    
  };
};

function mongo_count(selector, collection)
{
  this._selector = selector;
  this._collection = collection;

  this.mongo_serialize = function()
  {
    return {endpoint: 'collections', command: 'count', collection: this._collection._name, selector: this._selector};
  };

  this.response = function(r, command)
  {
    var document = r.count == 1 ? ' document' : ' documents';
    return r.count + document + ' in ' + this._collection._name;
  };
};

function mongo_info(collection)
{
  this._collection = collection;
  this.mongo_serialize = function()
  {
    return {endpoint: 'collections', command: 'info', collection: this._collection._name};
  };

  this.response = function(r)
  {

  };  
}
