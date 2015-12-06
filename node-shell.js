/**
 * Created by yaokuo on 15/12/6.
 * 应用于树莓派,调用摄像头然后输出到浏览器.
 */
var http=require("http");
var fs = require('fs');
var procstream = require('procstreams');

http.createServer(function(request, response) {
    console.log('request received');
    response.writeHead(200, {"Content-Type": "image/jpeg"});
    procstream('raspistill -o -').data(function(err,stdout,stderr){
        if(err){
            console.log(err);
            return;
        }else{
            console.log(stdout);
            response.write(stdout,'binary');
            response.end();
            return;
        }
    })

}).listen(8888);
console.log('server started');
