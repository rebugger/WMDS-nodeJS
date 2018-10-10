var io = require('cheerio');

module.exports = function(body,cb){
    var list = [["script", "src"], ["a", "href"], ["iframe","src"]];
    var $ = io.load(body);
    var temp  = [];

    list.forEach(function(it){
        // console.log('it' , it)
        $(it[0]).each(function(i,elem){
            var item = $(this).attr(it[1]);
            
            if(typeof(item) === 'string'){
                temp.push(item);
            }
        })
    })
    cb(null, temp)
}