/*******************************TIMER*********************************/

var minutes = $( '#set-time' ).val();

var target_date = new Date().getTime() + ((minutes * 60 ) * 1000); // set the countdown date
var time_limit = ((minutes * 60 ) * 1000);
//régler la minuterie actuelle


setTimeout(
  function() 
  {
      alert("perdu!")
    window.location.reload();
    
    
    
  }, time_limit );

var days, hours, minutes, seconds; // variables pour les unités de temps

var countdown = document.getElementById("tiles"); // obtenir un élément de balise

getCountdown();

var stop = setInterval(function () { getCountdown(); }, 1000);

function getCountdown(){

	// trouver le nombre de "secondes" entre maintenant et la cible
	var current_date = new Date().getTime();
	var seconds_left = (target_date - current_date) / 100;
  
if ( seconds_left >= 0 ) {
  console.log(time_limit);
   if ( (seconds_left * 1000 ) < ( time_limit / 2 ) )  {
     $( '#tiles' ).removeClass('color-full');
     $( '#tiles' ).addClass('color-half');

		} 
    if ( (seconds_left * 1000 ) < ( time_limit / 4 ) )  {
    	$( '#tiles' ).removeClass('color-half');
    	$( '#tiles' ).addClass('color-empty');
    }
  
	days = pad( parseInt(seconds_left / 86400) );
	seconds_left = seconds_left % 86400;
		 
	hours = pad( parseInt(seconds_left / 3600) );
	seconds_left = seconds_left % 3600;
		  
	minutes = pad( parseInt(seconds_left / 60) );
	seconds = pad( parseInt( seconds_left % 60 ) );

	// format de la chaîne du compte à rebours + valeur de l'étiquette
	countdown.innerHTML = "<span>" + hours + ":</span><span>" + minutes + ":</span><span>" + seconds + "</span>"; 
  

  
}
   
  
  
}

function pad(n) {
	return (n < 10 ? '0' : '') + n;
}

// Bouton pour mettre en pause
var p = document.getElementById("pause");
var  paused = false;
function stopCount(){
	clearTimeout(stop);
}

function restart(){
	setInterval(time_limit);
}