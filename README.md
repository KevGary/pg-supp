### current methods
```
your_db.getAll(table) - gets all rows and columns from provided table
your_db.getSpecific(table, condition) - gets all rows and columns from provided table where the specified condition is met
your_db.getColumn(table, column) - gets all rows from provided table within given column
your_db.insert(table, columns, values, returnValue) - inserts to provided table with given columns and values.  returnValue is optional, will return all if none is given (can be ignored for general usage)
your_db.update(table, columns, newValues, condition) - updates provided table at specified columns with given newValues at points that meet condition
your_db.deleteAll(table) - deletes all rows and columns from provided table
your_db.deleteSpecific(table, condition) - deletes all rows and columns from provided table where the specificed condition is met
```

### methods coming soon
```
orderBy
createDatabase
createTable
createJoinTable
```

## Usage
Install using:
```
npm install pg-supp [args]
```
Require the pg and pg-supp module as follows:
```
var pg = require('pg');
var pgs = require('pg-supp');
```
Host must already be established and database must already be created.  Instantiate your database with pg-supp by invoking constructor function:
```
var yourDBVariable = new pgs('your_db_name', 'your_host');
OR
var yourDBVariable = new pgs('your_db_name');
```
If host is not provided it will default to 'postgres://@localhost/'.
You can provide username/password with the host if needed:
```
var yourDBVariable = new pgs('your_db_name', 'postgres://username:password@localhost/database')
```
Multiple databases with different or same hosts can be established and used in this way:
```
var yourFirstDBVariable = new pgs('db_name', 'host');
var yourSecondDBVariable = new pgs('other_db_name', 'other_host');
var yourThirdDBVariable = new pgs('db_name', 'host')
```

Now, all your DBVariables have access to all methods pg-supp exposes and will act on corresponding databases/hosts.

All pg-supp methods return promises.  Users might need to require the promise module or an alternative for particular use cases.

### Examples
Bear in mind all .then(...) functionality is from the promise npm and isn't required to use.  Each of the following examples can be implemented with each pg-supp method.

For all examples I will use the table 'users' with the columns 'name' and 'age', and an id that is a serial primary key.

Without .then:
```
yourDBVariable.insert('users', ['name', 'age'], ['richard', 35]);
yourDBVariable.deleteSpecific('users', 'name = richard');
```
With .then:
```
yourDBVariable.getSpecific('users', 'name = richard AND age = 35')
  .then(function (repsonse) {
    //promise code goes here
    //simple example below
    console.log(reponse);
    return response;
  });
```
Inside of an express app:
```
var express = require('express');
var router = express.Router();

var pg = require('pg');
var pgs = require('pgs');

var myDB = new pgs('db_name');

router.get('/api/users', function(req, res, next) {
  myDb.getAll('users')
    .then(function (response) {
      res.send(response);
      return;
    });
}
```





