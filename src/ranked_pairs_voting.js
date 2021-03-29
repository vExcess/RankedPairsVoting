//factorial of a number
function factorial(num){
    var result = 1;
    for(var i = 2; i <= num; i++){
        result *= i;
    }
    return result;
}

//calculate the number of pairs
function numCombinations(numItems, itemsPerGroup){
    return factorial(numItems) / (factorial(itemsPerGroup) * factorial(numItems - itemsPerGroup));
}

//create listener for input change
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

//handle the input change
var diplayContent = false;
var fileContent = "";
function handleFileSelect(event){
    //create a file reader
    var fileReader = new FileReader();
    //select the file
    var file = event.target.files[0];
    
    //function that is fired once the file is done being read
    fileReader.onload = function(event){
        //display the fileContents
        var fileContents = fileReader.result || event.target.result;
        fileContent = fileContents;
    }
    
    //read the file as a text file
    fileReader.readAsText(file);
    
    diplayContent = true;
}

//store the data
var seperators = ["Timestamp", "Name", "Email Address", "Do you approve the draft bylaws and petition for autonomous status?", []];
var ballots = [];

//draw loop
function draw(){
    //add the data once inputed
    if(diplayContent && fileContent !== ""){
        //reset ballots
        ballots = [];
        
        //reset the content table
        var resultsTable = document.getElementById("fileContent");
        resultsTable.innerHTML = "";
        
        var temp = fileContent.split("\n");
        var topRow = temp[0].split(",");
        //add seperators
        seperators[seperators.length-1] = topRow.slice(seperators.length-1, topRow.length);
        //at ballots
        for(var i = 1; i < temp.length; i++){
            ballots.push(temp[i].split(","));
        }

        //go through the ballot
        for(var i = ballots.length-1; i >= 0; i--){
            //add the user data to the content table
            var row = resultsTable.insertRow(0);
            for(var j = 0; j < ballots[i].length; j++){
                row.insertCell(j).innerHTML = "<span style='padding-left: 4px; padding-right: 4px; padding-top: 2px; padding-bottom: 2px;'>" + ballots[i][j] + "</span>";
            }
        }
        
        //add seperators
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
        
        diplayContent = false;
        
        //remove empty candidates
        for(var i = 0; i < seperators[seperators.length-1].length; i++){
            if(seperators[seperators.length-1][i].length < 2){
                seperators[seperators.length-1].splice(i, 1);
                i--;
            }
        }
        
        //find all the pairs
        var pairsOut = document.getElementById("pairs");
        var candidates = seperators[seperators.length-1];
        var pairs = [];
        for(var i = 0; i < candidates.length; i++){
            for(var j = i+1; j < candidates.length; j++){
                pairs.push([candidates[i], candidates[j], 0, 0, 0]);
            }
        }
        
        //display if there is an error or not
        if(pairs.length === numCombinations(candidates.length, 2)){
            pairsOut.innerHTML = "<span style='color: green;'>[✔] The correct amount of pairs was found</span><br><br>";
        }else{
            pairsOut.innerHTML = "<span style='color: red;'>[✘] The incorrect amount of pairs was found</span><br><br>";
        }
        
        //database of places
        var places = [
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
        
        //calculate scores for each pair
        for(var p = 0; p < pairs.length; p++){
            //reset score for the pair
            var score1 = 0;
            var score2 = 0;
            
            //find the indexes on the ballot for both candidates
            var candidate1Index = candidates.indexOf(pairs[p][0]) + seperators.length-1;
            var candidate2Index = candidates.indexOf(pairs[p][1]) + seperators.length-1;
            
            //loop through all the ballots to find the scores
            for(var b = 0; b < ballots.length; b++){
                //get the candidate content for the ballot
                var ballotContent1 = ballots[b][candidate1Index].toLowerCase();
                var ballotContent2 = ballots[b][candidate2Index].toLowerCase();
                
                //find what the candidate was ranked in number form on the ballot
                for(var n = places.length-1; n >= 0; n--){
                    if(ballotContent1.includes(n+1) || ballotContent1.includes(places[n][0]) || ballotContent1.includes(places[n][1])){
                        ballotContent1 = n+1;
                        break;
                    }
                }
                for(var n = places.length-1; n >= 0; n--){
                    if(ballotContent2.includes(n+1) || ballotContent2.includes(places[n][0]) || ballotContent2.includes(places[n][1])){
                        ballotContent2 = n+1;
                        break;
                    }
                }
                
                //add to the score
                if(ballotContent1 > ballotContent2){
                    score1++;
                }else if(ballotContent2 > ballotContent1){
                    score2++;
                }else{
                    score1++;
                    score2++;
                }
            }
            
            //add the data to the pair
            pairs[p][2] = score1;
            pairs[p][3] = score2;
            pairs[p][4] = Math.round(score1/(score1+score2)*100);
        }
        
        for(var p = 0; p < pairs.length; p++){
            if(pairs[p][3] > pairs[p][2]){
                var temp = pairs[p][0];
                pairs[p][0] = pairs[p][1];
                pairs[p][1] = temp;
                temp = pairs[p][2];
                pairs[p][2] = pairs[p][3];
                pairs[p][3] = temp;
                pairs[p][4] = Math.round(pairs[p][2]/(pairs[p][2]+pairs[p][3])*100);
            }
        }
        
        //sort the pairs by score
        pairs.sort(function(a, b) {
            return b[4] - a[4];
        });
        
        //diplay all the pairs
        for(var p = 0; p < pairs.length; p++){
            if(pairs[p][2] === pairs[p][3]){
                pairsOut.innerHTML += pairs[p][0] + " ties " + pairs[p][1] + " " + pairs[p][2] + " - " + pairs[p][3] + " " + pairs[p][4] + "%<br>";
            }else{
                pairsOut.innerHTML += pairs[p][0] + " wins " + pairs[p][1] + " " + pairs[p][2] + " - " + pairs[p][3] + " " + pairs[p][4] + "%<br>";
            }
        }
        
    }
}

//run the draw loop
setInterval(function(){draw();}, 1000/60);
