var FoodX, FoodY;
var blocks = 20;
var end;
let snake = [];
var lambi = 0;
var level;
var bigScore = false;
var ran;
var inputName;
var data;
var times;
var record1 = [];
var record2 = [];
var submit = 0;
let eatSound;
let deadSound;
let appleImg;
let pearImg;
let orangeImg;
let bananaImg;
let change = true;
let noInternet = false;

const noopSound = {
	play() {},
	rate() {},
	setVolume() {},
};

eatSound = noopSound;
deadSound = noopSound;

function assetPath(relativePath) {
	const base = window.location.pathname.endsWith("/")
		? window.location.pathname
		: window.location.pathname.substring(
				0,
				window.location.pathname.lastIndexOf("/") + 1
		  );
	return base + relativePath;
}
