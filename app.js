var game = {
	answer : 0,
	totalGuesses : 0,
	agent : "dog"
};

game.initialize = function(){
	this.answer = generateRandomNumber(100);
	this.guesses = [];
	this.notification = createNotification();
	$("#gameScreen").removeClass("hide");
};

game.setTotalGuesses = function(num){
	this.totalGuesses = num;
	$("#selectMode").addClass("hide");
	$("#selectAgent").removeClass("hide");
};

game.setAgent = function(name){
	this.agent = name;
	$("#selectAgent").addClass("hide");
	this.initialize();
};

game.checkAnswer = function(){
	console.log("I am here");
	var input = $("input").val();
	if(!isNaN(input)){
		if(this.guesses.indexOf(input) === -1){
			this.guesses.push(input);
			if(input === this.answer){
				console.log("you win");
			} else if (input > this.answer){

			}
		}
	} else {

	}
};

game.getAHint = function(){
	alert("The answer is " + game.answer);
};

var generateRandomNumber = function(upperBound){
	return Math.ceil(Math.random() * upperBound);
};

function createNotification(){
	var notification = {
		text : "",
		mood : "",
	};

	notification.change = function(textIn, moodIn){
		this.text = textIn;
		this.mood = moodIn;
		this.render();
	};

	notification.render = function(){
		$(".notification").text(this.text);
		if($(".notification").hasClass("warm") && this.mood !== "warm"){
			$(".notification").removeClass("warm");
			$(".notification").addClass(this.mood);
		} else if($(".notification").hasClass("cold") && this.mood !== "cold") {
			$(".notification").removeClass("cold");
			$(".notification").addClass(this.mood);
		} else if($(".notification").hasClass("neutral") && this.mood !== "neutral"){
			$(".notification").removeClass("neutral");
			$(".notification").addClass(this.mood);
		}
	};

	return notification;
}