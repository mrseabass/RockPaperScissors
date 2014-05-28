function handleFileSelect(evt){
	var dt    = evt.dataTransfer;
  	var files = dt.files;
	var file = files[0];
	if(file){
		var reader = new FileReader();
		reader.readAsText(file);

		reader.onload = loaded;
		reader.onerror = handleError;
		reader.onloadend = handleLoadEnd;
	}
	else{
		alert("Unable to load the file!");
	}
	return false;
}

function loaded(evt){
	var fString = evt.target.result;
	var str = fString.replace(/[\t\r\n]/g, '');
	if(str[0]=="[" && str[ str.length-1 ] == "]"){
		var array = JSON.parse(str);
		console.log(evaluateTournament(array));
	}
	else{
		alert("File must be in the specified tournament format");
	}
}

function handleError(evt){
	if(evt.target.error.name == "NotReadableError"){
		alert("Colud not read file");
	}
}

function handleLoadEnd(){
	
	setTimeout(function(){
		$('.list-row').remove();
		loadPlayers();
	}, 1500);
	
}

// Check for the various File API support.
if (window.File && window.FileReader) {
	document.getElementById('filedrag').addEventListener("drop", handleFileSelect, false);
	window.addEventListener("dragover",function(e){
	    e = e || event;
	    e.preventDefault();
	},false);

	window.addEventListener("drop",function(e){
	    e = e || event;
	    e.preventDefault();
	},false);
}
else{
	alert('The File APIs are not fully supported in this browser.');
}

function download(file){
	window.location=file;
}