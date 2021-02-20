var autoBtn = document.querySelector(".auto-play");
var loader = document.querySelector(".loader");
var songSheet = "";
var customSheet =
	"s/f.el..uk.pl...k.l.q.s.th.l..o.g.o.&#13;&#10;8d..f..0g..ush..f..rad..y..o..s.a.";

var msPerBeat = 1500 / 7;
var songName = "Kiss The Rain";
var pauseSong = true;
var listOfSongs = [
	"Clocks",
	"Fur Elise",
	"Kiss The Rain",
	"Naruto- Sadness and Sorrow",
	"Naruto- Despair",
	"River Flows in You",
	"Something Just Like This",
	"The Scientist",
	"Custom Song",
];

// fetches song to auto Play  from local directory
getSong();

const keyboardStr = "1234567890qwertyuiopasdfghjklzxcvbnm!@$%^*(QWETYIOPSDGHJLZCVB";
var white = document.querySelector(".piano-white");

//Creating Piano keys
for (let i = 0; i < 36; i++) {
	white.appendChild(createWhiteKey(i));
}

// Creating 5 Grps, each containing 5 black Keys
for (let i = 0; i < 5; i++) {
	var bKeyGrp = document.createElement("div");
	bKeyGrp.className = "black-key-grp";
	for (let j = 1; j <= 5; j++) {
		bKeyGrp.appendChild(createBlackKey(i, j));
	}
	document.querySelector(".piano-black").appendChild(bKeyGrp);
}

var allKeys = document.querySelectorAll(".white-key, .black-key");
var keyboardKeyToPianoKey = {};

// This will create an Objet that have keyBoard keys mapped to corrosponding piano key
allKeys.forEach((pianoKey, i) => {
	keyboardKeyToPianoKey[keyboardStr[i]] = pianoKey;
});

// Adding all the playable sounds to DOM
for (let i = 1; i <= 36; i++) {
	appendAudio(`a${i}`);
}
for (let i = 1; i <= 25; i++) {
	appendAudio(`b${i}`);
}

// Setting up onLoad
window.addEventListener("load", () => loader.classList.add("hidden"));

// Mouse Click Event Piano
var pianoKey = document.querySelector(".piano-container");
pianoKey.addEventListener("mousedown", pressKeyAndPlay);

// Keyboard Event Piano
window.addEventListener("keydown", keyBoardKeyPressed);

// Undo Animation after playing
allKeys.forEach((key) => addEventListener("transitionend", removeKeyPressedClass));

document.querySelector(".auto-play").addEventListener("click", autoPlay);

document.querySelector(".list-btn").addEventListener("click", showAllSongs);

/*******************************  Functions  ********************************/
/***************************************************************************/

function pressKeyAndPlay(e) {
	// when the number on the key is clicked then e.target = keyNum div so we need to set e.target to its parent
	let el = e.target.parentElement.getAttribute("keyColor") ? e.target.parentElement : e.target;
	let keyColor = el.getAttribute("keyColor");
	let keyNum = el.getAttribute("keyNum");

	addKeyPressedClass(el, keyColor);
	// so that playKeySounnd dont post invalid get reqest
	if (el.getAttribute("keyNum")) playKeySound(keyColor, keyNum);
}

function addKeyPressedClass(el, keyColor) {
	if (el.classList.contains(`${keyColor}-key`)) {
		el.classList.add(`${keyColor}-key-pressed`);
	}
}

function removeKeyPressedClass(e) {
	let el = e.target;
	let keyColor = el.getAttribute("keyColor");
	el.classList.remove(`${keyColor}-key-pressed`);
}

function playKeySound(keyColor, keyNum) {
	// the sound inside the folder are saved as a1.mp3, a2.mp3, etc
	let keySound = document.querySelector(
		`audio[data-key="${keyColor == "white" ? "a" : "b"}${keyNum}"]`
	);
	keySound.currentTime = 0;
	keySound.play();
}

function keyBoardKeyPressed(e) {
	let key = e.key ? e.key : e;
	// this function expects an object with obj.target
	if (keyboardStr.includes(key)) pressKeyAndPlay({ target: keyboardKeyToPianoKey[key] });
}

function createWhiteKey(it) {
	var new_key = document.createElement("div");
	new_key.setAttribute("keyColor", "white");
	new_key.setAttribute("keyNum", it + 1);
	new_key.className = "white-key";
	var label = document.createElement("div");
	label.className = "key-name";
	label.innerHTML = keyboardStr[it];
	new_key.appendChild(label);
	return new_key;
}

function createBlackKey(i, j) {
	var newBlackKey = document.createElement("div");
	newBlackKey.classList.add("black-key");
	newBlackKey.classList.add(`k${j}`);
	newBlackKey.setAttribute("keyColor", "black");
	newBlackKey.setAttribute("keyNum", j + i * 5);

	var label = document.createElement("div");
	label.className = "key-name";
	label.innerHTML = keyboardStr[35 + j + i * 5];
	newBlackKey.appendChild(label);
	return newBlackKey;
}

function appendAudio(name) {
	let sound = document.createElement("audio");
	sound.src = `./sounds/${name}.mp3`;
	sound.setAttribute("data-key", name);
	sound.setAttribute("preload", "auto");
	sound.volume = 0.4;
	document.body.appendChild(sound);
}

function getSong() {
	document.querySelector(".song-name").innerText = songName;
	fetch("./sheets/" + songName + ".txt")
		.then((r) => r.text())
		.then((t) => (songSheet = t));
}

function autoPlay() {
	pauseSong = !pauseSong;
	autoBtn.classList.toggle("auto-stop");
	if (pauseSong) {
		autoBtn.innerHTML = "►";
	} else {
		autoBtn.innerHTML = "▪";
		playSong();
	}
}

async function playSong() {
	if (songName == "Custom Song") {
		songSheet = customSheet;
	}
	for (let x of songSheet) {
		if (x == ".") {
			await sleep(msPerBeat);
		} else if (x == "/") {
			await sleep((msPerBeat * 2) / 3);
		} else if (x == "+") {
			await sleep(msPerBeat / 6);
		} else {
			if (pauseSong) {
				break;
			}
			keyBoardKeyPressed(x);
		}
	}

	// when the song Finishes by itself
	if (autoBtn.classList.contains("auto-stop")) {
		pauseSong = !pauseSong;
		autoBtn.classList.toggle("auto-stop");
		autoBtn.innerHTML = "►";
	}
}

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// *********************Choose A Song*****************************
// ****************************************************************

function openPopup() {
	let blurScr = document.createElement("div");
	blurScr.classList.add("blur-bg");
	document.body.appendChild(blurScr);

	let midCnt = document.createElement("div");
	midCnt.classList.add("mid-cnt");
	document.body.appendChild(midCnt);

	let popup = document.createElement("div");
	popup.classList.add("popup");
	midCnt.appendChild(popup);

	let closeBtn = document.createElement("button", HTMLButtonElement);
	closeBtn.innerText = "X";
	closeBtn.className = "closeBtn";
	closeBtn.onclick = closePopup;
	popup.appendChild(closeBtn);

	return [popup, closePopup];

	function closePopup() {
		blurScr.remove();
		midCnt.remove();
	}
}

function showAllSongs() {
	var [popup, closePopup] = openPopup();

	let cnt = document.createElement("div");
	cnt.classList.add("cnt");
	popup.appendChild(cnt);

	listOfSongs.forEach((s) => addSongName(s));

	function addSongName(s) {
		let h = document.createElement("h3");
		h.innerText = s;
		h.classList.add("list-song");
		if (s == songName) {
			h.classList.add("active-song");
		}
		if (s == "Custom Song") {
			h.classList.add("cus-song");
		}
		cnt.appendChild(h);
	}

	cnt.addEventListener("click", chooseSong);

	function chooseSong(e) {
		if (e.target.classList.contains("cnt")) {
			return;
		}
		if (!pauseSong) {
			autoBtn.click();
		}
		closePopup();
		songName = e.target.innerText;
		if (songName == "Custom Song") {
			customSong();
		} else getSong();
	}
}

function customSong() {
	var [popup, closePopup] = openPopup();
	document.querySelector(".song-name").innerText = songName;
	popup.style.backgroundColor = "rgb(210,210,210)";

	var grammar = document.createElement("div");
	grammar.classList.add("grammar");
	popup.appendChild(grammar);

	var grHd = document.createElement("h2");
	grHd.innerText = "Grammar!";
	grammar.appendChild(grHd);

	var lis = document.createElement("ul");
	grammar.appendChild(lis);

	lis.innerHTML = `<li>This song will be auto-saved when you close this popup</li>
	<li>Dot (.) repersents delay btw two keys.</li>
	<li>Forward slash (/) repersents half the delay of dot.</li>
	<li>Consecutive keys will be pressed together.</li>
	<li>Invalid keys like space, comma, semicolon, etc wont do anything.</li>
	<li>All spaces including newlines will be removed when parsing.</li>`;

	var cnt = document.createElement("div");
	cnt.classList.add("cnt");
	popup.appendChild(cnt);

	var heading = document.createElement("h2");
	heading.innerText = songName;
	cnt.appendChild(heading);

	var textArea = document.createElement("textarea");
	textArea.classList.add("song-sheet");
	textArea.spellcheck = false;
	textArea.innerHTML = customSheet;
	customSheet = textArea.value;
	textArea.onchange = (e) => (customSheet = e.target.value);
	cnt.appendChild(textArea);
}
