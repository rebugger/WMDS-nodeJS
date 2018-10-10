var request = require('request');
var cheerio = require('cheerio');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
const readline = require('readline');
var fs = require('fs');
var path = 'urls/urls'
var rl = readline.createInterface({
  input : fs.createReadStream(path)
});

var sum = 0;
var startTime = new Date().getTime();
for (var i = 1; i <= 1000000; i++) {
	sum += i;
}

if(cluster.isMaster){
  for(var i=0; i< numCPUs; i++){
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal){
    console.log('worker' + worker.process.pid + ' died');
  })
}
if(cluster.isWorker){
    
}
else{
  var crawler = function(line,cb){
    require('./api/request/a')(line, function(err,result){
      if(err){
        cb(err);
      }
      cb(null, result)
    });  
  }
  rl.on('line', function(line, fuck){
    console.log('line : ', line);
    crawler(line, function(err,result){
      if(err){
        console.log('==== error ===== : %s', err)
      }
    })
    console.log('맞나1?')
  }).on('close', function(){
    rl.close();
  })  


    var endTime = new Date().getTime();
    console.log('+++', (endTime - startTime) / 1000);
}



// rl.on('close', function(){
//   console.log('끝!')
// })









// var sum = 0;
// console.time('calculateTime')
// for(var i =0; i < 1000000; i++){
//   sum+= i ;
// }
// var endTime = new Date().getTime();
// console.timeEnd('calculateTime')

// var sum = 0;

// var startTime = new Date().getTime();
// for (var i = 1; i <= 1000000; i++) {
// 	sum += i;
// }
// var endTime = new Date().getTime();

// console.log(endTime - startTime);