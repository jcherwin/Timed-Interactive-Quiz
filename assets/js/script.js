// Define global class for handling new quiz objects
class Quiz {
  constructor(q, a1t, a2t, a3t, a4t, aC) {
    this.question = q;
    this.a1Text = a1t;    
    this.a2Text = a2t;    
    this.a3Text = a3t;    
    this.a4Text = a4t;
    this.aCorrect = aC;
  }  
}

var quizArray = [];  

// New quizzes can be easily defined here, along with the number value of the the correct question
const quiz1 = new Quiz(
  "Commonly used data types DO NOT include:",
  "strings",
  "booleans",
  "alerts",
  "numbers",3,    
  );
quizArray.push(quiz1);

const quiz2 = new Quiz(
  "The condition in an if / else statement is enclosed within ____.",
  "quotes",
  "curly braces",
  "parenthesis",
  "square brackets",3,
  );
quizArray.push(quiz2);

const quiz3 = new Quiz(
  "Arrays in JavaScript can be used to store _____.",
  "numbers and strings",
  "other arrays",
  "booleans",
  "all of the above",4,   
  );
quizArray.push(quiz3);

const quiz4 = new Quiz(
  "String values must be enclosed within ____ when being assigned to variables.",
  "commas",
  "curly brackets",
  "quotes",
  "parenthesis",3,   
  );
quizArray.push(quiz4);

const quiz5 = new Quiz(
  "A very useful tool used during development and debugging for printing content to the debugger is:",
  "JavaScript",
  "terminal / bash",
  "for loops",
  "console.log",4,
  );
quizArray.push(quiz5);

// Define global variables
const SCORE_MAX = 90;
const QUIZ_MAX = quizArray.length;
const HIGHSCORES = "highscores";

var quizCounter = quizArray.length;  //dynamic variable that is adjusted when a question is answered
var scoreCounter = SCORE_MAX;  //timer 

// Query DOM elements
var startBtn = document.querySelector("#startBtn");
var scoresLink = document.querySelector("#scoresLink");
var mainContent = document.querySelector("#content");
var timerSpan = document.querySelector("#timer");
var resultP = document.querySelector(".result-p");
var mainEl = document.querySelector("main");

const landingPageContent = document.querySelector("#content").innerHTML;

// Object that stores all functions related to the main score timer
const scoreTimer = {
  start() {
    scoreCounter = SCORE_MAX;
    scoreCounter++;
    this.timeoutID = setInterval(() => {
      if(scoreCounter > 1){
        scoreCounter--;
        this.updateSpan(scoreCounter);
      }else{
        scoreCounter = 0;
        this.updateSpan(0);      
        clearInterval(this.timeoutID);
        loadResults();      
      }      
    }, 1000);
  },
  stop(){
    clearTimeout(this.timeoutID);
  },
  updateSpan(num){
    timerSpan.innerHTML = num;
  },
};

const displayResultTimer = {
  start() {
    this.timeoutID = setTimeout(() => {
      resultP.style.cssText = "display:none !important";
    }, 2000);
  },
  stop() {
    clearTimeout(this.timeoutID);
  },
};

// Governs all access to local storage 
function accessLocalStorage(op,keyword,content){
  if(op === "get"){
    return localStorage.getItem(keyword);
  }
  else if(op === "set"){
    localStorage.setItem(keyword,content);
  }
  else if(op === "remove"){
    localStorage.removeItem(keyword);
  }
}

// Contains all the actions to be taken when an answer button is clicked
function answerEvent(result){
  //var resultCheck = document.querySelector(".result-p");
  if(!result){
    if(scoreCounter >= 10){
      scoreCounter -= 10;
    }else{
      scoreCounter = 0;
    }
    outcomeMsg(false);    
  }else{
    outcomeMsg(true);
  }
  quizCounter--;
  var nextQuiz = QUIZ_MAX - quizCounter;

  if(quizCounter > 0){
    writeNewQuiz(quizArray[nextQuiz]);
  }else{
    scoreTimer.stop();
    scoreTimer.updateSpan(scoreCounter);
    loadResults();
  }
}

// Clears the section tag (and its class attribute) where all content is written
function clearMain(){
  mainContent.innerHTML = "";
  mainContent.removeAttribute("class");
}

// Gets the string from localstorage and returns it as an object (array)
function getHighscores(){
  var tempArray = [];  
  var temp = accessLocalStorage("get", HIGHSCORES, ""); //string  

  if(temp == null){    
    return tempArray;  //obj
  }else{
    return tempArray = JSON.parse(temp);  //obj     
  }
}

// Loads the results page that is shown after the last quiz question is clicked
function loadResults(){
  clearMain();
  mainContent.setAttribute("class","results-page");
  quizCounter = QUIZ_MAX;

  var h2 = document.createElement("h2");
  h2.innerHTML = "All done!";
  mainContent.appendChild(h2);

  var pEl = document.createElement("p");
  pEl.innerHTML = "Your final score is " + scoreCounter + ".";
  mainContent.appendChild(pEl);

  var formEl = document.createElement("form");
  var labelEl = document.createElement("label");
  labelEl.setAttribute("for", "initials");
  labelEl.innerHTML = "Enter initials: ";
  var inputEl = document.createElement("input");
  inputEl.setAttribute("type", "text");
  inputEl.setAttribute("id", "initials");
  inputEl.setAttribute("name", "initials");
  var submitBtn = document.createElement("button");
  submitBtn.innerHTML = "Submit";
  submitBtn.setAttribute("class","submit-button"); 

  formEl.appendChild(labelEl);
  formEl.appendChild(inputEl);
  formEl.appendChild(submitBtn);

  mainContent.appendChild(formEl);

  var highscoreArray = getHighscores();

  // Event listener for the submit button
  submitBtn.addEventListener("click", function(event){
    event.preventDefault(); 

    var highscore = inputEl.value + " - " + scoreCounter;
    highscoreArray.push(highscore);
    highscoreArray = JSON.stringify(highscoreArray);

    accessLocalStorage("set", HIGHSCORES, highscoreArray);
    
    loadHighscores(event);
  });
}

// Creates and loads the highscore page 
function loadHighscores(event){
  event.preventDefault();  
  clearMain();
  mainContent.setAttribute("class","highscore-page");
  scoreTimer.stop();
  scoreTimer.updateSpan(0);

  var h1 = document.createElement("h1");
  h1.innerHTML = "Highscores";
  mainContent.appendChild(h1);

  var highscoreArray = getHighscores();

  if(highscoreArray != null){
    if(highscoreArray.length != 0){
      var ol = document.createElement("ol");  
      for(var x in highscoreArray){
        var li = document.createElement("li");
        var p = document.createElement("p");
        p.innerHTML = highscoreArray[x];
        li.appendChild(p);
        ol.appendChild(li);
      }
      mainContent.appendChild(ol);
    }
  }

  var backBtn = document.createElement("button");
  backBtn.innerHTML = "Go Back";
  var clearBtn = document.createElement("button");
  clearBtn.innerHTML = "Clear Highscores";

  mainContent.appendChild(backBtn);
  mainContent.appendChild(clearBtn);

  // Adds event listeners for Back and Clear buttons
  backBtn.addEventListener("click", function(){
    loadLandingPage();
  });
  clearBtn.addEventListener("click", function(){
    if(highscoreArray != null){
      accessLocalStorage("remove", HIGHSCORES, "");
      ol.innerHTML = "";
    }
  });
}

// Loads the initial landing page from its saved variable
function loadLandingPage(){
  clearMain();
  mainContent.setAttribute("class","landing-page");
  mainContent.innerHTML = landingPageContent;
}

// Displays the result when an answer button is clicked (called in answerEvent function)
function outcomeMsg(result){
  displayResultTimer.stop();  //clears timer so that an old/existing timer won't interrupt a new one
  resultP.style.cssText = "display:block !important;";
  if(result){
    resultP.innerHTML = "Correct!";
  }else{
    resultP.innerHTML = "Wrong!";
  }

  displayResultTimer.start();
}

// Decided to move this code from event listener to onclick attribute because otherwise I would be nesting an addeventlistener
// in another function when returning from the highscores page (couldn't get that to work)
function startQuiz(){  
  writeNewQuiz(quizArray[0]);
  scoreTimer.start();  
}

// Accepts quiz object and writes its information to html elements and displays them on the page
function writeNewQuiz(quiz){
  clearMain();
  mainContent.setAttribute("class","quiz-page");

  var h2 = document.createElement("h2");
  h2.innerHTML = quiz.question;
  mainContent.appendChild(h2);

  var answerText = [quiz.a1Text,quiz.a2Text,quiz.a3Text,quiz.a4Text];  //array of answers text to write to buttons
  var answerCorrect = quiz.aCorrect - 1;  //translates human readable correct answer number to a zero indexed number 

  for(var x in answerText){
    var answerBtn = document.createElement("button");
    answerBtn.innerHTML = (Number(x)+1) + ". " + answerText[x];
    if(x == answerCorrect){
      answerBtn.addEventListener("click", function(){
        answerEvent(true);
      });
    }else{
      answerBtn.addEventListener("click", function(){
        answerEvent(false)
      });       
    }   
    mainContent.appendChild(answerBtn);
  }
}

function init(){
  scoresLink.addEventListener("click", function(event){
    loadHighscores(event);  
  });
}

init();
