var express=require('express')
var router=express.Router()
var pool=require('./pool')
var upload=require('./multer');
const e = require('express');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');

router.get('/flightinterface',function(req,res){
var admin=JSON.parse(localStorage.getItem('ADMIN'))
if(admin)
 res.render('flightinterface',{message:''})  
else
    res.render('flightlogin',{message:''})
})

router.get('/displayallflights',function(req,res){
    var admin=JSON.parse(localStorage.getItem('ADMIN'))
    if(!admin)
    res.render('flightlogin',{message:''})
    else
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity) as source,(select C.cityname from cities C where C.cityid=F.destinationcity) as destination from flightsdetails F ",function(error,result){
        if(error)
        {
            res.render('displayallflights',{'data':[],'message':'server error'})
        }
        
        else
        {
            res.render('displayallflights',{'data':result,'message':'Success'})
        }  
    })   
   })

router.post('/flightsubmit',upload.single('logo'),function(req,res){
    //console.log("Days",req.body.days)
    console.log("BODY",req.body)
    console.log("FILE",req.file)
    var days=(""+req.body.days).replaceAll("'",'"')
    
pool.query("insert into flightsdetails(flightname, flightype, noofseats, days, sourcecity, deptime, destinationcity, arrtime, company,logo)values(?,?,?,?,?,?,?,?,?,?)",[req.body.flightname,req.body.flightype,req.body.noofseats,days,req.body.sourcecity,req.body.deptime,req.body.destinationcity,req.body.arrtime,req.body.company,req.file.originalname],function(error,result){


if(error)
{
    res.render('flightinterface',{'message':'server error'})
}

else
{
    res.render('flightinterface',{'message':'Record Submitted Successfuly'})
}

})
})

router.get('/fetchallcities',function(req,res){
    pool.query("select * from cities",function(error,result){
    if(error)
    {
        res.status(500).json({result:result,message:'server Error '})
    }

    else
    {
        res.status(200).json({result:result,message:'success'})
    }
    })
   })


   router.get('/searchbyid',function(req,res){
    
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity) as source,(select C.cityname from cities C where C.cityid=F.destinationcity) as destination from flightsdetails F where flightid=?",[req.query.fid],function(error,result){
        if(error)
        {
            res.render('flightbyid',{'data':[],'message':'server error'})
        }
        
        else
        {
            res.render('flightbyid',{'data':result[0 ],'message':'Success'})
        }  
    })   
   })


   router.post('/flight_edit_delete',function(req,res){
    if(req.body.btn=="Edit")
    {
    var days=(""+req.body.days).replaceAll("'",'"')
    
pool.query("update flightsdetails set flightname=?, flightype=?, noofseats=?, days=?, sourcecity=?, deptime=?, destinationcity=?, arrtime=?, company=? where flightid=?",[req.body.flightname,req.body.flightype,req.body.noofseats,days,req.body.sourcecity,req.body.deptime,req.body.destinationcity,req.body.arrtime,req.body.company,req.body.flightid],function(error,result){
if(error)
{
    res.redirect('/flight/displayallflights')
}

else
{
    res.redirect('/flight/displayallflights')
}

})
    }
    
 else
 {

    
    
    pool.query("delete from flightsdetails  where flightid=?",[req.body.flightid],function(error,result){
    if(error)
    {
        res.redirect('/flight/displayallflights')
    }
    
    else
    {
        res.redirect('/flight/displayallflights')
    }
    
    })
 }
})

router.get('/searchbyidforimages',function(req,res){
    
    pool.query("select F.*,(select C.cityname from cities C where C.cityid=F.sourcecity) as source,(select C.cityname from cities C where C.cityid=F.destinationcity) as destination from flightsdetails F where flightid=?",[req.query.fid],function(error,result){
        if(error)
        {
            res.render('showimages',{'data':[],'message':'server error'})
        }
        
        else
        {
            res.render('showimages',{'data':result[0 ],'message':'Success'})
        }  
    })   
   })


router.post('/editimage',upload.single('logo'),function(req,res){
    //console.log("Days",req.body.days)
    console.log("BODY",req.body)
    console.log("FILE",req.file)
    
pool.query("Update  flightsdetails set logo=? where flightid=?",[req.file.originalname,req.body.flightid],function(error,result){
if(error)
{
    res.redirect('/flight/displayallflights')
}
else
{
    res.redirect('/flight/displayallflights')
}
})
})

module.exports = router;