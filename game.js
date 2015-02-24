//On document load
$(document).ready(function(){
	//submit guess
	$("#guessSubmit").click(function(){
		if(game.isGameOver === false){
			var guess = $("#guessNum").val();
			if (checksNumber(guess)){
				game.checksWin(parseInt(guess));
			} else {
				game.setNotification(["Not a valid number!", "cold", "Guess a number from 1-100."]);
				game.setAgentTalk("missed");
			}
		}
	});

	//Click Hint
	$("#requestHint").click(function(){
		if(game.isGameOver === false){
			game.setNotification(["This answer is " + game.getTarget() + ".","neutral","Guess you guys really can't do anything yourself."]);
			game.setAgentTalk("hint");
		}
	});

	//Toggle Give Up Button
	$("#giveUp").click(function(){
		$("#promptSection").toggleClass("hidden");
	});

	//Restart Game
	$("#restart").click(function(){
		game.reset();
	});

	//Handles Configuration
	$("#config").click(function(){
		var configPanel = $("configPanel");
		if (!configPanel.hasClass("hidden")){
			game.config($("#selectLevel").val(), $("selectAgent").val());
			configPanel.addClass("hidden");
		} else {
			configPanel.removeClass("hidden");
		}
	});
});

/*
The following are cosmetic DOM changes using Jquery.
*/
function updateNotification(){
	//updates game notifications
	var notify = $("#gameNotification");
	notify.html(function(){
		var htmlText = "<strong>" + game.notification[0] + "</strong>  " + game.notification[2];
		return htmlText;
	});
	if(game.notification[1] === "warm"){
		if(!notify.hasClass("alert-danger")){
			notify.removeClass("alert-success alert-info alert-warning").addClass("alert-danger");
		}
	} else if (game.notification[1] === "cold"){
		if(!notify.hasClass("alert-info")){
			notify.removeClass("alert-success alert-warning alert-danger").addClass("alert-info");
		}
	} else if (game.notification[1] === "neutral"){
		if(!notify.hasClass("alert-warning")){
			notify.removeClass("alert-success alert-info alert-danger").addClass("alert-warning");
		}
	} else if (game.notification[1] === "right"){
		if(!notify.hasClass("alert-success")){
			notify.removeClass("alert-info alert-warning alert-danger").addClass("alert-success");
		}
	}
}

//updates agent's trash talking
function updateAgentTalk(){
	var talk = $("#agentTalk");
	talk.html(function(){
		var htmlText = "<strong>" + game.agent.shortName + " says:</strong>  " + game.agentTalk;
		return htmlText;
	});
}

/*function togglePrompt(mode){
	//Prompt Window
	var promptPanel = $("#promptSection.panel");
	var promptTitle = $("#promptSection.panel-title");

	var restartButton = $("#restart");
	var configButton = $("#config");
	var giveUpButton = $("#giveUp");

	if(mode === "config"){
		promptPanel.removeClass("panel-danger").addClass("panel-primary");
		promptTitle.text("Start Mission");
		restartButton.removeClass("btn-danger").addClass("btn-primary disabled");
		configButton.removeClass("btn-danger btn-default").addClass("btn-success");
		giveUpButton.addClass("disabled");
	} else if (mode === "gameOver"){
		promptPanel.removeClass("panel-danger").addClass("panel-primary");
		promptTitle.text("Start Mission");
		restartButton.removeClass("btn-danger disabled").addClass("btn-primary");
		configButton.removeClass("btn-danger btn-success").addClass("btn-default");
		giveUpButton.addClass("disabled");
	} else if (mode === "inGame"){
		promptPanel.removeClass("panel-primary").addClass("panel-danger");
		promptTitle.text("Want to give up on the current mission?");
		restartButton.removeClass("btn-primary disabled").addClass("btn-danger");
		configButton.removeClass("btn-success btn-default").addClass("btn-danger");
		giveUpButton.removeClass("disabled");
	}
}

//Toggle gameOver
function updateGameState(){
	var promptSection = $("#promptSection");

	//Buttons & Input
	var hintButton = $("#requestHint");
	var submitButton = $("#guessSubmit");
	var inputField = $("#guessNum");
	
	if(game.isGameOver){
		togglePrompt("gameOver");
		hintButton.addClass("disabled");
		submitButton.addClass("disabled");
		inputField.addClass("disabled");
		if(promptSection.hasClass("hidden")){
			promptSection.removeClass("hidden");
		}
	} else {
		togglePrompt("inGame");
		hintButton.removeClass("disabled");
		submitButton.removeClass("disabled");
		inputField.removeClass("disabled");
		if(!promptSection.hasClass("hidden")){
			promptSection.addClass("hidden");
		}
	}
}*/

/*
The following are Game related functions.
 */

var game = new Game();

//Create a Game constructor function
function Game(){
	this.target = generateTarget(1,100); //Number that the player will have to guess
	this.maxGuesses = 8; //Maximum number of chances that the player has
	this.priorGuesses = []; //List of all prior guesses in this game session
	this.agentList = new AgentList();
	this.agent = this.agentList.cletus; //Agent that the player will be saving
	this.notification = ["Welcome!", "neutral", "Guess a number from 1-100."]; //Format of notification is [what is bold, type of alert, what is not bold]
	this.agentTalk = "Surprise.";
	this.isGameOver = false;
}


//Reset Game Function
Game.prototype.reset = function(){
	this.target = generateTarget(1,100);
	this.priorGuesses = [];
	this.setNotification(["Welcome!", "neutral", "Guess a number from 1-100."]);
	this.agentTalk = this.setAgentTalk("welcome");
	this.isGameOver = false;
};

//Configure Game Components like Number of Guesses and Agent Function and restarts game
Game.prototype.config = function(maxGuessesName, agentLongName){
	//Set Max Guesses
	if (maxGuessesName === "Clueless (8 Guesses)"){
		this.maxGuesses = 8;
	} else if (maxGuessesName === "Project (5 Guesses)"){
		this.maxGuesses = 5;
	} else if (maxGuessesName === "Prospect (3 Guesses)"){
		this.maxGuesses = 3;
	}

	//Set Agent
	if (this.agent === "Cletus, the About-Retired"){
		this.agent = this.agentList.cletus;
	} else if (this.agent === "Claire, the First Mission"){
		this.agent = this.agentList.claire;
	} else if (this.agent === "Fido, the Dog Experiment"){
		this.agent = this.agentList.fido;
	}

	this.reset();
};

//For Hint function
Game.prototype.getTarget = function(){
	return this.target;
};

//Set Notification
Game.prototype.setNotification = function(arrayNotification){
	this.notification = arrayNotification;
	updateNotification();
};

Game.prototype.setAgentTalk = function(scenerio){
	if(scenerio === "hint"){
		this.agentTalk = this.agent.hintPhrases.getPhrase();
		updateAgentTalk();
	} else if (scenerio === "success") {
		this.agentTalk = this.agent.savePhrases.getPhrase();
		updateAgentTalk();
	} else if (scenerio === "fail") {
		this.agentTalk = this.agent.failPhrases.getPhrase();
		updateAgentTalk();
	} else if (scenerio === "missed") {
		this.agentTalk = this.agent.missedPhrases.getPhrase();
		updateAgentTalk();
	} else if (scenerio === "welcome") {
		this.agentTalk = this.agent.welcomePhrases.getPhrase();
		updateAgentTalk();
	}
};

//Checks to see if guess is correct
Game.prototype.checksCollision = function(guess){
	if (guess === this.target){
		return [true];
	} else if (guess > 100 || guess < 1){
		return [false, ["Not a valid number!", "cold", "Guess a number from 1-100."]];
	} else if (this.priorGuesses.length === 0){
		if(guess < this.target){
			this.priorGuesses.push(guess);
			return [false, ["Higher!", "cold", "Guess again."]];
		} else {
			this.priorGuesses.push(guess);
			return [false, ["Lower!", "cold", "Guess again."]];
		}
	} else if (this.checksBefore(guess)) {
		return [false, ["Guess again.", "cold", " You guessed this number before."]];
	} else{
		var feedback = [];
		var isSpreadLarger = Math.abs(this.priorGuesses[this.priorGuesses.length - 1] - this.target) <= Math.abs(guess - this.target);
		var isGuessSmaller = guess < this.target;
		if(!isSpreadLarger && isGuessSmaller){
			feedback = [false, ["Warmer!", "warm", "Guess higher."]];
		} else if(!isSpreadLarger && !isGuessSmaller) {
			feedback = [false, ["Warmer!", "warm", "Guess lower."]];
		} else if (isSpreadLarger && isGuessSmaller){
			feedback = [false, ["Colder!", "cold", "Guess higher."]];
		} else {
			feedback = [false, ["Colder!", "cold", "Guess lower."]];
		}
		this.priorGuesses.push(guess);
		return feedback;
	}
};

Game.prototype.checksWin = function(guess){
	var checkResults = this.checksCollision(guess);
	 if(checkResults[0] === true){
	 	this.setNotification(["You got it right!", "right", "Mission successful."]);
	 	this.setAgentTalk("success");
	 	this.isGameOver = true;
	 } else {
	 	if(this.priorGuesses.length === this.maxGuesses){
	 		this.setNotification(["You failed your mission!", "warm","All lives lost."]);
	 		this.setAgentTalk("fail");
	 		this.isGameOver = true;
	 	} else {
	 		this.setNotification(checkResults[1]);
	 		this.setAgentTalk("missed");
	 	}
	 }
};

Game.prototype.checksBefore = function(guess){
	for(var i = 0; i < this.priorGuesses.length; i++){
		if (guess === this.priorGuesses[i]){
			return true;
		}
	}
	return false;
};

/* Generating Functions

 */

//Generate Number to Guess Function
function generateTarget(min, max){
	return Math.ceil(Math.random() * (max - min + 1) + min + 1);
}

function checksNumber(stringInput){
	if(isNaN(parseInt(stringInput))){
		return false;
	} else {
		return true;
	}
}
//AgentList constructor function
function AgentList(){
		this.cletus = new Agent("Cletus",
								"Cletus, the About-Retired",
								["Can't believe you stoop so low.", "I rather rot here than be free because of their help.","You call yourself an agent?"],
								["Jeez. About. Time.", "Could have gotten out sooner if they didn't bound me."],
								["When I saw you, I knew there was no hope.", "The agency betrayed me by bringing you in."],
								["Do you not have a childhood?", "Use your training!", "What?", "Let us switch places and have me do this."],
								["Oh. My. God.", "Guess the agency doesn't want to pay for my retirement benefits."],
								"Cletus is an agent that has been in the field for a long time. Seen many things. Does not like to chit-chat. Just wants to see the job done. Will get in your face if he doesn't see things getting done.");
		this.claire = new Agent("Claire",
								"Claire, the First Mission",
								["Whatever it takes to get us out of here.", "Just do what you have to do."],
								["Thank you, hero.", "YES! I knew you could do it."],
								["Don't need to be sorry, you did your best.", "Thanks anyway."],
								["Step back and take a breather.", "It's okay. We still got another shot", "Keep your head up."],
								["Hey", "Thanks for coming in."],
								"Claire is a fresh agent that recently was transferred from her desk position. She is glad for this opportunity.s");
		this.fido = new Agent("Fido",
								"Fido, the Dog Experiment",
								["**T__T**"],
								["**runs up to you and dance around your feet**", "Woof woof Woof!"],
								["**X___X**", "**takes last breath**"],
								["**softly whimpers**", "**looks deep into your soul with his watery eyes**"],
								["Woof!"],
								"Dog was a failed government experiment pushed aggressively by [INTELLIGENCE OFFICER'S NAME REDACTED], after being moved by the Air Bud movie series. However the security officer has since been able to utilize its super cuteness in hostile situations to coax the opposition into submitting to peaceful negotiations");

}

//Create Agent constructor function
function Agent(shortName, longName, hintArray, saveArray, failArray, missedArray, welcomeArray, description){
	this.shortName = shortName;
	this.longName = longName;
	this.hintPhrases = new Phrases(hintArray);
	this.savePhrases = new Phrases(saveArray);
	this.failPhrases = new Phrases(failArray);
	this.missedPhrases = new Phrases(missedArray);
	this.welcomePhrases = new Phrases(welcomeArray);
	this.description = description;
}

//Create Phrases constructor function
function Phrases(phrasesArray){
	this.phrases = phrasesArray;
}

Phrases.prototype.getPhrase = function(){
	var randomIndex = Math.floor(Math.random() * (this.phrases.length - 0));
	return this.phrases[randomIndex];
};