const XLSX = require("xlsx")


function parseExcel(buffer){

    const workbook = XLSX.read(buffer, {type : 'buffer'}) ;
    const sheetName = workbook.SheetNames[0] ;
    const sheet = workbook.Sheets[sheetName] ;

    const rows =XLSX.utils.sheet_to_json(sheet ,{defval : null}) ;

    return rows ;



}

module.exports =  parseExcel ;









