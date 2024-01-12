let allMusic = [
  {
    name: "Shepherd",
    artist: "Ennio Morricone",
    img: "music-1",
    src: "music-1"
  },
  {
    name: "Storm",
    artist: "Vanessa Mae",
    img: "music-2",
    src: "music-2"
  },
  {
    name: "Conquest Of Paradise",
    artist: "Allegro Milano",
    img: "music-3",
    src: "music-3"
  },
  {
    name: "Time To Say Goodbye",
    artist: "Andrea Bocelli & Sara Brightman",
    img: "music-4",
    src: "music-4"
  },
  {
    name: "Your Love",
    artist: "Ennio Morricone & Dulce Pontes",
    img: "music-5",
    src: "music-5"
  }

  // ,{
  //   name: "Here is the music name",
  //   artist: "Here is the artist name",
  //   img: "image name here - remember img must be in .jpg formate and it's inside the images folder of this project folder",
  //   src: "music name here - remember img must be in .mp3 formate and it's inside the songs folder of this project folder"
  // }
];

console.log('hello!');

const wrapper = document.querySelector(".player-wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closemoreMusic = musicList.querySelector("#close");

// // load random music on page
// let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
// isMusicPaused = true;
let musicIndex = 1;

/*------------------LOAD A SONG----------------*/

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong();
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].name;
  musicArtist.innerText = allMusic[indexNumb - 1].artist;
  musicImg.src = `./img/slides/${allMusic[indexNumb - 1].src}.jpg`;
  mainAudio.src = `./songs/${allMusic[indexNumb - 1].src}.mp3`;
};


/*------------------PLAY A SONG----------------*/

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
};

/*------------------PLAY OR PAUSE A SONG BY CLICKING PLAY/PAUSE BUTTON----------------*/

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
};

playPauseBtn.addEventListener("click", () => {
  const isMusicPlay = wrapper.classList.contains("paused");
  //if isPlayMusic is true then call pauseMusic else call playMusic
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
});


/*------------------PLAY NEXT SONG----------------*/

function nextMusic() {
  musicIndex++;
  //make infinit music play
  musicIndex = musicIndex > allMusic.length ? 1 : musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};

nextBtn.addEventListener("click", () => {
  nextMusic();
});


/*------------------PLAY PREVIOUS SONG----------------*/
function prevMusic() {
  musicIndex--;
  //make infinit music play
  musicIndex = musicIndex < 1 ? allMusic.length : musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};

prevBtn.addEventListener("click", () => {
  prevMusic();
});


/*-------UPDATE PROGRESS BAR WIDTH ACCORDING TO MUSIC CURRENT TIME--------*/

mainAudio.addEventListener("timeupdate", (e) => {
  const currentTime = e.target.currentTime; //getting song current time
  const duration = e.target.duration; //getting song total duration
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time");
  let musicDuartion = wrapper.querySelector(".max-duration");
  mainAudio.addEventListener("loadeddata", () => {
    // update song total duration
    let totalMin = Math.floor(mainAudio.duration / 60);
    let totalSec = Math.floor(mainAudio.duration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    }
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });
  // update song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) { //if sec is less than 10 then add 0 before it
    currentSec = `0${currentSec}`;
  }
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});


/*------UPDATE SONG CURRENT TIME BY PRESSING PROGRESS BAR------*/

progressArea.addEventListener("click", (e) => {
  let progressWidth = progressArea.clientWidth; //getting width of progress bar
  let clickedOffsetX = e.offsetX; //getting offset x value
  let songDuration = mainAudio.duration; //getting song total duration

  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playMusic();
  //playingSong();
});


/*------PLAYING MODE - CHANGE LOOP, SHUFFLE, REPEAT ICON------*/

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  // getting icon inner text
  let getText = repeatBtn.innerText;
  switch (getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Играть песню снова");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Играть в произвольном порядке");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Играть плейлист снова");
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch (getText) {
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do {
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex;
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
});


/*------SHOW MUSIC LIST ONCLICK OF MUSIC ICON------*/

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});
closemoreMusic.addEventListener("click", () => {
  moreMusicBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  // pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  //inserting the li inside ul tag
  ulTag.insertAdjacentHTML("beforeend", liTag);

  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    let totalMin = Math.floor(liAudioTag.duration / 60);
    let totalSec = Math.floor(liAudioTag.duration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    // adding t duration attribute to use below
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

/*------PLAY PARTICULAR SONG FROM THE LIST ONCLICK OF LI TAG------*/

// pass the song name, artist from the array
const allLiTag = ulTag.querySelectorAll("li");

//play particular song from the list onclick of li tag
function playingSong() {

  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");

    // delete style (color) from marked playing song in list
    if (allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      // get duration value from t duration attribute
      audioTag.innerText = audioTag.getAttribute("t-duration");
    }

    // mark playing song in list with another style (color)
    if (allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
};

// play checked song on click
function clicked(element) {
  // getting li index of particular clicked song
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
};