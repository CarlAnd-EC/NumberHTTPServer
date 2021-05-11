# Basic HTTP Server for numeric query handling

### Author: Carlos Andrés Escalona Contreras 

#### Proposed by: Javier Luna
Main file: NumberHTTPServer.js  
Created: 05/05/2021  
Updated: 08/05/2021  
## Installation
### `git clone `

## Testing
### `npm run dev`

## Description:
1. Server that is listening to requests on port 9000.
2. Node App stores a number in the path /myNumber. Use body payload to send the value: { myNumber: 123 }. Don't create one number per request, just create or update the current number.
3. The value number can be seen with a request to /myNumber.
4. If a request from path /myNumber/{multiplier} is received, you should return in the response the value: myNumber*multiplier. If there is no current value for myNumber, return 400 error.
5. Delete the current value with a request to /reset.
6. If you try to use a non-numeric value to create/update myNumber, a 400 error should be returned.
7. If there is no value stored, a 404 should be returned.
8. Any other request should be handled with an error code 404, "resource not found".