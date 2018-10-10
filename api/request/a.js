var request = require('request');
var io = require('../cheerio/a');
var fs = require('fs');

//1. 주소 형식이 맞는지 확인할 것
//2. 받아온 src가 있으면 다음 링크로 이동시킬 것

module.exports = function(url,cb){
    var item;
    var total = [];
    request(url, function(error, response, body){
        if(!error){    
            io(body, function(err,result){
                if(!err){
                    for(var i =0; i < result.length; i++){
                        if(i === 100){
                            break;
                        }
                        if(result[i].indexOf('/') === 0){
                            item = url + result[i];
                            total.push(item)
                        }
                        else if(result[i].indexOf('http') === 0){
                            item=result[i]+'\n';
                            total.push(item);
                        }
                    }
                    console.log('길이 값 : ', total.length);
                    cb(null, total);
                }
            })
        }
        else{
            console.log('리스폰 : ', response)
            console.log('error : ', error)
            cb(error || response);
        }
    })
}
