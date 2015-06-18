var osmium = require('osmium');
var sentiment = require('sentiment');
var LanguageDetect = require('languagedetect');
var fs = require('fs');

var language = new LanguageDetect();
var file = new osmium.File(__dirname+'/changesets/changesets-latest.osm.bz2');
var reader = new osmium.Reader(file);

var handler = new osmium.Handler();

var words = fs.readFileSync(__dirname+'/curses.txt', 'utf8').split('\n')
var additions = {};
words.forEach(function(word){
  additions[word] = -6;
});

var header = ''
header += 'id,'
header += 'time,'
header += 'user,'
header += 'language,'
header += 'score,'
header += 'comment,'
header += 'editor'
console.log(header)

handler.on('changeset', function(changeset) {
  var tags = changeset.tags();
  if(tags.comment) {
    var lang = '';
    var commentLanguage = language.detect(tags.comment, 1)[0];
    if(commentLanguage) lang = commentLanguage[0];
    if(lang || lang === 'english'){
      var score = sentiment(tags.comment, additions).score;
      if(score < -5) {
        var row = ''
        row += changeset.id+','
        row += changeset.created_at()+','
        row += changeset.user+','
        row += lang+','
        row += score+','
        row += tags.comment.split(',').join(' ')+','
        row += tags.created_by
        console.log(row)
      }
    }
  }
});

osmium.apply(reader, handler);
