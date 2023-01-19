var express=require('express')
var router=express.Router()
var pool=require('./pool')
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/flightlogin',function(req,res){
 res.render('flightlogin',{message:''})   
})

router.get('/adminlogout',function(req,res){
  localStorage.clear()
  res.render('flightlogin',{message:''})   
 })

router.post('/chkadminlogin',function(req,res,next){
    pool.query("select * from adminlogin where (emailid=? or mobileno=?) and password=?",[req.body.emailid,req.body.emailid,req.body.password],function(error,result){
        if(error)
        {console.log(error)
            res.render('flightlogin',{message:'Server Error'})   
        }
        else
        { 
          if(result.length==1)
          {
            localStorage.setItem("ADMIN",JSON.stringify(result[0]))
           res.render('dashboard',{data: result})
          }
          else
          {console.log(result)
            res.render('flightlogin',{message:'Invalid emailid/phoneno/address'})   
          }
        }
    })
    
})

module.exports = router;