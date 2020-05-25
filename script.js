// initialize page
const gameContainer = document.getElementById("game");
const buttons = document.getElementById("buttons");
// initialize scores
let score = 0;
let scoreBox = document.getElementById('scorebox');
scoreBox.value = score;
// retrieve best score
let bestScore = localStorage.getItem('bestscore');
let bestScoreBox = document.getElementById('bestscore');
bestScoreBox.value = bestScore;
// end of game flag
let endGame = true;
// initialize color sets
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    // Decrease counter by 1
    counter--;
    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

let shuffledColors = shuffle(COLORS);
// intialize cardOpen counter
let cardOpen = 0;

buttons.addEventListener('click', function(e) {
  // console.log(e.target.className);
  if (e.target.className === 'restart') {
    location.reload();
    createDivsForColors(shuffledColors); // not sure why this line doesn't work..
  }
  else if (e.target.className === 'start' && endGame === true) {
    
    // call function to create divs
    createDivsForColors(shuffledColors);
    endGame = false;
  }
  else if (e.target.className === 'addcards' && endGame === false) {
    console.log('Add cards!');
    let shuffledColors = shuffle(COLORS);
    let cardOpen = 0;
    for (let color of shuffledColors) {
      const newDiv = document.createElement("div");
      newDiv.classList.add(color);
      newDiv.classList.add('close');
      newDiv.addEventListener("click", handleCardClick);
      gameContainer.append(newDiv);
    }
  }
});

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  // this returns an html collections
  const closedCards = document.getElementsByClassName('close'); 
  const openCards = document.getElementsByClassName('open');
  // create divs only if no cards was already created
  // so that clicking start button in mid game won't add another set of cards
  if (closedCards.length === 0 && openCards.length === 0) {
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");
      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);
      newDiv.classList.add('close');
      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);
      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
  }
}

// TODO: Implement this function!
function handleCardClick(e) {
  // console.log("you just clicked", e.target);
  if (e.target.classList.contains('close')) {
    cardOpen++;
  }; // up cardOpen if a closed card was clicked

  // what to do with first card
  if (cardOpen === 1 && e.target.classList.contains('close')) { 
    e.target.classList.remove('close');
    let colorOne = e.target.className; // extract colorOne and store in localStorage
    console.log("you just opened card " + cardOpen + ", color: " + colorOne);
    localStorage.setItem('firstColor', colorOne);
    e.target.classList.add('open');
  }
  // what to do with second card
  if (cardOpen === 2 && e.target.classList.contains('close')) {
    e.target.classList.remove('close');
    let colorTwo = e.target.className; // extract colorTwo
    console.log("you just opened card " + cardOpen + ", color: " + colorTwo);
    e.target.classList.add('open');

    let colorOne = localStorage.getItem('firstColor'); // retrieve colorOne
    if (colorTwo === colorOne) {
      console.log("they're the same card!"); // do nothing, let the cards stay open
      cardOpen = 0;

      // check end game condition (no card is closed)
      const closedCards = document.getElementsByClassName('close'); 
      if (closedCards.length === 0) {
        document.getElementById('status').textContent = "Good Job!";
        endGame = true;
        // update localStorage.bestscore 
        if (score <= bestScore || bestScore === null) { 
          bestScore = score + 1; // figure out why I needed +1 here
          localStorage.setItem('bestscore', bestScore);
        }
      }
    }
    else {
      console.log("they're different cards..");
      // change class back to close after one second
      setTimeout(function() {
        let firstCard = document.getElementsByClassName(colorOne + ' open'); 
        firstCard[0].className = colorOne + ' close'
        e.target.classList.remove('open');
        e.target.classList.add('close');
        cardOpen = 0;
      }, 1000)
    }
    // update score 
    score++;
    scoreBox.value = score;
  }
}
// when the DOM loads
// createDivsForColors(shuffledColors);
