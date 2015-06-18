var fs = require('fs');
var moment = require('moment');

var csv = fs.readFileSync(__dirname+'/spam.csv', 'utf8');

var lines = csv.split('\n');
var columns = lines[0].split(',');
lines.shift();

var langs = {};
var users = {};
var dates = {};
var months = {};
var years = {};
var editors = {};

for(var i = 0; i < lines.length; i++){
  var cells = lines[i].split(',');
  if(cells.length !== 7) continue;
  var item = {};
  for(var k = 0; k < columns.length; k++){
    item[columns[k]] = cells[k];
  }
  var date = moment(new Date(item.time)).format('YYYY-MM-DD');
  var month = moment(new Date(item.time)).format('YYYY-MM');
  var year = moment(new Date(item.time)).format('YYYY');
  increment(langs, item.language, 1);
  increment(users, item.user, 1);
  increment(dates, date, 1);
  increment(months, month, 1);
  increment(years, year, 1);
  increment(editors, item.editor, 1);
}
var data = {
  languages: langs,
  users: users,
  dates: dates,
  months: months,
  years: years,
  editors: editors
};

console.log(JSON.stringify(dataToArrays(data)));

function increment(items, key, val){
  if(!items[key]) items[key] = 0;
  items[key] += val;
}

function dataToArrays(data){
  return Object.keys(data).map(function(column){
    return {
      name: column,
      data: Object.keys(data[column]).map(function(cell){
        var item = {};
        item.x = cell;
        item.y = data[column][cell];
        return item;
      }).sort(function(a,b){
        return a.y - b.y;
      })
    };
  });
}