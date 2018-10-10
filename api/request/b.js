var request = require('request');
var io2 = require('../cheerio/b');
var fs = require('fs');
var rlB = require('../rl/b');

//바디 값 받아서 패턴 감지용으로 쓸 모듈

module.exports = function(url,cb){
    var pp ;
    var total = [];

    request(url, function(error, response, body){
        if(!error){
            rlB(url, body, function(err, result){
                if(!err){
                    console.log('==> ',url+':'+result);
                    cb(null, result);
                }
                else{
                    cb('request_B :'+err);
                }
            })
        }
        else{
            console.log('error : ', error);
            cb('request_B : '+error);
        }
    })
}
