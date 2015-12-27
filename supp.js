module.exports = {
  var pg = require('pg');
  var Promise = require('promise');

  function Database (databaseName, host) {
    this.host = host || 'postgres://@localhost/';
    this.databaseName = databaseName || 'database';
    this.conString = this.host + this.databaseName;
  }

  Database.prototype.generateIdentifierArray = function (columns) {
    var identifierArray = [];
    for(var i = 1; i <= columns.length; i++) {
      identifierArray.push('$' + String(i));
    }
    return identifierArray;
  }

  Database.prototype.connect = function (queryString, values) {
    var conString = this.conString;
    return new Promise(function (resolve, reject) {
      pg.connect(conString, function (err, client, done) {
        if (err) {
          return console.error('error fetching client from pool', err);
        }
        console.log('connected to database');
        client.query(queryString, values, function (err, result) {
          done();
          if (err) {
            reject (err);
          } else {
            resolve (result);
          }
          client.end();
        }); 
      });
    });
  }

  Database.prototype.getAll = function (table) {
    var queryString = String('SELECT * FROM ' + table);
    
    return this.connect(queryString);
  }

  Database.prototype.getSpecific = function (table, condition) {
    var queryString = String('SELECT * FROM ' + table + ' WHERE ' + condition);
    
    return this.connect(queryString);
  }

  Database.prototype.getColumn = function (table, column) {
    var queryString = String('SELECT DISTINCT ' + column + ' FROM ' + table);

    return this.connect(queryString);
  }

  Database.prototype.insert = function (table, columns, values, returnValue) {
    this.returnValue = returnValue || '*';
    var queryString = String('INSERT INTO ' + table + '(' + columns.toString() + ') VALUES(' + this.generateIdentifierArray(columns).toString() + ') RETURNING ' + this.returnValue);

    return this.connect(queryString, values);
  }

  Database.prototype.update = function (table, columns, newValues, condition) {
    var modifiedIdentifierArray = [];
    var identifierArray = this.generateIdentifierArray(columns);
    for(var i = 0; i < columns.length; i++) {
      if(i == columns.length - 1) {
        modifiedIdentifierArray += String(columns[i] + ' = ' + identifierArray[i] + ' ');
      } else {
        modifiedIdentifierArray += String(columns[i] + ' = ' + identifierArray[i] + ', ');      
      }
    }
    var queryString = String('UPDATE ' + table + ' SET ' + modifiedIdentifierArray.toString() + 'WHERE ' + condition);

    return this.connect(queryString, newValues)
  }

  Database.prototype.deleteSpecific = function (table, condition) {
    var queryString = String('DELETE FROM ' + table + ' WHERE ' + condition + ' RETURNING *');

    return this.connect(queryString);
  }

  Database.prototype.deleteAll = function (table) {
    var queryString = String('DELETE FROM ' + table + ' RETURNING *');

    return this.connect(queryString);
  }
}