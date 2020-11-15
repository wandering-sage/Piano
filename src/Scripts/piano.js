var allKeys = document.querySelectorAll(".white-key, .black-key");
var keyboardStr =
	"1234567890qwertyuiopasdfghjklzxcvbnm!@$%^*(QWETYIOPSDGHJLZCVB";
var keyboardKeyToPianoKey = {};

// This will create an Objet that have keyBoard keys mapped to corrosponding piano key
allKeys.forEach((pianoKey, i) => {
	keyboardKeyToPianoKey[keyboardStr[i]] = pianoKey;
});

// Mouse Click Event
var pianoKey = document.querySelector(".piano-container");
pianoKey.addEventListener("mousedown", pressKeyAndPlay);

// Keyboard Event
window.addEventListener("keydown", keyBoardKeyPressed);

// Undo Animation after playing
allKeys.forEach(key=>addEventListener("transitionend", removeKeyPressedClass))

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
	let keySound = new Sound(
		`./sounds/${keyColor == "white" ? "a" : "b"}${keyNum}.mp3`
	);

	keySound.play();
}

function keyBoardKeyPressed(e) {
	// this function expects an object with obj.target
	if (keyboardStr.includes(e.key))
		pressKeyAndPlay({ target: keyboardKeyToPianoKey[e.key] });
}

// This function is copied from W3School FIXME: Figure out its functionality and Change it
function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	};
	this.stop = function () {
		this.sound.pause();
	};
}
