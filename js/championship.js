 Parse.initialize("Oo5VN2L3vzOHQ2dVqSpWAAhH0Ic8D9aKPSCgueKe", "c2Hd1gJNdVLVzcNj4k3dZrvI6DxiE1ntIdHZLqiS");

// Check if the strategy <strategy> used is valid(R, P or S).
function validStrategy(strategy){
	var valid = true;
	switch(strategy){
		case "R":
		case "P":
		case "S":
			break;
		default:
			valid = false;
			break;
	}
	return valid;
}

// Evaluate a Rock, Paper, Scissor match. It determines who wins the match,
// if there is a tie, the first player wins.
// param: <players> a list composed of 2 two-itemed lists with a player's name
//        and his strategy. e.g. [["Dave", "R"],["Matthew", "S"]]
function match(players){
	var winner;
	try{
		if(players.length != 2) throw "The number of players is not 2...";
		for(var i=0; i<2; i++){
			if(!validStrategy(players[i][1])) throw "Incorrect strategy...";
		}

		winner = players[0];

		if(players[0][1]=="R" && players[1][1]=="P"){
			winner = players[1];
		}
		if(players[0][1]=="P" && players[1][1]=="S"){
			winner = players[1];
		}
		if(players[0][1]=="S" && players[1][1]=="R"){
			winner = players[1];
		}
		return winner;
	}
	catch(err){
		alert(err);
	}
}

// Recursive function witch valuates a whole tournament. It contains a nested list
// that must have 2^n players to work.
// param: <tournament> - the nested list.
function evaluateTournament(tournament){
	var players=[];
	if(typeof tournament[0] != 'string'){
		players[0] = evaluateTournament(tournament[0]);
		players[1] = evaluateTournament(tournament[1]);
		var winner =  match(players);
		var loser;

		winner==players[0] ? loser=players[1] : loser=players[0];

		if(arguments.callee.caller.name=="loaded"){
			addScore(winner,3);
			addScore(loser,1);
		}
		
		return winner;
	}
	else{
		return tournament;
	}
}

function loadPlayers(){
	var Player = Parse.Object.extend("Player");
	var query = new Parse.Query(Player);
	query.limit(10);
	query.descending("score");
	query.find({
	  success: function(results) {
	  	if(results.length>0){
		    for(var i=0; i<results.length;++i){
		    	player = results[i];
		    	var name = document.createElement("div");
		    	var score = document.createElement("div");
		    	name.innerHTML = player.get("name");
		    	score.innerHTML = player.get("score");
		    	if(i % 2 == 1){
					name.setAttribute("class","col-1-2 list-row even");
					score.setAttribute("class","col-1-2 list-row even score");
		    	}
		    	else{
					name.setAttribute("class","col-1-2 list-row odd");
					score.setAttribute("class","col-1-2 list-row odd score");
		    	}
		    	document.getElementById('table-wraper').appendChild(name);
		    	document.getElementById('table-wraper').appendChild(score);

		    }
		}
		else{
			var div = document.createElement("div");
			div.setAttribute("class","col-1-2 list-row odd");
			div.innerHTML="No players found...";
			document.getElementById('table-wraper').appendChild(div);

			var div = document.createElement("div");
			div.setAttribute("class","col-1-2 list-row odd score");
			div.innerHTML="-";
			document.getElementById('table-wraper').appendChild(div);
		}

	  },
	  error: function(error) {
	    alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function addScore(winner, points){
	var Player = Parse.Object.extend("Player");

	var query = new Parse.Query(Player);
	query.equalTo("name", winner[0]);
	query.first({
		success: function(results){
			if(results!=null){
				for(var i=0; i<points; ++i){
					results.increment("score");
				}
				results.save();
			}
			else{
				var player = new Player();
				player.set("name", winner[0]);
				for(var i=0; i<points; ++i){
					player.increment("score");
				}
				player.save();
			}
		}
	});

}

function resetPlayers(){
	var Player = Parse.Object.extend("Player");
	var query = new Parse.Query(Player);
	query.find({
		success: function(results){
			for(var i=0; i<results.length; ++i){
				var obj = results[i];
				obj.destroy();
			}
		}
	});
	
	setTimeout(function(){
		$('.list-row').remove();
		loadPlayers();
	}, 1500);
}

$(function(){
	loadPlayers();
});