//ONLINE WEBSOCKET SERVER SETTINGS
const websocket_endpoint = "wss://relay.aricodes.net/ws";

//LOCAL JSON SERVER SETTINGS
var JSON_ADDRESS = "127.0.0.1";
const JSON_PORT = 7190;
const POLLING_RATE = 333;
var JSON_ENDPOINT = `http://${JSON_ADDRESS}:${JSON_PORT}/`;

// PARAM VARIABLES
var HideIGT = false;
var HidePosition = false;
var HideMoney = false;
var HideDA = false;
var HideStats = false;
var ShowBossOnly = false;
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

// RESIDENT EVIL 0 REMAKE
function RE0Stats(data) {
	if (HideStats)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title">Saves: <font color="#00FF00">${data.Stats.Saves}</font></div>`;
	mainContainer.innerHTML += `<div class="title">Kills: <font color="#00FF00">${data.Stats.Kills}</font></div>`;
	mainContainer.innerHTML += `<div class="title">Shots: <font color="#00FF00">${data.Stats.Shots}</font></div>`;
	mainContainer.innerHTML += `<div class="title">Recoveries: <font color="#00FF00">${data.Stats.Recoveries}</font></div>`;
}

//Resident Evil 5
const Chapters = [
    {
      Accuracy: 70,
      Kills: 20,
      Deaths: 0,
      Time: 720
    },
    {
      Accuracy: 70,
      Kills: 15,
      Deaths: 0,
      Time: 780
    },
    {
      Accuracy: 70,
      Kills: 60,
      Deaths: 0,
      Time: 1380
    },
    {
      Accuracy: 70,
      Kills: 50,
      Deaths: 0,
      Time: 1320
    },
    {
      Accuracy: 70,
      Kills: 40,
      Deaths: 0,
      Time: 540
    },
    {
      Accuracy: 70,
      Kills: 30,
      Deaths: 0,
      Time: 1080
    },
    {
      Accuracy: 70,
      Kills: 50,
      Deaths: 0,
      Time: 1140
    },
    {
      Accuracy: 70,
      Kills: 30,
      Deaths: 0,
      Time: 1140
    },
    {
      Accuracy: 70,
      Kills: 50,
      Deaths: 0,
      Time: 1380
    },
    {
      Accuracy: 70,
      Kills: 35,
      Deaths: 0,
      Time: 960
    },
    {
      Accuracy: 70,
      Kills: 7,
      Deaths: 0,
      Time: 720
    },
    {
      Accuracy: 70,
      Kills: 40,
      Deaths: 0,
      Time: 1320
    },
    {
      Accuracy: 70,
      Kills: 30,
      Deaths: 0,
      Time: 2280
    },
    {
      Accuracy: 70,
      Kills: 40,
      Deaths: 0,
      Time: 1560
    },
    {
      Accuracy: 70,
      Kills: 35,
      Deaths: 0,
      Time: 1380
    },
    {
      Accuracy: 70,
      Kills: 25,
      Deaths: 0,
      Time: 1320
    }
];

function RE5Stats(data, player) {
	if (HideStats && HideDA) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let statHTML = "";

	if (!HideDA)
	{
		if (player == 1) 
		{
			statHTML += `<div class="title">P1 DA Score: <font color="#00FF00">${data.ChrisDA}</font></div><div class="title">P1 DA Rank: <font color="#00FF00">${data.ChrisDARank}</font></div>`
		}
		else 
		{
			statHTML += `<div class="title">P2 DA Score: <font color="#00FF00">${data.ShevaDA}</font></div><div class="title">P2 DA Rank: <font color="#00FF00">${data.ShevaDARank}</font></div>`
		}
	}
	if (!HideStats)
	{
		if (player == 1) 
		{
			statHTML += `<div class="title">P1 Kills: <font color="#00FF00">${data.ChrisKills} | ${GetNeededKills(data)} | ${GetSRank(data.Chapter, data.EnemiesHits, data.ShotsFired, data.Deaths, data.IGT, data.ChrisKills)}</font></div>`
		}
		else
		{
			statHTML += `<div class="title">P2 Kills: <font color="#00FF00">${data.ShevaKills} | ${GetNeededKills(data)} | ${GetSRank(data.Chapter, data.EnemiesHits2, data.ShotsFired2, data.Deaths, data.IGT, data.ShevaKills)}</font></div>`
		}
	}
	mainContainer.innerHTML += `<div id="da">${statHTML}</div>`;
}

function GetNeededKills(data){
	switch(data.Chapter){
		case 0:
			return "20";
		case 1:
			return "15";
		case 2:
			return "60";
		case 3:
			return "50";
		case 4:
			return "40";
		case 5:
			return "30";
		case 6:
			return "50";
		case 7:
			return "30";
		case 8:
			return "50";
		case 9:
			return "35";
		case 10:
			return "7";
		case 11:
			return "40";
		case 12:
			return "30";
		case 13:
			return "40";
		case 14:
			return "35";
		case 15:
			return "25";
		default:
			return "None";
	}
}

function GetSRank(chapter, enemiesHit, shotsFired, kills, deaths, time){
	var accuracy = enemiesHit / shotsFired * 100;
	if (accuracy >= Chapters[chapter].Accuracy && kills >= Chapters[chapter].Kills && deaths == Chapters[chapter].Deaths && time <= Chapters[chapter].Time) {
		return "S";
	}
	else {
		return "No S";
	}
}

// RESIDENT EVIL 6
function RE6GetCurrentLevel(data) {
	if (!IsDebug) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `
	<div id="da">
		<div class="title">Level: <font color="#00FF00">${data.CurrentLevel}</font></div>
	</div>`;
}

// RESIDENT EVIL: CODE VERONICA X
function RECVXHP(data) {
let mainContainer = document.getElementById("srtQueryData");
	var hitPercent = (data.Player.CurrentHP / data.Player.MaximumHP) * 100;
	var playerName = data.Player.CharacterFirstName;
	// Player HP
	if (data.Player.IsGassed) {
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar gassed" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: ${data.Player.CurrentHP} / ${data.Player.MaximumHP}</div>
						<div class="pink" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
	else if (data.Player.IsPoison) {
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar poison" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: ${data.Player.CurrentHP} / ${data.Player.MaximumHP}</div>
						<div class="purple" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
	else if (hitPercent > 75 && hitPercent <= 100) {
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar fine" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: ${data.Player.CurrentHP} / ${data.Player.MaximumHP}</div>
						<div class="green" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
	else if (hitPercent > 50 && hitPercent <= 75) {
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar fineToo" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: ${data.Player.CurrentHP} / ${data.PlayerMaxHealth}</div>
						<div class="yellow" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
	else if (hitPercent > 25 && hitPercent <= 50) {
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar caution" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: ${data.Player.CurrentHP} / ${data.Player.MaximumHP}</div>
						<div class="orange" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
	else if (hitPercent >= 0 && hitPercent <= 25){
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar danger" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: ${data.Player.CurrentHP} / ${data.Player.MaximumHP}</div>
						<div class="red" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
	else{
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar dead" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}: 0 / ${data.Player.MaximumHP}</div>
						<div class="grey" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
}

function RECVXStats(data) {
	if (HideIGT && HideStats) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let statHTML = "";
	if (!HideIGT)
	{
		statHTML += `<div class="title">IGT: <font color="#00FF00">${data.IGT.FormattedString}</font></div>`
	}
	//if (!HideDA)
	//{
	//	statHTML += `<div class="title">DA Score: <font color="#00FF00">${data.RankScore}</font></div><div class="title">DA Rank: <font color="#00FF00">${data.Rank}</font></div>`
	//}
	if (!HideStats)
	{
		statHTML += `<div class="title">Room Name: <font color="#00FF00">${data.Room.Name}</font></div>`
		statHTML += `<div class="title">Difficulty: <font color="#00FF00">${data.DifficultyName}</font></div>`
	}
	mainContainer.innerHTML += `<div id="da">${statHTML}</div>`;
}

function RECVXEHPBars(data) {
	if (HideEnemies)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	var filterdEnemies = data.Enemy.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		if (!ShowBossOnly && item.IsAlive) {
			mainContainer.innerHTML += `<div class="enemyhp"><div class="enemyhpbar danger" style="width:${(item.Percentage * 100).toFixed(1)}%">
			<div id="currentenemyhp">${item.TypeName}: ${item.CurrentHP} / ${item.MaximumHP}</div><div class="red" id="percentenemyhp">${(item.Percentage * 100).toFixed(1)}%</div></div></div>`;
		}
		else if (ShowBossOnly && item.IsAlive && item.IsBoss) {
			mainContainer.innerHTML += `<div class="enemyhp"><div class="enemyhpbar danger" style="width:${(item.Percentage * 100).toFixed(1)}%">
			<div id="currentenemyhp">${item.TypeName}: ${item.CurrentHP} / ${item.MaximumHP}</div><div class="red" id="percentenemyhp">${(item.Percentage * 100).toFixed(1)}%</div></div></div>`;
		}
	});
}

// ENEMY HP FUNCTIONS
function EnemyHPBars(data) {
	if (HideEnemies)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		if (!ShowBossOnly && item.IsAlive) {
			mainContainer.innerHTML += `<div class="enemyhp"><div class="enemyhpbar danger" style="width:${(item.Percentage * 100).toFixed(1)}%">
			<div id="currentenemyhp">${item.CurrentHP} / ${item.MaximumHP}</div><div class="red" id="percentenemyhp">${(item.Percentage * 100).toFixed(1)}%</div></div></div>`;
		}
		else if (ShowBossOnly && item.IsAlive && item.IsBoss) {
			mainContainer.innerHTML += `<div class="enemyhp"><div class="enemyhpbar danger" style="width:${(item.Percentage * 100).toFixed(1)}%">
			<div id="currentenemyhp">${item.BossName}: ${item.CurrentHP} / ${item.MaximumHP}</div><div class="red" id="percentenemyhp">${(item.Percentage * 100).toFixed(1)}%</div></div></div>`;
		}
	});
}

function EnemyHPRE0(data) {
	if (HideEnemies)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive && !m.IsPlayer) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).map(item => {
		mainContainer.innerHTML += `
		<div class="enemyhpnobar">
			<div id="currentenemyhp">Enemy: <font color="#FF0000">${item.CurrentHP}</font></div>
		</div>`;
	});
}

function EnemyHPRE1(data) {
	if (HideEnemies)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		if (item.IsAlive) {
			mainContainer.innerHTML += `
			<div class="enemyhpnobar">
				<div id="currentenemyhp">Enemy: <font color="#FF0000">${item.CurrentHP}</font></div>
			</div>`;
		}
	});
}

function EnemyHPRE2(data) {
	if (HideEnemies)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	var filterdEnemies = data.EnemyHealth.filter(m => { return (m.IsAlive) });
	filterdEnemies.sort(function (a, b) {
		return Asc(a.Percentage, b.Percentage) || Desc(a.CurrentHP, b.CurrentHP);
	}).forEach(function (item, index, arr) {
		if (!ShowBossOnly && item.IsAlive) {
			if (item.IsBoss) {
				let percent = item.CurrentHP / item.MaximumHP * 100;
				mainContainer.innerHTML += `
				<div class="enemyhp">
					<div class="enemyhpbar danger" style="width:${percent.toFixed(1)}%">
						<div id="currentenemyhp">${item.BossName}: ${item.CurrentHP} / ${item.MaximumHP}</div>
						<div class="red" id="percentenemyhp">${percent.toFixed(1)}%</div>
					</div>
				</div>`;
			}
			else {
				mainContainer.innerHTML += `
				<div class="enemyhpnobar">
					<div id="currentenemyhp">Enemy: <font color="#FF0000">${item.CurrentHP}</font></div>
				</div>`;
			}
		}
		else if (ShowBossOnly && item.IsAlive && item.IsBoss) {
			let percent = item.CurrentHP / item.MaximumHP * 100;
			mainContainer.innerHTML += `
			<div class="enemyhp">
				<div class="enemyhpbar danger" style="width:${percent.toFixed(1)}%">
					<div id="currentenemyhp">${item.BossName}: ${item.CurrentHP} / ${item.MaximumHP}</div>
					<div class="red" id="percentenemyhp">${percent.toFixed(1)}%</div>
				</div>
			</div>`;
		}
	});
}

function NemesisHPClassic(data) {
	if (HideEnemies)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	if (data.Nemesis.IsAlive) {
		mainContainer.innerHTML += `
		<div class="enemyhp">
			<div class="enemyhpbar danger" style="width:${(data.Nemesis.Percentage * 100).toFixed(1)}%">
				<div id="currentenemyhp">${data.Nemesis.BossName}: ${data.Nemesis.CurrentHP} / ${data.Nemesis.MaximumHP}</div>
				<div class="red" id="percentenemyhp">${(data.Nemesis.Percentage * 100).toFixed(1)}%</div>
			</div>
		</div>`;
	}
}

// UNIVERSAL RESIDENT EVIL FUNCTIONS
function GetTimer(data) {
	if (HideIGT) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title">IGT: <font color="#00FF00">${data.IGTFormattedString}</font></div>`;
}

function GetMoney(title, prefix, money) {
	if (HideMoney) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title">${title}<font color="#00FF00">${prefix + money}</font></div>`;
}

function GetDA(score) {
	if (HideDA) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title">DA Rank: <font color="#00FF00">${Math.floor(score / 1000)}</font></div>`;
	mainContainer.innerHTML += `<div class="title">DA Score: <font color="#00FF00">${score}</font></div>`;
}

function GetDA2(score, rank) {
	if (HideDA) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `<div class="title">DA Rank: <font color="#00FF00">${rank}</font></div>`;
	mainContainer.innerHTML += `<div class="title">DA Score: <font color="#00FF00">${score}</font></div>`;
}

function GetPosition(position) {
	if (HidePosition) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let children = "";
	children += `<div class="title">X: <font color="#00FF00">${position.X}</font></div>`;
	children += `<div class="title">Y: <font color="#00FF00">${position.Y}</font></div>`;
	children += `<div class="title">Z: <font color="#00FF00">${position.Z}</font></div>`;
	mainContainer.innerHTML += `<div id="position">${children}</div>`;
}

function DrawHPBar(player, playerName, states) {
	if (!player.IsAlive) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let colors = GetColor(player, states);
	mainContainer.innerHTML += `<div class="hp"><div class="hpbar ${colors[0]}" style="width:${(player.Percentage * 100)}%">
				<div id="currenthp">${playerName}${player.CurrentHP.toFixed(0)} / ${player.MaxHP}</div><div class="${colors[1]}" id="percenthp">${(player.Percentage * 100).toFixed(1)}%</div></div></div>`;
}

function GetColor(player, states)
{
	if (states == 2) {
		if (player.HealthState == 1) return ["fine", "green"];
		else if (player.HealthState == 2) return ["danger", "red"];
		return ["dead", "grey"];
	}
	else if (states == 3) {
		if (player.HealthState == 1) return ["fine", "green"];
		else if (player.HealthState == 2) return ["caution", "orange"];
		else if (player.HealthState == 3) return ["danger", "red"];
		return ["dead", "grey"];
	}
	else if (states == 4) {
		if (player.HealthState == 1) return ["fine", "green"];
		else if (player.HealthState == 2) return ["fineToo", "yellow"];
		else if (player.HealthState == 3) return ["caution", "orange"];
		else if (player.HealthState == 4) return ["danger", "red"];
		return ["dead", "grey"];
	}
	else if (states == 5) {
		if (player.IsPoisoned) return ["poison", "purple"];
		if (player.HealthState == 1) return ["fine", "green"];
		else if (player.HealthState == 2) return ["fineToo", "yellow"];
		else if (player.HealthState == 3) return ["caution", "orange"];
		else if (player.HealthState == 4) return ["danger", "red"];
		return ["dead", "grey"];
	}
	else if (states == 6) {
		if (player.IsGassed) return ["gassed", "pink"];
		if (player.IsPoisoned) return ["poison", "purple"];
		if (player.HealthState == 1) return ["fine", "green"];
		else if (player.HealthState == 2) return ["fineToo", "yellow"];
		else if (player.HealthState == 3) return ["caution", "orange"];
		else if (player.HealthState == 4) return ["danger", "red"];
		return ["dead", "grey"];
	}
}

function appendData(data) {
	//console.log(data);
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	switch (data.GameName)
	{
		case "RECVX":
			//RECVXHP(data);
			DrawHPBar(data.player, data.Player.CharacterFirstName, 6)
			RECVXStats(data);
			RECVXEHPBars(data);
			return;
		case "RE0":
			GetTimer(data)
			DrawHPBar(data.Player, data.PlayerName, 4);
			DrawHPBar(data.Player2, data.PlayerName2, 4);
			RE0Stats(data);
			EnemyHPRE0(data);
			return;
		case "RE1":
			GetTimer(data);
			DrawHPBar(data.Player, data.PlayerName, 4);
			EnemyHPRE1(data);
			return;
		case "RE2":
			GetTimer(data);
			DrawHPBar(data.Player, data.PlayerName, 4);
			EnemyHPRE2(data)
			return;
		case "RE3":
			GetTimer(data);
			DrawHPBar(data.Player, data.PlayerName, 4);
			NemesisHPClassic(data);
			return;
		case "RE1R":
			GetTimer(data);
			DrawHPBar(data.Player, data.PlayerName, 4);
			return;
		case "RE2R":
			GetTimer(data);
			DrawHPBar(data.Player, data.PlayerName, 3);
			GetDA2(data.RankManager.RankScore, data.RankManager.Rank);
			EnemyHPBars(data);
			return;
		case "RE3R":
			GetTimer(data);
			DrawHPBar(data.Player, data.PlayerName, 3);
			GetDA2(data.RankManager.RankScore, data.RankManager.Rank);
			EnemyHPBars(data);
			return;
		case "RE4":
			GetTimer(data);
			GetMoney(data.GameData.Money);
			DrawHPBar(data.Player, data.PlayerName, 3);
			GetDA(data.GameData.RankScore);
			DrawHPBar(data.Player2, data.PlayerName2, 3);
			return;
		case "RE5":
			if (!IsSeparated)
			{
				GetTimer(data);
				GetMoney("PTAS: ", "₧ ", data.Money);
				DrawHPBar(data.Player, "Chris: ", 3);
				RE5Stats(data, 1);
				DrawHPBar(data.Player2, "Sheva: ", 3);
				RE5Stats(data, 2);
				EnemyHPBars(data);
			}
			else 
			{
				if (IsPlayer2) 
				{
					DrawHPBar(data.Player2, "Sheva: ", 3);
					RE5Stats(data, 2)
					return;
				}
				DrawHPBar(data.Player, "Chris: ", 3);
				RE5Stats(data, 1);
				EnemyHPBars(data);
			}
			return;
		case "RE6":
			RE6GetCurrentLevel(data);
			if (!IsSeparated)
			{
				if (data.Player.CurrentHP == 0 && data.Player.MaxHP == 0) return;
				DrawHPBar(data.Player, data.PlayerName, 2);
				GetDA(data.PlayerDA);

				if (data.Player2.CurrentHP == 0 && data.Player2.MaxHP == 0) return;
				DrawHPBar(data.Player2, data.PlayerName2, 2);
				GetDA(data.Player2DA);
				return;
			}
			else
			{
				if (IsPlayer2) 
				{
					DrawHPBar(data.Player2, data.PlayerName2, 2);
					GetDA(data.Player2DA);
					return;
				}
				DrawHPBar(data.Player, data.PlayerName, 2);
				GetDA(data.PlayerDA);
				return;
			}
		case "RE7":
			GetDA2(data.RankScore, data.Rank);
			DrawHPBar(data.Player, "Ethan: ", 3);
			EnemyHPBars(data);
			return;
		case "RE8":
			//GetPosition(data.PlayerPosition);
			DrawHPBar(data.Player, data.PlayerName, 3);
			GetDA2(data.RankScore, data.Rank);
			GetMoney("LEI: ", "", data.Lei);
			EnemyHPBars(data);
			return;
		default:
			mainContainer.innerHTML += "No Plugin Detected";
			return;
	}
}