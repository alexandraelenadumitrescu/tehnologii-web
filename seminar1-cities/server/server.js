const express=require('express');
const {DataReader}=require('buffered-reader');
const cities=[];
const PORT=8080;
express()
    .use(express.static('../client'))
    .get('/cities.json',(request,response)=>response.json(cities))
    .listen(PORT,()=>{
        try{
            new DataReader('cities.csv',{encoding:'utf-8'})
            .on('error',error=>console.error(error.message))
            .on('line',line=>{
                var data=line.split(',');
                cities.push({name:data[1],district:data[2],inhabitants:parseInt(data[3])});
        })
        .read();}
        catch(exception){
            console.error(exception.message);
        }
    });