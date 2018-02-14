/* triviaScript.js */

/* $=jQuery; $(document) = go find the document; .ready= when ready/loaded */
$(document).ready(function() {
	var score=0;
	var streak=0;
	var total=0;
	var bestStreak=0;

	var submitButton=$("#generateQuestion");
	var correctAnswer="-1";
	document.getElementById( 'trivia' ).style.display = 'none';

	submitButton.click(function(e) {
		e.preventDefault();
		// First, reset the correct answer and uncheck the boxes
		var previousCorrect=document.getElementById( 'choice'+correctAnswer );
		if (previousCorrect!==null)
			previousCorrect.style='border:0px;';
		correctAnswer="-1";

		document.getElementById( 'trivia' ).style.display = 'initial';


		var multipleChoice = document.forms['multipleChoice'];
		for ( var i=0; i<multipleChoice.length; i++ ){
		   if(multipleChoice[i].checked == true ){
		       multipleChoice[i].checked = false;
		   }
		}

		// Next, get random values if 'any' is chosen for difficulty or category
		var categoryInput = $("#categoryInput").val();
		if (categoryInput==="any") {
			categoryInput=Math.floor(Math.random()*21)+9; }

		var difficultyInput = $("#difficultyInput").val();

		if (difficultyInput==="any") {
			var difficulty=Math.floor(Math.random()*3)+1; // returns a random number between 1 and 3

			if (difficulty===1) {
				difficultyInput="easy"; }
			else if (difficulty===2) {
				difficultyInput="medium"; }
			else if (difficulty===3) {
				difficultyInput="hard"; }
		}
		
		// get the request URL
		var myurl= "https://opentdb.com/api.php?amount=1&category=" + categoryInput+ "&difficulty=" + difficultyInput + 
			"&type=multiple";

	$.ajax({
	    url : myurl,
	    dataType : "json",

	    // on success, call this function (this function takes in a json object)
	    success : function(json) {
		console.log(json);
		var trivia=json.results[0];
		$("#question").html(trivia.question);
		// Put all possible answers together in one array
		answers=(trivia.incorrect_answers).concat(trivia.correct_answer);
		console.log(trivia.correct_answer);

		var answerIndex=Math.floor(Math.random() * 4); // starts at a random number between 0-3

		for (var i=0;i<4;i++) {
			$("#choice"+parseInt(i)).html(answers[answerIndex]);
			if (answers[answerIndex]===trivia.correct_answer) {
				correctAnswer=i; }
			answerIndex++;
			if (answerIndex>3) {
				answerIndex-=4; }
	    }
		// finally, allow the answer button to be pressed
		document.getElementById("answerQuestion").disabled = false;

		}
	});
    });


	var answerButton=$("#answerQuestion");
	
	answerButton.click(function(e) {
		e.preventDefault();

		try {
		// Play a ding if they got the answer correct or error if they get an incorrect answer
		var choice=document.querySelector('input[name="choice"]:checked').value;
		
		total++;
		if (choice==correctAnswer) {
			var audio = document.getElementById('correctSound');
			audio.play();
			document.getElementById("answerQuestion").disabled = true;
			// Increase your score
			score++;
			streak++;

			if (streak>bestStreak)
				bestStreak=streak;
		}
		else {
			var audio = document.getElementById('wrongSound');
			audio.volume=0.25;
			audio.play();
			document.getElementById("answerQuestion").disabled = true;
			// reset streak
			streak=0;
		}
		// Update your score
		$("#score").html("Total score:  "+score);
		$("#streak").html("Current streak:  "+streak);
		$("#total").html("Total questions:  "+total);
		$("#bestStreak").html("Best streak:  "+bestStreak);
		// highlight the correct answer
		var correct=document.getElementById('choice'+parseInt(correctAnswer));
		console.log(correct);
		correct.style = 'border:3px solid green; border-radius:7px;';
		}
		catch(err) {}
	});
		
		

});
