var mysql=require("mysql")
var pool=mysql.createPool(
{host:'localhost',
 port:3306,
 user:'root',
password:'1234',
database:'flight',
connectionLimit: 100,
multipleStatement:'true'

})
module.exports=pool;
