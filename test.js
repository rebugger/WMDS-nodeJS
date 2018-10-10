const request = require('request');
const io = require('cheerio');
const readline = require('readline');
const async = require('async');
const fs = require('fs');

var url = "https://kin.naver.com/best/listaha.nhn?svc=KIN&dirId=-1&page=";
// var url = "https://kin.naver.com/best/listaha.nhn?svc=KIN&dirId=-1&page=";
var cnt = 1;


async.waterfall([
    function arrayList (cbA){
        var urlTotal = [];
        for(var i = 11; i < 977; i++){
            var target = url+i
            urlTotal.push(target);
            if(i === 976){
                
                cbA(null, urlTotal);
            }
        }
    },
    function eachList (cbA, cbB) {
        var urlList = cbA;
        var htmlTotal = [];
        
        async.eachSeries(urlList,  function(tg, callback) {  
            // console.log(tg);
            request(tg, function(err, response, body){
                if(!err){
                    console.log('접근 : ', tg)
                    ioFunction(body, function(data){
                        if(data){
                            // htmlTotal.push(data);
                            
                            fsAppend(data, function(){
                                setTimeout(function(){
                                    callback()
                                }, 100);
                            });
                        }else{
                            console.log('없음')
                            callback()
                        }
                    })
                }else{
                    console.log('없음없음');
                    callback();
                }
            })
        }, function(){
            cbB(null, 'fuck');
        })
    }
], function(err, results){
    if(err){
        console.log('최종 에러 : ', err);
        process.exit()
    }else{
        console.log(" 클로링이 끝낫쯉니다 ");
        process.exit()
    }
})

function ioFunction (body, cb) {
    var $ = io.load(body);
    // console.log(body)
    var total = [];
    $('#au_board_list .title').each(function(i1, elem1){
        
        var fuck1 = $(this).text()
        $('#au_board_list .field').each(function(i2, elem2){
            var fuck2 = $(this).text()
            
            if(i1 === i2) {
                // console.log(typeof(fuck1), typeof(fuck2))
                if(typeof(fuck1) === 'string'){
                    if(typeof(fuck2) === 'string'){
                        // console.log('접근', fuck1, fuck2)
                        total.push({key : fuck2, value : fuck1});
                    }
                }  
            }
        })
    })
    if(total.length > 0){
        cb(total);
    }
}


function fsAppend (data,cb) {
    if(data.length > 0){
        // console.log('data : ', data);
        data.map(function(v,i){
            fs.appendFileSync('results.txt', JSON.stringify(v)+'\n');
        })
        cb()
    }
}

function ram (data,cb){
    var txtArray = data;
    var txtTotal = [];
    async.eachSeries(txtArray, function(txt, callback){
        ram_sub(txt.value, function(result){
            txtTotal.push(result);
            callback()
        })
    }, function(){
        // console.log('txtTOtal " :', txtTotal);
        cb(txtTotal)
    })
}


function ram_sub (txt, cb){
    var re = txt
    // var reRE = new RegExp(/(\r\n\t|\n|\r\t)/gm);
    // var reRE = new RegExp(/\n|\t/g);

    // re.replace(/\s+/g, ' ').trim();
    // console.log(re); // logs: "this is a test"

    // re.replace(reRE, '');
    cb(re)
}