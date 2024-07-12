document.addEventListener('DOMContentLoaded', function () {
  loadGameData();
});

let currentArtist = "";
let currentSong = "";
let currScore = 0;
let canScore = true;
let tries = 2;
let difficulty = "easy";

function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}


  
async function searchArtists(event) {
  console.log("entered");
  event.preventDefault(); 

  const difficultyInput = difficulty;

  let searchInput = document.querySelector('#searchForm input[name="q"]').value;
  searchInput = capitalizeEveryWord(searchInput);
  console.log("search input: " + searchInput);

  try {
    // Make a GET request to your server's /songs endpoint with the searchInput
    const response = await fetch(`http://localhost:4000/songs?artist_name=${encodeURIComponent(searchInput)}&difficulty=${encodeURIComponent(difficultyInput)}`);
    const data = await response.json();

    
    console.log('Search Results:', data);
    console.log("track name: " + data.track_name);
    console.log("artist name: " + data.artist_name);
    console.log("id: " + data.track_id);

    currentArtist = data.artist_name;
    currentSong = data.track_name;

    console.log("GOOO" + currentArtist);

    if(currentArtist === undefined){
      document.getElementById('currArtist').textContent = `could not find your artist try a different artist`;
    }
    else{
      document.getElementById('currArtist').textContent = `Current Artist: ${currentArtist}`;
    }


    const spotifyIframe = document.getElementById('iframecontainer');

    // Construct the new Spotify track URL with the updated track ID
    let newSrc = `https://open.spotify.com/embed/track/${data.track_id}?utm_source=generator&theme=0&autoplay=true`;

    localStorage.setItem('newSrc', newSrc);

    

    // Set the new source for the iframe
    spotifyIframe.querySelector('iframe').src = newSrc;

    
  } catch (error) {
    console.error('Error:', error);
  }
  
  resetTemp();
  saveGameData();
}

function checkGuess() {
  var guess = document.getElementById('guessInput').value.toLowerCase();
  currentSong = currentSong.toLowerCase();
  var resultDisplay = document.getElementById('responseText');

  if (currentSong.includes(guess)) {
    resultDisplay.textContent = 'Correct! You guessed the right song.';
    resultDisplay.style.backgroundImage = 'linear-gradient(to top, rgb(0, 40, 0), rgb(27, 190, 27))';
    console.log("correct");
    var score = document.getElementById('score');
    if(canScore && tries > 0){
      currScore+=1;
      score.textContent = currScore;
      localStorage.setItem('score', currScore);
    }
    
  } else {
    resultDisplay.textContent = `Incorrect. Try again! Tries Remaining: ${tries}`;
    if(tries>0){
      tries--;
      localStorage.setItem('tries', tries);
    }
    resultDisplay.style.backgroundImage = 'linear-gradient(to top, rgb(0, 40, 0), rgb(191, 23, 23))';
    console.log("actual: " + currentSong);
    console.log("your guess: " + guess);
    console.log("incoorect");
  }
  saveGameData();
}

function hideSong(){
  canScore = true;
  let button = document.getElementById('hideButton');
  button.style.display = 'block';
}

function showSong(){
  canScore = false;
  let button = document.getElementById('hideButton');
  button.style.display = 'none';
}

document.getElementById('easyButton').addEventListener('click', setDifficultyEasy);
document.getElementById('mediumButton').addEventListener('click', setDifficultyMedium);
document.getElementById('hardButton').addEventListener('click', setDifficultyHard);


function setDifficultyEasy(){
  document.getElementById('easyButton').querySelector('button').style.backgroundColor = "#36d31a";
  document.getElementById('mediumButton').querySelector('button').style.backgroundColor = "#191414";
  document.getElementById('hardButton').querySelector('button').style.backgroundColor = "#191414";
  difficulty = "easy";
  searchArtistsButton();
  saveGameData();
}

function setDifficultyMedium(){
  document.getElementById('easyButton').querySelector('button').style.backgroundColor = "#191414";
  document.getElementById('mediumButton').querySelector('button').style.backgroundColor = "#36d31a";
  document.getElementById('hardButton').querySelector('button').style.backgroundColor = "#191414";
  difficulty = "medium";
  searchArtistsButton();
  saveGameData();
}

function setDifficultyHard(){
  document.getElementById('easyButton').querySelector('button').style.backgroundColor = "#191414";
  document.getElementById('mediumButton').querySelector('button').style.backgroundColor = "#191414";
  document.getElementById('hardButton').querySelector('button').style.backgroundColor = "#36d31a";
  difficulty = "hard";
  searchArtistsButton();
  saveGameData();
}

async function searchArtistsButton() {

  const difficultyInput = difficulty;

  try {
    
    const response = await fetch(`http://localhost:4000/songs?artist_name=${encodeURIComponent(currentArtist)}&difficulty=${encodeURIComponent(difficultyInput)}`);
    const data = await response.json();

   
    console.log('Search Results:', data);
    console.log("track name: " + data.track_name);
    console.log("artist name: " + data.artist_name);
    console.log("id: " + data.track_id);

    currentArtist = data.artist_name;
    currentSong = data.track_name;
    if(currentArtist === undefined){
      document.getElementById('currArtist').textContent = `could not find your artist try a different artist`;
    }
    else{
      document.getElementById('currArtist').textContent = `Current Artist: ${currentArtist}`;
    }

    const spotifyIframe = document.getElementById('iframecontainer');

    
    let newSrc = `https://open.spotify.com/embed/track/${data.track_id}?utm_source=generator&theme=0&autoplay=true`;

  
    spotifyIframe.querySelector('iframe').src = newSrc;

    saveGameData();

    
  } catch (error) {
    console.error('Error:', error);
  }

  resetTemp();
}
 

function saveGameData() {
  localStorage.setItem('canScore', canScore);
  localStorage.setItem('difficulty', difficulty);
  localStorage.setItem('score', currScore);
  localStorage.setItem('currentArtist', currentArtist);
  localStorage.setItem('tries', tries);
  localStorage.setItem('currentSong', currentSong);
  localStorage.setItem('difficulty', difficulty);
  localStorage.setItem('newSrc', document.getElementById('iframecontainer').querySelector('iframe').src);
}

function resetTemp(){
  var resultDisplay = document.getElementById('responseText');
  resultDisplay.textContent = "";

  var guess = document.getElementById('guessInput');
  guess.value = "";
  canScore = true;
  tries = 2;
  hideSong();
  saveGameData();
}

function updateDifficultyButtonColors() {
  document.getElementById('easyButton').querySelector('button').style.backgroundColor = "#191414";
  document.getElementById('mediumButton').querySelector('button').style.backgroundColor = "#191414";
  document.getElementById('hardButton').querySelector('button').style.backgroundColor = "#191414";


  if (difficulty === 'easy') {
      document.getElementById('easyButton').querySelector('button').style.backgroundColor = "#36d31a";
  } else if (difficulty === 'medium') {
      document.getElementById('mediumButton').querySelector('button').style.backgroundColor = "#36d31a";
  } else if (difficulty === 'hard') {
      document.getElementById('hardButton').querySelector('button').style.backgroundColor = "#36d31a";
  }
}

  function loadGameData(){
    const savedScore = localStorage.getItem('score');
    if (savedScore) {
        currScore = parseInt(savedScore);
        document.getElementById('score').textContent = currScore;
    }
    
    const savedCurrentArtist = localStorage.getItem('currentArtist');
    if (savedCurrentArtist) {
        currentArtist = savedCurrentArtist;
        document.getElementById('currArtist').textContent = `Current Artist: ${currentArtist}`;
    }

    const savedTries = localStorage.getItem('tries');
      if (savedTries) {
          tries = parseInt(savedTries);
      }

      const savedCurrentSong = localStorage.getItem('currentSong');
      if (savedCurrentSong) {
          currentSong = savedCurrentSong;
      }


    if (canScore) {
        hideSong();
    } else {
        showSong();
    }

    const savedSrc = localStorage.getItem('newSrc');
    if(savedSrc){
      document.getElementById('iframecontainer').querySelector('iframe').src = savedSrc;
    }

    const savedDifficulty = localStorage.getItem('difficulty');
    if(savedDifficulty) {
        difficulty = savedDifficulty;
        updateDifficultyButtonColors();
    }
  }

document.getElementById('resetButton').addEventListener('click', resetGame);


function resetGame() {
  currentArtist = "";
  currentSong = "";
  currScore = 0;
  canScore = true;
  tries = 2;
  difficulty = "easy";

  document.getElementById('iframecontainer').querySelector('iframe').src = `https://open.spotify.com/embed/track/2Dp0qki35K3PMjRvnKQ5o0?utm_source=generator&theme=0&autoplay=true`;

  document.getElementById('currArtist').textContent = `Current Artist: (none)`;
  document.getElementById('score').textContent = currScore;

 
  updateDifficultyButtonColors();


  hideSong();


  saveGameData();
}

  

  
 