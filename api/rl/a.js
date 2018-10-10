
var readline = require('readline');
var fs = require('fs');

module.exports = function(dn,cnt,cb){
    var pp;
    var pt = 'NB VIP';
    
    if(cnt === 0){
        var di = __dirname+'/../../logs/'
        var pp;

        test(dn,function(err,result){
            if(result){
                pp = di+result+'.log'
                rf(pp,function(err,data){
                    if(data){
                        rf2(data,pt,function(err,result){
                            console.log(result)
                            if(!err){
                                //도메인.log 이 후의 도메인2.log 로 저장
                                rl_s(dn,pp,pt,function(err,result){
                                    if(!err){
                                        console.log('리절트닷 ! : ',result);
                                        cb(null, result);
                                    }
                                    else{
                                        cb('1'+err);
                                    }
                                })
                            }
                            else{
                                cb('2'+err);
                            }
                        })
                    }
                    else{
                        cb('3'+err);
                    }
                })
            }
            else{
                cb('4'+err);
            }
        });
    }
    else{
        pp = dn+(cnt+'.log');
    }

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
            console.log('value : ', line);
            li.push({"url" : dn , "detect" : line});
        }
    }).on('close', function(){
        rl.close()
        if(li.length > 0){
            cb(null,li)
        }
        else{
            cb(null)
        } 
    })
}
function rf2(data,pt,cb){
    if(data.indexOf(pt) > -1){
        cb(null,'1')
    }
    else{
        cb(null);
    }
}
function rf(pp1,cb){
    fs.readFile(pp1, 'utf-8',(err, data) => {
        if (err) throw err;
        cb(err,data);
    });
}


function test(dn,cb){
    if(dn.indexOf('https') > -1){
        var dname = dn.replace('https://', '');
        console.log('dn 1',dname)
        cb(null,dname);
    }
    else if(dn.indexOf('http') > -1){
        var dname2 = dn.replace('http://', '');
        console.log('dn 2',dname2)
        cb(null,dname2);
    }
    else{
        cb('fuck');
    }
}
