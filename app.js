var https = require("https");

var token = "XZt4JnwJQqNQTvry2bPffDfWrSvK";
var bucket = {};
bucket.name = "shiyas-bucket-100";

function uploadFile(file) {
	
	var options = {
		host: "developer.api.autodesk.com",
		path: "/oss/v1/buckets/" + bucket.name + "/objects/" + "filename.txt",
		method: "PUT", 
		headers: {
			"Content-Type": "application/octet-stream",
			"Authorization": "Bearer " + token
		}
	};

	var uploadFileRequest = https.request(options, function (uploadResponse){
		var responseString = "";

		uploadResponse.on('data', function (data) {
			responseString += data;
		});
		uploadResponse.on("end", function () {
			console.log(responseString); // print response
		});
	});

	uploadFileRequest.write(file);
	uploadFileRequest.end();
}

uploadFile("sometext");