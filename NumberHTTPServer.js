/*
Name: NumberHTTPServer.js
Alias: Basic HTTP Server for number path handling
Author: Carlos Andrés Escalona Contreras 
Created: 06/05/2021       Updated: 06/05/2021
Proposed by: Javier Luna
Description:
1. Server listening to requests on port 9000.
2. Your Node App stores a number in the path /myNumber. 
Use body payload to send the value: { myNumber: 123 }. Don't create one number per request, just create or update the current number.
3. The value number can be requested to /myNumber.
4. If you receive a request from path /myNumber/{multiplier}, you should return in the response the value: myNumber*multiplier. If there is no current value for myNumber, return 400 error.
5. Delete the current value with a request to /reset.
6. If you try to use a non-numeric value to create/update myNumber, a 400 error should be returned.
7. If there is no value stored, a 404 should be returned.
8. Any other request should be handled with an error code 404, "resource not found".

*/
const http = require('http');
var path = require('path');
const fs = require('fs');

const PORT = 9000;
// const publicDir = path.join(__dirname.replace('src',''),'public');

const serverRoutes = {
  '/myNumber':{
    method:{
      GET: ()=> "./views/myWebPage.html",
      POST:()=> ""
    }
  },
  '/reset':{
    method:{
      DELETE: ()=> "books-DELETE"
    }
  }
}; 

const mime = {
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript'
};

const statusCodes= {
  informational: {}, //(100–199)
  successful: {},   //(200–299)
  redirects: {},    //(300–399)
  clientError: {},  //(400–499)
  serverError: {},  //(500–599)
}
const server = http.createServer(
  (request,response)=>{
    console.log(request);
    const {url,method} = request;

    if ( serverRoutes.hasOwnProperty(url) ){
      const res = evaluateRequest(url,method);
      const type = mime[path.extname(res.view).slice(1)] || 'text/plain';
      console.log(`${res.view} ${res.statusCode} ${method} ${type}`);
      fs.readFile(res.view, "UTF-8", function(err, html){
        response.writeHead(res.statusCode, {"Content-Type": type});
        response.end(html);
      });
    }
    else{
      // 404 Not Found
      response.writeHead(404, {"Content-Type": 'text/html'});
      response.end("Error: 404 Not Found");
    }
    
  }).listen(PORT, ()=>console.log(`Server running at port: ${PORT}`));

function evaluateRequest(route,method){
  let response = {};
  if(!serverRoutes.hasOwnProperty(route)){
    // 404 Not Found
    response.statusCode = 404;
    response.body = "Error 404: Method Not Allowed";
    return response;
  }
  if(!serverRoutes[`${route}`].method.hasOwnProperty(method)){
    // 405 Method Not Allowed
    response.statusCode = 405;
    response.body = "Error 405: Method Not Allowed";
    return response;
  }
  response.statusCode = 200;
  response.body = serverRoutes[`${route}`].method[`${method}`]();
  return response;
}