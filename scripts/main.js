import "../styles/index.css";

//Add Play/Pause button
//playtime/totaltime
// Revision
// Three.js Scene

//Selector Functionality
const selector = document.getElementById("Selector");
let currentActiveMusic = document.getElementById("active");

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "http://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player) after the API code downloads.
// const playerDom = document.getElementById("player");

var player;
window.onYouTubeIframeAPIReady = () => {
	player = new YT.Player("player", {
		height: "200",
		width: "350",
		videoId: "5qap5aO4i9A",
		playerVars: {
			playsinline: 1,
			autoplay: 1,
			controls: 0,
			showinfo: 0,
			autohide: 0,
			fs: 0,
			iv_load_policy: 3,
			modestbranding: 1,
			rel: 0,
		},
		events: {
			onReady: onPlayerReady,
			onStateChange: onPlayerStateChange,
		},
	});
};

// 4. The API will call this function when the video player is ready.

function onPlayerReady(event) {
	event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

let duration = 0;
const progress = document.getElementById("progress");

function onPlayerStateChange(event) {
	duration = player.getDuration();

	// Change the parameters
	setInterval(function () {
		let time = player.getCurrentTime();
		if (duration) progress.value = (time / duration) * 100;
	}, 1000);
}

//Music Genre Selector

selector.addEventListener("click", (event) => {
	currentActiveMusic.removeAttribute("id");
	switch (event.target.innerText) {
		case "#LofiGirl":
			currentActiveMusic = event.target;
			event.target.setAttribute("id", "active");
			player.loadVideoById({ videoId: "5qap5aO4i9A" });
			break;

		case "#Wormono":
			player.stopVideo();
			player.setShuffle(true);
			player.loadPlaylist({
				list: "PLEGDepFXWNlXw9aNpu9Y8MWIKSrv9mS7v",
				index: Math.round(Math.random() * 50),
			});
			currentActiveMusic = event.target;
			event.target.setAttribute("id", "active");
			break;

		case "#YukoRecords":
			player.stopVideo();
			player.setShuffle(true);
			player.loadPlaylist({
				list: "PL_NWZpphCxB0y6s5COLLYZG9jdqjpjCBn",
				index: Math.round(Math.random() * 162),
			});
			currentActiveMusic = event.target;
			event.target.setAttribute("id", "active");
			break;
	}
});
