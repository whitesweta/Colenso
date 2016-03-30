var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");
var express = require('express');
var router = express.Router();
var multer = require('multer');

var uploading = multer();
router.use(uploading.single('file'));

//GLOBAL VARIABLES//
var xml_lines = null;
var firstLocation = [];
var uniquePlaces = [];
var Colenso = [];
var Colensodiary = [];
var Colensonewspaper = [];
var Colensoprivate = [];
var Haast = [];
var Hadfield = [];
var Haddiary = [];
var Hadprivate = [];
var Hector = [];
var Holmes = [];
var Hooker = [];
var Mclean = [];
var Other = [];
var fileName = "";
var searchedQuery = "";


//FOR BROWSE - INCOMPLETE//
client.execute("XQUERY db:list('Colenso')",
	function (error, result) {
		if(error){ 
			console.error(error);
		}
		else {
				var xml_results = result.result;
				xml_lines = xml_results.split("\n");
				for (var i = 0; i < xml_lines.length; ++i) {
					var res = xml_lines[i].split("/");
					firstLocation.push(res[0]);
					if(res[0]==="Haast"){
						Haast.push(xml_lines[i]);
					}
					else if(res[0]==="Colenso"){
						Colenso.push(xml_lines[i]);
						var res2 = xml_lines[i].split("/");
						if(res2[1]==="diary"){
							Colensodiary.push(xml_lines[i]);
						}
						else if(res2[1]==="newspaper_letters"){
							Colensonewspaper.push(xml_lines[i]);
						}
						else{
							Colensoprivate.push(xml_lines[i]);
						}
					}
					else if(res[0]==="Hadfield"){
						Hadfield.push(xml_lines[i]);
						var res2 = xml_lines[i].split("/");
						if(res2[1]==="diary"){
							Haddiary.push(xml_lines[i]);
						}
						else{
							Hadprivate.push(xml_lines[i]);
						}
					}
					else if(res[0]==="Hector"){
						Hector.push(xml_lines[i]);
					}
					else if(res[0]==="Holmes"){
						Holmes.push(xml_lines[i]);
					}
					else if(res[0]==="Hooker"){
						Hooker.push(xml_lines[i]);
					}
					else if(res[0]==="McLean"){
						Mclean.push(xml_lines[i]);
					}
					else{
						Other.push(xml_lines[i]);
					}
				}
				//use this to populate nav bar?? i don't know how to do this so its hard coded
				uniquePlaces = unique(firstLocation);
			}
		}
	)

//POPULATE BROWSE - WORKING ON IT
/*router.get("/browseAuther",function(req,res){
	  var TEIs = result.result.split('\n');
	  var length = TEIs.length;
	  res.render('search', {files: TEIs, searchString: query, numResults: length});

});*/


//VIEW FILE IN NICE READABLE TEXT
router.get("/viewFile",function(req,res){
client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"(doc('Colenso/"+req.query.file+"'))[1]",
function (error, result) {
  if(error){
	   console.error(error);
	  }
	else {
	fileName = req.query.file;
	res.render('viewFile', { title: 'Colenso Project', file: result.result });
	 }
	});
});


//VIEW RAW
router.get("/viewRaw",function(req,res){
client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"(doc('Colenso/"+fileName+"'))[1]",
function (error, result) {
  if(error){
	   console.error(error);
	  }
	else {
	res.render('viewRaw', {file: result.result });
	 }
	});
});

//DOWNLOAD
router.get('/download', function(req, res) {
	var url = req.originalUrl;
	var path = url.replace('/download/', '');
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
	"(doc('Colenso/"+fileName+"'))[1]",
		function (error, result) {
			if(error){
				console.error(error);
			}
			else {
				var name = fileName;
				res.writeHead(200, {
					'Content-Type': 'application/force-download','Content-disposition': 'attachment; filename=' + name,
				});

				res.write(result.result);
				res.end();

			}
	});
});


//SEE ALL
router.get("/All",function(req,res){

	  var TEIs = xml_lines;
	  var length = TEIs.length;
	  res.render('All', {files: TEIs, numResults: length});

});

//SEE HAAST
router.get("/haast",function(req,res){

	  var TEIs = Haast;
	  var length = TEIs.length;
	  res.render('haast', {files: TEIs, numResults: length});

});

//SEE HECTOR
router.get("/hector",function(req,res){

	  var TEIs = Hector;
	  var length = TEIs.length;
	  res.render('hector', {files: TEIs, numResults: length});

});

//SEE HOLMES
router.get("/holmes",function(req,res){

	  var TEIs = Holmes;
	  var length = TEIs.length;
	  res.render('holmes', {files: TEIs, numResults: length});

});

//SEE HOOKER
router.get("/hooker",function(req,res){

	  var TEIs = Hooker;
	  var length = TEIs.length;
	  res.render('hooker', {files: TEIs, numResults: length});

});

//SEE MCLEAN
router.get("/mclean",function(req,res){
	  var TEIs = Mclean;
	  var length = TEIs.length;
	  res.render('mclean', {files: TEIs, numResults: length});

});

//SEE OTHER
router.get("/others",function(req,res){
	  var TEIs = Other;
	  var length = TEIs.length;
	  res.render('others', {files: TEIs, numResults: length});

});

//SEE ColensoDiary
router.get("/colensodiary",function(req,res){
	  var TEIs = Colensodiary;
	  var length = TEIs.length;
	  res.render('colensodiary', {files: TEIs, numResults: length});

});

//SEE HadDiary
router.get("/haddiary",function(req,res){
	  var TEIs = Haddiary;
	  var length = TEIs.length;
	  res.render('haddiary', {files: TEIs, numResults: length});

});

//SEE ColensoNewspaper
router.get("/colensonewspaper",function(req,res){
	  var TEIs = Colensonewspaper;
	  var length = TEIs.length;
	  res.render('colensonewspaper', {files: TEIs, numResults: length});

});

//SEE ColensoPrivate
router.get("/colensoprivate",function(req,res){
	  var TEIs = Colensoprivate;
	  var length = TEIs.length;
	  res.render('colensoprivate', {files: TEIs, numResults: length});

});
//SEE HadPrivate
router.get("/hadprivate",function(req,res){
	  var TEIs = Hadprivate;
	  var length = TEIs.length;
	  res.render('hadprivate', {files: TEIs, numResults: length});

});


//SEARCH BY STRING
router.get("/search",function(req,res){
	console.log("Here again");
	//console.log(searchStringAgain);
	var fullQuery = "";
	var query = req.query.searchString;
	var fullQuery0 = query.replace(/ AND /g, '\' ftand \'');
	var fullQuery01 = fullQuery0.replace(/ NOT /g, '\' ftnot \'');
	var fullQuery02 = fullQuery01.replace(/ OR /g, '\' ftor \'');
	fullQuery = fullQuery02.replace(/\"/g, '\'');
	searchedQuery = fullQuery;
	client.execute(("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "for $v in .//TEI[. contains text "+fullQuery+" using wildcards] return db:path($v)"),
	function (error, result) {
	if(error){
		console.error(error);
	}
	else {
	var TEIs = result.result.split('\n');
	var length = TEIs.length;
	res.render('search', {files: TEIs, searchString: query, numResults: length});
	}
	});
});


//ATTEMPTING NESTED SEARCH, NOT WORKING
/*
router.get("/searchAgain",function(req,res){
  var query = req.query.searchString;
  var fullQuery0 = query.replace(/ AND /g, '\' ftand \'');
  var fullQuery01 = fullQuery0.replace(/ NOT /g, '\' ftnot \'');
  var fullQuery02 = fullQuery01.replace(/ OR /g, '\' ftor \'');
  var fullQuery = fullQuery02.replace(/\"/g, '\'');

  
  var com
  client.execute(("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "for $v in .//TEI[. contains text "+searchedQuery+"] return db:path($v)"),
  function (error, result) {
	if(error){
		 console.error(error);
	  }
	  else {
	  var TEIs = result.result.split('\n');
	  var length = TEIs.length;
	  res.render('search', {files: TEIs, searchString: query, numResults: length});
	 }
	});
});
*/

//SEARCH BY XQUERY
router.get("/searchxquery", function(req,res){
  var query = req.query.searchXQuery;
  client.execute(("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "for $n in (collection('Colenso/')"+ query +")" + "return db:path($n)"),
  function(error,result){
	if(error){
	  console.error(error);
	}
	else{
	  var TEIs = result.result.split('\n');
	  var length = TEIs.length;
	  var raw = false;
	  res.render('searchxquery',{files: TEIs, searchString: query, numResults: length, isRaw: raw});
	}
  });
});


//GET INFO FOR MAIN PAGE
router.get("/",function(req,res){
	client.execute("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" +
		" (//name[@type='place'])[1] ",
		function (error, result) {
			if(error){ console.error(error);
		}
			else {
				console.log(req.query.searchString);
				res.render('index', { test: 'testtest', title: 'The Colenso Project', database_list: uniquePlaces, search_result: result.result });

			}
		});
});


//ADD FUNCTION
router.post('/upload', function(req, res){
    var queries = req.query;
    if(req.file){
        var pathOfFile = queries.path + req.file.originalname;
        var file = req.file.buffer.toString();
        client.execute('ADD TO ' + pathOfFile + ' "' + file + '"', 
        	function(error, result){
            if(error){
                console.error(error);
            }
            else{
            	res.redirect('/');
            }
        });
    } else {
        console.log('Please upload a file');
    }

});

//OTHER FUNCTIONS
function unique(arr) {
	var hash = {};
	var result = [];
	for ( var i = 0, l = arr.length; i < l; ++i ) {
		if ( !hash.hasOwnProperty(arr[i]) ) { 
			hash[ arr[i] ] = true;
			result.push(arr[i]);
		}
	}
	return result;
}

module.exports = router;