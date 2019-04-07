const request = require('request');
recieveData = {}

function initialize(){
    // Setting URL and headers for request
    var options = {
        url: 'http://localhost:5000'
    };
    // Return new promise 
    return new Promise(function(resolve, reject) {
    	// Do async job
        request.get(options, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(body));
            }
        })
    })

}

recieveData.main = function() {
    var initializePromise = initialize();
    initializePromise.then(function(result) {
        console.log("Recieved user details");
        
        return result;
    }, function(err) {
        console.log(err);
    })
}



module.exports = recieveData