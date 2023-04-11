import * as dotenv from 'dotenv';  
dotenv.config();
import http from "http";  
  // createServer( fn requestListener)
  // requestListener(request, response)
const server = http.createServer( (request, response) => {  
  //handle the request  
  console.log("Received hello world request");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("Hello world testing");
  response.end();  
});  
  
server.listen(process.env.PORT, () => console.log("Server running on port 8080"));
