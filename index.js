//ONLINE WEBSOCKET SERVER SETTINGS
const websocket_endpoint = "wss://relay.aricodes.net/ws";

//LOCAL JSON SERVER SETTINGS
var JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;
var JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

// PARAM VARIABLES
var HideRoom = false;
var HideIGT = false;
var HidePosition = false;
var HideMoney = false;
var HideDA = false;
var HideStats = false;
var ShowBossOnly = false;
var ShowOnlyDamaged = false;
var HideEnemies = false;
var IsSeparated = false;
var IsPlayer2 = false;
var IsDebug = false;

window.onload = function () {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	// HIDE DEBUG INFO
	const debug = urlParams.get('debug');
	if (debug != null) {
		IsDebug = true;
	}

	// HIDE DEBUG INFO
	const position = urlParams.get('hideposition');
	if (position != null) {
		HidePosition = true;
	}

	// HIDE IN-GAME TIMER
	const igt = urlParams.get('hideigt');
	if (igt != null) {
		HideIGT = true;
	}

	const money = urlParams.get('hidemoney');
	if (money != null) {
		HideMoney = true;
	}

	// HIDE DA
	const da = urlParams.get('hideda');
	if (da != null) {
		HideDA = true;
	}

	// HIDE MISC STATS
	const stats = urlParams.get('hidestats');
	if (stats != null) {
		HideStats = true;
	}

	// SEPARATE PLAYER STATS
	const separated = urlParams.get('separated');
	if (separated != null) {
		IsSeparated = true;
	}

	// IS PLAYER 2 CHECK
	const isPlayer2 = urlParams.get('isplayer2');
	if (isPlayer2 != null) {
		IsPlayer2 = true;
	}

	// SHOW BOSS ONLY
	const boss = urlParams.get('bossonly');
	if (boss != null) {
		ShowBossOnly = true;
	}

	// SHOW BOSS ONLY
	const damaged = urlParams.get('damagedonly');
	if (damaged != null) {
		ShowOnlyDamaged = true;
	}

	// HIDE ALL ENEMIES
	const enemies = urlParams.get('hideenemies');
	if (enemies != null) {
		HideEnemies = true;
	}

	//
	// CHECK FOR AUTH TOKEN
	const token = urlParams.get('token');
	if (token != null) {
		const socket = new WebSocket(websocket_endpoint);
		socket.onopen = () => socket.send(`listen:${token}`);
		socket.onmessage = (event) => appendData(JSON.parse(event.data));
	}
	else {
		getData();
		setInterval(getData, POLLING_RATE);
	}
};

var Asc = function (a, b) {
	if (a > b) return +1;
	if (a < b) return -1;
	return 0;
};

var Desc = function (a, b) {
	if (a > b) return -1;
	if (a < b) return +1;
	return 0;
};

function getData() {
	fetch(JSON_ENDPOINT)
		.then(function (response) {
			return response.json();
		})
		.then(function (data) {
			appendData(data);
		})
		.catch(function (err) {
			console.log("Error: " + err);
		});
}

//	<summary>
//	PROGRESS BAR DRAW FUNCTION
//	</summary>
//
//	current = current value;
//	max = max value;
//	percent = current / max as float 0 - 1
//	label = string label for progress bar (optional)
//	colors = array of color class names as string
//	Example
// DrawProgressBar(1000, 1000, 1, "Player: ", ["fine", "green"]);
function DrawProgressBar(current, max, percent, label, colors) 
{
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="bar"><div class="progressbar ${colors[0]}" style="width:${(percent * 100)}%">
		<div id="currentprogress">${label}${current} / ${max}</div><div class="${colors[1]}" id="percentprogress">${(percent * 100).toFixed(1)}%</div></div></div>`;
}

//	<summary>
//	TEXTBLOCK DRAW FUNCTION
//	</summary>
//
//	label = string label
//	val = current value
//	colors = array of color class names as string
//	hideParam = user choosen query parameter
//	Example
//	DrawTextBlock("IGT", "00:00:00", ["white", "green2"], HideIGT);
function DrawTextBlock(label, val, colors, hideParam)
{
	if (hideParam) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title ${colors[0]}">${label}: <span class="${colors[1]}">${val}</span></div>`;
}

//	<summary>
//	FLEXBOXED TEXTBLOCK DRAW FUNCTION
//	</summary>
//
//	labels = string labels array
//	vals = current value array
//	colors = array of color class names as string
//	hideParam = user choosen query parameter
//	Example
//	DrawTextBlocks(["DARank", "DAScore"], [9, 9999], ["white", "green2"], HideDA);
function DrawTextBlocks(labels, vals, colors, hideParam)
{
	if (hideParam) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let children = "";
	for (var i = 0; i < labels.length; i++)
	{
		children += `<div class="title ${colors[0]}">${labels[i]}: <span class="${colors[1]}">${vals[i]}</span></div>`
	}
	mainContainer.innerHTML += `<div class="textblock">${children}</div>`;
}

//	<summary>
//	ALIGNED FLEXBOX TEXTBLOCK DRAW FUNCTION
//	</summary>
//
//	labels = string labels array
//	vals = current value array
//	colors = array of color class names as string
//	alignment = text alignment as string (left, center, right)
//	hideParam = user choosen query parameter
//	Example
//	DrawAlignedTextBlocks(["X", "Y", "Z"], [100.0000, 100.0000, 100.0000], ["white", "green2"], "center", HideDA);
function DrawAlignedTextBlocks(labels, vals, colors, alignment, hideParam)
{
	if (hideParam) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let children = "";
	for (var i = 0; i < labels.length; i++)
	{
		children += `<div class="title ${colors[0]}">${labels[i]}: <span class="${colors[1]}">${vals[i]}</span></div>`
	}
	mainContainer.innerHTML += `<div class="textblock-${alignment}">${children}</div>`;
}

//	<summary>
//	GET HP BAR AND TEXT COLOR ACCORDING TO PLAYER HEALTH STATE
//	</summary>
function GetColor(player)
{
	if (player.CurrentHealthState == "Gassed") return ["gassed", "pink"];
	if (player.CurrentHealthState == "Poisoned")  return ["poison", "purple"];
	if (player.CurrentHealthState == "Fine")  return ["fine", "green"];
	else if (player.CurrentHealthState == "FineToo")  return ["fineToo", "yellow"];
	else if (player.CurrentHealthState == "Caution")  return ["caution", "orange"];
	else if (player.CurrentHealthState == "Danger")  return ["danger", "red"];
	return ["dead", "grey"];
}

function DinoCrisisCheatSheet(roomID, hide)
{
	if (roomID == 271) DrawTextBlock("Battery Puzzle", "2, 3, 2", ["white", "green2"], hide);
	else if (roomID == 1) DrawTextBlock("Password", "JP: 0375 / US: 0426", ["white", "green2"], hide);
	else if (roomID == 2) DrawTextBlock("DDK H", "HEAD", ["white", "green2"], hide);
	else if (roomID == 3) DrawTextBlock("Password", "705037", ["white", "green2"], hide);
	else if (roomID == 4) DrawTextBlock("DDK N", "NEWCOMER", ["white", "green2"], hide);
	else if (roomID == 5) DrawTextBlock("Battery Puzzle", "1, 2, 3, 1, 2, 1", ["white", "green2"], hide);
	else if (roomID == 6) DrawTextBlock("Paul Baker ID", "JP: 46907 / US: 58104", ["white", "green2"], hide);
	else if (roomID == 7) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 8) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 9) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 10) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 11) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 12) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 13) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 14) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 15) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 16) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 17) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 18) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 19) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 20) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 21) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 22) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 23) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 24) DrawTextBlock("", "", ["white", "green2"], hide);
	else if (roomID == 25) DrawTextBlock("", "", ["white", "green2"], hide);
}

function appendData(data) {
	//console.log(data);
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
	switch (data.GameName)
	{
		case "Dead Rising 1":
			DeadRising1(data);
			return;
		case "Dino Crisis 1 Rebirth":
			DinoCrisis1(data);
			return;
		case "DMC4SE":
			DevilMayCry4(data);
			return;
		case "TEW":
			TheEvilWithin(data);
			return;
		case "RECVX":
			ResidentEvilCodeVeronicaX(data);
			return;
		case "RE0":
			ResidentEvil0Remake(data);
			return;
		case "RE1":
			ResidentEvil1Classic(data);
			return;
		case "RE1R":
			ResidentEvil1Remake(data);
			return;
		case "RE2":
			ResidentEvil2Classic(data);
			return;
		case "RE2R":
			ResidentEvil2Remake(data);
			return;
		case "RE3":
			ResidentEvil3Classic(data);
			return;
		case "RE3R":
			ResidentEvil3Remake(data);
			return;
		case "RE4":
			ResidentEvil4(data);
			return;
		case "RE5":
			ResidentEvil5(data);
			return;
		case "RE6":
			ResidentEvil6(data);
			return;
		case "RE7":
			ResidentEvil7(data);
			return;
		case "RE8":
			ResidentEvil8(data);
			return;
		case "REREV1":
			ResidentEvilRevelations1(data);
			return;
		case "REREV2":
			ResidentEvilRevelations2(data);
			return;
		default:
			mainContainer.innerHTML += "No Plugin Detected";
			return;
	}
}

function DrawContainerBG()
{
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="container-bg"></div>`;
}
// DEAD RISING 1
function DeadRising1(data)
{
	let _colors = GetColor(data.CarInfo);
	DrawContainerBG();
	DrawAlignedTextBlocks(["X", "Y", "Z", "RX", "RY"], [data.Player.X, data.Player.Y, data.Player.Z, data.Player.RX, data.Player.RY], ["white", "green2"], "center", HidePosition);
	if (data.CarInfo.IsAlive) DrawProgressBar(data.CarInfo.CurrentHealth, data.CarInfo.MaxHealth, data.CarInfo.Percentage, "Car: ", _colors);
	DrawTextBlock("Stock", data.PlayerStats.ItemStock + 1, ["white", "green2"], HideStats);
	//DrawTextBlock("Speed", data.PlayerStats.Speed, ["white", "green2"], HideStats);
	if (data.CurrentWeapon.MaxDurability != 0) DrawProgressBar(data.CurrentWeapon.Durability, data.CurrentWeapon.MaxDurability, data.CurrentWeapon.Percentage, "Weapon Durability: ", ["caution", "yellow"]);
	if (data.CurrentWeapon.MaxAmmo != 0) DrawTextBlock("Weapon Ammo", `${data.CurrentWeapon.Ammo} / ${data.CurrentWeapon.MaxAmmo}`, ["white", "green2"], HideStats);
	DrawTextBlock("Campain Progress", data.Campaign.CampainProgress, ["white", "green2"], !IsDebug);
	DrawTextBlock("Room ID", data.RoomData.RoomId, ["white", "green2"], !IsDebug);
	if (data.Boss.IsAlive)
	{
		DrawProgressBar(data.Boss.CurrentHealth, data.Boss.MaxHealth, data.Boss.Percentage, "", ["danger", "red"]);
	}
}

// DINO CRISIS 1
function DinoCrisis1(data)
{
	let _colors = GetColor(data.Player);
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, "Regina: ", _colors);
	DrawTextBlock("RoomID", data.Stats.RoomID, ["white", "green2"], IsDebug);
	DrawTextBlock("Room", data.Stats.RoomName, ["white", "green2"], IsDebug);
	DrawTextBlock("Save Count", data.Stats.SaveCount, ["white", "green2"], IsDebug);
	DrawTextBlock("Continues", data.Stats.Continues, ["white", "green2"], IsDebug);
	if (data.EnemyHealth.IsAlive)
	{
		DrawProgressBar(data.EnemyHealth.CurrentHP, data.EnemyHealth.MaxHP, data.EnemyHealth.Percentage, "", ["danger", "red"]);
	}
	DinoCrisisCheatSheet(data.Stats.RoomID, IsDebug);
}

// DEVIL MAY CRY 4 SE
function DevilMayCry4(data)
{
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, data.Player.Name, _colors);
	DrawProgressBar(data.Player.CurrentDT, data.Player.MaxDT, data.Player.PercentageDT, "Devil Trigger: ", ["devil", "purple"]);
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	DrawTextBlock("Red Orbs", data.Stats.RedOrbs, ["white", "green2"], HideMoney);
	DrawTextBlock("Room ID", data.Stats.RoomID, ["white", "green2"], HideRoom);

	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});

	DrawTextBlock("TV", data.VersionInfo, ["white", "green2"], IsDebug);
	DrawTextBlock("GV", data.GameInfo, ["white", "green2"], IsDebug);
}

// THE EVIL WITHIN

// Will be changed later
function formatGameTime(gameTimeSecs) {
    const zeroPrefix = (str, digits=2) => str.length === digits ? str : `0${str}`;

    const hours = Math.floor(gameTimeSecs / 3600);
    gameTimeSecs = gameTimeSecs % 3600;
    const minutes = Math.floor(gameTimeSecs / 60);
    gameTimeSecs = gameTimeSecs % 60;

    const hoursStr = zeroPrefix(hours.toString());
    const minutesStr = zeroPrefix(minutes.toString());
    const secondsStr = zeroPrefix(gameTimeSecs.toFixed(0).toString(), digits=2);

    return `${hoursStr}:${minutesStr}:${secondsStr}`;
}

function TheEvilWithin(data)
{
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, "Sebastian: ", _colors);
	DrawTextBlock("IGT",formatGameTime(data.Stats.IGT), ["white", "green2"], HideIGT);
	DrawTextBlock("Green Gel", `${data.GreenGel}`, ["white", "green2"], HideMoney);

	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL 0
// CLASSIC

// REMAKE
function ResidentEvil0Remake(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	let _colors2 = GetColor(data.Player2);
	DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.Percentage, data.PlayerName2, _colors2);
	DrawTextBlock("Saves", data.Stats.Saves, ["white", "green2"], HideStats);
	DrawTextBlock("Kills", data.Stats.Kills, ["white", "green2"], HideStats);
	DrawTextBlock("Shots", data.Stats.Shots, ["white", "green2"], HideStats);
	DrawTextBlock("Recoveries", data.Stats.Recoveries, ["white", "green2"], HideStats);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive && !m.IsPlayer) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawTextBlock("Enemy", item.CurrentHP, ["white", "red"], false);
	});
}

// RESIDENT EVIL 1
// CLASSIC
function ResidentEvil1Classic(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawTextBlock("Enemy", item.CurrentHP, ["white", "red"], false);
	});
}

// REMAKE
function ResidentEvil1Remake(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL 2
// CLASSIC 
// TODO: FIX ENEMY HP
function ResidentEvil2Classic(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	//var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	//filterdEnemies.sort(function (a, b) {
	//	return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	//}).forEach(function (item, index, arr) {
	//	if (item.MaximumHP != 0)
	//		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	//	else
	//		DrawTextBlock("Enemy", item.CurrentHP, ["white", "red"], false);
	//});
}

// REMAKE
function ResidentEvil2Remake(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	DrawTextBlocks(["Rank", "RankScore"], [data.RankManager.Rank, data.RankManager.RankScore], ["white", "green2"], HideDA);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL 3
// CLASSIC
function ResidentEvil3Classic(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	if (data.Nemesis.IsAlive)
	{
		DrawProgressBar(data.Nemesis.CurrentHP, data.Nemesis.MaximumHP, data.Nemesis.Percentage, data.Nemesis.BossName, ["danger", "red"]);
	}
}

// REMAKE
function ResidentEvil3Remake(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	DrawTextBlocks(["Rank", "RankScore"], [data.RankManager.Rank, data.RankManager.RankScore], ["white", "green2"], HideDA);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL 4
function ResidentEvil4(data)
{
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	let _colors2 = GetColor(data.Player2);
	DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.Percentage, data.PlayerName2, _colors2);
	let rank = Math.floor(data.GameData.RankScore / 1000);
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	DrawTextBlocks(["RankScore", "Rank"], [data.GameData.RankScore, rank], ["white", "green2"], HideDA);
	DrawTextBlock("PTAS", `₧ ${data.GameData.Money}`, ["white", "green2"], HideMoney);
	DrawTextBlock("Last Item", data.GamePlayerItemID.Name, ["white", "green2"], HideStats);
	DrawTextBlock("Chapter Kills", data.GamePlayerKills.ChapterKills, ["white", "green2"], HideStats);
	DrawTextBlock("Kills", data.GamePlayerKills.Kills, ["white", "green2"], HideStats);
}

// RESIDENT EVIL 5
function ResidentEvil5(data)
{
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";
	let _colors = GetColor(data.Player);
	let _colors2 = GetColor(data.Player2);
	//DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	//Player HPs
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, "Chris: ", _colors);
	DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.Percentage, "Sheva: ", _colors2);

	//Player Stats
	mainContainer.innerHTML += `
	<div id="RE5Stats">
		<div class="RE5title">Naira: </div><font color="#00FF00">${"₦ " + data.Money}</font><div></div>
	</div>`;

	mainContainer.innerHTML += `
	<div id="RE5Stats">
		<div class="RE5title">P1 Kills: </div><font color="#00FF00">${data.ChrisKills} | ${data.KillsRequired} | ${data.IsSRank ? "S" : "No S" + "&nbsp;" + "&nbsp;" + "&nbsp;"}</font>
		<div class="RE5title">P2 Kills: </div><font color="#00FF00">${data.ShevaKills} | ${data.KillsRequired} | ${data.IsSRank ? "S" : "No S"}</font>
	</div>`;

	if(data.Gamestate == 6 || data.Gamestate == 7){
		DrawTextBlocks(["P1 DA", "P1 Rank"], [data.ChrisDA, data.ChrisDARank], ["white", "green2"], HideDA);
		DrawTextBlocks(["P2 DA", "P2 Rank"], [data.ShevaDA, data.ShevaDARank], ["white", "green2"], HideDA);
	} else{
		DrawTextBlocks(["P1 DA", "P1 Rank"], ["0", "0"], ["white", "green2"], HideDA);
		DrawTextBlocks(["P2 DA", "P2 Rank"], ["0", "0"], ["white", "green2"], HideDA);
	}

	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL6
var RE6Names = ['Leon', 'Helena', 'Chris', 'Piers', 'Jake', 'Sherry', 'Ada', 'Agent'];

function GetRE6PlayerDA(data, value) {
	var playerDA;
	if (data.PlayerID == 0 || data.PlayerID == 2 || data.PlayerID == 4 || data.PlayerID == 6) {
		switch (data.PlayerID + value) {
			case 0:
				return playerDA = data.Stats.DALeon;
			case 1:
				return playerDA = data.Stats.DAHelena;
			case 2:
				return playerDA = data.Stats.DAChris;
			case 3:
				return playerDA = data.Stats.DAPiers;
			case 4:
				return playerDA = data.Stats.DAJake;
			case 5:
				return playerDA = data.Stats.DASherry;
			case 6:
				return playerDA = data.Stats.DAAda;
			case 7:
				return playerDA = data.Stats.DAHunk;
			default:
		}
	} else {
		switch (data.PlayerID - value) {
			case 0:
				return playerDA = data.Stats.DALeon;
			case 1:
				return playerDA = data.Stats.DAHelena;
			case 2:
				return playerDA = data.Stats.DAChris;
			case 3:
				return playerDA = data.Stats.DAPiers;
			case 4:
				return playerDA = data.Stats.DAJake;
			case 5:
				return playerDA = data.Stats.DASherry;
			case 6:
				return playerDA = data.Stats.DAAda;
			case 7:
				return playerDA = data.Stats.DAHunk;
			default:
		}
	}
}

function ResidentEvil6(data) {
	let _colors = GetColor(data.Player);
	let _colors2 = GetColor(data.Player2);
	// Check which character we are playing currently to prevent showing wrong data
	if (data.PlayerID == 0 || data.PlayerID == 2 || data.PlayerID == 4 || data.PlayerID == 6) {
		// Player HP
		DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, RE6Names[data.PlayerID] + ": ", _colors);
		DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.PercentageHP, RE6Names[data.PlayerID + 1] + ": ", _colors2);

		// Player DA
		DrawTextBlock("DA " + RE6Names[data.PlayerID], GetRE6PlayerDA(data, 0), ["white", "green2"]);
		DrawTextBlock("DA " + RE6Names[data.PlayerID + 1], GetRE6PlayerDA(data, 1), ["white", "green2"]);
	} else {
		// Player HP
		DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.PercentageHP, RE6Names[data.PlayerID - 1] + ": ", _colors);
		DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.PercentageHP, RE6Names[data.PlayerID] + ": ", _colors2);

		// Player DA
		DrawTextBlock("DA " + RE6Names[data.PlayerID - 1], GetRE6PlayerDA(data, 1), ["white", "green2"]);
		DrawTextBlock("DA " + RE6Names[data.PlayerID], GetRE6PlayerDA(data, 0), ["white", "green2"]);
	}
	
	DrawTextBlock("Skill Points ", data.StatusPoints + data.StatusPointsCur, ["white", "green2"]);

	// Enemy HP
	if(data.Areas == 300 || data.Areas == 301 || data.Areas == 303 || data.Areas == 500 || data.Areas == 501 || data.Areas == 502 
		|| data.Areas == 503 || data.Areas == 504 || data.Areas == 506 || data.Areas == 507 || data.Areas == 770){
		var filteredExceptions = data.EnemyHealth.filter(m => {return (m.MaximumHP != 1000 && m.IsAlive)});
		filteredExceptions.sort(function (a, b) {
			return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
		}).forEach(function (item, index, arr) {
			DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
		});
	} else if(data.Areas == 300 || data.Areas == 301){
		var filteredExceptions = data.EnemyHealth.filter(m => {return (m.MaximumHP != 10000 && m.IsAlive)});
		filteredExceptions.sort(function (a, b) {
			return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
		}).forEach(function (item, index, arr) {
			DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
		});
	} else{
		var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
		filterdEnemies.sort(function (a, b) {
			return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
		}).forEach(function (item, index, arr) {
			DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
		});
	}

	// Versions
	DrawTextBlock("TV", data.VersionInfo, ["white", "green2"]);
	DrawTextBlock("GV", data.GameInfo, ["white", "green2"]);
}

var JackHPs = [
	{MaxJackHP: 1600},
	{MaxJackHP: 1200},
	{MaxJackHP: 1200},
	{MaxJackHP: 1200},
	{MaxJackHP: 500},
	{MaxJackHP: 1000},
	{MaxJackHP: 800},
	{MaxJackHP: 500}
];

// RESIDENT EVIL 7
function ResidentEvil7(data)
{
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, "Player: ", _colors);
	DrawTextBlocks(["Rank", "RankScore"], [data.Rank, data.RankScore], ["white", "green2"], HideDA);
	
	// Enemy HPs
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});

	// Jack Eyes new
	var filteredJackNewEyes = data.JackHP.filter(m => {return (m.IsAlive)});
	filteredJackNewEyes.forEach(function (item, index, arr){
		DrawProgressBar(item.CurrentHP, JackHPs[index].MaxJackHP, item.CurrentHP / JackHPs[index].MaxJackHP, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL 8: VILLAGE
function ResidentEvil8(data)
{
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);
	DrawTextBlocks(["Rank", "RankScore"], [data.Rank, data.RankScore], ["white", "green2"], HideDA);
	DrawTextBlock("LEI", `L ${data.Lei}`, ["white", "green2"], HideMoney);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.CurrentHP, b.CurrentHP) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, "", ["danger", "red"]);
	});
}

// RESIDENT EVIL: CODE VERONICA X
function ResidentEvilCodeVeronicaX(data)
{
	DrawTextBlock("IGT", data.IGT.FormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, `${data.Player.CharacterFirstName}: `, _colors);
	DrawTextBlock("Room Name", data.Room.Name, ["white", "green2"], HideStats);
	DrawTextBlock("Difficulty", data.DifficultyName, ["white", "green2"], HideStats);
	var filterdEnemies = data.Enemy.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, item.TypeName, ["danger", "red"]);
	});
}

// RESIDENT EVIL: REVELATIONS
function ResidentEvilRevelations1(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.Player.Name, _colors);
	DrawTextBlocks(["Rank", "RankScore"], [data.EndResults.Rank, data.EndResults.RankScore], ["white", "green2"], HideDA);
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		DrawProgressBar(item.CurrentHP, item.MaximumHP, item.Percentage, item.Name, ["danger", "red"]);
	});
}

// RESIDENT EVIL: REVELATIONS 2
function ResidentEvilRevelations2(data)
{
	DrawTextBlock("IGT", data.IGTFormattedString, ["white", "green2"], HideIGT);
	let _colors = GetColor(data.Player);
	DrawProgressBar(data.Player.CurrentHP, data.Player.MaxHP, data.Player.Percentage, data.PlayerName, _colors);

	let _colors2 = GetColor(data.Player2);
	DrawProgressBar(data.Player2.CurrentHP, data.Player2.MaxHP, data.Player2.Percentage, data.Player2Name, _colors2);
}
