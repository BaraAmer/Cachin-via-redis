const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')

const client = redis.createClient({
    port : 6379,
    host : "127.0.0.1"
});

let settings = { method: "Get" };

client.on("error",(error)=>{
    console.log("erroe hapened"+ error);
});

client.on("connect",(error)=>{
console.log("connection established")
});


let url = "https://jsonplaceholder.typicode.com/todos";
let options = {json: true};

const app = express();

function cache_info(req,res,next){

    client.get("todosTitle",(err,data)=>{
        if (err) throw err;
        if(data !== null )
        res.send(data)
        else
        next()
    })


}

const strtodo = {
    "userId": 2,
    "id": 41,
    "title": "aliquid amet impedit consequatur aspernatur placeat eaque fugiat suscipit",
    "completed": false
  }


async function gettodos(req,res,next){
try {
await fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        // do something with JSON
        const todostring = JSON.stringify(strtodo);
        const todo_obj = JSON.parse(todostring)

        console.log("title : "+todo_obj.title);
       
       client.setex("todosTitle",3600,todo_obj.title);
        res.send(json)
    });
} catch (error) {
    console.log(error);
}}

app.get("/todos",cache_info,gettodos);

app.listen(4000,()=>{
    console.log("The server is listenning : ...")
})