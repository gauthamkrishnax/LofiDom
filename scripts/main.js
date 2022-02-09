import "../styles/index.css";

/*

I. Selector Functionality

*/

//Selector Div Element
const selector = document.getElementById("Selector");

//LocalStorage previously played music number
// 0 - #LofiGirl
// 1 - #Wormono
// 2 - #YukoRecords

const localStorageActiveMusicNumber = localStorage.getItem("active");

let activeMusic = "#LofiGirl";

if (!localStorageActiveMusicNumber) {
	selector.children[0].setAttribute("id", "active");
	localStorage.setItem("active", 0);
} else {
	selector.children[localStorageActiveMusicNumber].setAttribute("id", "active");
	if (localStorageActiveMusicNumber == 1) activeMusic = "#Wormono";
	else activeMusic = "#YukoRecords";
}

let currentActiveMusic = document.getElementById("active");

//Default Start Values
// LocalStorageActiveMusicNumber = 0 (SAVED IN LOCALSTORAGE AS "active")
// activeMusic = "#LofiMusic"
// currentActiveMusic = Dom Element ( button - current Active )

/*

II. Load Youtube Player and Embedded API

*/

// 1. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 2. This function creates an <iframe> (and YouTube player) after the API code downloads.
// const playerDom = document.getElementById("player");

var player;
window.onYouTubeIframeAPIReady = () => {
	player = new YT.Player("player", {
		height: "200",
		width: "350",
		videoId: "5qap5aO4i9A",
		playerVars: {
			playsinline: 1, //disable fullscreen for mobile
			autoplay: 1,
			controls: 0,
			showinfo: 0,
			autohide: 0,
			disablekb: 1, //disable keyboard controls
			fs: 0, //disable fullscreen button
			iv_load_policy: 3, //disable annotation
			modestbranding: 1, //hide youtube branding
			rel: 0,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
};

// 3. The API will call this function when the video player is ready.

function onPlayerReady(event) {
	event.target.playVideo();
	changePlayBtnIcon(); //change Play/pause button icon according to state.
	changePlayerVideo(activeMusic); //use Active music to change video
}

// 4. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

let duration = 0; //initial video duration
const progress = document.getElementById("progress"); //progress bar

function onPlayerStateChange(event) {
	duration = player.getDuration(); //current video total duration
	changePlayBtnIcon();

	//Update progressbar every second
	setInterval(function () {
		let time = player.getCurrentTime();
		if (isFinite((time / duration) * 100)) {
			document.title = `Lofi-Dom [ ${Math.round((time / duration) * 100)}% ]`;
			if (Math.round((time / duration) * 100) == 100)
				document.title = `Lofi-Dom [ Live 🔴 ]`;
			progress.value = (time / duration) * 100;
		}
	}, 1000);
}

/*

III. Player functionalities and event listener

*/

// play-pause ,  next-track ,  previous-track  buttons

const playPause = document.getElementById("playPause");
const pTrack = document.getElementById("pTrack");
const nTrack = document.getElementById("nTrack");

//Disable next-track and pre-track for lofigirl
if (currentActiveMusic.innerText == "#LofiGirl") {
	pTrack.disabled = true;
	nTrack.disabled = true;
}

//Music Genre Selector
selector.addEventListener("click", (event) => {
	currentActiveMusic.removeAttribute("id");
	pTrack.disabled = false;
	nTrack.disabled = false;
	changePlayerVideo(event.target.innerText, event);
});

// Change the currently playing to active music

function changePlayerVideo(activeMusic, event = null) {
	player.stopVideo();
	player.setShuffle(true);
	switch (activeMusic) {
		case "#LofiGirl":
			player.loadVideoById({ videoId: "5qap5aO4i9A" });
			pTrack.disabled = true;
			nTrack.disabled = true;
			localStorage.setItem("active", 0);
			break;

		case "#Wormono":
			player.loadPlaylist({
				list: "PLEGDepFXWNlXw9aNpu9Y8MWIKSrv9mS7v",
				index: Math.round(Math.random() * 50), //Wormono Playlist number of tracks = 50
			});
			localStorage.setItem("active", 1);
			break;

		case "#YukoRecords":
			player.loadPlaylist({
				list: "PL_NWZpphCxB0y6s5COLLYZG9jdqjpjCBn",
				index: Math.round(Math.random() * 162), //Yuko Records Playlist Number of tracks = 162
			});
			localStorage.setItem("active", 2);
			break;
	}
	if (event) {
		currentActiveMusic = event.target;
		event.target.setAttribute("id", "active");
	}
	playPause.focus();
}

// Change the play pause button using player state
const changePlayBtnIcon = () => {
	let pState = player.getPlayerState();
	//if player not paused or in cue or has started
	if (pState != 2 && pState != -1 && pState != 5) {
		//  TWO LEG SVG
		playPause.innerHTML = `<svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M15.375 7.6875H12.8125C12.1329 7.6875 11.4811 7.95748 11.0005 8.43804C10.52 8.9186 10.25 9.57038 10.25 10.25V30.75C10.25 31.4296 10.52 32.0814 11.0005 32.562C11.4811 33.0425 12.1329 33.3125 12.8125 33.3125H15.375C16.0546 33.3125 16.7064 33.0425 17.187 32.562C17.6675 32.0814 17.9375 31.4296 17.9375 30.75V10.25C17.9375 9.57038 17.6675 8.9186 17.187 8.43804C16.7064 7.95748 16.0546 7.6875 15.375 7.6875V7.6875Z"
										fill="black" />
									<path
										d="M28.1875 7.6875H25.625C24.9454 7.6875 24.2936 7.95748 23.813 8.43804C23.3325 8.9186 23.0625 9.57038 23.0625 10.25V30.75C23.0625 31.4296 23.3325 32.0814 23.813 32.562C24.2936 33.0425 24.9454 33.3125 25.625 33.3125H28.1875C28.8671 33.3125 29.5189 33.0425 29.9995 32.562C30.48 32.0814 30.75 31.4296 30.75 30.75V10.25C30.75 9.57038 30.48 8.9186 29.9995 8.43804C29.5189 7.95748 28.8671 7.6875 28.1875 7.6875V7.6875Z"
										fill="black" />
								</svg>`;
	} else {
		// ARROW SVG
		playPause.innerHTML = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M7 28C6.73478 28 6.48043 27.8947 6.29289 27.7071C6.10536 27.5196 6 27.2652 6 27V5.00001C6.00003 4.82624 6.04534 4.65548 6.13147 4.50455C6.21759 4.35363 6.34156 4.22775 6.49115 4.13933C6.64074 4.0509 6.8108 4.00299 6.98455 4.0003C7.1583 3.99762 7.32975 4.04025 7.482 4.12401L27.482 15.124C27.6388 15.2103 27.7695 15.3372 27.8606 15.4912C27.9517 15.6453 27.9997 15.821 27.9997 16C27.9997 16.179 27.9517 16.3547 27.8606 16.5088C27.7695 16.6629 27.6388 16.7897 27.482 16.876L7.482 27.876C7.33435 27.9573 7.16855 28 7 28Z"
										fill="black" />
								</svg>`;
	}
};

// controls functions event listeners
playPause.addEventListener("click", (event) => {
	let pState = player.getPlayerState();
	if (pState != 2 && pState != -1 && pState != 5) {
		player.pauseVideo();
	} else {
		player.playVideo();
	}
});

//spacebar play pause
document.addEventListener("keyup", (event) => {
	if (event.code === "Space") {
		let pState = player.getPlayerState();
		if (pState != 2 && pState != -1 && pState != 5) {
			player.pauseVideo();
		} else {
			player.playVideo();
		}
	}
});

// play previous track
pTrack.addEventListener("click", (event) => {
	player.previousVideo();
});

// play next track
nTrack.addEventListener("click", (event) => {
	player.nextVideo();
});
