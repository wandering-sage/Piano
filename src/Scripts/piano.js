const keyboardStr =
	"1234567890qwertyuiopasdfghjklzxcvbnm!@$%^*(QWETYIOPSDGHJLZCVB";
var white = document.querySelector(".piano-white");

//Creating Piano keys
for (let i = 0; i < 36; i++) {
	white.appendChild(createWhiteKey(i));
}

// Creating 5 Grps, each containing 5 black Keys
for (let i = 0; i < 5; i++) {
	var curGrp = document.createElement("div");
	curGrp.className = "black-key-grp";

	for (let j = 1; j <= 5; j++) {
		var newBlackKey = document.createElement("div");
		newBlackKey.classList.add("black-key");
		newBlackKey.classList.add(`k${j}`);
		newBlackKey.setAttribute("keyColor", "black");
		newBlackKey.setAttribute("keyNum", j + i * 5);

		var label = document.createElement("div");
		label.className = "key-name";
		label.innerHTML = keyboardStr[35 + j + i * 5];
		newBlackKey.appendChild(label);
		curGrp.appendChild(newBlackKey);
	}
	document.querySelector(".piano-black").appendChild(curGrp);
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

// Mouse Click Event
var pianoKey = document.querySelector(".piano-container");
pianoKey.addEventListener("mousedown", pressKeyAndPlay);

// Keyboard Event
window.addEventListener("keydown", keyBoardKeyPressed);

// Undo Animation after playing
allKeys.forEach((key) =>
	addEventListener("transitionend", removeKeyPressedClass)
);

/*******************************  Functions  ********************************/
/***************************************************************************/

function pressKeyAndPlay(e) {
	// when the number on the key is clicked then e.target = keyNum div so we need to set e.target to its parent
	let el = e.target.parentElement.getAttribute("keyColor")
		? e.target.parentElement
		: e.target;
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
	// this function expects an object with obj.target
	if (keyboardStr.includes(e.key))
		pressKeyAndPlay({ target: keyboardKeyToPianoKey[e.key] });
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

function appendAudio(name) {
	let sound = document.createElement("audio");
	sound.src = `./sounds/${name}.mp3`;
	sound.setAttribute("data-key", name);
	sound.setAttribute("preload", "auto");
	document.body.appendChild(sound);
}
