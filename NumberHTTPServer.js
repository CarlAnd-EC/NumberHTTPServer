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
      POST:(newNumber)=> updateNumber(newNumber)
    }
  },
  '/reset':{
    method:{
      DELETE: ()=> deleteNumber()
    }
  }
};

const server = http.createServer(
  async (request,response)=>{
    try{
      const {url,method} = request;
      const res = evaluateRequest(url,method);
      if(res.status ==='approved'){
          const result = await handleRequest(request);
          res.statusCode = result.statusCode;
          res.type = result.type;
          res.body = result.body;
      }
      console.log(`${res.statusCode} ${method} ${url} ${res.type} ${res.body}`);
      response.writeHead(res.statusCode, {"Content-Type": res.type});
      response.end(res.body);
    }
    catch (error) {
      console.error(error);
    }
    finally{
      console.log("Request served");
    }
  }).listen(PORT, ()=>console.log(`Server running at port: ${PORT}`));

function evaluateRequest(route,method){
  if(route.includes('/myNumber/')){
    return multiplyNumber(route.slice(route.indexOf('/myNumber/')+10));
  }
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

async function handleRequest(request){
  switch (request.method) {
    case 'GET':
      return serverRoutes[`${request.url}`].method.GET();
    case 'POST':
      try {
        const body = await collectRequestData(request);
        const response = await serverRoutes[`${request.url}`].method.POST(body);
        return response;
      } catch (error) {
        console.error(error);
      }
    case 'DELETE':
      return serverRoutes[`${request.url}`].method.DELETE();
    default:
      break;
  }
}

function collectRequestData(request) {
  return new Promise((resolve, reject) => {  
    let body = '';
    request.on('data', chunk => {
      switch (request.headers['content-type']) {
        case 'text/plain':
          body += chunk;
          break;
        case 'application/json':
          body = JSON.parse(chunk)['number'];
          break;
        default:
          break;
      }
    });
    request.on('end', () => {
      resolve(body);
    });
  })
  /* .then(function(val) {
    // Log the fulfillment value
    console.log(`beforeend ${typeof val} ${val} Promise fulfilled`);
  }) */
  .catch((reason) => {
    // Log the rejection reason
    console.log(`Handle rejected promise (${reason}) here.`);
  }); 
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
    body: String(myNumber)
  };
}
function updateNumber(numberString){
  const newNumber = Number(numberString);
  if(Number.isNaN(newNumber)){
    return {
      statusCode: 400,
      type: 'text/plain',
      body: "Error 400: Bad request"
    };
  }
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
function multiplyNumber(multiplierString){
  const multiplier = Number(multiplierString);
  if(myNumber==null || Number.isNaN(multiplier)){
    return {
      status:'denied',
      statusCode: 400,
      type: 'text/plain',
      body: "Error 400: Bad request"
    };
  }
  return {
    status:'operation',
    statusCode: 200,
    type: 'text/plain',
    body: `${myNumber*multiplier}`
  };
}