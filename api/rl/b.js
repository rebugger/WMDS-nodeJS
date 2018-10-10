
var fs = require('fs');
var rd = require('randomstring');
var readline = require('readline');
var async = require('async');
var xlsx = require('./../xlsx/a')


// request.B 로부터 받아온 body 에서 패턴이 존재하는지 확인하기
module.exports = function(url,body,cb){
    // var pattern = ['/* NB VIP */','51yes.com', 'coinhive'];
    // var pattern = ['google.com'];
    var pattern;

    xlsx(function(data){
        pattern = data;
    })
    var url = url;
    var body = body;

    //탐지된 url 집어넣는 곳
    var dt = [];
    //안전한 사이트 url 을 담을 곳
    var safe_site = {}
    safe_site.dt_url = url;
    safe_site.db_pt = null;
    safe_site.db_spot = null;
    safe_site.detect = false;
    var sface = [safe_site];


    async.eachSeries(pattern, function(item, done){
        // console.log(body.indexOf(item));
        if(body.indexOf(item) > - 1){
            // console.log('check 1');
            // var fl = rd.generate(5);
            // var path = __dirname + '/../../logs' +fl+'.log';
            // console.log('path : ', path);
            dt.push({dt_url : url, dt_pt : item, db_spot : body.indexOf(item), detect : true});
            done();
        }
        else{
            done()
        }
    },function(){
        if(dt.length > 0){
            // console.log('던진다 ',dt.length)
            cb(null,dt)
        }
        else{
            //탐지된 것이 없으면 안전한 사이트로 전달
            cb(null,sface);
        }
    });

}

function appendFile(url,pattern, path,body,cb){
    fs.appendFile(path, body, 'utf-8', function(err){
        if(err){
            return cb(err);
        }
        else{
            rl_s(url, path, pattern, function(err,result){
                if(err){
                    return cb(err);
                }
                else{
                    // console.log('접근완료');
                    // console.log('접근완료 : %s',result);
                    cb(null, 'success');
                }
            })
        }
    })
}



function rl_s(dn,pp,pt,cb){
    var li = [];
    // var path = './logs/a.log'
    var readStream = fs.createReadStream(pp)
    var rl = readline.createInterface({
        input : readStream
    });

    rl.on('line',function(line){
        if(line.indexOf(pt) > -1){
            // console.log('value : ', line);
            li.push({"url" : dn , "detect" : line});
        }
    }).on('close', function(){
        rl.close()
        if(li.length > 0){
            cb(null,li)
        }
        else{
            cb('없음')
        } 
    })
}
// function rf2(data,pt,cb){
//     if(data.indexOf(pt) > -1){
//         cb(null,'1')
//     }
//     else{
//         cb(null);
//     }
// }
