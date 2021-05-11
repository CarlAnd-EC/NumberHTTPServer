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

const PORT = 9000;
var myNumber = null;

const serverRoutes = {
  '/myNumber':{
    method:{
      GET: ()=> getNumber(),
      POST:()=> updateNumber()
    }
  },
  '/reset':{
    method:{
      DELETE: ()=> deleteNumber()
    }
  }
};

const statusCodes= {
  informational: {},  //(100–199)
  successful: {
    GET: 200,
    POST: 201
  },                  //(200–299)
  redirects: {},      //(300–399)
  clientError: {},    //(400–499)
  serverError: {},    //(500–599)
}
const server = http.createServer(
  (request,response)=>{
    const {url,method} = request;
    const res = evaluateRequest(url,method);
    if(res.status ==='approved'){
      let result = null;
      switch (method) {
        case 'POST':
          let body;
          collectRequestData(request, data => {
            body = data;
          });
          result = serverRoutes[`${url}`].method.POST(Number(body));
          res.statusCode = result.statusCode;
          res.type = result.type;
          res.body = result.body;
          break;
        case 'GET':
          result = serverRoutes[`${url}`].method.GET();
          res.statusCode = result.statusCode;
          res.type = result.type;
          res.body = result.body;
          break;
        case 'DELETE':
          result = serverRoutes[`${url}`].method.DELETE();
          res.statusCode = result.statusCode;
          res.type = result.type;
          res.body = result.body;
          break;
        default:
          break;
      }  
    }
    
    console.log(`${res.statusCode} ${method} ${url} ${res.type} ${res.body}`);
    response.writeHead(res.statusCode, {"Content-Type": res.type});
    response.end(res.body);
    
  }).listen(PORT, ()=>console.log(`Server running at port: ${PORT}`));

function evaluateRequest(route,method){
  if(!serverRoutes.hasOwnProperty(route)){
    // 404 Not Found
    return {
      status:'denied',
      statusCode: 404,
      type: 'text/plain',
      body: "Error 404: Resource not found"
    };
  }
  if(!serverRoutes[`${route}`].method.hasOwnProperty(method)){
    // 405 Method Not Allowed
    return {
      status:'denied',
      statusCode: 405,
      type: 'text/plain',
      body: "Error 405: Method Not Allowed"
    };
  }
  return {status: 'approved'};
}

function getNumber(){
  if(myNumber===null) {
    return {
      statusCode: 404,
      type: 'text/plain',
      body: "Error 404: Resource does not exist"
    };
  }
  return {
    statusCode: 200,
    type: 'text/plain',
    body: myNumber
  };
}
function updateNumber(newNumber){
  if(myNumber===null){
    myNumber = newNumber;
    return {
      statusCode: 201,
      type: 'text/plain',
      body: "Created successfully"
    };
  }
  myNumber = newNumber;
  return {
    statusCode: 200,
    type: 'text/plain',
    body: "Updated successfully"
  };
}

function deleteNumber(){
  myNumber=null;
  return {
    statusCode: 200,
    type: 'text/plain',
    body: "Deleted successfully"
  };
}
function collectRequestData(request, callback) {
    let body = '';
    request.on('data', chunk => {
      switch (request.headers['content-type']) {
        case 'text/plain':
          body += chunk;
          break;
        case 'application/json':
          body = '0';
          break;
        default:
          break;
      }
    });
    request.on('end', () => {
      callback(Number(body));
    });
}