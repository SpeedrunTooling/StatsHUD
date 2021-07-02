  
const websocket_endpoint = "wss://relay.aricodes.net/ws";

var HideIGT = false;
var HideMoney = false;
var HideDA = false;
var HideStats = false;
var ShowBossOnly = false;
var HideEnemies = false;

var IsSeparated = false;
var IsPlayer2 = false;

window.onload = function () {
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

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

	// CHECK FOR AUTH TOKEN
	const token = urlParams.get('token');
	if (token != null) {
		const socket = new WebSocket(websocket_endpoint);
		socket.onopen = () => socket.send(`listen:${token}`);
		socket.onmessage = (event) => appendData(JSON.parse(event.data));
	}
	else {
		let mainContainer = document.getElementById("srtQueryData");
		mainContainer.innerHTML = "Please provide username params to url to listen to.";
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

// RESIDENT EVIL CLASSIC TITLES
function RECHP(data) {
	let mainContainer = document.getElementById("srtQueryData");
	var hitPercent = (data.PlayerCurrentHealth / data.PlayerMaxHealth) * 100;
	var playerName = "Player: ";
	// Player HP
	if (hitPercent > 75 && hitPercent <= 100) {
		mainContainer.innerHTML += `
			<div class="hp">
				<div class="hpbar fine" style="width:${hitPercent}%">
					<div id="currenthp">
						<div style="font-size: 24px">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div>
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
						<div style="font-size: 24px">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div>
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
						<div style="font-size: 24px">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div>
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
						<div style="font-size: 24px">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div>
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
						<div style="font-size: 24px">${playerName}0 / ${data.PlayerMaxHealth}</div>
						<div class="grey" id="percenthp">${hitPercent.toFixed(1)}%</div>
					</div>
				</div>
			</div>`;
	}
}

function RECStats(data) {
	if (HideIGT)
	{
		return;
	}
	let mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML += `
	<div id="da">
		<div class="title">IGT: <font color="#00FF00">${data.IGTFormattedString}</font></div>
	</div>`;
}

//Resident Evil 5
function RE5HP(current, max, playerName) {
	let mainContainer = document.getElementById("srtQueryData");
	var hitPercent = (current / max) * 100;
	if (hitPercent > 66) {
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar fine" style="width:${hitPercent}%">
				<div id="currenthp">${playerName}${current} / ${max}</div><div class="green" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
	}
	else if (hitPercent <= 66 && hitPercent > 33) {
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar caution" style="width:${hitPercent}%">
				<div id="currenthp">${playerName}${current} / ${max}</div><div class="yellow" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
	}
	else if (hitPercent <= 33 && hitPercent > 0){
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar danger" style="width:${hitPercent}%">
				<div id="currenthp">${playerName}${current} / ${max}</div><div class="red" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
	}
	else {
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar dead" style="width:${100}%">
				<div id="currenthp">${playerName}${current} / ${max}</div><div class="grey" id="percenthp">${0}%</div></div></div>`;
	}
}

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
	if (HideIGT && HideMoney && HideStats && HideDA) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let statHTML = "";

	if (!HideIGT)
	{
		statHTML += `<div class="title">IGT: <font color="#00FF00">${data.IGTFormattedString}</font></div>`
	}
	if (!HideMoney)
	{
		statHTML += `<div class="title">Naira: <font color="#00FF00">${"₦ " + data.Money}</font></div>`
	}
	if (!HideDA)
	{
		if (!IsSeparated)
		{
			statHTML += `<div class="title">P1 DA Score: <font color="#00FF00">${data.ChrisDA}</font></div><div class="title">P1 DA Rank: <font color="#00FF00">${data.ChrisDARank}</font></div>`
			statHTML += `<div class="title">P2 DA Score: <font color="#00FF00">${data.ShevaDA}</font></div><div class="title">P2 DA Rank: <font color="#00FF00">${data.ShevaDARank}</font></div>`
		}
		else
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
		
	}
	if (!HideStats)
	{
		if (!IsSeparated)
		{
			statHTML += `<div class="title">P1 Kills: <font color="#00FF00">${data.ChrisKills} | ${GetNeededKills(data)} | ${GetSRank(data.Chapter, data.EnemiesHits, data.ShotsFired, data.Deaths, data.IGT, data.ChrisKills)}</font></div>`
			statHTML += `<div class="title">P2 Kills: <font color="#00FF00">${data.ShevaKills} | ${GetNeededKills(data)} | ${GetSRank(data.Chapter, data.EnemiesHits2, data.ShotsFired2, data.Deaths, data.IGT, data.ShevaKills)}</font></div>`
		}
		else 
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

// RESIDENT EVIL ENGINE TITLES
function REEngineHP(data) {
	let mainContainer = document.getElementById("srtQueryData");
	var hitPercent = (data.PlayerCurrentHealth / data.PlayerMaxHealth) * 100;
	var playerName = "Player: ";
	if (hitPercent > 66) {
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar fine" style="width:${hitPercent}%">
				<div id="currenthp">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div><div class="green" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
	}
	else if (hitPercent <= 66 && hitPercent > 33) {
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar caution" style="width:${hitPercent}%">
				<div id="currenthp">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div><div class="yellow" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
	}
	else if (hitPercent <= 33 && hitPercent > 0){
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar danger" style="width:${hitPercent}%">
				<div id="currenthp">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div><div class="red" id="percenthp">${hitPercent.toFixed(1)}%</div></div></div>`;
	}
	else {
		mainContainer.innerHTML += `<div class="hp"><div class="hpbar dead" style="width:${100}%">
				<div id="currenthp">${playerName}${data.PlayerCurrentHealth} / ${data.PlayerMaxHealth}</div><div class="grey" id="percenthp">${0}%</div></div></div>`;
	}
}

function REEngineStats(data) {
	if (HideIGT && HideDA) { return; }
	let mainContainer = document.getElementById("srtQueryData");
	let statHTML = "";
	if (!HideIGT && data.GameName != "RE7" && data.GameName != "RE8")
	{
		statHTML += `<div class="title">IGT: <font color="#00FF00">${data.IGTFormattedString}</font></div>`
	}
	if (!HideDA)
	{
		statHTML += `<div class="title">DA Score: <font color="#00FF00">${data.RankScore}</font></div><div class="title">DA Rank: <font color="#00FF00">${data.Rank}</font></div>`
	}
	mainContainer.innerHTML += `<div id="da">${statHTML}</div>`;
}

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

function appendData(data) {
	//console.log(data);
	var mainContainer = document.getElementById("srtQueryData");
	mainContainer.innerHTML = "";

	switch (data.GameName)
	{
		case "RE1":
			RECHP(data);
			RECStats(data);
			EnemyHPRE1(data);
			return;
		case "RE2":
			RECHP(data);
			RECStats(data);
			EnemyHPRE2(data)
			return;
		case "RE3":
			RECHP(data);
			RECStats(data);
			NemesisHPClassic(data);
			return;
		case "RE1R":
			RECHP(data);
			RECStats(data);
			return;
		case "RE2R":
			REEngineHP(data);
			REEngineStats(data);
			EnemyHPBars(data);
			return;
		case "RE3R":
			REEngineHP(data);
			REEngineStats(data);
			EnemyHPBars(data);
			return;
		case "RE5":
			if (!IsSeparated)
			{
				RE5HP(data.PlayerCurrentHealth, data.PlayerMaxHealth, "P1: ");
				RE5HP(data.PlayerCurrentHealth2, data.PlayerMaxHealth2, "P2: ");
				RE5Stats(data, 0);
				EnemyHPBars(data);
			}
			else 
			{
				if (IsPlayer2) 
				{
					RE5HP(data.PlayerCurrentHealth2, data.PlayerMaxHealth2, "P2: ");
					RE5Stats(data, 2)
					return;
				}
				RE5HP(data.PlayerCurrentHealth, data.PlayerMaxHealth, "P1: ");
				RE5Stats(data, 1);
				EnemyHPBars(data);
			}
			return;
		case "RE7":
			REEngineHP(data);
			REEngineStats(data);
			EnemyHPBars(data);
			return;
		case "RE8":
			REEngineHP(data);
			REEngineStats(data);
			EnemyHPBars(data);
			return;
		default:
			mainContainer.innerHTML += "No Plugin Detected";
			return;
	}
}