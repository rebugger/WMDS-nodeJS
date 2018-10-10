var express = require('express')
var router = express.Router();
var Result = require('../model/results');
var Source = require('../model/source');
var excute = require('../api/request/a');
var excute2 = require('../api/request/b');
var async = require('async')


router.get('/test', function(req,res){
    
    res.send('/test');
})

router.get('/b', function(req,res){
    res.render('test3.pug',io);
})

// app.get('/main', function(req,res){
//     res.render('main.pug');
// })

router.get('/', function(req,res){
    res.render('index.pug');
})
router.get('/main', function(req,res){
    res.render('main2.pug');
})

router.get('/miner', function(req,res){
    pageSlite('1', function(err,range){
        if(!err){
            Result.find({pattern: {$in : ["coinhive"]}}, function(err,result){
                if(!err){
                    console.log('success')                    
                    res.render('miner.pug', {
                        url : result,range1 : range[0], range2 :range[1]
                    });
                }
                else{
                    console.log('error')
                    res.redirect('miner.pug');
                }
            }).sort({time : -1 })
        }
        else{
            console.log('error2');
            res.render('miner.pug');
        }
    })
    
})

router.get('/miner/:num', function(req,res){
    var num = req.params.num; 
    pageSlite(num, function(err,range){
        if(!err){
            //coinhive 패턴만 보여준다.
            Result.find({pattern: {$in : ["coinhive"]}}, function(err,result){
                if(!err){
                    console.log('success')
                    res.render('miner.pug', {
                        url : result, num : num,range1 : range[0], range2 :range[1]
                    });
                }
                else{
                    console.log('error')
                    res.render('miner.pug');
                }
            })
        }
        else{
            console.log('error2');
            res.render('miner.pug');
        }
    })

})
router.get('/click/:id', function(req,res){
    console.log(req.params);
    var id = req.params.id
    Source.find({identifier : id}, function(err,result){
        //여기에다가 페이지를 만들어주면 된다.
        res.render('source.pug', {id : result[0].identifier ,source : result[0].source});
    })
})


router.get('/malurl', function(req,res){
    console.log('testfuck');
    // res.render('malurl.pug');
    pageSlite('1', function(err,range){
        if(!err){
            Result.find({pattern : {$nin : ["coinhive", "new CoinHive.Anonymous"]}}, function(err,result){
                if(!err){
                    // console.log('test here', result);
                    res.render('malurl.pug', {
                        url : result,range1 : range[0], range2 :range[1]
                    });
                }
                else{
                    console.log(err)
                    res.render('malurl.pug');
                }
            }).sort({time : -1 })
        }
        else{
            console.log('error2');
            res.render('malurl.pug');
        }
    })
    
})

router.get('/malurl/:num', function(req,res){
    var num = req.params.num
    pageSlite(num, function(err,range){
        if(!err){
            Result.find({pattern : {$nin : ["coinhive","new CoinHive.Anonymous"]}}, function(err,result){
                if(!err){
                    res.render('malurl.pug', {
                        url : result, num : num,range1 : range[0], range2 :range[1]
                    });
                }
                else{
                    console.log('error')
                    res.render('malurl.pug');
                }
            })
        }
        else{
            console.log('error2');
            res.render('malurl.pug');
        }
    })
})
router.get('/search', function(req,res){
    res.redirect('/main');
})
router.post('/search', function(req,res){
    console.log(req.body.id)
    var id = req.body.id;
    async.parallel([
        //identifier 의 값을 찾기위해
        function(index){
            Result.find({identifier : id}, function(err,result){
                if(!err){
                    if(result.length > 0){
                        // res.render('miner.pug', {url : result[0], tp : 'search'});
                        index(null,result[0]);
                    }
                    else{
                        index(null,null);
                    }
                }
                else{
                    index(err);
                }
            })
        },
        // url 링크 검색결과를 찾기위해
        function(link){
            Result.find({$text : {$search : id}}, function(err,result){
                if(!err){
                    if(result.length > 0){
                        // console.log('?', result)
                        link(null, result);
                    }
                    else{
                        link(null,null)
                    }
                    
                }
                else{
                    link(err);
                }
            })
        },
    ], function(err,result){
        if(!err){
            if(result[0] && !result[1]){
                res.render('search_total.pug', {url : result[0], tp : "search"});
            }
            else if(!result[0] && !result[1]){
                res.render('main2.pug');
            }
            else if(result[0] && result[1]){
                //아직까지 나올 일이 없음;
                res.render('search_total.pug',{tp : "both"});
            }
            else{
                //result[1] 만 있을 떄; url
                console.log('여기 맞징/>')
                res.render('search_total.pug', {data: result[1].length, url : result[1]})
            }
        }
        else{
            console.log(err);
        }

    })
    
})

router.get('/result', function(req,res){
    res.redirect('/')

})
router.post('/result', function(req,res){
    console.log('얍삐!',req.body);
    var url = req.body.url
    var total = [];
    var total2 = [];
    console.log(res.statusCode)

    res.on('end', function(){
        console.log('=================================RES.ON END===================================');
    })

    if(res.statusCode === 200 || res.statusCode === 302){
        if(url.indexOf('http') === 0 || url.indexOf('https') === 0){
            //요청 URL 에 대한 하위페이지 목록 불러오기.
            excute(url, function(err,result){
                if(err){
                    return res.status(400).render('index.pug', {message : 'error'})
                }
                else{
                    console.log('1. 검색요청된 주소의 하위페이지 목록을 불러왔습니다.')
                    //받아온 하위페이지에 대한 단일페이지 검사
                    async.waterfall([
                        //받아온 하위페이지를 단일 배열로 재저장 
                        function(cb_a){
                            console.log('2.받아온 하위페이지에 대한 재배열 함수 실행합니다.')
                            totalForEach(result, function(Aa){
                                if(Aa){
                                    cb_a(null,Aa);
                                }
                                else{
                                    return cb_a('cb_a err');
                                }
                            })
                        },
                        //받아온 재배열된 하위페이지들을 5개의 로직으로 나눠어 검사 실행
                        function(cb_a,cb_b){
                            console.log('3. 5개의 로직으로 분할 검사 실행합니다.');
                            var total = [];
                            console.log('3-1. 받아온 하위페이지의 갯수(cb_a.length) : ', cb_a.length);
                            asyncLogic(cb_a,function(err,result){
                                if(!err){
                                    cb_b(null, result);
                                }
                                else{
                                    // console.log('뻑ㅗ')
                                    cb_b(err);
                                }
                            })
                        },
                        //검사 결과에 대한 내용을 재확인, null 값에 대한 처리 후 검색 결과를 재배열화
                        function(cb_b, cb_c){
                            console.log('4. 탐색결과를 재배열화 진행합니다.');
                            var total = [];

                            // console.log('cb_b length : %s', cb_b.length);
                            for(var i = 0; i < cb_b.length; i++){
                                for(var q = 0; q < cb_b[i].length; q++){
                                    if(cb_b[i][q] !== null){
                                        if(cb_b[i][q][0].detect === true){
                                            total.push({pt : cb_b[i][q][0].dt_pt, url :cb_b[i][q][0].dt_url, spot: cb_b[i][q][0].db_spot, detect : 'danger'});
                                        }
                                        else{
                                            total.push({pt : null, url :cb_b[i][q][0].dt_url, spot: null, detect : 'safe'});
                                        }
                                    }
                                }
                            }
                            cb_c(null, total);
                        }
                        //마지막 데이터 송출
                    ],function(err,result){
                        if(err){
                            console.log(err);
                            res.status(400).render('/')
                        }
                        else{
                            console.log('5. 마지막 결과값을 전송합니다. 길이값 : ', result.length);
                            res.status(200).render('result.pug', {url :result});
                        }
                    })
                }
            })   
        }
        else{
            // res.status(304).render('index.pug',{url : url, ch: false});
            res.status(400).redirect('/')
        }
    }
    else{
        console.log(res.statusCode);
        res.status(400).render('/')
    }
})

function totalForEach(total,cb){
    var list = [];
    
    for(var i = 0; i < total.length; i++){
        list.push(total[i]);
    }
    // console.log('re1')
    cb(list)
}

function totalForEach2(total,cb){
    var tt = [];
    
    total.forEach(function(url, idx){
        excute2(url, function(err,result){
            if(!err){
                // console.log('채우기')
                tt.push(result);
            }
        })
    })
    // console.log('re2')
    cb(tt);
}
// }


function pageSlite(num,cb){
    var range = [];
    console.log('num check :',num, num.length , typeof(num));
    if(num){
        if(num === "1"){
            range.push(1,21);
        }
        else if(num === "2"){
            range.push(22,41);
        }
        else if(num === "3"){
            range.push(42,61);
        }
        else if(num === "4"){
            range.push(62,81);
        }
        else if(num === "5"){
            range.push(82,101);
        }
        else{
            range.push(1,999);
        }

        cb(null, range);
    }
    else{
        cb('nothing');
    }
}

function haltOnTimedout (req, res, next) {
    console.log('timeout', req.timeout);
    if (!req.timedout) next()
  }

function asyncLogic(cb_a, shit){
    var totalA = [];
    var totalB = [];
    var totalC = [];
    var totalD = [];
    var totalE = [];
    var total = [];

    var resultA = [];
    var resultB = [];
    var resultC = [];
    var resultD = [];
    var resultE = [];

    console.log(cb_a.length / 5)
    var split = (cb_a.length / 5);


    //5개로 분할합니다.
    for(var i = 0; i < cb_a.length; i++){
        if(i < split){
            totalA.push(cb_a[i]);
        }
        else if(i < split*2){
            totalB.push(cb_a[i]);
        }
        else if(i < split*3){
            totalC.push(cb_a[i]);
        }
        else if(i < split*4){
            totalD.push(cb_a[i]);
        }
        else{
            totalE.push(cb_a[i]);
        }
    }
    //5개의 로직을 동기방식으로 수행합니다.
    async.parallel([
        function(a){
            async.eachSeries(totalA, function(item, done){
                console.log('** [logic A] : : ', item);
                excute2(item, function(err,result){
                    if(err){
                        // console.log('여기인가?');
                        done(err);
                    }
                    else{
                        resultA.push(result);
                        console.log('** [logic A] ==> %s',item, result);
                        done();
                    }
                })
            }, function(err){
                if(err){
                    // console.log('err eachSeries',err);
                    a(err);
                }
                else{
                    // console.log('3 success');
                    a(null, resultA)
                }
            })
        },
        function(b){
            async.eachSeries(totalB, function(item, done){
                console.log('** [logic B] : : ', item);
                excute2(item, function(err,result){
                    if(err){
                        // console.log('여기인가?');
                        done(err);
                    }
                    else{
                        resultB.push(result);
                        console.log('** [logic B] ==> %s',item, result);
                        done();
                    }
                })
            }, function(err){
                if(err){
                    // console.log('err eachSeries',err);
                    b(err);
                }
                else{
                    // console.log('3 success');
                    b(null, resultB)
                }
            })
        },
        function(c){
            async.eachSeries(totalC, function(item, done){
                console.log('** [logic C] : : ', item);
                excute2(item, function(err,result){
                    if(err){
                        // console.log('여기인가?');
                        done(err);
                    }
                    else{
                        resultC.push(result);
                        console.log('** [logic C] ==> %s',item, result);
                        done();
                    }
                })
            }, function(err){
                if(err){
                    // console.log('err eachSeries',err);
                    c(err);
                }
                else{
                    // console.log('3 success');
                    c(null, resultC)
                }
            })
        },
        function(d){
            async.eachSeries(totalD, function(item, done){
                console.log('** [logic D] : : ', item);
                excute2(item, function(err,result){
                    if(err){
                        // console.log('여기인가?');
                        done(err);
                    }
                    else{
                        resultD.push(result);
                        console.log('** [logic D] ==> %s',item, result);
                        done();
                    }
                })
            }, function(err){
                if(err){
                    // console.log('err eachSeries',err);
                    d(err);
                }
                else{
                    // console.log('3 success');
                    d(null, resultD)
                }
            })
        },
        function(e){
            async.eachSeries(totalE, function(item, done){
                console.log('** [logic E] : : ', item);
                excute2(item, function(err,result){
                    if(err){
                        // console.log('여기인가?');
                        done(err);
                    }
                    else{
                        resultE.push(result);
                        console.log('[logic E] ==> %s',item, result);
                        done();
                    }
                })
            }, function(err){
                if(err){
                    // console.log('err eachSeries',err);
                    e(err);
                }
                else{
                    // console.log('3 success');
                    e(null, resultE)
                }
            })
        },

    ],function(err,result){
        console.log('[logic 검사결과] : ',err|| result.length);
        shit(null, result);
    })    
}
module.exports = router;
