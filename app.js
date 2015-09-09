var https = require("https");
var express = require("express");
var formidable = require("formidable");
var fs = require("fs");

var app = express();

var token = "YOUR ACCESS TOKEN";
var bucket = {};
bucket.name = "YOUR BUCKET NAME";

function uploadFileOSS(file) {
	if (!file) {
		return;
	}

	var options = {
		host: "developer.api.autodesk.com",
		path: "/oss/v1/buckets/" + bucket.name + "/objects/" + file.name,
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

	fs.readFile(file.path, function (err, data){
		uploadFileRequest.write(data);
		uploadFileRequest.end();
	});
}

app.get("/", function (req, res){
	res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res){
	var form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req);

	form.on("fileBegin", function (name, file){
		file.path = __dirname + "/uploads/" + file.name;
	});

	form.on("file", function (name, file){
		uploadFileOSS(file); // passes in a formidable file object
	});

	res.sendFile(__dirname + "/index.html");
});

app.listen(3000);