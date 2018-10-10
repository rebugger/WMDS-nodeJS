var async = require('async');
var request = require('request');
var cheerio = require('cheerio');
// var cluster = require('cluster');
// var numCPUs = require('os').cpus().length;
const readline = require('readline');
var fs = require('fs');
var path = 'urls/urls'
var readStream = fs.createReadStream(path)
var rl = readline.createInterface({
  input : readStream
});
var crawler = function(line,cb){
  require('./api/request/a')(line, function(err,result){
    if(err){
      cb(err);
    }
    cb(null, result)
  });  
}
var sum = 0;
var startTime = new Date().getTime();
for (var i = 1; i <= 1000000; i++) {
	sum += i;
}

var list = [];

async.waterfall([
  function(cb_list){
    rl.on('line', function(line, fuck){
      // console.log('line : ', line);
      list.push(line);
    }).on('close', function(){
      console.log('뀹')
      
      rl.close()
      readStream.destroy();

      cb_list(null, list);
    })
  },
  function(list, cb_craw){
    list.forEach(function(item,fuck){
      console.log('fuck: ', fuck)
      crawler(item,function(err,result){
        if(err){
          console.log(err);
        }
        var endTime = new Date().getTime();
        console.log('끄읕!!!: '+(endTime - startTime) / 1000);
      })
      return true
    })
  }
], function(err,result){
  if(err){
    console.log('끄악!');
  }
  else{
    console.log('result');
  }
})










