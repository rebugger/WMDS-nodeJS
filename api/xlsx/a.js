var xlsx = require('xlsx');

module.exports = function(cb){

    var wb = xlsx.readFile(__dirname +'/../../pattern/a.xlsx');
    var firstsheetName= wb.SheetNames[0];
    var firstSheet = wb.Sheets['Sheet1']

    var data = [];
    for(var i = 22891; i < 24891; i++){
        var fuck = String('B'+i);
        data.push(firstSheet[fuck].w);
    }

    cb(data)
}