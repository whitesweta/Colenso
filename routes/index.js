var basex = require('basex');
var client = new basex.Session("127.0.0.1", 1984, "admin", "admin");
client.execute("OPEN Colenso");
var express = require('express');
var router = express.Router();

//GLOBAL VARIABLES//
var xml_lines = null;
var firstLocation = [];
var uniquePlaces = [];


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
				}
				uniquePlaces = unique(firstLocation);
				for (var i = 0; i < uniquePlaces.length; ++i) {
  					console.log('value at index [' + i + '] is: [' + uniquePlaces[i] + ']');
  			}
			}
		}
	)


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


//SEARCH BY STRING
router.get("/search",function(req,res){
  var query = req.query.searchString;
  client.execute(("XQUERY declare default element namespace 'http://www.tei-c.org/ns/1.0';" + "for $v in .//TEI[. contains text "+query+"] return db:path($v)"),
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
      res.render('searchxquery',{files: TEIs, searchString: query, numResults: length});
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