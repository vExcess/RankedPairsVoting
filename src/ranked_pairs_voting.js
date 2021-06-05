// factorial of a number
function factorial(num){
    var result = 1;
    for(var i = 2; i <= num; i++){
        result *= i;
    }
    return result;
}

// calculate the number of pairs
function numCombinations(numItems, itemsPerGroup){
    return factorial(numItems) / (factorial(itemsPerGroup) * factorial(numItems - itemsPerGroup));
}

// create listener for input change
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// handle the input change
var diplayContent = false;
var fileContent = "";
function handleFileSelect(event){
    // create a file reader
    var fileReader = new FileReader();
    // select the file
    var file = event.target.files[0];
    
    // function that is fired once the file is done being read
    fileReader.onload = function(event){
        // display the fileContents
        var fileContents = fileReader.result || event.target.result;
        fileContent = fileContents;
    }
    
    // read the file as a text file
    fileReader.readAsText(file);
    
    diplayContent = true;
}

// store the data
var seperators = ["Timestamp", "Name", "Email Address", []];
var ballots = [];

function handleDataTable(){
	// reset ballots
	ballots = [];
	seperators = [];
	
	// reset the content table
	var resultsTable = document.getElementById("fileContent");
	resultsTable.innerHTML = "";
	
	var temp = [];
	// split up the fileContent into arrays
	for(var i = 0; i < fileContent.length; i++){
		var j = i;
		while(fileContent.charAt(j) !== "\n" && fileContent.charAt(j) !== "\r" && j < fileContent.length){
			j++;
		}
		var content = fileContent.slice(i, j).replace("\n", "").replace("\r", "");
		if(content.length > 0){
			temp.push(content);
		}
		i = j;
	}
	
	var topRow = temp[0].split(",");
	// add seperators
	for(var i = 0; i < topRow.length; i++){
		if(!topRow[i].includes("Candidate Rankings") && topRow[i].length > 0){
			seperators.push(topRow[i]);
		}
	}
	seperators.push([]);
	for(var i = 0; i < topRow.length; i++){
		if(topRow[i].includes("Candidate Rankings") && topRow[i].length > 0){
			seperators[seperators.length - 1].push(topRow[i]);
		}
	}

	// add ballots
	for(var i = 1; i < temp.length; i++){
		var splitBallot = temp[i].split(",");
		var newSplitBallot = [];
		for(var j = 0; j < splitBallot.length; j++){
			if(j < seperators.length + seperators[seperators.length - 1].length - 1){
				newSplitBallot.push(splitBallot[j]);
			}
		}
		ballots.push(newSplitBallot);
	}

	// go through the ballot
	for(var i = ballots.length-1; i >= 0; i--){
		// add the user data to the content table
		var row = resultsTable.insertRow(0);
		for(var j = 0; j < ballots[i].length; j++){
			row.insertCell(j).innerHTML = "<span style='padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;'>" + ballots[i][j] + "</span>";
		}
	}
	
	// add seperators
	var row = resultsTable.insertRow(0);
	for(var i = 0; i < seperators.length; i++){
		if(typeof seperators[i] === "string"){
			row.insertCell(i).innerHTML = "<strong style='padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;'>" + seperators[i] + "</strong>";
		}else{
			for(var j = 0; j < seperators[i].length; j++){
				row.insertCell(i+j).innerHTML = "<strong style='padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;'>" + seperators[i][j] + "</strong>";
			}
		}
	}
	
	// remove empty candidates
	for(var i = 0; i < seperators[seperators.length - 1].length; i++){
		if(seperators[seperators.length-1][i].length < 2){
			seperators[seperators.length-1].splice(i, 1);
			i--;
		}
	}
	
	diplayContent = false;
}

// database of places
const places = [
	["one", "first"],
	["two", "second"],
	["three", "third"],
	["four", "fourth"],
	["five", "fifth"],
	["six", "sixth"],
	["seven", "seventh"],
	["eight", "eighth"],
	["nine", "ninth"],
	["ten", "tenth"],
	["eleven", "eleventh"],
	["twelve", "twelveth"],
	["thirteen", "thirteenth"],
	["fourteen", "fourteenth"],
	["fifteen", "fifteenth"],
	["sixteen", "sixteenth"],
	["seventeen", "seventeenth"],
	["eighteen", "eighteenth"],
	["nineteen", "nineteenth"],
	["twenty", "twentieth"],
];
function processData(){
	if(fileContent !== ""){
		// gets table
		var oTable = document.getElementById('fileContent');
		// gets rows of table
		var rowLength = oTable.rows.length;
		// loops through rows    
		for (i = 0; i < rowLength; i++){
			// gets cells of current row  
			var oCells = oTable.rows.item(i).cells;
			// loops through each cell in current row
			for(var j = 0; j < oCells.length; j++){
				// get your cell info here
				var cellVal = oCells.item(j).innerHTML;
				// console.log(cellVal);
			}
		}
		
		// find all the pairs
		var pairsOut = document.getElementById("pairs");
		var candidates = seperators[seperators.length-1];
		var pairs = [];
		for(var i = 0; i < candidates.length; i++){
			for(var j = i + 1; j < candidates.length; j++){
				pairs.push([candidates[i], candidates[j], 0, 0, 0]);
			}
		}
		
		// log if there is an error or not
		if(pairs.length === numCombinations(candidates.length, 2)){
			console.log("[✔] The correct amount of pairs was found");
		}else{
			console.log("[✘] The incorrect amount of pairs was found");
		}
		
		// calculate scores for each pair
		for(var p = 0; p < pairs.length; p++){
			// reset score for the pair
			var score1 = 0;
			var score2 = 0;
			
			// find the indexes on the ballot for both candidates
			var candidate1Index = candidates.indexOf(pairs[p][0]) + seperators.length-1;
			var candidate2Index = candidates.indexOf(pairs[p][1]) + seperators.length-1;
			
			// loop through all the ballots to find the scores
			for(var b = 0; b < ballots.length; b++){
				// get the candidate content for the ballot
				var ballotContent1 = ballots[b][candidate1Index].toLowerCase();
				var ballotContent2 = ballots[b][candidate2Index].toLowerCase();
				
				// find what the candidate was ranked in number form on the ballot
				for(var n = Math.min(places.length - 1, seperators[seperators.length - 1].length); n >= 0; n--){
					if(ballotContent1.includes(n + 1) || ballotContent1.includes(places[n][0]) || ballotContent1.includes(places[n][1])){
						ballotContent1 = n+1;
						break;
					}
				}
				for(var n = Math.min(places.length - 1, seperators[seperators.length - 1].length); n >= 0; n--){
					if(ballotContent2.includes(n + 1) || ballotContent2.includes(places[n][0]) || ballotContent2.includes(places[n][1])){
						ballotContent2 = n+1;
						break;
					}
				}
				
				if(ballotContent1 && ballotContent2){
					// add to the score
					if(ballotContent1 > ballotContent2){
						score1++;
					}else if(ballotContent2 > ballotContent1){
						score2++;
					}else{
						score1++;
						score2++;
					}
				}
			}
			
			// add the data to the pair
			pairs[p][2] = score1;
			pairs[p][3] = score2;
			pairs[p][4] = Math.round(score1 / (score1 + score2) * 100);
		}
		
		// switch the candidates so that the winner is first
		for(var p = 0; p < pairs.length; p++){
			if(pairs[p][3] > pairs[p][2]){
				var temp = pairs[p][0];
				pairs[p][0] = pairs[p][1];
				pairs[p][1] = temp;
				temp = pairs[p][2];
				pairs[p][2] = pairs[p][3];
				pairs[p][3] = temp;
				pairs[p][4] = Math.round(pairs[p][2] / (pairs[p][2] + pairs[p][3]) * 100);
			}
		}
		
		// sort the pairs by score
		pairs.sort(function(a, b) {
			return b[4] - a[4];
		});

		// clear the HTML
		pairsOut.innerHTML = "";
		
		// diplay all the pairs
		for(var p = 0; p < pairs.length; p++){
			if(pairs[p][2] === pairs[p][3]){
				pairsOut.innerHTML += pairs[p][0] + " ties " + pairs[p][1] + " " + pairs[p][2] + " - " + pairs[p][3] + " " + pairs[p][4] + "%<br>";
			}else{
				pairsOut.innerHTML += pairs[p][0] + " wins " + pairs[p][1] + " " + pairs[p][2] + " - " + pairs[p][3] + " " + pairs[p][4] + "%<br>";
			}
		}
	}
}

// draw loop
function draw(){
    // add the data once inputed
    if(diplayContent && fileContent !== ""){
        handleDataTable();
    }
}

// run the draw loop
setInterval(function(){draw();}, 1000 / 60);
