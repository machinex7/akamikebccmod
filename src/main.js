//A mod by @machinex7 for akamikeb.
//A lot of this was copied from my old cookie clickers mods

//utility functions.
var cnum=function(base, factor){
	factor = factor.toLowerCase();
	var fct = 1;
	if(factor == 'k'){
		fct = 1000;
	} else if(factor == 'm'){
		fct = 1000000;
	} else if(factor == 'b'){
		fct = 1000000000;
	} else if(factor == 't'){ //trillion
		fct = 1000000000000;
	} else if(factor == 'qa'){ //quadrillion
		fct = 1000000000000000;
	} else if(factor == 'qi'){ //quintillion
		fct = 1000000000000000000;
	} else if(factor == 'sx'){ //sextillion
		fct = 1000000000000000000000;
	} else if(factor == 'sp'){ //septillion
		fct = 1000000000000000000000000;
	} else if(factor == 'o'){ //octillion
		fct = 1000000000000000000000000000;
	} else if(factor == 'n'){ //nonillion
		fct = 1000000000000000000000000000000;
	} else if(factor == 'd'){ //decillion
		fct = 1000000000000000000000000000000000;
	} else if(factor == 'ud'){ //undecillion
		fct = 1000000000000000000000000000000000000;
	}
	
	return base * fct;
}
//helps load data. In case of this being a new version, it doesn't die on new variables.
loadHelper=function(vars, index){
	if(index < vars.length){ //safe
		return vars[index];
	} else { //bad
		return '0';
	}
}

//everything goes in here.
AkaMod = {
	streamData: {
		url: "http://ec2-34-223-52-113.us-west-2.compute.amazonaws.com:3000/",
		viewerCount: 0,
		mikeStreaming: false,
		gameName: "",
		title: "",
		caughtStreams: 0,
		lastStream: "Mon Jan 01 1970"
	},

	upgrades: [],
	achievements: [],

	//set up the hooks.
	init:function(){
		//Boost CPS
		/*Game.registerHook('cps', (oldCps) => {
			if(AkaMod.streamData.mikeStreaming) {
				return oldCps * (1 + AkaMod.computeStreamingBuff() * AkaMod.streamData.viewerCount / 100);
			}
			return oldCps;
		});*/

		//Boost clicks.
		/*Game.registerHook("cookiesPerClick", (oldClicks) => {
			if(AkaMod.streamData.mikeStreaming) {
				return oldClicks * AkaMod.computeStreamingBuff();
			}
			return oldClicks;
		});*/

		//initial resource loading.
		Game.registerHook("create", () => {
			//This seems to only be called in the APP. It is called after all the other upgrades and achievments are registered.
			AkaMod.registerUpgrades();
			AkaMod.registerAchivements();
			AkaMod.registerBuffs();
		});

		//slowtick
		Game.registerHook("check", AkaMod.check);

		AkaMod.bakeryNameSet=Game.bakeryNameSet;
		Game.bakeryNameSet=function(what){
			if(what.toLowerCase() == 'akamikeb'){
				Game.Win("No, you're a Fony");
				what = "Fony";
			}
			AkaMod.bakeryNameSet(what);
		}

		//'reset' - called whenever the player resets; parameter is true if this is a hard reset, false if it's an ascension

		//'reincarnate' - called when the player has reincarnated after an ascension
		Game.registerHook('reincarnate', () => {
			//reset upgrades
			for (var i in AkaMod.upgrades) {
				var me=AkaMod.upgrades[i];
				me.unlocked=0;me.bought=0;
			}
		});

		Game.Popup("AkamikebB mod loaded!");
		setTimeout(AkaMod.streamingPoll, 1000); //wait a second so the load or Create finishes.
	},

	//This is called every 5 seconds.
	check: function(){
		if(new Date().toDateString().indexOf('Sep 20') >= 0) {
			Game.Win("Happy Birthday Mike!");
		}
	},

	//Figures out the CPS and click boost from mike streaming.
	computeStreamingBuff: () => {
		if(!AkaMod.streamData.mikeStreaming) {
			return 1;
		}
		let factor = 1;
		if(Game.Has("I'm A Fan")) {
			factor = 2;
		}
		if(Game.Has("I'm A Big Fan")) {
			factor *= 2;
		}
		if(Game.Has("I'm A Super Fan")) {
			factor *= 2;
		}
		if(Game.Has("I'm A MEGA Fan")) {
			factor *= 2;
		}
		if(Game.Has("I'm A RIDICULOUS Fan")) {
			factor *= 2;
		}

		return factor;
	},
	//refresh the buff we get while streaming.
	refreshStreamingBuff: () => {
		if(AkaMod.streamData.mikeStreaming) {
			AkaMod.registerBuffs();
			Game.killBuff("Streaming");
			setTimeout(() => {
				Game.gainBuff('streaming',60*2,AkaMod.computeStreamingBuff());
			}, 1000 / Game.fps);
		}
	},

	registerBuffs: () => {
		if(Game.buffTypesByName.streaming) {
			return;
		}
		new Game.buffType('streaming',function(time, streamingBuff) {
			const boost = streamingBuff * AkaMod.streamData.viewerCount / 200;
			return {
				name:'Streaming',
				desc:'Mike is Streaming! Clicks boosted by ' + streamingBuff + '00%! ' + AkaMod.streamData.viewerCount + ' viewers are boosting CPS by ' + (boost*100) + '%!',
				icon:[28,6],
				time:time*Game.fps,
				max:true,
				multCpS: 1 + boost,
				multClick: streamingBuff
			};
		});
	},

	//redefine the Upgrade constructor. The localization thing is causing bugs for me.
	Upgrade: (name,desc,price,icon,buyFunction) => {
		const upgrd = new Game.Upgrade(name,desc,price,icon,buyFunction);
		AkaMod.upgrades.push(upgrd);
		upgrd.dname = upgrd.name;
		upgrd.ddesc = upgrd.desc;
	},

	//register all upgrades
	loadedUpgradeString: undefined,
	registerUpgrades: () => {
		if(AkaMod.upgrades.length !== 0) {
			return; //don't load twice
		}
		//Game.Upgrade=function(name,desc,price,icon,buyFunction)
		AkaMod.Upgrade("I'm A Fan","Double bonus from watching live streams!<q>How's this twitch thing work?</q>",cnum(400,'m'),[19,3], AkaMod.refreshStreamingBuff);
		AkaMod.Upgrade("I'm A Big Fan","Another double bonus from watching live streams!<q>So I press this button to stream...</q>",cnum(400,'b'),[20,3], AkaMod.refreshStreamingBuff);
		AkaMod.Upgrade("I'm A Super Fan","Another double bonus from watching live streams!<q>And I can chat right here...</q>",cnum(400,'t'),[21,3], AkaMod.refreshStreamingBuff);
		AkaMod.Upgrade("I'm A MEGA Fan","Another double bonus from watching live streams!<q>And the streamer video goes here...</q>",cnum(400,'qa'),[19,4], AkaMod.refreshStreamingBuff);
		AkaMod.Upgrade("I'm A RIDICULOUS Fan","Another double bonus from watching live streams!<q>Oh, that's how it works.</q>",cnum(400,'qi'),[20,4], AkaMod.refreshStreamingBuff);
		
		AkaMod.loadUpgrades();
	},
	loadUpgrades: () => { //loads upgrades from save data.
		if(AkaMod.loadedUpgradeString === undefined || AkaMod.upgrades.length === 0) {
			return;
		}
		var upgradeData = AkaMod.loadedUpgradeString.split(';');
		for(var i in upgradeData){
			var u = upgradeData[i];
			AkaMod.upgrades[i].unlocked = parseInt(u.charAt(0));
			AkaMod.upgrades[i].bought = parseInt(u.charAt(2));
			if(isNaN(AkaMod.upgrades[i].unlocked)) { //I don't think this should happen anymore, but I want to monitor just in case.
				console.error("Failed to load upgrade " + i + " data:" + u);
				AkaMod.upgrades[i].unlocked = 0;
				AkaMod.upgrades[i].bought = 0;
			}
		}
	},

	//redefine the Achievement constructor. The localization thing is causing bugs for me.
	Achievement: (name,desc,icon) => {
		const ach = new Game.Achievement(name,desc,icon);
		AkaMod.achievements.push(ach);
		ach.dname = ach.name;
		ach.ddesc = ach.desc;
	},

	//register all achievements.
	loadedAchievementString: undefined,
	registerAchivements: () => {
		if(AkaMod.achievements.length !== 0) {
			return; //don't load twice
		}
		//Game.Achievement=function(name,desc,icon)
		//streamer achievements
		AkaMod.Achievement("Streamerman", "Catch a live stream!", [16,5]);
		AkaMod.Achievement("It's a classic!", "Mike is playing Trials or Oxygen Not Included", [8,0]);
		AkaMod.Achievement("No, you're a Fony", "Rename your bakery to akamikeb", [28,7]);
		AkaMod.Achievement("Happy Birthday Mike!", "Play on Mike's Birthday!", [22,13]);

		AkaMod.loadAchievements();
	},
	loadAchievements: () => { //loads achievements from save data.
		if(AkaMod.loadedAchievementString === undefined || AkaMod.achievements.length === 0) {
			return;
		}
		var achieves = AkaMod.loadedAchievementString.split(';');
		for(var i in achieves){
			if(achieves[i]=='1'){
				AkaMod.achievements[i].won=1;
				Game.AchievementsOwned++;
			}
		}
	},

	//Save the mod data.
	save:function(){
		//use this to store persistent data associated with your mod
		let str = "";
		//save ugprades
		for (var i in AkaMod.upgrades) { //upgrades
			const me = AkaMod.upgrades[i];
			str += me.unlocked + ',' + me.bought + ';';
		}
		if(AkaMod.upgrades.length !== 0) { //only fails when there's a load error
			str = str.substr(0, str.length-1);
		}

		//save achievements
		str+='|';
		for (var i in AkaMod.achievements) {
			const me = AkaMod.achievements[i];
			str += me.won + ';';
		}
		if(AkaMod.achievements.length !== 0) { //only fails when there's a load error
			str = str.substr(0, str.length-1);
		}

		//streaming stuff
		str += "|";
		str += AkaMod.streamData.caughtStreams + ";";
		str += AkaMod.streamData.lastStream;
		return str;
	},

	//Load save data.
	load:function(str) {
		//Loading is janky due to supporting both the steam app and website. Loading stuf happens in a different order.
		if(Game.UpgradesN > 1) {
			//If we are running on the webapp, we need to register our data before doing the load.
			//On the webapp, create is already called.
			Game.runModHook('create');
		}
		if(!str) {
			return;
		}
		try{
			//do stuff with the string data you saved previously
			var strarr=str.split('|');
			if(strarr.length != 3) {
				Game.Popup("AkamikeB Mod data is corrupt!");
				console.log(str);
				return;
			}
			//load upgrades
			AkaMod.loadedUpgradeString = strarr[0];
			AkaMod.loadUpgrades();

			//load achievements
			AkaMod.loadedAchievementString = strarr[1];
			AkaMod.loadAchievements();

			//load streaming stuff
			var vars = strarr[2].split(';');
			AkaMod.streamData.caughtStreams=parseInt(loadHelper(vars, 0));
			AkaMod.streamData.lastStream=loadHelper(vars, 1);

			//recalculate gains at the end.
			Game.CalculateGains();
			Game.RebuildUpgrades();
		} catch (err) {
			console.error(err);
			Game.Popup("Failed to load AkaMikeB Mod!");
		}
	},

	//Check if mike is streaming
	streamingPoll: () => {
		//https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started
		let httpRequest;
		// Old compatibility code, no longer needed.
		if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
			httpRequest = new XMLHttpRequest();
		} else if (window.ActiveXObject) { // IE 6 and older
			httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
		}
		httpRequest.onreadystatechange = function(){
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if(httpRequest.status !== 200) {
					//something went wrong! Try again later.
					Game.Popup("http call failed with " + httpRequest.status);
					setTimeout(this.streamingPoll, 1000 * 60 * 5); //poll every 5 minutes.
					return;
				}
				// Everything is good, the response was received.
				const liveStreamData = JSON.parse(httpRequest.responseText);
				const oldmikeStreaming = AkaMod.streamData.mikeStreaming;
				// version, mikeStreaming, viewerCount, gameName title, bitTotal, hypeLevel
				AkaMod.streamData = {...AkaMod.streamData, ...liveStreamData};
				if(!oldmikeStreaming && AkaMod.streamData.mikeStreaming) {
					Game.Popup("Mike is streaming!");
					Game.Win("Streamerman");
					if(AkaMod.streamData.gameName.startsWith("Trials") || AkaMod.streamData.gameName.indexOf("Oxygen Not Included") !== -1) {
						Game.Win("It's a classic!");
					}
					if(AkaMod.streamData.lastStream === undefined) {
						AkaMod.streamData.caughtStreams++;
						AkaMod.streamData.lastStream = new Date().toDateString();
					} else {
						const testDate = new Date().toDateString();
						if(testDate !== AkaMod.streamData.lastStream) {
							AkaMod.streamData.lastStream = testDate;
							AkaMod.streamData.caughtStreams++;
							if(AkaMod.streamData.caughtStreams >= 2) {
								Game.Unlock("I'm A Fan");
								if(AkaMod.streamData.caughtStreams >= 10) {
									Game.Unlock("I'm A Big Fan");
									if(AkaMod.streamData.caughtStreams >= 20) {
										Game.Unlock("I'm A Super Fan");
										if(AkaMod.streamData.caughtStreams >= 80) {
											Game.Unlock("I'm A MEGA Fan");
											if(AkaMod.streamData.caughtStreams >= 240) {
												Game.Unlock("I'm A RIDICULOUS Fan");
											}
										}
									}
								}
							}
						}
					}
				}
				if(AkaMod.streamData.mikeStreaming) {
					AkaMod.refreshStreamingBuff();
					setTimeout(AkaMod.streamingPoll, 1000 * 60); //poll every minute
				} else {
					setTimeout(AkaMod.streamingPoll, 1000 * 60 * 5); //poll every 5 minutes.
				}
			}
		};
		httpRequest.open('GET', AkaMod.streamData.url, true);
		//httpRequest.setRequestHeader('Content-Type','text/json');
		//httpRequest.overrideMimeType('text/json');
		httpRequest.send();
	}
};
Game.registerMod("akamikeb", AkaMod);