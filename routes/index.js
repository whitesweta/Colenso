var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");
var express = require('express');
var router = express.Router();

//GLOBAL VARIABLES//
var xml_lines = null;
var firstLocation = [];
var uniquePlaces = [];
var Colenso = [];
var Haast = [];
var Hadfield = [];
var Hector = [];
var Holmes = [];
var Hooker = [];
var Mclean = [];
var Other = [];
var fileName = "";


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
  					else if(res[0]==="Hector"){
  						Haast.push(xml_lines[i]);
  					}
  					else if(res[0]==="Holmes"){
  						Holmes.push(xml_lines[i]);
  					}
  					else if(res[0]==="Hooker"){
  						Hooker.push(xml_lines[i]);
  					}
  					else if(res[0]==="Mclean"){
  						Mclean.push(xml_lines[i]);
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

//DOWNLOAD. DONT KNOW WHAT THIS
router.get("/download",function(req,res,next){
	
	var url = req.originalUrl;
	var path = url.replace('/download/', '');
	client.execute("XQUERY doc('"+path+"')",
		function(error, result) {
			if (error) {
				console.error(error);
			}
			else {
				var doc = result.result;
				var filename = 'tei_document.xml';
				res.writeHead(200, {
					'Content-Disposition': 'attachment; filename=' + filename,
				});
				res.write(doc);
				res.end();
			}
		}
	)
});

router.get("/All",function(req,res){

      var TEIs = xml_lines;
      var length = TEIs.length;
      res.render('All', {files: TEIs, numResults: length});

});

//SEARCH BY STRING
router.get("/search",function(req,res){
  var query = req.query.searchString;
  var fullQuery = query
  			.replace(" AND ", '\' ftand \'')
			.replace(" NOT ", '\' ftnot \'')
			.replace(" OR ", '\' ftor \'');

  client.execute(("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "for $v in .//TEI[. contains text "+fullQuery+"] return db:path($v)"),
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