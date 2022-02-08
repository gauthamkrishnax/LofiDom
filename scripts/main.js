import "../styles/index.css";

//Selector Functionality
const selector = document.getElementById("Selector");
let currentActiveMusic = document.getElementById("active");

selector.addEventListener("click", (event) => {
	currentActiveMusic.removeAttribute("id");
	switch (event.target.innerText) {
		case "#LofiGirl":
			currentActiveMusic = event.target;
			event.target.setAttribute("id", "active");
			break;
		case "#Wormono":
			currentActiveMusic = event.target;
			event.target.setAttribute("id", "active");
			break;
		case "#YukoRecords":
			currentActiveMusic = event.target;
			event.target.setAttribute("id", "active");
			break;
	}
});

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
		videoId: "DoFDbkziWSc",
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
let duration = 0;
const progress = document.getElementById("progress");

function onPlayerReady(event) {
	event.target.playVideo();
	duration = player.getDuration();

	// Change the parameters
	setInterval(function () {
		let time = player.getCurrentTime();
		if (duration) progress.value = (time / duration) * 100;
	}, 1000);
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.

var done = false;

function onPlayerStateChange(event) {
	// console.log(event);
	// console.log(player, player.getCurrentTime());
}

function stopVideo() {
	player.stopVideo();
}
