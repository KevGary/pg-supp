var pg = require('pg');
var conString = 'postgres://@localhost/supp';

var supp = {
  insert: function(table, columns, values) {
    var bangArray = this.generateBangArray(values);
    var queryString = String('INSERT INTO ' + String(table) + '(' + columns.toString() + ') VALUES('+ bangArray.toString() + ') returning id');
    this.connect(queryString, values);
  },

  selectAll: function(table) {
    var queryString = String('SELECT * FROM ' + String(table));
    this.connect(queryString);
  },

  selectOne: function(table, condition) {
    var queryString = String('SELECT * FROM ' + String(table) + ' WHERE ' + String(condition));
    this.connect(queryString);
  },

  update: function(table, columns, newValues, condition) {
    var columnAssignmentArray = [];
    for(var i = 0; i < columns.length; i++){
      if(i < columns.length-1){
        columnAssignmentArray.push('' + String(columns[i]) + ' = $' + String(i+1) + ',');
      }else{
        columnAssignmentArray.push(String(columns[i]) + ' = $' + String(i+1));        
      }
    }
    console.log(columnAssignmentArray.join(' '));
    var bangArray = this.generateBangArray(newValues)
    var queryString = String('UPDATE ' + String(table) + ' SET ' + String(columnAssignmentArray.join(' ')) + ' WHERE ' + String(condition));
    console.log(queryString)
    this.connect(queryString, newValues);
  },

  deleteAll: function(table) {
    var queryString = String('DELETE FROM ' + String(table));
    this.connect(queryString);
  },

  deleteOne: function(table, condition) {
    var queryString = String('DELETE FROM ' + String(table) + ' WHERE ' + String(condition));
    this.connect(queryString);
  },

  generateBangArray: function(values) {
    //build bangArray e.g. ($1, $2, $3...)
    var bangArray = [];
    if(typeof values == 'object'){
      for(var i = 1; i < values.length+1; i++){
        bangArray.push('$' + String(i));
      }
    }
    return bangArray;
  },
  
  connect: function(queryString, values) {
    this.values = [] || values;
    pg.connect(conString, function(err, client, done) {
      if (err) {
        return console.error('error fetching client from pool', err);
      }
      //pg connect success
      console.log('connected to database');

      client.query(queryString, values, function(err, result) {
        done();
        if (err) {
          return console.error('error running query', err);
        }
        console.log(result);
      }); 
    })
  } 
}

module.exports = supp;

//some example calls
// obj.deleteAll('movies')
// obj.deleteOne('movies', 'id = 11');
// obj.insert('movies', ['title', 'genre', 'year'], ['The Godfather', 'Drama', '1970']);
// obj.selectAll('movies', 'id = 13');
// obj.update('movies', ['title', 'genre', 'year'], ['The Godfather', 'Crime, Drama', '1972'], 'id = 14');
// obj.update('movies', ['title', 'genre', 'year'], ['The Godfather', 'Crime, Drama', '1972', 14], 'id = $4');
// obj.deleteOne('movies', 'id=12');