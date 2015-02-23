//On document load
$(document).ready(function(){
});

var game = new Game();


//Create a Game constructor function
function Game(){
	this.target = generateTarget(1,100); //Number that the player will have to guess
	this.maxGuesses = 8; //Maximum number of chances that the player has
	this.priorGuesses = []; //List of all prior guesses in this game session
	this.agent = cletus; //Agent that the player will be saving
	this.notification = ["Welcome!", "Guess a number from 1-100.", "neutral"];
	this.isGameOver = false; 
}


//Reset Game Function
Game.prototype.reset = function(){
	generateTarget(1,100);
	this.priorGuesses = [];
};

//Configure Game Components like Number of Guesses and Agent Function and restarts game
Game.prototype.config = function(maxGuesses, agent){
	this.maxGuesses = maxGuesses;
	this.agent = agent;
	this.reset();
};

//Hint function
Game.prototype.getTarget = function(){
	return this.target;
};

//Checks to see if guess is correct
Game.prototype.checksCollision = function(guess){
	if (guess === this.target){
		return [true];
	} else if (priorGuesses.length === 0){
		if(guess < this.target){
			this.priorGuesses.push(guess);
			return [false, "Higher!", "cold"];
		} else {
			this.priorGuesses.push(guess);
			return [false, "Lower!", "cold"];
		}
	} else if (checksBefore(guess)) {
		return [false, "Guess again.", "cold", " You guessed this number before."];
	} else{
		if(Math.abs(priorGuesses[priorGuesses.length - 1] - this.target) <= Math.abs(guess - this.target)){
			if(guess < this.target){
				return [false, "Warmer!", "warm", "Guess higher."];
			} else {
				return [false, "Warmer!", "warm", "Guess lower."];
			}

		} else {
			if(guess < this.target){
				return [false, "Colder!", "cold", "Guess higher."];
			} else {
				return [false, "Colder!", "cold", "Guess lower."];
			}

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
//Validate Number Input Function
//Save prior guesses function
//Toggle Active & Inactive classes

//Agent Feedback function
//Game Notification function


/* Generating Functions

 */

//Generate Number to Guess Function
function generateTarget(min, max){
	return Math.ceil(Math.random() * (max - min + 1) + min + 1);
}

//Generate an Agent ***Actualy better to make an Agent List
function generateAgent(name){
	return (function(){
		//Instantiate the 3 different agents
		var cletus = new Agent("Cletus",
								["Can't believe you stoop so low.", "I rather rot here than be free because of their help.","You call yourself an agent?"],
								["Jeez. About. Time.", "Could have gotten out sooner if they didn't bound me."],
								["When I saw you, I knew there was no hope.", "The agency betrayed me by bringing you in."],
								["Do you not have a childhood?", "Use your training!", "What?", "Let us switch places and have me do this."],
								["Oh. My. God.", "Guess the agency doesn't want to pay for my retirement benefits."],
								"Cletus is an agent that has been in the field for a long time. Seen many things. Does not like to chit-chat. Just wants to see the job done. Will get in your face if he doesn't see things getting done.");
		var claire = new Agent("Claire",
								["Whatever it takes to get us out of here.", "Just do what you have to do."],
								["Thank you, hero.", "YES! I knew you could do it."],
								["Don't need to be sorry, you did your best.", "Thanks anyway."],
								["Step back and take a breather.", "It's okay. We still got another shot", "Keep your head up."],
								["Hey", "Thanks for coming in."],
								"Claire is a fresh agent that recently was transferred from her desk position. She is glad for this opportunity.s");
		var fido = new Agent("Fido",
								["**T__T**"],
								["**runs up to you and dance around your feet**", "Woof woof Woof!"],
								["**X___X**", "**takes last breath**"],
								["**softly whimpers**", "**looks deep into your soul with his watery eyes**"],
								["Woof!"],
								"Dog was a failed government experiment pushed aggressively by [INTELLIGENCE OFFICER'S NAME REDACTED], after being moved by the Air Bud movie series. However the security officer has since been able to utilize its super cuteness in hostile situations to coax the opposition into submitting to peaceful negotiations");

		return agent;
	})();
}

//Create Agent constructor function
function Agent(name, hintArray, saveArray, failArray, missedArray, welcomeArray, description){
	this.name = name;
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