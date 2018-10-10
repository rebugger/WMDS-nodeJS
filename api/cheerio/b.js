var io = require('cheerio');
// var pt = require('../../pattern/a.txt');
const htt = require('cheerio-html-to-text')


//패턴감지용
module.exports = function(body,cb){
    // var $ = io.load(body);
    var pt = 'index.html';
    var temp = [];
    console.log('=========success!!!============')
    const text = htt.convert(body);
    console.log(text)


    // $().each(function(i,elem){
    //     var item = $(this).text(pt);

    //     if(typeof(item) === 'string'){
    //         temp.push(item)
    //         console.log('index.html string success : ', item);
    //     }
    // })

    // $.each(function(i,elem){
    //     var item = $(this).text();

    //     console.log('test : ', item.length);
    //     // console.log('test : ', item[0]);
    //     // console.log('test : ', item[1]);
    //     if(typeof(item)=== 'string'){
    //         temp.push(item)
    //         console.log('test : ', item);
    //     }
    // })

    // var fuck = $('body').text('google.com')
    // var fuck2 = $('head').text('google.com')
    // console.log('0',$('html').text())
    // console.log('1',$('body').text())
    
    // console.log('1 : ', fuck)
    // console.log('2 : ', fuck2)
    
    // temp.push(fuck)
    // temp.push(fuck2)

    cb(null, temp)
}
