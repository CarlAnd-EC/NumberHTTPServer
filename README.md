# Basic HTTP Server for number storage

### Author: Carlos Andrés Escalona Contreras 

#### Proposed by: Javier Luna
Main file: NumberHTTPServer.js  
Created: 05/05/2021  
Updated: 12/05/2021  
## Installation
### `git clone `

## Testing
### `npm run dev`

## Description:
* Server that is listening to requests on port 9000.

| Endpoint | Method | Description |
|-|-|-|
| /myNumber | GET | Displays the number stored in the 'myNumber' variable. If there is no value stored, a 404 error is returned. |
| /myNumber | POST | Stores or update the current number in the path /myNumber. If a non-numeric value is sent to create/update 'myNumber', a 400 error is returned.|
| /reset | DELETE | Clears the content of the variable 'myNumber'. |
| /myNumber/{multiplier} | GET | Returns the stored value multiplied by the value specified in 'multiplier': myNumber*multiplier. If there is no current value for 'myNumber', it returns a 400 error. |

* Node App stores a number in the path /myNumber. Use body payload to send the value: { myNumber: 123 }. Don't create one number per request, just create or update the current number.
* Any other request is handled with an error code 404, "resource not found".