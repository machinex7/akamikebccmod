//A mod by @MachineX7 for @AkaMikeB.
//SPOILERS! May be more fun to discover stuff as you go.

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
	}  else if(factor == 'dd'){ //duodecillion
		fct = 1000000000000000000000000000000000000000;
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
//redefine this function so it can load other source files.
Pic=function(what) {
	if (Game.Loader.assetsLoaded.indexOf(what)!=-1) {
		return Game.Loader.assets[what];
	} else if (what.indexOf('http') != -1){
		var img=new Image();
		img.src=what;
		img.alt=what;
		img.onload=bind(Game.Loader,Game.Loader.onLoad);
		Game.Loader.assets[what]=img;
		Game.Loader.assetsLoading.push(what);
	} else if (Game.Loader.assetsLoading.indexOf(what)==-1) {
		Game.Loader.Load([what]);
	}
	return Game.Loader.blank;
}

//everything goes in here.
AkaMod = {
	streamData: {
		url: "http://ec2-34-223-52-113.us-west-2.compute.amazonaws.com:3000/stream",
		viewerCount: 0,
		mikeStreaming: false,
		gameName: "",
		title: "",
		caughtStreams: 0,
		lastStream: "Mon Jan 01 1970",
		minutesWatched: 0,
		rank: 7777
	},
	sundaeData: {
		pets: 0,
		totalPets: 0, //persist
		totalScratches: 0,
		consecutivePets: 0,
		consecutiveScratches: 0,
		mood: 100,
		maxMood: 80,
		moodReduction: 2,
		moodRecovery: 1,
		regainedMood: 0,
		cookieGains: 2,
		scratchLoss: 3,
		cookiesEarned: 0
	},
	blizzDays: {
		remainingTime: 0,
		nextDay: 1,
		//boss stuff
		currentBoss: 0,
		bossHP: 0,
		round: 0,
		optimalVictories: 0,
		lastAbility: '',
		lastBossAbility: [],
		bossDamage: 0,
		bossDamageReceived:0,
		totalBossDamage:0,
		bossCombatText: "",
		summonedGrandma: false,
		grandmaDamage:0,
		totalBosses: 0,
		//end boss stuff
		comingSoonCounter: 0,
		//pokemon stuff
		pokemon: [],
		activePokemon: -1,
		currentBait: -1,
		boughtBaits: 0,
		baitTime: 0,
		clickCatchChance: 0,
		minClicks: 0,
		catchAttempts: 0,
		catchSuccesses: 0,
		totalCatches: 0,
		caughtBunnies: 0,
		xpEarned: 0,
		//end pokemon stuff
		//quest stuff
		questTimer: -1,
		questType: -1,
		questStart: 0,
		questTarget: 0,
		questDesc: "",
		completedQuests: 0,
		totalQuests: 0,
		questCookies: 0,
		equipment:[
			-1,//helmet
			-1,//shoulder
			-1,//chest
			-1,//glove
			-1,//belt
			-1,//leg
			-1,//boot
		],
		//end quest stuff
		//finale!
		finaleClicks: 0,
		completions: 0
	},
	pokemon: [],

	upgrades: [],
	achievements: [],

	//set up the hooks.
	init:function(){
		//load external JS
		/*const wh1 = document.createElement("script");
		wh1.innerHTML = "const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true};";
		const wh2 = document.createElement("script");
		wh2.src = "https://wow.zamimg.com/widgets/power.js";
		document.head.appendChild(wh1);
		document.head.appendChild(wh2);*/
		const r1 = document.createElement("style");
		r1.innerHTML = ".q{color: #ffd100;} "
			+ ".q0{color:#9d9d9d;} "
			+ ".q1{color:white;} "
			+ ".q2{color:green;} "
			+ ".q3{color:#0070dd; font-weight:bold;} "
			+ ".q4{color:#a335ee; font-weight:bold;} "
			+ ".q5{color:#ff8000; font-weight:bold;} "
			+ ".q9{color:#71d5ff;} "
			+ ".moneysilver {padding-right: 15px; background: url(https://wow.zamimg.com/images/icons/money-silver.gif) no-repeat right center;} "
			+ ".moneycopper {padding-right: 15px; background: url(https://wow.zamimg.com/images/icons/money-copper.gif) no-repeat right center; } "
			+ ".moneygold {padding-right: 15px; background: url(https://wow.zamimg.com/images/icons/money-gold.gif) no-repeat right center; } "
			+ ".flipped {-moz-transform: scaleX(-1);-o-transform: scaleX(-1);-webkit-transform: scaleX(-1);transform: scaleX(-1);filter: FlipH;-ms-filter:\"FlipH\";}"//https://stackoverflow.com/questions/5768998/how-to-flip-background-image-using-css/5769010
			+ ".flippedVertical {-moz-transform: scaleY(-1);-o-transform: scaleY(-1);-webkit-transform: scaleY(-1);transform: scaleY(-1);filter: FlipV;-ms-filter:\"FlipV\";}"
			+ ".flippedBoth {-moz-transform: scaleX(-1) scaleY(-1);-o-transform: scaleX(-1) scaleY(-1);-webkit-transform: scaleX(-1) scaleY(-1);transform: scaleX(-1) scaleY(-1);filter: FlipH FlipV;-ms-filter:\"FlipH\" \"FlipV\";}"
		;
		document.head.appendChild(r1);

		//initial resource loading.
		Game.registerHook("create", () => {
			//This seems to only be called in the APP. It is called after all the other upgrades and achievments are registered.
			try{
				AkaMod.registerUpgrades();
				AkaMod.registerAchivements();
				AkaMod.registerBuffs();
			} catch (err) {
				console.log(err);
				Game.Popup(err);
			}
		});

		//slowtick
		Game.registerHook("check", AkaMod.check);
		//called nearly every frame.
		/*Game.registerHook("draw", ()=>{
		});*/

		Game.registerHook('ticker', () => {
			const list = [];

			list.push("Bruh.");
			list.push("Twitch streamer talks constantly about donuts and sundays. Inspires new Ben and Jerry's flavor: Donut Sundae.");
			list.push('After years of having his name mispronounced, popular streamer says, "My name is Mike now. Just Mike. Can you get that one right?"');
			list.push("News: No more models on OnlyFans. Now it's just pictures of cookies.");
			list.push("News: World of Warcraft experiences massive resurgence after adding more Cookies. <q>I don't know why it didn't occur to us sooner.</q> - Dev");
			list.push("News: Beavers of the world organizing. Rumours abound of a Beaver Overlord.");
			list.push("News: Popular streamer not allowed to leave his home until he posts more Don't Starve clips.");
			list.push("News: Cookie Clicker mod wins award for most moddiest mod of the year.");
			if(AkaMod.streamData.rank > 1){
				let odds = 1;
				if(AkaMod.streamData.rank < 100){
					odds -= 0.5; //50% remaining
				}
				if(AkaMod.streamData.rank < 10){
					odds -= 0.25; //25% remaining
				}
				if(Math.random() <= odds){
					list.push("<div onclick=\"AkaMod.updateStreamRank();\" style='cursor:pointer; color:yellow;'>AkaMikeB reaches " + AkaMod.streamData.rank + " streamer rank!</div>");
				}
			} else if(AkaMod.streamData.rank == 1){
				list.push("<div>AkaMikeB is the #1 ranked streamer!</div>");
			}
			
			if(AkaMod.streamData.mikeStreaming) {
				list.push("<a href='https://www.twitch.tv/akamikeb' target='_blank'>Mike is Streaming! Click Here!</a>");
				if(AkaMod.streamData.rank > 1){
					for(let r = 0; r < 4; r++){
						list.push("<div onclick=\"AkaMod.updateStreamRank();\" style='cursor:pointer; color:yellow;'>AkaMikeB reaches " + AkaMod.streamData.rank + " streamer rank!</div>");
					}
				}
			}

			if(Game.Has("Sundae!")) {
				list.push("Streamer rockets to most-watched after promoting his cat to take his place.");
				if(AkaMod.sundaeData.mood < 40) {
					list.push("<q>Hiss!</q>");
				} else {
					list.push("<q>Meow.</q>");
				}
			}

			if(Game.Has("Rogue Only Legendary!")) {
				list.push("<q>Yeah yeah yeah, it's ya boy Darnell.</q>");
				list.push("News: Women have started adding \"Lower Jaw\" to list of desired traits in a spouse.");
				list.push("\"How I Lost My Jaw And Found My Voice\" by new author Darnell tops New York Times Bestseller list.");
				list.push("<q>This is the worst outrage since the Mill-Vanilli incident!</q> - Says fan after learning Darnell has been using AkaMikeB's comedy material for years.");
				list.push("News: Resurgence of a popular '12 Days of Christmas' cover has fans wondering, what even is SWTOR?");
				list.push("Classifieds: <q>LF Lower Jaw. If found, please contact Darnell.</q>");
				list.push("News: Darnell, a loud-mouthed Undead Rogue, is scheduled to appear on Sesame Street. Parents ask, \"WTF?\"");
				if(AkaMod.blizzDays.currentBoss > 0) {
					list.push("Each boss has an attack pattern. Learn the attack pattern can you can devise a strategy to counter it.");
					list.push("Pay attention to how your abilities and the boss's abilities interact.");
					list.push("You can only do a critical attack after a normal attack. Bosses have no such limitation.");
					list.push("Boss attacks don't actually hurt you, buy they greatly increase the cost of your abilities.");
					list.push("You may only call upon a single Grandma to fight for you at a time. She does slightly more damage when you are unable to deal damage.");
				}
				if(AkaMod.blizzDays.pokemon.length >= 10 && AkaMod.blizzDays.pokemon.length < AkaMod.pokemonTypes.length) {
					list.push("There are still " + (AkaMod.pokemonTypes.length - AkaMod.blizzDays.pokemon.length) + " creatures you have not caught.");
				}
				if(AkaMod.blizzDays.caughtBunnies > 10) {
					list.push("Eastern cottontail rabbits can have between one and seven litters each year, and they average three or four litters annually, Animal Diversity Web reports. Each litter can contain between one and 12 babies, with the average being five.");
				}
			}

			if(Game.season === "halloween") {
				list.push("News: \"Darnell\" costume again tops the bestseller list.");
			} else if(Game.season === "christmas"){
				list.push("News: Strange man spotted carolling without lower jaw.");
				list.push("Darnell tops the charts with latest holiday song: \"All I Want For Christmas Is To Chew\"");
				list.push("Darnell tops the charts with latest holiday song: \"Wight Christmas\"");
				list.push("Darnell tops the charts with latest holiday song: \"It's Beginning To Look A Lot Like Cataclysm\"");
				list.push("Darnell tops the charts with latest holiday song: \"I Want a Hippogryph For Christmas\"");
				list.push("News: Darnell in hot water after new Hanukkah song \"I Have A Little Bagel\" voted most offensive song of all time.");
			}

			return list;
		});

		AkaMod.bakeryNameSet=Game.bakeryNameSet;
		Game.bakeryNameSet=function(what){
			if(what.toLowerCase() == 'akamikeb'){
				Game.Win("No, you're a Fony");
				what = "Fony";
			}
			AkaMod.bakeryNameSet(what);
		}

		Game.registerHook('click', AkaMod.clickHandler);
		Game.registerHook('cps', AkaMod.cpsHandler);

		//add hooks to golden cookie click.
		AkaMod.oldGoldenClick = Game.shimmerTypes.golden.popFunc;
		Game.shimmerTypes.golden.popFunc = function(me){
			AkaMod.goldenClick();
			return AkaMod.oldGoldenClick(me);
		}

		//'reset' - called whenever the player resets; parameter is true if this is a hard reset, false if it's an ascension

		//'reincarnate' - called when the player has reincarnated after an ascension
		Game.registerHook('reincarnate', () => {
			//reset upgrades
			for (var i in AkaMod.upgrades) {
				var me=AkaMod.upgrades[i];
				me.unlocked=0;me.bought=0;
			}
			let container = l('barContainers');
			if(container){
				container.remove();
			}
			AkaMod.streamData.mikeStreaming = false;
			AkaMod.sundaeData = {
				pets: 0,
				totalPets: AkaMod.sundaeData.totalPets,
				totalScratches: 0,
				consecutivePets: 0,
				consecutiveScratches: 0,
				mood: 100,
				maxMood: 80,
				moodReduction: 2,
				moodRecovery: 1,
				regainedMood: 0,
				cookieGains: 2,
				scratchLoss: 3,
				cookiesEarned: 0
			};
			AkaMod.blizzDays = {
				remainingTime: 0,
				nextDay: 1,
				currentBoss: 0,
				bossHP: 0,
				round: 0,
				optimalVictories: 0,
				lastAbility: '',
				lastBossAbility:[],
				bossDamage: 0,
				bossDamageReceived:0,
				totalBossDamage:AkaMod.blizzDays.totalBossDamage,
				bossCombatText: "",
				summonedGrandma: false,
				grandmaDamage:0,
				totalBosses: AkaMod.blizzDays.totalBosses,
				comingSoonCounter: 0,
				pokemon: [],
				activePokemon: -1,
				currentBait: -1,
				boughtBaits: AkaMod.blizzDays.boughtBaits,
				baitTime: 0,
				clickCatchChance: 0,
				minClicks: 0,
				catchAttempts: 0,
				catchSuccesses: 0,
				totalCatches: AkaMod.blizzDays.totalCatches,
				caughtBunnies: 0,
				xpEarned: AkaMod.blizzDays.xpEarned,
				questTimer: -1,
				questType: -1,
				questStart: 0,
				questTarget: 0,
				questDesc: "",
				completedQuests: 0,
				totalQuests: AkaMod.blizzDays.totalQuests,
				questCookies: 0,
				equipment:[-1,-1,-1,-1,-1,-1,-1,],
				finaleClicks: 0,
				completions: AkaMod.blizzDays.completions
			};
		});

		AkaMod.initSundaeStuff();
		AkaMod.initDaysOfChristmas();

		//render some stats for the mod.
		AkaMod.UpdateMenu = Game.UpdateMenu;
		Game.UpdateMenu = function(){
			AkaMod.UpdateMenu();
			
			if (Game.onMenu==='stats') {
				let newSection = "<div class='subsection'>"
					+ "<div class='title'><b>MikeB Mod Stats</b></div>"
					+ "<div class='listing'><b>Watched Streams: </b>" + AkaMod.streamData.caughtStreams + "</div>";
				if(AkaMod.streamData.minutesWatched < 120) {
					newSection += "<div class='listing'><b>Minutes Watched: </b>" + AkaMod.streamData.minutesWatched + "</div>";
				} else {
					newSection += "<div class='listing'><b>Hours Watched: </b>" + (Math.round(AkaMod.streamData.minutesWatched/6)/10) + "</div>";
				}
				if(AkaMod.streamData.rank < 7777){
					newSection += "<div class='listing'><b>Stream Rank: </b>" + AkaMod.streamData.rank + "</div>";
				}
				if(Game.Has("Sundae!")) {
					newSection += "<div class='listing'><b>Sundae Pets(This run): </b>" + AkaMod.sundaeData.pets + "</div>";
					newSection += "<div class='listing'><b>Sundae Pets(All-time): </b>" + AkaMod.sundaeData.totalPets + "</div>";
					newSection += "<div class='listing'><b>Sundae Scratches: </b>" + AkaMod.sundaeData.totalScratches + "</div>";
					newSection += "<div class='listing'><b>Pets in a Row: </b>" + AkaMod.sundaeData.consecutivePets + "</div>";
					newSection += "<div class='listing'><b>Cookies Gained From Petting: </b><div class=\"price plain\">"+Game.tinyCookie() + Beautify(AkaMod.sundaeData.cookiesEarned) + "</div> ("
						+(Math.round(10000 * AkaMod.sundaeData.cookiesEarned / Game.cookiesEarned) / 100)+"% of Baked Cookies)</div>";
				}

				if(Game.Has("Rogue Only Legendary!")) {
					newSection += "<div class='title'><b>12 Days of Blizz Blues</b></div>";
					newSection += "<div class='listing'><b>See the Inspiration! </b><a href='https://www.youtube.com/watch?v=yvIM8RUPCYE' target='_blank'>12 Days Of Blizz Blues</a></div>";
					newSection += "<div class='listing'><b>CPS Boost from the 12 Days of Blizz Blues: </b>" +Math.round(100*AkaMod.blizzDaysCPS()-100) + "%</div>";
				}
				if(Game.Has(AkaMod.Month12Upgrade) && AkaMod.blizzDays.nextDay === 12 && !Game.Has("The 13th Day of Blizz Blues?")){
					newSection += "<div class='listing'><b>Time Until Day " + AkaMod.blizzDays.nextDay + " of Christmas: </b>12 Months<div onclick='AkaMod.break12MonthContract()' style='cursor:pointer;display:inline-block;height: 24px;width: 24px;background-position: -360px -216px;background-image:url(img/icons.png?v="+Game.version+");background-size: 816px 816px;'></div></div>";
				} else if(AkaMod.blizzDays.remainingTime > 0) {
					newSection += "<div class='listing'><b>Time Until Day " + AkaMod.blizzDays.nextDay + " of Christmas: </b>";
					if(AkaMod.blizzDays.remainingTime >= 100) {
						newSection += Math.round(AkaMod.blizzDays.remainingTime/60) + " Minutes</div>";
					} else {
						newSection += AkaMod.blizzDays.remainingTime + " Seconds</div>";
					}
				}
				if(AkaMod.blizzDays.nextDay >= 6 && (Game.Has("Belphegor Again") || Game.Has("Mammon Again") || Game.Has("Abaddon Again") 
					|| Game.Has("Satan Again") || Game.Has("Asmodeus Again") || Game.Has("Beelzebub Again"))){
					if(AkaMod.blizzDays.optimalVictories > 0){
						newSection += "<div class='listing'><b>Perfect Victories: </b>"+AkaMod.blizzDays.optimalVictories+"</div>";
					}					
					newSection += "<div class='listing'><b>Bosses Fought: </b>";
					let secretBossClue = 0;
					if(Game.Has("Belphegor Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===1?"":"enabled")+'" '
							+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Belphegor, A demon of shortcuts and laziness.</div>\';})','this')
							+' style="float:none;background-position:' + 7*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue++;
					}
					if(Game.Has("Mammon Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===2?"":"enabled")+'"'
							+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Mammon, The demonic emodiment of wealth.</div>\';})','this')
							+'style="float:none;background-position:' + 8*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue++;
					}
					if(Game.Has("Abaddon Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===3?"":"enabled")+'" '
							+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Abaddon, Master of overindulgence.</div>\';})','this')
							+'style="float:none;background-position:' + 9*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue++;
					}
					if(Game.Has("Satan Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===4?"":"enabled")+'" '
						+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Satan, The counterpoint to everything righteous</div>\';})','this')
							+'style="float:none;background-position:' + 10*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue++;
					}
					if(Game.Has("Stan?")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===8?"":"enabled")+'" '
						+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:400px;height:20px;text-align:center;padding:8px;\\\'>Stan, Satans little-known kid brother. Both are in the Soul-Tormenting business, but Stan decided to go the corporate route.</div>\';})','this')
							+'style="float:none;background-position:' + 1*-48 + 'px ' + 33*-48 + 'px;"></div>';
					}
					if(Game.Has("Asmodeus Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===5?"":"enabled")+'" '
							+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Asmodeus, This demon with three heads.</div>\';})','this')
							+'style="float:none;background-position:' + 11*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue++;
					}
					if(Game.Has("Beelzebub Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===6?"":"enabled")+'" '
						+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Beelzebub, The festering incarnation of blight and disease.</div>\';})','this')
							+'style="float:none;background-position:' + 12*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue++;
					}
					if(Game.Has("Lucifer Again")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===7?"":"enabled")+'" '
							+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Lucifer, Also known as Lightbringer.</div>\';})','this')
							+'style="float:none;background-position:' + 13*-48 + 'px ' + 11*-48 + 'px;"></div>';
						secretBossClue += 10;
					}
					if(Game.Has("Angry Sundae")) {
						newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.currentBoss===9?"":"enabled")+'" '
							+Game.getDynamicTooltip('(bt1=function(){return \'<div style=\\\'width:300px;height:20px;text-align:center;padding:8px;\\\'>Sundae has calmed down and is appeased for this run.</div>\';})','this')
							+'style="float:none;background-position:' + 18*-48 + 'px ' + 17*-48 + 'px;"></div>';
					}
					newSection += "</div>";
					if(AkaMod.blizzDays.bossHP > 0) {
						newSection += '<div class="listing"><b>Boss HP: </b><div  class="smallFramed meterContainer" style="width: 300px; height: 16px; display: inline-block; top: 4px;" >'
							+ '<div style="position:absolute; left:0px; right:0px; top:0px; height:100%; transform:translate(0px,0px);width: ' + (300*(AkaMod.blizzDays.bossHP/100)) + 'px; transform: scale(1,2); height: 50%; transform-origin: 50% 0; background:url(img/timerBars.png) 0px -16px repeat-x;"></div>'
							+ '<div class="titleFont" style="width: 100%; text-align: center; margin-top: 1px; position: absolute; transform: scale(1,0.8); color: white;">' + Math.round(AkaMod.blizzDays.bossHP) + ' / 100</div>'
						+ '</div></div>';
						let bossAbilityStr = "(None)";
						for(let a=0; a < AkaMod.blizzDays.lastBossAbility.length; a++){
							if(AkaMod.blizzDays.lastBossAbility[a]){
								if(a === 0){
									bossAbilityStr = AkaMod.blizzDays.lastBossAbility[a];
								} else {
									bossAbilityStr += ", " + AkaMod.blizzDays.lastBossAbility[a];
								}
							}
						}
						newSection += "<div class='listing'><b>Round: </b>"+AkaMod.blizzDays.round+"&nbsp;&nbsp;&nbsp;&nbsp;<b>Damage Received: </b><span "+(AkaMod.blizzDays.bossDamageReceived>0?style="style='color:red;'":"")+">"+AkaMod.blizzDays.bossDamageReceived+"</span>&nbsp;&nbsp;&nbsp;&nbsp;<b>Recent Boss Actions: </b>"+bossAbilityStr+"</div>";
						if(AkaMod.blizzDays.bossCombatText) {
							newSection += "<div class='listing'>" + AkaMod.blizzDays.bossCombatText 
								+ (AkaMod.blizzDays.summonedGrandma ? "Your Grandma is fighting for you and has done a total of " + AkaMod.blizzDays.grandmaDamage + " damage." : "")
								+ "</div>";
						}
					}
					if(AkaMod.blizzDays.completions > 0 && AkaMod.blizzDays.currentBoss === 0){
						if(!Game.Has("Angry Sundae")){
							newSection += "<div class='listing' style='color:red'><q>The First Queen watches. Beware her anger.</q></div>";
						} else if(AkaMod.blizzDays.completions > 1 && secretBossClue === 6 && AkaMod.blizzDays.nextDay >= 7) {
							newSection += "<div class='listing' style='color:red'><q>Legend says when the 6 have fallen, and the 12 remain, the Abomination shall rise again.</q></div>";
						} else if(AkaMod.blizzDays.completions > 2 && secretBossClue > 2 && AkaMod.blizzDays.nextDay >= 7 && Game.Has("Satan Again") && !Game.Has("Stan?")){
							newSection += "<div class='listing' style='color:green'><q>It's well known that Satan trades in favours, but rumour has it that a relative of his is currently trading in Golden Contracts.</q></div>";
						}
					}
				}

				if(Game.Has("Pandas And Pokemon")){
					newSection += "<div class='line'></div>";
					//pokemon section
					if(AkaMod.blizzDays.catchAttempts > 0){
						newSection += "<div class='listing'><b>Total Catches: </b>" + AkaMod.blizzDays.catchSuccesses + " out of "+AkaMod.blizzDays.catchAttempts+" Attempts</div>";
					}
					if(Game.Has("WoW Reskin with Voices and Lightsabers.")) {
						newSection += "<div class='listing'><b>Creatures Caught: </b><span>" + AkaMod.blizzDays.pokemon.length + "</span></div>";
					} else {
						newSection += "<div class='listing'><b>Creatures Caught: </b><span " + (AkaMod.blizzDays.pokemon.length >= 10 ? "style='color:green'" : "") + ">" + AkaMod.blizzDays.pokemon.length + " / 10</span></div>";
					}
					newSection += "<div class='listing'><b>XP Earned: </b>" + AkaMod.blizzDays.xpEarned + "</div>";
					newSection += "<div class='listing'><b>Baits Bought: </b>" + AkaMod.blizzDays.boughtBaits + "</div>";
					if(AkaMod.blizzDays.currentBait >= 0) {
						let color = "white";
						let status = "";
						if(AkaMod.blizzDays.baitTime > 60 * 30) {
							color = "brown";
							if(AkaMod.blizzDays.baitTime < 60 * 45) {
								status = "Spoiling ";
							} else if(AkaMod.blizzDays.baitTime < 60 * 60) {
								status = "Moldy ";
							} else if(AkaMod.blizzDays.baitTime < 60 * 75) {
								status = "Rotting ";
							} else {
								status = "Putrefying ";
								color = "green";
							}
						}
						newSection += "<div class='listing'><b>Current Bait: </b> <span style='color: "+color+"'>" + status + AkaMod.baitTypes[AkaMod.blizzDays.currentBait].name + " (+"+AkaMod.baitTypes[AkaMod.blizzDays.currentBait].chance+"% Catch Chance)</span></div>";
					}
					if(AkaMod.blizzDays.pokemon.length > 0) {
						newSection += "<div class='listing'><b>Your Creatures and their evolutions are increasing your CPS by: </b>" + Math.round((AkaMod.pokemonCPSBuff(0.01)-1)*100) + "%</div>";
						newSection += "<div class='listing'><b>Your Creatures are increasing your chance to Catch by: </b>" + AkaMod.creatureChanceBoost() + "%</div>";
						newSection += "<div class='listing'><b>Your Creatures: </b>";
						for(let pokemon of AkaMod.blizzDays.pokemon) {
							const pokemonType = AkaMod.pokemonTypes[pokemon.index];
							let icon = pokemonType.icon;
							let name = pokemonType.name;
							let extraInfo = "<br />" + pokemonType.flavor.replaceAll("'", "\\\'");
							if(pokemon.form > 0) {
								extraInfo += "<br />This is " + name + "s " + pokemon.form + (pokemon.form === 1 ? "st" : pokemon.form === 2 ? "nd" : pokemon.form === 3 ? "rd" : "th") 
									+ (pokemon.level === 99 ? " and final": "") + " evolution.";
								icon = pokemonType.forms[pokemon.form - 1].icon;
								name = pokemonType.forms[pokemon.form - 1].name;
							}
							const toolTip = name + "<br />" + 
								(pokemon.level === 99 ? "<span style=\\\'color: green\\\'>Max Level</span>" : "Level " + pokemon.level + " / 99" )
								+ extraInfo;
							const dynamicToolip = Game.getDynamicTooltip('(temp = function(){return\'<div style=\\\'width:200px;\\\'>' + toolTip + '</div>\'})','this');
							let onClick = "";
							if(pokemon.index === 0 && pokemon.level === 99 && Game.HasAchiev("BlizzBlues: Bunny Fan")) {
								onClick = ' onClick="new Game.shimmer(\'bbBunny\',{icon: 2, offset: 0});new Game.shimmer(\'bbBunny\',{icon: 1, offset: 1});"';
							}
							newSection += '<div class="crate upgrade enabled" '
								+ dynamicToolip + onClick
								+' style="float:none;background-position:' + icon[0]*-48 + 'px ' + icon[1]*-48 + 'px;"></div>';
						}
						if(Game.Has("Easy Creature Click")) {
							//add the easy click to spawn.
							const toolTip = "Click to spawn a random creature to try to catch. Good for grinding XP, but the Creatures are more expensive now.";
							const dynamicToolip = Game.getDynamicTooltip('(temp = function(){return\'<div style=\\\'width:200px;\\\'>' + toolTip + '</div>\'})','this');
							newSection += '<div class="crate upgrade '+(AkaMod.blizzDays.activePokemon === -1 ? "enabled" : "")+'" '
								+ dynamicToolip
								+' style="margin-left:8px;float:none;background-position:' + 22*-48 + 'px ' + 7*-48 + 'px;" onClick="AkaMod.spawnPokemon(true)"></div>';
						}
						newSection += "</div>"; //end pokemon buttons.
						if(AkaMod.blizzDays.completions > 0 && AkaMod.blizzDays.activePokemon === -1 && AkaMod.blizzDays.pokemon.length >= 10 && AkaMod.blizzDays.pokemon.length < 13 && Game.Has("Easy Creature Click")) {
							if(!Game.Has("Try to Catch Voideater")){
								newSection += "<div class='listing' style='color:red'><q>The Floating Eye sees many dark things. Summon, Summon the Sacrifice.</q></div>";
							} else if(AkaMod.blizzDays.completions > 1 && !Game.Has("Try to Catch Chimera") && Game.Has("Lucifer Again")) {
								newSection += "<div class='listing' style='color:red'><q>The Seventh Unholy will meet the God of Light, and a monster will be born.</q></div>";
							} else if(AkaMod.blizzDays.completions > 2 && !Game.Has("Try to Catch Hungerer")) {
								newSection += "<div class='listing' style='color:green'><q>The Hunger. Spoiled milk, moldy bread, rotten vegetables, fouled meat. The Putrefying.</q></div>";
							}
						}
						
					}
				}

				if(Game.Has("WoW Reskin with Voices and Lightsabers.")){
					newSection += "<div class='line'></div>";
					if(AkaMod.blizzDays.completedQuests < 11) {
						newSection += "<div class='listing'><b>Completed Quests: </b>" + AkaMod.blizzDays.completedQuests + " / 11</div>";
					} else {
						newSection += "<div class='listing'><b>Completed Quests: </b>" + AkaMod.blizzDays.completedQuests + "</div>";
					}
					if(AkaMod.blizzDays.questCookies > 0) {
						newSection += "<div class='listing'><b>Cookies Gained From Quests: </b><div class=\"price plain\">"+Game.tinyCookie() + Beautify(AkaMod.blizzDays.questCookies) + "</div> ("
						+(Math.round(10000 * AkaMod.blizzDays.questCookies / Game.cookiesEarned) / 100)+"% of Baked Cookies)</div>";
					}
					if(AkaMod.blizzDays.questTimer > 0) {
						if(AkaMod.blizzDays.questTimer > 90) {
							newSection += "<div class='listing'><b>Quest Timer: </b>" + Math.round(AkaMod.blizzDays.questTimer/60) + " Minutes</div>";
						} else {
							newSection += "<div class='listing'><b>Quest Timer: </b>" + AkaMod.blizzDays.questTimer + " Seconds</div>";
						}
					}
					newSection += "<div class='listing'><b>Item Level: <span style='color:"+AkaMod.getEquipmentColor(Math.floor(AkaMod.getGearValue()/AkaMod.blizzDays.equipment.length))+"'>" + AkaMod.getGearValue() + "</span></b></div>";
					const tableStr = "<div class='listing'><b>Equipment: </b><table style='display:inline-block'>"
						+ "<tr><td></td><td>"+AkaMod.renderEquipment(0)+"</td><td></td></tr>"
						+ "<tr><td>"+AkaMod.renderEquipment(1)+"</td><td>"+AkaMod.renderEquipment(2)+"</td><td>"+AkaMod.renderEquipment(1,true)+"</td></tr>"
						+ "<tr><td>"+AkaMod.renderEquipment(3)+"</td><td>"+AkaMod.renderEquipment(4)+"</td><td>"+AkaMod.renderEquipment(3,true)+"</td></tr>"
						+ "<tr><td></td><td>"+AkaMod.renderEquipment(5)+"</td><td></td></tr>"
						+ "<tr><td>"+AkaMod.renderEquipment(6)+"</td><td></td><td>"+AkaMod.renderEquipment(6,true)+"</td></tr>"
						+ "</table></div>";
					newSection += tableStr;
				}

				newSection += "</div>";
				const menu = l('menu');
				let index = menu.innerHTML.indexOf("<div class=\"subsection\">");
				if(index === -1) {
					index = menu.innerHTML.indexOf("<div class='subsection'>");
				}
				menu.innerHTML = menu.innerHTML.substr(0, index) + newSection + menu.innerHTML.substr(index);
			}
		};

		Game.Popup("AkamikebB mod loaded!");
		setTimeout(AkaMod.streamingPoll, 1000); //wait a second so the load or Create finishes.
	},

	//This is called every 5 seconds.
	check: function(){
		if(new Date().toDateString().indexOf('Sep 20') >= 0) {
			Game.Win("Happy Birthday Mike!");
		}

		if(Game.Has("Sundae!")) {
			if(AkaMod.sundaeData.mood < AkaMod.sundaeData.maxMood) {
				let moremood = 5 * AkaMod.SundaeMoodRecovery() / Game.fps;
				AkaMod.sundaeData.mood += moremood;
				if(AkaMod.sundaeData.mood > AkaMod.sundaeData.maxMood) {
					AkaMod.sundaeData.mood = AkaMod.sundaeData.maxMood;
				}
				AkaMod.sundaeData.regainedMood += moremood;
				if(AkaMod.sundaeData.regainedMood > 4*60) { //4 hours at 1/min
					Game.Unlock("Cat Toy");
					if(AkaMod.sundaeData.regainedMood > 12*60) { //another 6 hours at 2/min
						Game.Unlock("Cat Food");
					}
				}
			}
		} else if (Game.Has("Kitten workers")) {
			Game.Unlock("Sundae!");
		}

		//blizz blues stuff
		if(Game.season==='christmas' && Game.Has('Santa\'s dominion') && Game.GetHowManyReindeerDrops() === Game.reindeerDrops.length && Game.Upgrades["Rogue Only Legendary!"].unlocked === 0) {
			//kick off the content
			Game.Unlock("Rogue Only Legendary!");
			Game.Popup("On the first day of Christmas, Blizzard gave to me...");
		}
		if(AkaMod.blizzDays.remainingTime > 0) {
			AkaMod.blizzDays.remainingTime -= 5; //5 seconds elapsed.
			if(AkaMod.blizzDays.remainingTime <= 0) {
				AkaMod.unlockNextDay(AkaMod.blizzDays.nextDay);
			}
		}
		if(AkaMod.blizzDays.currentBait >= 0 && AkaMod.blizzDays.pokemon.length >= 10) {
			AkaMod.blizzDays.baitTime += 5;
		}
		if(AkaMod.blizzDays.questTimer > 0) {
			AkaMod.blizzDays.questTimer -= 5;
			if(AkaMod.blizzDays.questTimer <= 0) {
				AkaMod.prepareQuest();
			}
		}
	},

	//does stuff when the big cookie is clicked.
	clickHandler: function(){
		if(AkaMod.blizzDays.nextDay >= 10 && Game.Has("Pandas And Pokemon")) {
			if(AkaMod.blizzDays.activePokemon != -1) {
				//increase catching chance.
				if(AkaMod.blizzDays.clickCatchChance < AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].clickLimit) {
					AkaMod.blizzDays.clickCatchChance += AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].clickBoost;
					AkaMod.updatePokemonUpgrade();
				}
			} else {
				//chance to spawn a pokemon.
				AkaMod.blizzDays.minClicks--;
				if(AkaMod.blizzDays.minClicks > 0) {
					//do nothing. get through this waiting period first.
				} else if(Math.random() < (-AkaMod.blizzDays.minClicks / 200) + (AkaMod.blizzDays.pokemon.length/100)) {
					//^ each excess click increases your chances by 0.5%, and each pokemon by 1%. So it's less clicks to spawn the further along you get.
					AkaMod.spawnPokemon(false);
				}
			}
		}
		if(AkaMod.blizzDays.questType === 0) {
			AkaMod.updateQuestProgress(1);
		}
	},

	//CPS multiplier due to blizz days
	blizzDaysCPS:function(){
		let mult = 1;
		let bdf = 0.01;
		if(Game.HasAchiev("13 Days of Blizz Blues, 4th Run")){bdf += 0.005;}
		if(Game.HasAchiev("13 Days of Blizz Blues, 12th Run")){bdf += 0.005;}

		if(Game.Has("Rogue Only Legendary!")) {mult *= 1+bdf;}
		if(Game.Has("Double Bladed Lightsabers")) {mult *= 1+bdf*2;}
		if(Game.Has("First Bouncing Bunny")) {mult *= 1+bdf;}
		if(Game.Has("Second Bouncing Bunny")) {mult *= 1+bdf;}
		if(Game.Has("Third Bouncing Bunny")) {mult *= 1+bdf;}
		if(Game.Has("First Holo Dancer")) {mult *= 1+bdf;}
		if(Game.Has("Second Holo Dancer")) {mult *= 1+bdf;}
		if(Game.Has("Third Holo Dancer")) {mult *= 1+bdf;}
		if(Game.Has("Fourth Holo Dancer")) {mult *= 1+bdf;}
		if(Game.Has("Enter the Lion's Pride Inn")) {mult *= 1+bdf*5;}
		let bossBoost = 1;
		if(Game.HasAchiev("13 Days of Blizz Blues Again")){
			bossBoost += AkaMod.blizzDays.optimalVictories;
		}
		if(Game.Has("Belphegor Again")) {mult *= 1+bdf*bossBoost;}
		if(Game.Has("Mammon Again")) {mult *= 1+bdf*bossBoost;}
		if(Game.Has("Abaddon Again")) {mult *= 1+bdf*bossBoost;}
		if(Game.Has("Satan Again")) {mult *= 1+bdf*bossBoost;}
		if(Game.Has("Stan?")) {mult *= 1+bdf*2*bossBoost;}
		if(Game.Has("Asmodeus Again")) {mult *= 1+bdf*bossBoost;}
		if(Game.Has("Beelzebub Again")) {mult *= 1+bdf*bossBoost;}
		if(Game.Has("Lucifer Again")) {mult *= 1+bdf*2*bossBoost;}
		if(Game.Has("Angry Sundae")) {mult *= 1+bdf*2*bossBoost;}
		if(Game.Has("Thesaurus")) {mult *= 1+bdf*7;}
		if(Game.Has("Exciting New Feature!")) {mult *= 1+bdf*8;}
		if(Game.Has("90 Minutes of Unneccesary Commentary So You Can Like, Go And Kill Some Swamp Rats And Stuff.")) {mult *= 1+bdf;}
		mult *= AkaMod.pokemonCPSBuff(bdf);
		if(Game.Has("WoW Reskin with Voices and Lightsabers.")) {mult *= 1+bdf;}
		if(Game.Has("A 12 month contract locking you into a 7 year old game paying over $150 for beta access that everyone else gets for free, a midget mount, and a copy of Diablo 3.")) {mult *= 1+bdf;}
		if(Game.Has("The 13th Day of Blizz Blues?")) {mult *= 1+bdf;}

		if(Game.HasAchiev("13 Days of Blizz Blues, 7th Run")){
			mult *= 1 + AkaMod.getGearValue()/7;
		}

		return mult;
	},
	//CPS buff from your critters
	pokemonCPSBuff:function(bdf){
		let mult = 1;
		for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++){
			const pokemon = AkaMod.blizzDays.pokemon[p];
			if(!pokemon.secret) {
				mult *= 1+bdf*(pokemon.form+1);
			} else {
				mult *= 1+bdf*4*(pokemon.form+1);//4x from secret pokemon.
			}
		}
		if(Game.HasAchiev("13 Days of Blizz Blues, 6th Run")){
			mult *= 1 + AkaMod.creatureChanceBoost()/100;
		}
		return mult;
	},

	//return the CPS multiplier.
	cpsHandler: function(cookiesPs){
		let mult = AkaMod.blizzDaysCPS();

		return mult * cookiesPs;
	},

	//Called when a golden or wrath cookie is clicked.
	goldenClick: function(){
		if(Game.season==='fools' && Game.Has("Satan Again") && AkaMod.blizzDays.currentBoss === 0 && !Game.Has("Stan?")) {
			Game.Unlock("Stan?");
			Game.Notify("A Boss Emerges!", "It's horrible! It's despicable! It's... Stan?", [1,33]);
		}
		if(AkaMod.blizzDays.questType === 2) {
			AkaMod.updateQuestProgress(1);
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
	//handles the rank minigame
	updateStreamRank:()=>{
		AkaMod.streamData.rank--;
		if(!AkaMod.streamData.rank || AkaMod.streamData.rank < 1) {
			AkaMod.streamData.rank = 1;
		}
		const earned = Game.cookiesPs * (1 + (7777 - AkaMod.streamData.rank) / 10);
		Game.Earn(earned);
		Game.Popup("Ranked Up and earned " + Beautify(earned) + " cookies!");
		if(AkaMod.streamData.rank <= 7000){
			Game.Win("Streamer Rank 7000");
			if(AkaMod.streamData.rank <= 6000){
				Game.Win("Streamer Rank 6000");
				if(AkaMod.streamData.rank <= 5000){
					Game.Win("Streamer Rank 5000");
					if(AkaMod.streamData.rank <= 4000){
						Game.Win("Streamer Rank 4000");
						if(AkaMod.streamData.rank <= 3000){
							Game.Win("Streamer Rank 3000");
							if(AkaMod.streamData.rank <= 2000){
								Game.Win("Streamer Rank 2000");
								if(AkaMod.streamData.rank <= 1000){
									Game.Win("Streamer Rank 1000");
									if(AkaMod.streamData.rank <= 100){
										Game.Win("Streamer Rank 100");
										if(AkaMod.streamData.rank <= 10){
											Game.Win("Streamer Rank 10");
											if(AkaMod.streamData.rank <= 1){
												Game.Win("Streamer Rank 1!");
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	},

	//Holds all the sundae feature content.
	initSundaeStuff: () => {
		Game.UpdateSpecial=function() {
			Game.specialTabs=[];
			if (Game.Has('A festive hat')) Game.specialTabs.push('santa');
			if (Game.Has('A crumbly egg')) Game.specialTabs.push('dragon');
			if (Game.Has("Sundae!")) Game.specialTabs.push('sundae');
			if (Game.specialTabs.length==0) {Game.ToggleSpecialMenu(0);return;}
		
			if (Game.LeftBackground)
			{
				Game.specialTabHovered='';
				var len=Game.specialTabs.length;
				if (len==0) return;
				var y=Game.LeftBackground.canvas.height-24-48*len;
				for (var i=0;i<Game.specialTabs.length;i++)
				{
					var selected=0;
					if (Game.specialTab==Game.specialTabs[i]) selected=1;
					var x=24;
					var s=1;
					if (selected) {s=2;x+=24;}
					
					if (Math.abs(Game.mouseX-x)<=24*s && Math.abs(Game.mouseY-y)<=24*s)
					{
						Game.specialTabHovered=Game.specialTabs[i];
						Game.mousePointer=1;
						Game.CanClick=0;
						if (Game.Click && Game.lastClickedEl==l('backgroundLeftCanvas'))
						{
							if (Game.specialTab!=Game.specialTabs[i]) {
								Game.specialTab=Game.specialTabs[i];Game.ToggleSpecialMenu(1);PlaySound('snd/press.mp3');
							} else {Game.ToggleSpecialMenu(0);PlaySound('snd/press.mp3');}
						}
					}
					
					y+=48;
				}
			}
		};
		AkaMod.SundaeMoodRecovery=()=>{
			let moremood = AkaMod.sundaeData.moodRecovery;
			if(Game.Has("Sundae's Gift")){
				if(Game.hasBuff("Frenzy")) {
					moremood += 2;
				} else if(Game.hasBuff("Dragon Harvest")) {
					moremood += 3;
				} else if(Game.hasBuff("Clot")) {
					moremood += 1;
				}
			}
			return moremood;
		}

		//Handles petting Sundae.
		AkaMod.SundaePetGains = () => {
			//each consecutive pet gives a 2.5% increase
			let gain = Game.computedMouseCps * AkaMod.sundaeData.cookieGains * Math.min((1 + AkaMod.sundaeData.consecutivePets/40), 8);
			if(AkaMod.streamData.mikeStreaming && Game.Has("Sundae's Super Secret Gift")) {
				const boost = AkaMod.computeStreamingBuff() * AkaMod.streamData.viewerCount / 200;
				gain *= 1 + boost;
			}
			return gain;
		};
		AkaMod.ClickSpecialPic = Game.ClickSpecialPic;
		Game.ClickSpecialPic=function() {
			if (Game.specialTab==='sundae'){
				//try to pet her.
				triggerAnim(l('specialPic'),'pucker');
				if(Math.random() * 100 < AkaMod.sundaeData.mood + (AkaMod.sundaeData.mood - 40)/8) {
					//^ tweak the random chance a bit more extreme and slightly in the player's favour, so it feels better.
					//at 80 mood, the actual chance is 85%. At 10 mood, the chance is 6%. At 50 Mood, it's 51%.
					//pet!
					AkaMod.sundaeData.pets++;
					AkaMod.sundaeData.totalPets++;
					AkaMod.sundaeData.consecutivePets++;
					AkaMod.sundaeData.consecutiveScratches = 0;
					if(AkaMod.blizzDays.questType === 6) {
						AkaMod.updateQuestProgress(1);
					}
					if(AkaMod.sundaeData.mood < 10) {
						Game.Win("Risky Moves");
					}
					AkaMod.sundaeData.mood -= AkaMod.sundaeData.moodReduction;
					let gain = AkaMod.SundaePetGains();
					Game.Earn(gain);
					AkaMod.sundaeData.cookiesEarned += gain;
					
					PlaySound('snd/click'+Math.floor(Math.random()*7+1)+'.mp3',0.5); //TODO get a meow sound.
					Game.lastClickedSpecialPic=Date.now();
					if (Game.prefs.particles) {
						Game.particleAdd(Game.mouseX,Game.mouseY-32,Math.random()*4-2,Math.random()*-2-4,Math.random()*0.2+0.5,1,2,[20,3]);
						Game.particleAdd(Game.mouseX+Math.random()*8+100,Game.mouseY-40,0,-2,1,4,2,'','+'+Beautify(gain,1));
					}

					//unlocks and achievements.
					if(AkaMod.sundaeData.pets >= 40) {
						Game.Unlock("Good Kitty");
						if(AkaMod.sundaeData.pets >= 100) {
							Game.Unlock("Very Good Kitty");
							if(AkaMod.blizzDays.pokemon.length > 5 && AkaMod.sundaeData.mood > 95 && AkaMod.blizzDays.activePokemon === -1 && !Game.Has("Try to Catch Cat")){
								AkaMod.blizzDays.activePokemon = 12;
								const upgrdName = "Try to Catch " + AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].name;
								Game.Popup("Sundae's Happiness has attracted another Cat!");
								Game.Lock(upgrdName);
								Game.Unlock(upgrdName);
								AkaMod.updatePokemonUpgrade();
							}
							if(AkaMod.sundaeData.pets >= 420) {
								Game.Win("Tokin Sundae");
							}
							if(AkaMod.sundaeData.pets >= 600) {
								Game.Unlock("Very Very Good Kitty");
								if(AkaMod.sundaeData.pets >= 2000) {
									Game.Unlock("The Best Kitty");
								}
								
							}
						}
					}
					if(AkaMod.sundaeData.consecutivePets >= 12) {
						Game.Unlock("Content Kitty");
						if(AkaMod.sundaeData.consecutivePets >= 15) {
							Game.Unlock("Happy Kitty");
							if(AkaMod.sundaeData.consecutivePets >= 20) {
								Game.Unlock("Happier Kitty");
								if(AkaMod.sundaeData.consecutivePets >= 27) {
									Game.Unlock("Happiest Kitty");
									Game.Win("She Likes You!");
									if(AkaMod.sundaeData.consecutivePets >= 35 && Game.Has("Happiest Kitty") && Game.Has("Sundae's Gift")) {
										Game.Unlock("Sundae's Secret Gift");
									}
								}
							}
						}
					}

					Game.Win("Pet Owner");
					if(AkaMod.sundaeData.totalPets > 200) {
						Game.Win("Pet Petter");
						if(AkaMod.sundaeData.totalPets > 2000) {
							Game.Win("Petting Pet Petter");
							if(AkaMod.sundaeData.totalPets > 20000) {
								Game.Win("Petting Pet Petter Who Pets Pets");
							}
						}
					}

					if(Math.random() < 0.005) { //0.5% chance
						Game.Unlock("Sundae's Gift");
						if(AkaMod.streamData.mikeStreaming && Game.Has("Sundae's Secret Gift")) {
							Game.Unlock("Sundae's Super Secret Gift");
						}
					}

				} else {
					//scratch!
					let loss = Game.computedMouseCps * AkaMod.sundaeData.scratchLoss * (1 + AkaMod.sundaeData.consecutiveScratches/5);
					if(AkaMod.sundaeData.mood < 2) {loss *= 4;}
					else if(AkaMod.sundaeData.mood < 10) {loss *= 2;}
					if(Game.cookies < loss) {
						loss = Game.cookies;
					}
					if(!Game.Has('Sadistic')) {
						AkaMod.sundaeData.mood -= AkaMod.sundaeData.moodReduction;
						AkaMod.sundaeData.mood = Math.max(AkaMod.sundaeData.mood, 0);
					}
					if(AkaMod.sundaeData.mood <= 0.1) {
						Game.Win("Do You Even Like Cats?");
					}

					AkaMod.sundaeData.totalScratches++;
					AkaMod.sundaeData.consecutivePets = 0;
					AkaMod.sundaeData.consecutiveScratches++;

					Game.Spend(loss);
					AkaMod.sundaeData.cookiesEarned -= loss;

					PlaySound('snd/growl.mp3',1);
					if (Game.prefs.particles) {
						Game.particleAdd(Game.mouseX,Game.mouseY-32,Math.random()*4-2,Math.random()*-2-4,Math.random()*0.2+0.5,1,2,[0,8]);
						Game.particleAdd(Game.mouseX+Math.random()*8+100,Game.mouseY-40,0,-2,1,4,2,'','-'+Beautify(loss,1));
					}
					if(AkaMod.sundaeData.mood < 2) {Game.gainBuff('scratch',4);}
					else if(AkaMod.sundaeData.mood < 10) {Game.gainBuff('scratch',2);}
					else {Game.gainBuff('scratch',1);}

					//unlocks and achievements.
					if(AkaMod.sundaeData.totalScratches >= 60) {
						Game.Unlock('Filed Claws');
						if(AkaMod.sundaeData.totalScratches >= 200) {
							Game.Unlock('Sadistic');
							Game.Win("Sundae Bloody Sundae");
							if(AkaMod.sundaeData.totalScratches >= 420) {
								Game.Win("Smokin Sundae");
							}
						}
					}
					if(AkaMod.sundaeData.mood <= 1 && !Game.Has("Angry Sundae") && AkaMod.blizzDays.currentBoss === 0 && Game.Has("Thesaurus")){
						Game.Unlock("Angry Sundae");
					}
				}
				Game.ToggleSpecialMenu(true); //refresh
				
			} else {
				AkaMod.ClickSpecialPic();
			}
		}

		//This is called when clicking the special thing in the LR. It brings up an overlay.
		AkaMod.ToggleSpecialMenu = Game.ToggleSpecialMenu;
		Game.ToggleSpecialMenu=function(on) {
			if(on && Game.specialTab=='sundae') {
				const pic = "https://machinex7.github.io/akamikebccmod/img/cat.png";
				let sundaeMood = "";
				if(AkaMod.sundaeData.mood >= 90) {
					sundaeMood = "Sundae is Exuberant!  ※\(^o^)/※";
				} else if(AkaMod.sundaeData.mood >= 60) {
					sundaeMood = "Sundae is Happy!  (づ｡◕‿‿◕｡)づ";
				} else if(AkaMod.sundaeData.mood >= 40) {
					sundaeMood = "Sundae is Indifferent.  (=ФェФ=)";
				}  else if(AkaMod.sundaeData.mood >= 20) {
					sundaeMood = "Sundae is Angry...  (•`_´•)";
				} else if(AkaMod.sundaeData.mood > 2){
					sundaeMood = "Sundae is Furrious.  (╯°□°)╯︵ ┻━┻";
				} else {
					sundaeMood = "༼つಠ益ಠ༽つ  ─=≡ΣO))";
				}
				var icon=[29,14]; //for sugar lump
				var str='<div id="specialPic" '+ Game.getDynamicTooltip('AkaMod.sundaePetTooltip','this') +' '+Game.clickStr+'="Game.ClickSpecialPic();" style="cursor:pointer;position:absolute;left:0px;top:0px;width:28px;height:28px;background-size:contain;background-repeat:no-repeat;background:url('+pic+');filter:drop-shadow(0px 3px 2px #000);-webkit-filter:drop-shadow(0px 3px 2px #000);"></div>';
				str+='<div class="close" onclick="PlaySound(\'snd/press.mp3\');Game.ToggleSpecialMenu(0);">x</div>';
				str+='<div class="line"></div>'
						+ '<div style="text-align:center;margin-bottom:4px;">'+sundaeMood+'</div>'
						+ '<div '+Game.getDynamicTooltip('AkaMod.sundaeRefillTooltip','this')+' id="sundaeLumpRefill" class="usesIcon shadowFilter lumpRefill" style="left:-14px;top:18px;background-position:'+(-icon[0]*48)+'px '+(-icon[1]*48)+'px;"></div>'
						+ '<div id="moodContainer" class="smallFramed meterContainer" style="height: 16px;margin-left:14px;">'
							+ '<div id="innerMood" class="meter filling" style="width: ' + (334*(Math.min(AkaMod.sundaeData.mood,100)/100)) + 'px; transform: scale(1,2); height: 50%; transform-origin: 50% 0;"></div>'
							+ '<div class="titleFont" style="width: 100%; text-align: center; margin-top: 1px; position: absolute; transform: scale(1,0.8); color: white;">' + Math.round(AkaMod.sundaeData.mood) + '/' + AkaMod.sundaeData.maxMood + ' (+' + AkaMod.SundaeMoodRecovery() + '/minute)</div>'
						+ '</div>';
				l('specialPopup').innerHTML=str;
				l('specialPopup').className='framed prompt onScreen';
				AddEvent(l('sundaeLumpRefill'),'click',function(){
					if (AkaMod.sundaeData.mood < AkaMod.sundaeData.maxMood - 1) {
						Game.refillLump(1,function(){
						AkaMod.sundaeData.mood = AkaMod.sundaeData.maxMood;
						Game.Win("Nothing But The Best For My Kitty");
						PlaySound('snd/pop'+Math.floor(Math.random()*3+1)+'.mp3',0.75);
						Game.gainBuff('purr',60); //1 minute 4x boost to clicks
					});}
				});
			} else {
				AkaMod.ToggleSpecialMenu(on);
			}
		};
		AkaMod.sundaePetTooltip=function(){
			return '<div style="width:300px;padding:8px;">Sundae Pets Yield '+Game.tinyCookie()+'<b>'+ Beautify(AkaMod.SundaePetGains()) +'.</b><div class="line"></div>Sundae Scratches Cost '+Game.tinyCookie()+'<b>'+ Beautify(Game.computedMouseCps * AkaMod.sundaeData.scratchLoss) + '.</div>';
		};
		AkaMod.sundaeRefillTooltip = function() {
			return '<div style="padding:8px;width:300px;font-size:11px;text-align:center;">Click to completely restore Sundae\'s Mood for <span class="price lump">1 Sugar Lump</span>.'
			+	(Game.canRefillLump()?'<br><small>('+("can be done once every " + Game.sayTime(Game.getLumpRefillMax(),-1))+')</small>':('<br><small class="red">('+("usable again in " + Game.sayTime(Game.getLumpRefillRemaining()+Game.fps,-1))+')</small>'))
			+ '</div>';
		};
		//just draw the special thing for you to click. It's in the LR.
		Game.DrawSpecial=function()
		{
			var len=Game.specialTabs.length;
			if (len==0) return;
			Game.LeftBackground.globalAlpha=1;
			var y=Game.LeftBackground.canvas.height-24-48*len;
			var tabI=0;
			
			for (var i in Game.specialTabs)
			{
				var selected=0;
				var hovered=0;
				if (Game.specialTab==Game.specialTabs[i]) selected=1;
				if (Game.specialTabHovered==Game.specialTabs[i]) hovered=1;
				var x=24;
				var s=1;
				var pic='';
				var frame=0;
				if (hovered) {s=1;x=24;}
				if (selected) {s=1;x=48;}
				
				if (Game.specialTabs[i]=='santa') {pic='santa.png';frame=Game.santaLevel;}
				else if (Game.specialTabs[i]=='dragon') {pic='dragon.png?v='+Game.version;frame=Game.dragonLevels[Game.dragonLevel].pic;}
				else if (Game.specialTabs[i]=='sundae') {pic="https://machinex7.github.io/akamikebccmod/img/bigcat.png", frame=0;}
				else {pic='dragon.png?v='+Game.version;frame=4;}
				
				if (hovered || selected)
				{
					var ss=s*64;
					var r=Math.floor((Game.T*0.5)%360);
					Game.LeftBackground.save();
					Game.LeftBackground.translate(x,y);
					if (Game.prefs.fancy) Game.LeftBackground.rotate((r/360)*Math.PI*2);
					Game.LeftBackground.globalAlpha=0.75;
					Game.LeftBackground.drawImage(Pic('shine.png'),-ss/2,-ss/2,ss,ss);
					Game.LeftBackground.restore();
				}
				
				if (Game.prefs.fancy) Game.LeftBackground.drawImage(Pic(pic),96*frame,0,96,96,(x+(selected?0:Math.sin(Game.T*0.2+tabI)*3)-24*s),(y-(selected?6:Math.abs(Math.cos(Game.T*0.2+tabI))*6)-24*s),48*s,48*s);
				else Game.LeftBackground.drawImage(Pic(pic),96*frame,0,96,96,(x-24*s),(y-24*s),48*s,48*s);
				
				tabI++;
				y+=48;
			}
			
		}
	},

	/**
	 * Show a progress bar above the upgrades panel.
	 * @param {number} value Current value of progress bar.
	 * @param {number} max MAX value for this bar. Likely 100.
	 * @param {string} id html ID
	 * @param {string?} label Optional label to show.
	 */
	updateProgressBar: (value, max, id, label) => {
		let bar = l(id);
		if(!bar){
			let container = l('barContainers');
			if(!container) { //create the container if it doesn't exist.
				container = document.createElement("div");
				container.className = "storeSection upgradeBox hasMenu";
				container.id = "barContainers";
				container.style.width = "99%";
				container.style.height = "auto";
				container.style.marginBottom = "2px";
				l('store').insertBefore(container, l('upgrades'));
			}
			bar = document.createElement("div");
			bar.id = id;
			bar.style.marginBottom="8px";
			bar.innerHTML = "<span id='"+id+"Label' style='display:inline-block;max-width:300px;'>" + label + "</span>"
				+ '<div class="smallFramed meterContainer" style="overflow-x: hidden;height: 16px; top: 4px;background: url(img/darkNoise.jpg);" >'
					+ '<div id="'+id+'Progress" style="position:absolute; left:0px; right:0px; top:0px; height:100%; transform:translate(0px,0px);width: ' + (298*(value/max)) + 'px; transform: scale(1,2); height: 50%; transform-origin: 50% 0; background:url(img/timerBars.png) 0px -16px repeat-x;"></div>'
					+ '<div id="'+id+'ProgressLabel" class="titleFont" style="width: 100%; text-align: center; margin-top: 1px; position: absolute; transform: scale(1,0.8); color: white;">' + Beautify(Math.round(value * 10)/10) + ' / '+Beautify(Math.round(max))+'</div>'
				+ '</div>';
			container.appendChild(bar);
		}
		bar.style.display = "block";
		if(label) {
			l(id+"Label").innerHTML = label;
		}
		l(id+"Progress").style.width = (298*(value/max)) + "px";
		l(id+"ProgressLabel").innerHTML = Beautify(Math.round(value * 10)/10) + ' / '+Beautify(Math.round(max));
	},
	hideProgressBar:(id)=>{
		const bar = l(id);
		if(bar){
			bar.style.display = "none";
		}
	},

	//holds most of the 12 days of blizz blues content.
	initDaysOfChristmas: () => {
		//start the timer for the next day of christmas. Called after you complete a day.
		AkaMod.nextDay=(day)=>{
			AkaMod.blizzDays.nextDay = day;
			AkaMod.blizzDays.remainingTime = 2 * 60 * (day-1); //2 minutes for each day.
			if(day === 2) {
				Game.Popup("Preparing for the next day of Christmas...");
				setTimeout(()=>{Game.Popup("Check the stats to see the time remaining.")}, 5000);
			} else if(day === 13) {
				Game.Popup("The 12 Days of Christmas are complete?");
			}
			if(Game.HasAchiev("13 Days of Blizz Blues, 3rd Run")){
				AkaMod.blizzDays.remainingTime = Math.round(AkaMod.blizzDays.remainingTime/2);
				if(Game.HasAchiev("13 Days of Blizz Blues, 5th Run")){
					AkaMod.blizzDays.remainingTime = Math.round(AkaMod.blizzDays.remainingTime/2);
				}
			}
		};
		//unlock the days upgrades.
		AkaMod.unlockNextDay=(day)=>{
			switch(day) {
				case 2:
					Game.Popup("On the Second Day of Christmas, My SWTOR Gave To Me...");
					Game.Unlock("Double Bladed Lightsabers");
					break;
				case 3:
					Game.Popup("On the Third Day of Christmas, Blizzard Gave To Me...");
					Game.Unlock("First Bouncing Bunny");
					Game.Unlock("Second Bouncing Bunny");
					Game.Unlock("Third Bouncing Bunny");
					break;
				case 4:
					Game.Popup("On the Fourth Day of Christmas, My SWTOR Gave To Me...");
					Game.Unlock("First Holo Dancer");
					Game.Unlock("Second Holo Dancer");
					Game.Unlock("Third Holo Dancer");
					Game.Unlock("Fourth Holo Dancer");
					break;
				case 5:
					Game.Popup("On the Fifth Day of Christmas, Guess What Your Boy Got?");
					Game.Unlock("Connect to Moonguard Server");
					break;
				case 6:
					Game.Popup("On the Sixth Day of Christmas, Word On the Street is Blizzard Gave To Thee..");
					Game.Unlock("Belphegor Again");
					Game.Unlock("Mammon Again");
					Game.Unlock("Abaddon Again");
					Game.Unlock("Satan Again");
					Game.Unlock("Asmodeus Again");
					Game.Unlock("Beelzebub Again");
					break;
				case 7:
					Game.Popup("On the Absolutely Seventh Day, Absolutely SWTOR Gave to Thee...");
					Game.Unlock("Thesaurus");
					break;
				case 8:
					Game.Popup("On the Eigth Day of Christmas, I Heard Your Blizzard Gave To Thee..");
					Game.Unlock("Exciting New Feature!");
					break;
				case 9:
					Game.Popup("On the Ninth Day of Christmas, SWTOR Gave To Thee...");
					Game.Unlock("90 Minutes of Unneccesary Commentary So You Can Like, Go And Kill Some Swamp Rats And Stuff.");
					break;
				case 10:
					Game.Popup("On the Tenth Day of Christmas, Your Blizzard Gave To Thee...");
					Game.Unlock("Pandas And Pokemon");
					break;
				case 11:
					Game.Popup("On the Eleventh Day of Christmas, Your SWTOR Gave To Thee...");
					Game.Unlock("WoW Reskin with Voices and Lightsabers.");
					break;
				case 12:
					Game.Unlock("A 12 month contract locking you into a 7 year old game paying over $150 for beta access that everyone else gets for free, a midget mount, and a copy of Diablo 3.");
					Game.Popup("On the Twelveth Day of Christmas, Your Blizzard Gave To Thee...");
					break;
				case 13:
					Game.Popup("On the Thirteenth Day of Christmas, Your SWTOR Gave To Thee...");
					Game.Unlock("The 13th Day of Blizz Blues?");
					break;
			}
		};
		AkaMod.bunnyUpgrade=()=>{
			if(Game.Has("First Bouncing Bunny") && Game.Has("Second Bouncing Bunny") && Game.Has("Third Bouncing Bunny")) {
				AkaMod.nextDay(4);
			}
		};
		AkaMod.holoDancerUpgrade=()=>{
			if(Game.Has("First Holo Dancer") && Game.Has("Second Holo Dancer") && Game.Has("Third Holo Dancer") && Game.Has("Fourth Holo Dancer")) {
				AkaMod.nextDay(5);
			}
		};
		//start a boss fight.
		AkaMod.startBoss=(index)=>{
			AkaMod.blizzDays.currentBoss = index;
			AkaMod.blizzDays.round = 0;
			AkaMod.blizzDays.bossDamageReceived = 0;
			AkaMod.blizzDays.lastAbility = "";
			AkaMod.blizzDays.lastBossAbility = [];
			AkaMod.blizzDays.summonedGrandma = false;
			AkaMod.blizzDays.grandmaDamage = 0;
			AkaMod.blizzDays.bossHP = 100;
			Game.Popup("The Battle Has Begun!");

			//locks and unbuys the upgrade, so make sure to only call this on bosses that are unbeaten.
			if(!Game.Has("Belphegor Again")) {Game.Lock("Belphegor Again");}
			if(!Game.Has("Mammon Again")) {Game.Lock("Mammon Again");}
			if(!Game.Has("Abaddon Again")) {Game.Lock("Abaddon Again");}
			if(!Game.Has("Satan Again")) {Game.Lock("Satan Again");}
			if(!Game.Has("Stan?")) {Game.Lock("Stan?");}
			if(!Game.Has("Asmodeus Again")) {Game.Lock("Asmodeus Again");}
			if(!Game.Has("Beelzebub Again")) {Game.Lock("Beelzebub Again");}
			if(!Game.Has("Lucifer Again")) {Game.Lock("Lucifer Again");}
			if(!Game.Has("Angry Sundae")) {Game.Lock("Angry Sundae");}
			AkaMod.nextBossRound("", 0);
		};
		AkaMod.bossNames=[{name:"",icon:[0,0]},
			{name:"Belphegor",icon:[7,11]},
			{name:"Mammon",icon:[8,11]},
			{name:"Abaddon",icon:[9,11]},
			{name:"Satan",icon:[10,11]},
			{name:"Asmodeus",icon:[11,11]},
			{name:"Beelzebub",icon:[12,11]},
			{name:"Lucifer",icon:[13,11]},
			{name:"Stan",icon:[1,33]},
			{name:"Angry Sundae",icon:[18,17]},
		];
		//Uses an ability and handles damage math.
		AkaMod.fightBoss=(ability)=>{
			let bossDamage = 0; //damage done by boss
			let bossAbilityText = "";
			let damageDealt = 0; //damage done by you
			let baseAttackDamage = 10;
			let baseBossDamage = baseAttackDamage * 2;
			
			const bossAbilityArray = [
				["attack", "attack", "attack", "heal"], //Belphegor
				["block", "attack", "crit"], //Mammon
				["attack", "crit", "heal"], //Abaddon
				["counter", "counter", "heal"], //Satan
				["attack", "crit", "attack", "crit", "heal", "counter"], //Asmodeus
				["crit", "counter", "crit", "heal"], //Beelzebub
				["crit"], //lucifer has his own system.
				["counter", "audit", "attack", "audit", "heal", "block", "crit"], //Stan
				["scratch", "attack", "hiss", "scratch"], //Sundae, Master of All
			];
			//figure out boss ability, based on round.
			const bossAbilityCycle = bossAbilityArray[AkaMod.blizzDays.currentBoss - 1];
			let bossAbility;
			let healAmount = 0;
			if(AkaMod.blizzDays.currentBoss === 7) {
				//This boss is harder to beat.
				switch(ability) {
					case "attack":
						bossAbility = "counter";
						break;
					case "crit":
						bossAbility = "block";
						break;
					case "counter":
						if(AkaMod.blizzDays.bossHp <= 40 || AkaMod.blizzDays.summonedGrandma) {
							bossAbility = "heal";
						} else {
							bossAbility = "crit";
						}
						break;
					case "block":
						if(AkaMod.blizzDays.bossHp <= 40) {
							bossAbility = "heal";
						} else {
							bossAbility = "attack";
						}
						break;
					case "dot":
						//weakness is grandmas
						bossAbility = "block";
						break;
				}
			} else {
				bossAbility = bossAbilityCycle[AkaMod.blizzDays.round % bossAbilityCycle.length];
			}
			AkaMod.blizzDays.lastBossAbility = [bossAbility].concat(AkaMod.blizzDays.lastBossAbility);
			if(AkaMod.blizzDays.lastBossAbility.length > bossAbilityCycle.length){
				AkaMod.blizzDays.lastBossAbility.splice(bossAbilityCycle.length);
			}
			//now handle ability interactions.
			switch(ability) {
				case "attack":
					if(bossAbility === "block") {
						bossAbilityText = "The boss blocked your attack and took no damage.";
						bossAbility = "";
						ability = "fail";
					} else if(bossAbility === "counter") {
						bossDamage = baseBossDamage * 1.5;
						bossAbility = "";
						bossAbilityText = "The boss countered your attack, costing you " + bossDamage + " seconds of CPS.";
						ability = "fail";
					} else if (bossAbility === "heal") {
						damageDealt = baseAttackDamage;
						bossAbility = "";
						bossAbilityText = "The boss tried to heal, but your attack interrupted it and dealt "+damageDealt+" damage.";
					} else if (bossAbility === "audit") {
						bossAbility = "";
						bossDamage = baseBossDamage;
						bossAbilityText = "Stan interuppted and Audited your attack. He calculated you owe " + bossDamage + " seconds of CPS.";
						ability = "fail";
					} else if (bossAbility === "hiss") {
						damageDealt = baseAttackDamage/2;
						bossAbilityText = "Sundae's hiss scarred you, but you still attacked for "+ damageDealt + " damage."
					} else {
						bossAbilityText = "You attacked the boss for "+baseAttackDamage+" damage. ";
						damageDealt = baseAttackDamage;
					}
				break;
				case "crit":
					if(bossAbility === "block") {
						bossAbilityText = "The boss blocked your attack and took no damage.";
						bossAbility = "";
					} else if(bossAbility === "counter") {
						damageDealt = baseAttackDamage * 2;
						bossAbility = "";
						bossAbilityText = "The boss tried to counter your crit, but couldn't and took " + damageDealt + " damage!";
					} else if (bossAbility === "heal") {
						damageDealt = baseAttackDamage * 2;
						bossAbility = "";
						bossAbilityText = "The boss tried to heal, but your attack interrupted it and dealt "+damageDealt+" damage!";
					} else if (bossAbility === "audit") {
						bossAbility = "";
						damageDealt = baseAttackDamage*4;
						bossAbilityText = "Stan audited your crit, and found it a satisfactory. He took increased damage, losing "+damageDealt+" HP. ";
					} else {
						damageDealt = baseAttackDamage*2;
						bossAbilityText = "You crit the boss for "+damageDealt+" damage. ";
					}
				break;
				case "counter":
					if(bossAbility === "attack") {
						bossAbility = "";
						damageDealt = baseAttackDamage * 1.5;
						bossAbilityText = "You countered the boss's attack and dealt " + damageDealt + " damage!";
					} else if (bossAbility === "crit") {
						bossAbilityText = "You tried to counter the boss's attack, but couldn't."
					} else if (bossAbility === "audit") {
						bossAbility = "";
						bossDamage = baseBossDamage * 3;
						bossAbilityText = "Stan interuppted and Audited your counter. He calculated you owe " + bossDamage + " seconds of CPS.";
					} else if(bossAbility==="block"){
						bossDamage = baseBossDamage / 2;
						bossAbilityText = "You tried to counter, but the boss blocked, and you ended up hitting yourself in the face. You take " + bossDamage + " damage.";
						bossAbility = "";
					} else if(bossAbility ==="counter"){
						bossAbility = "";
						bossAbilityText = "You both tried to counter, but just ended up looking at each other silly.";
					} else {
						bossAbilityText = "You tried to counter, but couldn't. ";
					}
				break;
				case "block":
					if(bossAbility === "attack" || bossAbility === "crit" || bossAbility === "scratch"){
						bossAbilityText = "You blocked the boss's "+bossAbility+" and took no damage!";
						bossAbility = "";
					} else if (bossAbility === "audit") {
						bossAbility = "";
						bossDamage = baseBossDamage * 4;
						bossAbilityText = "Stan interuppted and Audited your block. He calculated you owe " + bossDamage + " seconds of CPS.";
					} else if (bossAbility === "block"){
						bossAbility = "";
						bossAbilityText = "You both braced for an attack! But nothing happened. The boss relaxed a bit, regaining HP.";
						healAmount = baseBossDamage / 2;
						AkaMod.blizzDays.bossHP += healAmount;
						if(AkaMod.blizzDays.bossHP > 100) {
							AkaMod.blizzDays.bossHP = 100;
						}
					} else {
						bossAbilityText = "You tried to block, but couldn't. ";
					}
				break;
				case "dot":
					if (bossAbility === "audit") {
						bossAbility = "";
						bossDamage = baseBossDamage * 3;
						bossAbilityText = "Stan interuppted and Audited your Grandma. He calculated you owe " + bossDamage + " seconds of CPS.";
					} else {
						bossAbilityText = "You summoned an angry Grandma to whap the boss with a roller.";
						AkaMod.blizzDays.summonedGrandma = true;
					}
				break;
			}
			//deal with any unaffected boss abilities.
			switch(bossAbility) {
				case "attack":
					bossDamage = baseBossDamage;
					bossAbilityText += " The boss attacked and cost you " + bossDamage + " seconds of CPS.";
				break;
				case "crit":
					bossDamage = baseBossDamage * 3;
					bossAbilityText += " The boss critically attacked and cost you " + bossDamage + " seconds of CPS!";
				break;
				case "scratch":
					bossDamage = Math.round(baseBossDamage * (100 - AkaMod.sundaeData.mood) / 20);
					if(bossDamage <= baseBossDamage/4) {
						bossDamage = baseBossDamage/4;
						healAmount = baseBossDamage/2;
						AkaMod.blizzDays.bossHP += healAmount;
						if(AkaMod.blizzDays.bossHP > 100) {
							AkaMod.blizzDays.bossHP = 100;
						}
						bossAbilityText += " Sundae is getting sleepy. She only did "+bossDamage+" damage, but she also recovered " + healAmount + " health.";
					} else {
						bossAbilityText += " Sundae Scratched you. Her bad mood helped her to do " + bossDamage + " damage!";
					}
					break;
				case "heal":
					healAmount = baseBossDamage * 2;
					AkaMod.blizzDays.bossHP += healAmount;
					if(AkaMod.blizzDays.bossHP > 100) {
						AkaMod.blizzDays.bossHP = 100;
					}
					bossAbilityText += " The boss healed themselves for " + healAmount + " HP.";
					if(AkaMod.blizzDays.summonedGrandma) {
						AkaMod.blizzDays.summonedGrandma = false;
						bossAbilityText += " The heal dismissed your grandma!";
					}
				break;
				case "hiss":
					healAmount = baseBossDamage;
					AkaMod.blizzDays.bossHP += healAmount;
					if(AkaMod.blizzDays.bossHP > 100) {
						AkaMod.blizzDays.bossHP = 100;
					}
					bossAbilityText += " Sundae Hissed and healed themselves for " + healAmount + " HP.";
					if(AkaMod.blizzDays.summonedGrandma) {
						AkaMod.blizzDays.summonedGrandma = false;
						bossAbilityText += " The hiss scared away your grandma!";
					}
				break;
				case "counter":
					bossAbilityText += " The boss tried to counter but nothing happened.";
				break;
				case "block":
					bossAbilityText += " The boss tried to block but nothing happened.";
				break;
				case "audit":
					bossAbilityText += " Stan audited your ability, but found it adequate.";
				break;
			}
			if(AkaMod.blizzDays.summonedGrandma && ability !== "dot") {
				let grandmaDamage = 0;
				if(damageDealt === 0) {
					grandmaDamage = Math.ceil((baseAttackDamage / 3) + 1);
				} else {
					grandmaDamage = Math.floor((baseAttackDamage / 3));
				}
				damageDealt += grandmaDamage;
				AkaMod.blizzDays.grandmaDamage += grandmaDamage;
				bossAbilityText += " Your Grandma whacked the boss for " + grandmaDamage + " damage.";
			}
			bossAbilityText += "<br />";

			AkaMod.blizzDays.bossHP -= damageDealt;
			AkaMod.blizzDays.lastAbility = ability;
			AkaMod.blizzDays.round++;
			if(AkaMod.blizzDays.bossHP <= 0) {
				Game.Lock("Cookie Throw");
				Game.Lock("Critical Cookie Throw");
				Game.Lock("Counter");
				Game.Lock("Cookie Shield");
				Game.Lock("Summon Protective Grandma");
				Game.Popup(bossAbilityText + "Boss Defeated!");
				Game.Notify("Boss Defeated!", "Congratulations, you defeated "+AkaMod.bossNames[AkaMod.blizzDays.currentBoss].name+"!", AkaMod.bossNames[AkaMod.blizzDays.currentBoss].icon);
				AkaMod.blizzDays.bossCombatText = "";

				let targetRounds = 0;
				let maxDamage = 0;
				switch(AkaMod.blizzDays.currentBoss){
					case 1: targetRounds = 7; break;
					case 2: targetRounds = 11; break;
					case 3: targetRounds = 12; break;
					case 4: targetRounds = 12; break;
					case 5: targetRounds = 11; break;
					case 6: targetRounds = 19; break;
					case 7: Game.Win("Defeated Lucifer"); targetRounds = 21; maxDamage=baseBossDamage*1.5*8; break;
					case 8: Game.Win("Defeated Stan"); targetRounds = 6; maxDamage=baseBossDamage*2; break;
					case 9: Game.Win("Pacified Sundae"); targetRounds = 14; maxDamage=15; AkaMod.sundaeData.mood = AkaMod.sundaeData.maxMood; break;
				}
				if(AkaMod.blizzDays.round <= targetRounds && AkaMod.blizzDays.bossDamageReceived <= maxDamage){
					AkaMod.blizzDays.optimalVictories++;
					Game.Notify("Perfect Victory!", "Good job! You beat "+AkaMod.bossNames[AkaMod.blizzDays.currentBoss].name+" taking as little damage as possible, as quickly as possible.",[8, 13]);
					Game.Win("Christmas Boss Professional");
					if(AkaMod.blizzDays.optimalVictories >= 6){
						Game.Win("Christmas Boss Mastery");
						if(AkaMod.blizzDays.optimalVictories >= 9){
							Game.Win("Christmas Boss Proficiency");
						}
					}
				}

				AkaMod.blizzDays.currentBoss = 0;
				AkaMod.blizzDays.totalBosses++;
				if(AkaMod.blizzDays.totalBosses >= 20){
					Game.Win("A Squad of Christmas Bosses");
					if(AkaMod.blizzDays.totalBosses >= 50){
						Game.Win("A Platoon of Christmas Bosses");
						if(AkaMod.blizzDays.totalBosses >= 100){
							Game.Win("A Company of Christmas Bosses");
							if(AkaMod.blizzDays.totalBosses >= 200){
								Game.Win("A Battalion of Christmas Bosses");
							}
						}
					}
				}
				AkaMod.hideProgressBar("bossBar");
				Game.Win("Christmas Boss Fighter");
				if(AkaMod.blizzDays.nextDay === 6 && Game.Has("Mammon Again") && Game.Has("Abaddon Again") && Game.Has("Satan Again") 
					&& Game.Has("Asmodeus Again") && Game.Has("Beelzebub Again") && Game.Has("Belphegor Again")) {
						AkaMod.nextDay(7);
						Game.Win("Christmas Boss Conqueror");
						Game.Popup("Preparing for the next Day of Blizz Blues...");
				} else {
					Game.Unlock("Mammon Again");
					Game.Unlock("Abaddon Again");
					Game.Unlock("Satan Again");
					Game.Unlock("Asmodeus Again");
					Game.Unlock("Beelzebub Again");
					Game.Unlock("Belphegor Again");
				}
			} else {
				AkaMod.blizzDays.totalBossDamage += bossDamage;
				AkaMod.blizzDays.bossDamageReceived += bossDamage;
				AkaMod.nextBossRound(bossAbilityText, bossDamage);
			}
		};
		//sets up the UI for the next round.
		AkaMod.nextBossRound=(bossAbilityText, bossDamage)=>{
			AkaMod.blizzDays.bossDamage = bossDamage;
			AkaMod.blizzDays.bossCombatText = bossAbilityText;
			//lock, then unlock abilities
			Game.Lock("Cookie Throw");
			Game.Lock("Critical Cookie Throw");
			Game.Lock("Counter");
			Game.Lock("Cookie Shield");
			Game.Lock("Summon Protective Grandma");
			if(AkaMod.blizzDays.lastAbility !== "attack") {
				Game.Unlock("Cookie Throw");
			} else {
				Game.Unlock("Critical Cookie Throw");
			}
			Game.Unlock("Counter");
			Game.Unlock("Cookie Shield");
			if(!AkaMod.blizzDays.summonedGrandma) {
				Game.Unlock("Summon Protective Grandma");
			}

			if(bossAbilityText && bossAbilityText.length > 6) {
				Game.Popup(bossAbilityText);
				AkaMod.updateProgressBar(AkaMod.blizzDays.bossHP, 100, "bossBar", bossAbilityText + " Boss HP:");
				bossAbilityText = "<br />In the last round, " + bossAbilityText;
			} else {
				AkaMod.updateProgressBar(AkaMod.blizzDays.bossHP, 100, "bossBar", "Boss HP:");
			}

			//update upgrades
			const bossHealth = "<br />Boss HP: " + AkaMod.blizzDays.bossHP + " / 100";
			Game.Upgrades["Cookie Throw"].ddesc = Game.Upgrades["Cookie Throw"].desc = "Throws a handful of cookies at the boss.<br />" + bossAbilityText + bossHealth;
			Game.Upgrades["Critical Cookie Throw"].ddesc = Game.Upgrades["Critical Cookie Throw"].desc = "Throws a large fistful of cookies at the boss.<br />" + bossAbilityText + bossHealth;
			Game.Upgrades["Counter"].ddesc = Game.Upgrades["Counter"].desc = "Counter-attack the boss if they attack, dealing extra damage back to them.<br />" + bossAbilityText + bossHealth;
			Game.Upgrades["Cookie Shield"].ddesc = Game.Upgrades["Cookie Shield"].desc = "Block all damage from the boss's attack.<br />" + bossAbilityText + bossHealth;
			Game.Upgrades["Summon Protective Grandma"].ddesc = Game.Upgrades["Summon Protective Grandma"].desc = "Summon a Grandma who will constantly wack the boss for a little bit of damage each round.<br />" + bossAbilityText + bossHealth;
			//update prices, based on the boss attack.
			Game.Upgrades["Cookie Throw"].basePrice = 
				Game.Upgrades["Critical Cookie Throw"].basePrice = 
				Game.Upgrades["Counter"].basePrice = 
				Game.Upgrades["Cookie Shield"].basePrice = 
				Game.Upgrades["Summon Protective Grandma"].basePrice = (Game.cookiesPs * bossDamage) + 100;
			if (Game.onMenu=='stats') {Game.UpdateMenu();}
		};
		//handle the secret boss. Have to delay initialization because the minigames aren't set up yet.
		AkaMod.initSpellTweaks=()=>{
			if(!Game.Objects['Wizard tower'].minigame){
				setTimeout(AkaMod.initSpellTweaks, 100);
				return;
			}
			AkaMod.wizardAbomRes = Game.Objects['Wizard tower'].minigame.spells['resurrect abomination'].win;
			Game.Objects['Wizard tower'].minigame.spells['resurrect abomination'].win = function(){
				let count = 0;
				for (var i=0;i<12;i++){
					if(Game.wrinklers[i].phase === 2) {
						count++;
					}
				}
				if(count === 12 && AkaMod.blizzDays.currentBoss === 0 && Game.Has("Belphegor Again") && Game.Has("Mammon Again") && Game.Has("Abaddon Again") && Game.Has("Satan Again")
					&& Game.Has("Asmodeus Again") && Game.Has("Beelzebub Again") && !Game.Has("Lucifer Again")) {
					Game.Unlock("Lucifer Again")
					Game.Notify("Lucifer, the Lightbringer!", "The onetime bringer of Light, Lucifer, has been summoned!", [13,11]);
				}
				return AkaMod.wizardAbomRes();
			};
			AkaMod.oldWizardCast = Game.Objects['Wizard tower'].minigame.castSpell;
			Game.Objects['Wizard tower'].minigame.castSpell=function(spell,obj){
				const resp = AkaMod.oldWizardCast(spell, obj);
				if(AkaMod.blizzDays.questType === 4 && resp) {
					AkaMod.updateQuestProgress(1);
				}
				return resp;
			};
		};
		AkaMod.initSpellTweaks();
		AkaMod.absolPrompt=(round)=>{
			let text = "";
			Game.ClosePrompt();
			switch(round) {
				case 1:
					text = "Would you like to get the CPS for this upgrade?";
					break;
				case 2:
					text = "Are you happy you bought this upgrade?";
					break;
				case 3:
					text = "Is Absolutely a hard word to spell?";
					break;
				case 4:
					text = "Is this mod amazing?";
					break;
				case 5:
					text = "Will you give me some money to keep making these popups?";
					break;
				case 6:
					text = "Would you like these popups to stop?";
					break;
				case 7:
					text = "But are you secretly enjoying them?";
					break;
				case 8:
					text = "Do you watch AkaMikeB?";
					break;
				case 9:
					text = "Are you ready for the last popup?";
					break;
				case 10:
					text = "Did you really think there's going to be a last popup?";
					break;
				case 11:
					text = "Is Darnell awesome?";
					break;
				case 12:
					text = "Ready to move on to the next Day of Christmas?";
					break;
				default:
					return;
			}
			
			setTimeout(() => Game.Prompt("<div class='block'>"+text+"</div>", [["Absolutely", 'AkaMod.absolPrompt('+(round+1)+');']]), 400);
		};
		AkaMod.comingSoonUpdate=()=>{
			switch(AkaMod.blizzDays.comingSoonCounter) {
				case 0:
					Game.Notify("Oops, Sorry!", "Sorry, it's not quite ready yet. Please try again later.",[1,7]);
					break;
				case 1:
					Game.Notify("Oops, Sorry!", "This feature isn't done yet, it was just a little too expensive.",[1,7]);
					break;
				case 2:
					Game.Notify("Oops, Sorry!", "Not done yet, but it will be soon!",[1,7]);
					break;
				case 3:
					Game.Notify("Oops, Sorry!", "Soon(TM)",[1,7]);
					break;
				case 4:
					Game.Notify("Oops, Sorry!", "Almost done. Please try again later.",[1,7]);
					break;
				default:
					Game.Notify("Oops, Sorry!", "Forget This. Let's just move on to the 9th Day of Christmas.",[1,7]);
					AkaMod.nextDay(9);
					return;
			}
			AkaMod.blizzDays.comingSoonCounter++;
			Game.Lock("Exciting New Feature!");
			AkaMod.nextDay(8);
			AkaMod.blizzDays.remainingTime /= 8;
		};
		AkaMod.pokemonTypes = [
			{name: "Bunny", flavor: "Basically this game's Rattata.", baseChance: 59, clickLimit: 40, clickBoost: 1, icon: [0,12]},
			{name: "Gingerbread Man", flavor: "He's running as fast as he can. Will you catch him? He's the Gingerbread Man!", baseChance: 30, clickLimit: 30, clickBoost: 0.5, icon: [18,4]},
			{name: "Bat", flavor: "It's not a Zubat, because that would be copyright infringing. It's just a bat.", baseChance: 40, clickLimit: 30, clickBoost: 0.5, icon: [14,8]},
			{name: "Ghost", flavor: "I don't know what there is to say here. It's a Ghost. Everybody's heard of them.", baseChance: 30, clickLimit: 30, clickBoost: 0.5, icon: [13,8]},
			{name: "Slime", flavor: "Little known fact, after you throw away used tissues, garbage companies collect and recycle them. Slimes are what's born of the leavings.", baseChance: 30, clickLimit: 30, clickBoost: 0.5, icon: [15,8]},
			{name: "Fairy", flavor: "After the union strike at the Fairydust factory, most fairly workers were replaced with robotic dust generators. Fairies are looking for work wherever they can find it, even if it's a lame pokemon ripoff.", baseChance: 30, clickLimit: 30, clickBoost: 0.5, icon: [26,11]},
			{name: "Reindeer", flavor: "Life is a lot harder for the 10th Reindeer, Bob. He's not in any of the songs.", baseChance: 40, clickLimit: 20, clickBoost: 0.5, icon: [12,9]},
			{name: "Skull", flavor: "I don't really understand how skulls and skeletons are supposed to be sentient, and at this point I'm too afraid to ask.", baseChance: 30, clickLimit: 20, clickBoost: 0.5, icon: [12,8]},
			//evolution forms below.
			{name: "Closed Eye", flavor: "The eye is said to reach it's full power when fully opened.", baseChance: 20, clickLimit: 20, clickBoost: 0.2, icon: [31,20], forms: [{name: "Lidded Eye", icon: [30,20]}, {name: "Floating Eye", icon: [17,8]}]},
			{name: "Stoneface", flavor: "Despite their constant grimace, Stonefaces are natural born comedians and tell the best Knock Knock jokes.", baseChance: 30, clickLimit: 20, clickBoost: 0.5, icon: [12,7], forms: [{name: "Rockface", icon:[13,7]}, {name: "Magicface", icon:[14,7]}]},
			{name: "Wrinkler", flavor: "It's gross. It's wrinkly. Don't touch it with your bare hands.", baseChance: 10, clickLimit: 20, clickBoost: 0.2, icon: [19,8], forms:[{name: "Shiny Wrinkler", icon:[24,12]}]},
			{name: "Angel", flavor: "One of the most powerful creatures you can collect. It's a lot of work, but a fully ascended Angel is worth it.", baseChance: 0, clickLimit: 20, clickBoost: 0.1, icon: [0,11], forms:[
				{name: "Archangel", icon:[1,11]},{name: "Virtue", icon:[2,11]},{name: "Dominion", icon:[3,11]},
				{name: "Cherubim", icon:[4,11]},{name: "Seraphim", icon:[5,11]},{name: "God", icon:[6,11]}
			]},
			//these aren't secret, but they spawn in a weird way.
			{name: "Cat", flavor: "It's a completely normal cat. Seriously, everybody knows what these are. Why are you even reading this text?", baseChance: 30, clickLimit: 30, clickBoost:0.2, icon:[18,0], forms:[
				{name: "Pink Cat", icon:[18,1]}, {name: "Blue Cat", icon:[18,2]}, {name: "Sparkley Cat", icon:[18,13]}, {name: "Another Sparkley Cat", icon:[18,14]},
				{name: "What Is Up With These Cats?", icon:[18,15]}, {name: "Non-Sparkley Cat", icon:[18,16]}, {name: "Death Cat I guess IDK", icon:[18,17]},
				{name: "Great, Another Sparkley Cat", icon:[18,18]}, {name: "WTF Cat, stop sparkling", icon:[18,19]}, {name: "Cat, with another cat standing behind it", icon:[18,21]},
				{name: "Soft Kitty, Warm Kitty, Little Ball of Fur", icon:[18,25]}, {name: "Ooo, a Cat with a Plus", icon:[18,26]}, {name: "Smelly Cat, Smelly Cat", icon:[18,27]},
				{name: "Muddy Cat", icon:[18,28]}, {name: "Holy Cat", icon:[18,30]}, {name: "The Blackest Cat", icon:[18,31]}
			]},
			{name: "Single Cookie", flavor: "Extremely Rare. If Trubbish can be a pokemon, a Cookie can be a Creature.", baseChance:0, clickLimit: 100, clickBoost:1, icon:[0,5], forms:[
				{name: "Two Cookies", icon:[1,5]}, {name: "Three Cookies", icon:[2,5]}, {name: "Four Cookies", icon:[3,5]}, {name: "Cookie Pile", icon:[4,5]}, {name: "Cookie Mound", icon:[5,5]},
				{name: "Cookie Mass", icon:[6,5]}, {name: "Cookie Vortex", icon:[7,5]}, {name: "Cookie Pulsar", icon:[8,5]}, {name: "Cookie Quasar", icon:[9,5]},
				{name: "Cookie World", icon:[10,5]}, {name: "Infinite Cookie", icon:[11,5]}
			]},
			//bonus forms below
			{name: "Voideater", secret:true, flavor: "The Eye sees all. It has seen the Void, and become the Void.", baseChance: -40, clickLimit: 10, clickBoost: 0.1, icon: [21,25]},
			{name: "Hungerer", secret:true, flavor: "The Hungerer will swallow all. It's stomach is endless. It will never be sated.", baseChance: -40, clickLimit: 20, clickBoost: 0.1, icon: [21,32]},
			{name: "Chimera", secret:true, flavor: "When the forces of dark and light clash, the Chimera arises from the ashes.", baseChance: -50, clickLimit: 12, clickBoost: 0.1, icon: [24,7]},
			{name: "Missingno", secret:true, flavor: "ASDJKP@#_!^WERY:K", baseChance: -80, clickLimit: 40, clickBoost: 0.2, icon: [0,7], forms:[{name: "MissingNO", icon:[0,8]}, {name: "MissingNo", icon:[8,10]}, , {name: "MISSINGNO", icon:[17,5]}]},
		]; //DON'T ADD MORE. It will break upgrades.
		AkaMod.baitTypes=[
			{name:"Toast Bait", desc:"Buy a bait that gives a 1% boost to help catch a Creature. Click the Big Cookie a bunch to get a creature to spawn!", icon:[27,10], chance:1, cost:1},
			{name:"Pumpkin Bait", desc:"Buy a bait that gives a 5% boost to help catch a Creature.", icon:[16,8], chance:5, cost:60},
			{name:"Cheeseburger Bait", desc:"Buy a bait that gives a 10% boost to help catch a Creature.", icon:[28,30], chance:10, cost:600},
			{name:"Pizza Bait", desc:"Buy a bait that gives a 20% boost to help catch a Creature.", icon:[31,9], chance:20, cost:60*60},
			{name:"Chocolate Cake Bait", desc:"Buy a bait that gives a MASSIVE boost to help catch a Creature. Only appears when you are having lots of trouble with catches.", icon:[25,27], chance:40, cost:600}
		]; //DON'T ADD MORE. It will break upgrades.
		//spawn a random creature.
		AkaMod.spawnPokemon=(forced)=>{
			if(AkaMod.blizzDays.activePokemon != -1) {
				//Voideater check
				if(AkaMod.blizzDays.activePokemon <= 9 && AkaMod.blizzDays.pokemon.length >= 10 && !Game.Has("Try to Catch Voideater")) {
					for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++) {
						const pokemon = AkaMod.blizzDays.pokemon[p];
						if(pokemon.index === 8 && pokemon.form === 2) {
							Game.Lock("Try to Catch " + AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].name);
							Game.Unlock("Try to Catch Voideater");
							Game.Upgrades["Try to Catch Voideater"].basePrice = Game.cookiesPsRaw * AkaMod.blizzDays.pokemon.length * 5;
							Game.Notify("The Voideater Appears!","The "+AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].name+" was sacrificed to the Floating Eye, causing it to leave you and transform into the Voideater!", [21,25]);
							AkaMod.blizzDays.activePokemon = 14;
							AkaMod.blizzDays.pokemon.splice(p, 1);
							AkaMod.updatePokemonUpgrade();
							break;
						}
					}
				}
				
				return; //can't spawn when one is already there.
			}
			let skipPopup = false;
			if(AkaMod.blizzDays.activePokemon === -1) {
				if(forced && AkaMod.blizzDays.pokemon.length === AkaMod.pokemonTypes.length - 1) {
					let maxed = 0;
					for(let pokemon of AkaMod.blizzDays.pokemon) {
						if(pokemon.level >= 99) {
							maxed++;
						}
					}
					if(maxed===AkaMod.blizzDays.pokemon.length){
						AkaMod.blizzDays.activePokemon = AkaMod.pokemonTypes.length - 1; //missingno
					}
				}
				if(AkaMod.blizzDays.pokemon.length === 0) {
					AkaMod.blizzDays.activePokemon = 0; //spawn the bunny first, because it's extra easy.
				} else if(AkaMod.blizzDays.pokemon.length <= 5){
					AkaMod.blizzDays.activePokemon = Math.floor(Math.random() * 8); //only the non-evolving
				} else if(AkaMod.blizzDays.activePokemon === -1) {
					AkaMod.blizzDays.activePokemon = Math.floor(Math.random() * 12); //all normal, but no secret or weird spawn
					//5% single cookie chance
					if(!forced && Math.random() < 0.05){
						AkaMod.blizzDays.activePokemon = 13;
					}
					//check for chimera conditions.
					if(Game.Has("Lucifer Again") && forced && !Game.Has("Try to Catch Chimera")) {
						for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++) {
							const pokemon = AkaMod.blizzDays.pokemon[p];
							if(pokemon.index === 11) {
								if(pokemon.form === 6) {
									AkaMod.blizzDays.activePokemon = 16;
									Game.Notify("The Chimera Appears!", "God and Lucifer have left you and merged to create the Chimera!", [24,7]);
									skipPopup = true;
									Game.Upgrades["Lucifer Again"].lose();
									AkaMod.blizzDays.pokemon.splice(p, 1);
								}
								break;
							}
						}
					}
					//check for Hungerer conditions
					if(AkaMod.blizzDays.baitTime >= 60 * 75 && AkaMod.blizzDays.currentBait === 3 && !Game.Has("Try to Catch Hungerer")){
						AkaMod.blizzDays.activePokemon = 15;
						AkaMod.blizzDays.currentBait = -1;
						Game.Popup("The putrefying Pizza has attracted the Hungerer!");
						skipPopup = true;
					}
				}
			}
			const upgrdName = "Try to Catch " + AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].name;
			if(!skipPopup) {
				Game.Popup("A wild " + AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].name + " appeared!");
			}
			Game.Lock(upgrdName);
			Game.Unlock(upgrdName);
			if(forced) {
				Game.Upgrades[upgrdName].basePrice = Game.cookiesPsRaw * (AkaMod.blizzDays.activePokemon+1) * 10;
			}
			AkaMod.updatePokemonUpgrade();
		};
		AkaMod.tryCatch=(index)=>{
			const chance = AkaMod.chanceToCatch(index);
			AkaMod.hideProgressBar("pokemonBar");
			//XP gained is based on the difficulty of the pokemon and how buffed you are to catch it.
			let xp = Math.round((chance - AkaMod.pokemonTypes[index].baseChance + 100 - AkaMod.pokemonTypes[index].baseChance)/2) + 1;
			if(Game.HasAchiev("A Completed CreatureDex")){
				xp *= 2;
			}
			if(Math.random() < chance/100) {
				//success!
				Game.Win("Creature Amateur");
				AkaMod.blizzDays.catchSuccesses++;
				AkaMod.blizzDays.totalCatches++;
				if(AkaMod.blizzDays.totalCatches >= 100){
					Game.Win("Creature Hobbyist");
					if(AkaMod.blizzDays.totalCatches >= 1000){
						Game.Win("Creature Collector");
						if(AkaMod.blizzDays.totalCatches >= 2000){
							Game.Win("Creature Connoisseur");
							if(AkaMod.blizzDays.totalCatches >= 5000){
								Game.Win("Creature Authority");
							}
						}
					}
				}
				if(index === 0){
					AkaMod.blizzDays.caughtBunnies++;
					if(AkaMod.blizzDays.caughtBunnies >= 10){
						Game.Win("BlizzBlues: Bunny Fan");
						if(AkaMod.blizzDays.caughtBunnies >= 100){
							Game.Win("BlizzBlues: Bunny Farm");
							if(AkaMod.blizzDays.caughtBunnies >= 1000){Game.Win("BlizzBlues: Bunny Plantation");}
						}
					}
				}
				if(AkaMod.blizzDays.questType === 3) {
					AkaMod.updateQuestProgress(1);
				}
				//do we have this critter already?
				let hasPokemon = false;
				let hasMaxLevel=false;
				for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++) {
					if(AkaMod.blizzDays.pokemon[p].index === index) {
						hasPokemon = true;
						if(AkaMod.blizzDays.pokemon[p].level >= 99) {xp *= 4;hasMaxLevel=true;} //extra boost for max leveled creatures.
						break;
					}
				}
				if(!hasPokemon) {
					//get the new pokemon
					AkaMod.blizzDays.pokemon.push({index: index, form: 0, level: 1});
					Game.Notify("Captured " + AkaMod.pokemonTypes[index].name,"You have successfully captured " + AkaMod.pokemonTypes[index].name + " and earned " + xp + " XP!",AkaMod.pokemonTypes[index].icon);
					if(!Game.Has("Easy Creature Click") && AkaMod.blizzDays.pokemon.length >= 6){
						Game.Unlock("Easy Creature Click");
						Game.Upgrades["Easy Creature Click"].basePrice = 100 + Game.cookiesPsRaw * 60 * Math.pow(2, 10 - AkaMod.blizzDays.pokemon.length);
					}
					if(AkaMod.blizzDays.pokemon.length >= 6) {
						Game.Win("Filling Out Your CreatureDex");
						if(AkaMod.blizzDays.pokemon.length === 10 && AkaMod.blizzDays.nextDay === 10) {
							AkaMod.nextDay(11);
							Game.Popup("Preparing for the next Day of Blizz Blues...");
							Game.Win("A Full CreatureDex");
						}
						if(AkaMod.blizzDays.pokemon.length >= AkaMod.pokemonTypes.length - 1) {
							Game.Win("A Completed CreatureDex");
						}
					}
					if(index === 14){Game.Win("CreatureDex: Voideater");}
					if(index === 15){Game.Win("CreatureDex: Hungerer");}
					if(index === 16){Game.Win("CreatureDex: Chimera");}
					if(index === 17){Game.Win("CreatureDex: MISSINGNO");}
				} else {
					if(hasMaxLevel){
						Game.Notify("Success!","Since you already have a max level " + AkaMod.pokemonTypes[index].name + ", you released it into the wild and earned a bonus " + xp + " XP.",AkaMod.pokemonTypes[index].icon);
					} else {
						Game.Notify("Success!","Since you already have " + AkaMod.pokemonTypes[index].name + ", you released it into the wild and earned " + xp + " XP.",AkaMod.pokemonTypes[index].icon);
					}
				}
			} else {
				//fail to catch
				xp = Math.round(xp/2);
				Game.Popup("Failed to catch " + AkaMod.pokemonTypes[index].name + ", but your creatures still earned "+xp+" XP.");
				Game.Lock("Try to Catch " + AkaMod.pokemonTypes[index].name);
				if(AkaMod.blizzDays.catchAttempts > AkaMod.blizzDays.catchSuccesses * 4 && AkaMod.blizzDays.catchSuccesses > 30) {Game.Win("You Fail as Much as Ash Ketchum");}
			}
			AkaMod.blizzDays.xpEarned += xp;
			if(AkaMod.blizzDays.xpEarned >= 10000){
				Game.Win("BlizzBlues: A Bit of XP");
				if(AkaMod.blizzDays.xpEarned >= 50000){
					Game.Win("BlizzBlues: A Stack of XP");
					if(AkaMod.blizzDays.xpEarned >= 100000){
						Game.Win("BlizzBlues: A Pile of XP");
						if(AkaMod.blizzDays.xpEarned >= 200000){
							Game.Win("BlizzBlues: A Boatload of XP");
							if(AkaMod.blizzDays.xpEarned >= 400000){
								Game.Win("BlizzBlues: A Crapload of XP");
								if(AkaMod.blizzDays.xpEarned >= 800000){
									Game.Win("BlizzBlues: A Crapton of XP");
								}
							}
						}
					}
				}
			}
			for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++) {
				AkaMod.earnPokeXP(AkaMod.blizzDays.pokemon[p], xp);
			}
			let maxLevelCount = 0;
			for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++) {
				if(AkaMod.blizzDays.pokemon[p].level >= 99) {maxLevelCount++;}
			}
			if(maxLevelCount >= 10){
				Game.Win("All Creatures to 99");
				if(maxLevelCount >= 13){
					Game.Win("Really All Creatures to 99");
				}
			}
			//reset
			AkaMod.blizzDays.catchAttempts++;
			AkaMod.blizzDays.minClicks = 10;
			AkaMod.blizzDays.currentBait = -1;
			AkaMod.blizzDays.activePokemon = -1;
			AkaMod.blizzDays.clickCatchChance = 0;
			//unlock bait again.
			Game.Upgrades["Toast Bait"].lose();
			Game.Upgrades["Toast Bait"].basePrice = AkaMod.baitTypes[0].cost * Game.cookiesPsRaw;
			Game.Unlock("Toast Bait");
			if(AkaMod.blizzDays.catchAttempts >= 3) {
				Game.Upgrades["Pumpkin Bait"].lose();
				Game.Upgrades["Pumpkin Bait"].basePrice = AkaMod.baitTypes[1].cost * Game.cookiesPsRaw;
				Game.Unlock("Pumpkin Bait");
				if(AkaMod.blizzDays.catchAttempts >= 10) {
					Game.Upgrades["Cheeseburger Bait"].lose();
					Game.Upgrades["Cheeseburger Bait"].basePrice = AkaMod.baitTypes[2].cost * Game.cookiesPsRaw;
					Game.Unlock("Cheeseburger Bait");
					if(AkaMod.blizzDays.catchAttempts >= 30) {
						Game.Upgrades["Pizza Bait"].lose();
						Game.Upgrades["Pizza Bait"].basePrice = AkaMod.baitTypes[3].cost * Game.cookiesPsRaw;
						Game.Unlock("Pizza Bait");
						if(AkaMod.blizzDays.catchAttempts - AkaMod.blizzDays.catchSuccesses >= 30) {
							Game.Upgrades["Chocolate Cake Bait"].lose();
							Game.Upgrades["Chocolate Cake Bait"].basePrice = AkaMod.baitTypes[4].cost * Game.cookiesPsRaw;
							Game.Unlock("Chocolate Cake Bait");
						}
					}
				}
			}
			switch(AkaMod.blizzDays.catchAttempts) {
				case 3:
					Game.Popup("Unlocked Pumpkin Bait!");
					break;
				case 10:
					Game.Popup("Unlocked Cheeseburger Bait!");
					break;
				case 30:
					Game.Popup("Unlocked Pizza Bait!");
					break;
			}
		};
		//this pokemon is earning xp and leveling up and evolving.
		AkaMod.earnPokeXP=(pokemon, xp)=>{
			if(pokemon.level >= 99) {
				return; //nothing to do here.
			}
			if(pokemon.secret > 9) {
				xp = Math.floor(xp / 2); //secret creatures level up slower.
			}
			const pokemonType = AkaMod.pokemonTypes[pokemon.index];
			while(xp > 0) {
				xp -= pokemon.level;
				pokemon.level++; //always goes up at least 1 level.
				if(pokemon.level >= 99) {
					Game.Win("First Creature to 99");
					if(pokemonType.forms && pokemonType.forms.length > pokemon.form) {
						//evolve!
						let oldName = "";
						if(pokemon.form === 0) {
							oldName = pokemonType.name;
						} else {
							oldName = pokemonType.forms[pokemon.form - 1].name;
						}
						pokemon.form++;
						pokemon.level = 1;
						Game.Notify(oldName + " Evolved!", oldName + " gained enough XP to evolve into " + pokemonType.forms[pokemon.form - 1].name + "!", pokemonType.forms[pokemon.form - 1].icon);
						Game.Win("On the Origin of Creatures");
						let fullyEvolved = 0;
						for(let p = 0; p < AkaMod.blizzDays.pokemon.length; p++) {
							if(AkaMod.blizzDays.pokemon[p].forms && AkaMod.blizzDays.pokemon[p].form === AkaMod.blizzDays.pokemon[p].forms.length) {fullyEvolved++;}
						}
						if(fullyEvolved === 4) {Game.Win("Making Darwin Proud");}
					} else {
						xp = 0;//max level.
					}
				}
			}
		};
		//figure out the current odds of catching this creature. Returns a value from 0-100.
		AkaMod.chanceToCatch=(index)=>{
			const pokemonType = AkaMod.pokemonTypes[index];
			let catchChance = pokemonType.baseChance + AkaMod.blizzDays.clickCatchChance;
			if(AkaMod.blizzDays.currentBait >= 0) {
				catchChance += AkaMod.baitTypes[AkaMod.blizzDays.currentBait].chance;
			}
			catchChance += AkaMod.creatureChanceBoost();

			if(catchChance < 0) {
				return 0;
			} else if(catchChance > 100) {
				return 100;
			}
			return Math.round(catchChance * 100) / 100;
		};
		//gets the current catch boost from just your creatures;
		AkaMod.creatureChanceBoost=()=>{
			let catchChance = 0;
			for(let pokemon of AkaMod.blizzDays.pokemon) {
				catchChance += 1;
				catchChance += 3*(pokemon.level / 99);
				catchChance += 2*pokemon.form;
			}
			return Math.round(catchChance * 100) / 100;
		};
		//set the bait to use while trying to catch creatures.
		AkaMod.setBait=(bait)=>{
			Game.Upgrades["Toast Bait"].unlocked = 0;
			Game.Upgrades["Pumpkin Bait"].unlocked = 0;
			Game.Upgrades["Cheeseburger Bait"].unlocked = 0;
			Game.Upgrades["Pizza Bait"].unlocked = 0;
			Game.Upgrades["Chocolate Cake Bait"].unlocked = 0;
			Game.upgradesToRebuild=1;
			AkaMod.blizzDays.currentBait = bait;
			AkaMod.blizzDays.boughtBaits++;
			AkaMod.blizzDays.baitTime = 0;
			AkaMod.updatePokemonUpgrade();
			if(AkaMod.blizzDays.currentBait === 4){Game.Win("Discovered Chocolate Cake");}
			if(AkaMod.blizzDays.boughtBaits >= 100){
				Game.Win("Amatuer Baiter");
				if(AkaMod.blizzDays.boughtBaits >= 1000){
					Game.Win("Enthusiast Baiter");
					if(AkaMod.blizzDays.boughtBaits >= 2000){
						Game.Win("Professional Baiter");
						if(AkaMod.blizzDays.boughtBaits >= 5000){
							Game.Win("Master Baiter");
						}
					}
				}
			}
		}
		//updates the description on the active pokemon upgrade.
		AkaMod.updatePokemonUpgrade=()=>{
			if(AkaMod.blizzDays.activePokemon < 0) {
				return;
			}
			const name = AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].name;
			AkaMod.updateProgressBar(AkaMod.chanceToCatch(AkaMod.blizzDays.activePokemon), 100, "pokemonBar", "Chance To Catch " + name);
			const upgrd = Game.Upgrades["Try to Catch " + name];
			upgrd.ddesc = upgrd.desc = "Try to catch " + name + "! Increases CPS by "+(AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].secret?"4":"1")+"%<br />" + AkaMod.pokemonTypes[AkaMod.blizzDays.activePokemon].flavor + "<br /><br />"
				+ "Increases CPS by 1%. You have a " + AkaMod.chanceToCatch(AkaMod.blizzDays.activePokemon) + "% chance to catch this creature." 
				+ "Improve it by buying better bait, catching and leveling up more creatures, or clicking the big cookie.";
		};
		Game.storeBuyAll = () => {
			if (!Game.Has('Inspired checklist')) return false;
			for (var i in Game.UpgradesInStore){
				var me=Game.UpgradesInStore[i];
				//don't let the user accidentally try to buy all the boss things.
				if(me.name === "Belphegor Again" || me.name === "Mammon Again" || me.name === "Abaddon Again" || me.name === "Satan Again"
					|| me.name === "Asmodeus Again" || me.name === "Beelzebub Again" || me.name === "Lucifer Again"  || me.name === "Stan?" || me.name === "Angry Sundae"
					|| me.name === "Cookie Throw" || me.name === "Critical Cookie Throw" || me.name === "Counter" || me.name === "Cookie Shield" || me.name === "Summon Protective Grandma") {
					continue;
				}
				if (!me.isVaulted() && me.pool!='toggle' && me.pool!='tech') me.buy(1);
			}
		};
		//thanks to WoWHead for the images and HTML.
		AkaMod.equipmentTypes = [
			[ //helmet
				{name: "Dingy Plate Helmet", icon:"https://wow.zamimg.com/images/wow/icons/large/inv_helmet_03.jpg", url:"https://www.wowhead.com/item=90743", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 35</span><table width=\\\'100%\\\'><tr><td>Head</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>20 Armor</span><br>Durability 70 / 70</td></tr></table><table><tr><td>Requires Level 33<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>40</span> <span class=\\\'moneycopper\\\'>86</span></div></td></tr></table>'},
				{name: "Battered Jungle Hat", icon:"https://wow.zamimg.com/images/wow/icons/large/inv_helmet_50.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 5</span><table width=\\\'100%\\\'><tr><td>Head</td></table></td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>99</span></div></td></tr></table>'},
				{name: "Underworld Helm", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_helmet_15.jpg", html: '<table><tr><td><span class=\\\'q\\\'><br>Item Level 30</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Head</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>19 Armor</span><br><span>+8 [Strength or Intellect]</span><br><span>+11 Stamina</span><br><span class=\\\'q2\\\'>+7 Critical Strike</span><br>Durability 70 / 70</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>60</span> <span class=\\\'moneycopper\\\'>50</span></div></td></tr></table>'},
				{name: "Headdress of the Green Circle", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_helmet_09.jpg", html: '<table><tr><td><span class=\\\'q\\\'><br>Item Level 26</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Head</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>8 Armor</span><br><span>+7 [Agility or Intellect]</span><br><span>+10 Stamina</span><br><span class=\\\'q2\\\'>+8 Critical Strike</span><br>Durability 85 / 85</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>48</span> <span class=\\\'moneycopper\\\'>43</span></div></td></tr></table>'},
				{name: "Cap Of Writhing Malevolence", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_helm_leather_mawraid_d_01.jpg", html: '<table><tr><td><span class=\\\'q\\\'><br>Item Level 226</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Head</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>75 Armor</span><br><span>+81 [Agility or Intellect]</span><br><span>+149 Stamina</span><br><span class=\\\'q2\\\'>+92 Haste</span><br><span class=\\\'q2\\\'>+49 Versatility</span><br /><br><a href=\\\'/items/gems?filter=81;13;0\\\' class=\\\'socket-domination q0\\\'>Domination Socket</a><br /><br />Durability 100 / 100</td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=357349\\\' class=\\\'q2\\\'><span style=\\\'color: #20ff20\\\'>Bonus: Socket 3 Unholy Shards to gain Chaos Bane while in the Maw.<br /><br />Chaos Bane rips soul fragments from enemies, increasing your primary stat and dealing Shadow damage to them. Increases in effectiveness with more powerful Unholy Shards.</span></a></span><br>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>66</span> <span class=\\\'moneysilver\\\'>31</span> <span class=\\\'moneycopper\\\'>36</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Remnant of Ner\\\'zhul</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 2.61%</div></td></tr></table>'},
				{name: "The Emerald Dreamcatcher", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_helmet_81.jpg", html: '<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Head</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>16 Armor</span><br><span>+14 [Agility or Intellect]</span><br><span>+21 Stamina</span><br><span class=\\\'q2\\\'>+10 Critical Strike</span><br><span class=\\\'q2\\\'>+18 Mastery</span><br>Durability 120 / 120<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=11\\\' class=\\\'c11\\\'>Druid</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=208190\\\' class=\\\'q2\\\'>Starsurge reduces the Astral Power cost of your Starsurges by 5 for 5 sec. Stacks up to 2 times.</a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;Ysera dreams and the world trembles.&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>11</span> <span class=\\\'moneysilver\\\'>63</span> <span class=\\\'moneycopper\\\'>17</span></div></td></tr></table>'},
			],
			[//shoulder
				{name: "Sun-Baked Shoulderpads", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_08.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 35</span><table width=\\\'100%\\\'><tr><td>Shoulder</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>8 Armor</span><br>Durability 70 / 70</td></tr></table><table><tr><td>Requires Level 35<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>41</span> <span class=\\\'moneycopper\\\'>63</span></div></td></tr></table>'},
				{name: "War Paint Shoulder Pads", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_07.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 14</span><table width=\\\'100%\\\'><tr><td>Shoulder</td><th><span class=\\\'q1\\\'>Mail</span></th></tr></table><span>6 Armor</span><br>Durability 60 / 60</td></tr></table><table><tr><td>Requires Level 8<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>6</span> <span class=\\\'moneycopper\\\'>10</span></div></td></tr></table>'},
				{name: "Glorious Shoulder Pads", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_20.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 28</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Shoulder</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>17 Armor</span><br><span>+5 [Strength or Intellect]</span><br><span>+8 Stamina</span><br>Durability 70 / 70</td></tr></table><table><tr><td>Requires Level 22<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>51</span> <span class=\\\'moneycopper\\\'>12</span></div></td></tr></table>'},
				{name: "Black Rook Elite Shoulderplates", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_plate_lordravencrest_b_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 164</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Shoulder</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>111 Armor</span><br><span>+34 [Strength or Intellect]</span><br><span>+54 Stamina</span><br><span class=\\\'q2\\\'>+46 Critical Strike</span><br><span class=\\\'q2\\\'>+27 Mastery</span></td></tr></table><table><tr><td>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>48</span> <span class=\\\'moneysilver\\\'>32</span> <span class=\\\'moneycopper\\\'>17</span></div></td></tr></table>'},
				{name: "Pauldrons of Infinite Darkness", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_plate_nzothraid_d_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 95</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Shoulder</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>48 Armor</span><br><span>+34 [Strength or Intellect]</span><br><span>+48 Stamina</span><br>Durability 100 / 100<br /><br></td></tr></table><table><tr><td>Requires Level 50<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>57</span> <span class=\\\'moneysilver\\\'>19</span> <span class=\\\'moneycopper\\\'>31</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Fury of N\\\'Zoth</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 5.62%</div></td></tr></table>'},
				{name: "Echoes of the Great Sundering", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shoulder_plate_raidwarrior_j_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Shoulder</td><th><span class=\\\'q1\\\'>Mail</span></th></tr></table><span>22 Armor</span><br><span>+11 [Agility or Intellect]</span><br><span>+16 Stamina</span><br><span class=\\\'q2\\\'>+9 Haste</span><br><span class=\\\'q2\\\'>+12 Mastery</span><br>Durability 120 / 120<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=7\\\' class=\\\'c7\\\'>Shaman</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=208722\\\' class=\\\'q2\\\'>Earth Shock has up to a 50% chance, based on Maelstrom spent, to cause your next Earthquake to be free and deal 100% increased damage.</a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;10,000 years ago, the Well of Eternity imploded. The effects are still felt today.&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>11</span> <span class=\\\'moneysilver\\\'>28</span> <span class=\\\'moneycopper\\\'>15</span></div></td></tr></table>'},
			],
			[//chest
				{name: "Ragged Leather Vest", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_shirt_05.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 2</span><table width=\\\'100%\\\'><tr><td>Chest</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>3 Armor</span><br>Durability 60 / 60</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>11</span></div></td></tr></table>'},
				{name: "Battered Leather Harness", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_chest_leather_04.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 5</span><table width=\\\'100%\\\'><tr><td>Chest</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>3 Armor</span><br>Durability 75 / 75</td></tr></table><table><tr><td>Requires Level 3<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>1</span> <span class=\\\'moneycopper\\\'>39</span></div></td></tr></table>'},
				{name: "Glorious Breastplate", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate03.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 29</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Chest</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>25 Armor</span><br><span>+7 [Strength or Intellect]</span><br><span>+11 Stamina</span><br>Durability 115 / 115</td></tr></table><table><tr><td>Requires Level 23<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>74</span> <span class=\\\'moneycopper\\\'>80</span></div></td></tr></table>'},
				{name: "Breastplate of Many Graces", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate11.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 32</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Chest</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>27 Armor</span><br><span>+8 [Strength or Intellect]</span><br><span>+12 Stamina</span><br><span class=\\\'q2\\\'>+10 Versatility</span><br>Durability 140 / 140</td></tr></table><table><tr><td>Requires Level 27<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>1</span> <span class=\\\'moneysilver\\\'>15</span> <span class=\\\'moneycopper\\\'>95</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Grandmaster Vorpil</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 17.87%</div></td></tr></table>'},
				{name: "Cuirass of the Lonely Citadel", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate_mawraid_d_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 226</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Chest</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>222 Armor</span><br><span>+81 [Strength or Intellect]</span><br><span>+149 Stamina</span><br><span class=\\\'q2\\\'>+95 Haste</span><br><span class=\\\'q2\\\'>+47 Versatility</span><br /><br><a href=\\\'/items/gems?filter=81;13;0\\\' class=\\\'socket-domination q0\\\'>Domination Socket</a><br /><br />Durability 165 / 165</td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=357347\\\' class=\\\'q2\\\'><span style=\\\'color: #20ff20\\\'>Bonus: Socket 3 Blood Shards to gain Blood Link while in the Maw.<br /><br />Blood Link drains health from your enemies and redistributes it to you and your allies. Increases in effectiveness with more powerful Blood Shards.</span></a></span><br>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>88</span> <span class=\\\'moneysilver\\\'>57</span> <span class=\\\'moneycopper\\\'>83</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Remnant of Ner\\\'zhul</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 1.49%</div></td></tr></table>'},
				{name: "Ekowraith, Creator of Worlds", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_chest_leather_13.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Chest</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>22 Armor</span><br><span>+14 [Agility or Intellect]</span><br><span>+21 Stamina</span><br><span class=\\\'q2\\\'>+10 Critical Strike</span><br><span class=\\\'q2\\\'>+10 Haste</span><br><span class=\\\'q2\\\'>+18 Mastery</span><br>Durability 200 / 200<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=11\\\' class=\\\'c11\\\'>Druid</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=210667\\\' class=\\\'q2\\\'>Increase the effects of Thick Hide, Astral Influence, Feline Swiftness, and Ysera\\\'s Gift by 75%.</a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;We could not only evoke, but conjure a place of our own. And that everywhere... that has ever existed... it was all in service of our dream. Now please... Hear what I hear.&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>16</span> <span class=\\\'moneysilver\\\'>30</span> <span class=\\\'moneycopper\\\'>28</span></div></td></tr></table>'},
			],
			[//glove
				{name: "Worn Leather Gloves", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_18.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 3</span><table width=\\\'100%\\\'><tr><td>Hands</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>2 Armor</span><br>Durability 20 / 20</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>13</span></div></td></tr></table>'},
				{name: "Platemail Gloves", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_29.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 26</span><table width=\\\'100%\\\'><tr><td>Hands</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>12 Armor</span><br>Durability 40 / 40</td></tr></table><table><tr><td>Requires Level 20<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>15</span> <span class=\\\'moneycopper\\\'>31</span></div></td></tr></table>'},
				{name: "Baleheim Gloves", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_53.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 32</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Hands</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>15 Armor</span><br><span>+6 [Strength or Intellect]</span><br><span>+9 Stamina</span><br>Durability 40 / 40</td></tr></table><table><tr><td>Requires Level 27<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>50</span> <span class=\\\'moneycopper\\\'>91</span></div></td></tr></table>'},
				{name: "Faith Bearers Gauntlets", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_30.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 31</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Hands</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>15 Armor</span><br><span>+6 [Strength or Intellect]</span><br><span>+9 Stamina</span><br><span class=\\\'q2\\\'>+8 Critical Strike</span><br><span class=\\\'q2\\\'>+3 Haste</span><br /><br><a href=\\\'/items/gems?filter=81;9;0\\\' class=\\\'socket-prismatic q0\\\'>Prismatic Socket</a><br><a href=\\\'/items/gems?filter=81;9;0\\\' class=\\\'socket-prismatic q0\\\'>Prismatic Socket</a><br><span class=\\\'q0\\\'>Socket Bonus: +1 Critical Strike</span><br /><br />Durability 50 / 50</td></tr></table><table><tr><td>Requires Level 26<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>53</span> <span class=\\\'moneycopper\\\'>73</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Pandemonius</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 8.48%</div></td></tr></table>'},
				{name: "Reinforced Seaweave Gloves", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_glove_cloth_nazjatarraid_d_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 82</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Hands</td><th><span class=\\\'q1\\\'>Cloth</span></th></tr></table><span>10 Armor</span><br><span>+16 Intellect</span><br><span>+28 Stamina</span><br /><br><a href=\\\'/items/gems?filter=81;9;0\\\' class=\\\'socket-prismatic q0\\\'>Prismatic Socket</a><br /><br />Durability 55 / 55</td></tr></table><table><tr><td>Requires Level 50<br>Requires <a href=\\\'/skill=2533\\\' class=\\\'q1\\\'>Kul Tiran Tailoring</a> (165)<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>38</span> <span class=\\\'moneysilver\\\'>76</span> <span class=\\\'moneycopper\\\'>91</span></div></td></tr></table>'},
				{name: "Smoldering Heart", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_gauntlets_85.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Hands</td><th><span class=\\\'q1\\\'>Mail</span></th></tr></table><span>18 Armor</span><br><span>+11 [Agility or Intellect]</span><br><span>+16 Stamina</span><br><span class=\\\'q2\\\'>+11 Haste</span><br><span class=\\\'q2\\\'>+10 Mastery</span><br>Durability 70 / 70<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=7\\\' class=\\\'c7\\\'>Shaman</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=248029\\\' class=\\\'q2\\\'>You have a <br /><br /><span class=\\\'q2\\\'><span class=\\\'tooltip-inside-icon\\\' style=\\\'background-image: url(//wow.zamimg.com/images/wow/icons/small/spell_shaman_improvedstormstrike.jpg)\\\'></span> Enhancement (Level 20)</span><br /><span class=\\\'q9\\\'>0.12%</span><br /><br /><span class=\\\'q2\\\'><span class=\\\'tooltip-inside-icon\\\' style=\\\'background-image: url(//wow.zamimg.com/images/wow/icons/small/spell_nature_lightning.jpg)\\\'></span> Elemental, <span class=\\\'tooltip-inside-icon\\\' style=\\\'background-image: url(//wow.zamimg.com/images/wow/icons/small/spell_nature_magicimmunity.jpg)\\\'></span> Restoration</span><br /><span class=\\\'q9\\\'>0.10%</span><br /><br /> chance per Maelstrom spent to gain Ascendance for 10 sec.</a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;The essence of thousands of fiery elementals have been imbued in these gloves, yet they are strangely cool to the touch.&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>8</span> <span class=\\\'moneysilver\\\'>27</span> <span class=\\\'moneycopper\\\'>29</span></div></td></tr></table>'},
			],
			[//belt
				{name: "Moldy Leather Belt", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_belt_22.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 29</span><table width=\\\'100%\\\'><tr><td>Waist</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>6 Armor</span><br>Durability 40 / 40</td></tr></table><table><tr><td>Requires Level 25<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>15</span> <span class=\\\'moneycopper\\\'>17</span></div></td></tr></table>'},
				{name: "Veteran Girdle", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_belt_05.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 7</span><table width=\\\'100%\\\'><tr><td>Waist</td><th><span class=\\\'q1\\\'>Mail</span></th></tr></table><span>3 Armor</span><br>Durability 30 / 30</td></tr></table><table><tr><td>Requires Level 4<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>1</span> <span class=\\\'moneycopper\\\'>55</span></div></td></tr></table>'},
				{name: "Hyperion Girdle", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_belt_28.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 29</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Waist</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>14 Armor</span><br><span>+6 [Strength or Intellect]</span><br><span>+8 Stamina</span><br>Durability 40 / 40</td></tr></table><table><tr><td>Requires Level 23<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>35</span> <span class=\\\'moneycopper\\\'>81</span></div></td></tr></table>'},
				{name: "Waistcord of Dark Devotion", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_belt_leather_oribosdungeon_c_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 158</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Waist</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>40 Armor</span><br><span>+32 [Agility or Intellect]</span><br><span>+53 Stamina</span><br><span class=\\\'q2\\\'>+29 Versatility</span><br><span class=\\\'q2\\\'>+41 Mastery</span><br>Durability 55 / 55</td></tr></table><table><tr><td>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>31</span> <span class=\\\'moneysilver\\\'>48</span> <span class=\\\'moneycopper\\\'>83</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Lord Chamberlain</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 8.39%</div></td></tr></table>'},
				{name: "Korthite Crystal Waistguard", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_mail_mawraid_d_01_buckle.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 226</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Waist</td><th><span class=\\\'q1\\\'>Mail</span></th></tr></table><span>83 Armor</span><br><span>+61 [Agility or Intellect]</span><br><span>+112 Stamina</span><br><span class=\\\'q2\\\'>+75 Haste</span><br><span class=\\\'q2\\\'>+31 Mastery</span><br /><br><a href=\\\'/items/gems?filter=81;13;0\\\' class=\\\'socket-domination q0\\\'>Domination Socket</a><br /><br />Durability 55 / 55</td></tr></table><table><tr><td>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>1</span></div></td></tr></table>'},
				{name: "Cord of Infinity", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_belt_44c.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Waist</td><th><span class=\\\'q1\\\'>Cloth</span></th></tr></table><span>7 Armor</span><br><span>+11 Intellect</span><br><span>+16 Stamina</span><br><span class=\\\'q2\\\'>+12 Critical Strike</span><br><span class=\\\'q2\\\'>+9 Mastery</span><br>Durability 70 / 70<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=8\\\' class=\\\'c8\\\'>Mage</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=281263\\\' class=\\\'q2\\\'>Increases damage done by Arcane Missiles by 10%.</a></span><br><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=209311\\\' class=\\\'q2\\\'><span style=\\\'color: #808080\\\'>Each time Arcane Missiles hits an enemy, the damage of your next Mark of Aluneth is increased by 1.0%. This effect stacks.</span></a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;The magic contained inside seems to be as endless as the Burning Legion.&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>8</span> <span class=\\\'moneysilver\\\'>19</span> <span class=\\\'moneycopper\\\'>48</span></div></td></tr></table>'},
			],
			[//leg
				{name: "Ripped Ogre Loincloth", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_pants_wolf.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 5</span><table width=\\\'100%\\\'><tr><td>Legs</td><th><span class=\\\'q1\\\'>Cloth</span></th></tr></table><span>2 Armor</span><br>Durability 55 / 55</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>89</span></div></td></tr></table>'},
				{name: "Tattered Cloth Pants", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_pants_12.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 2</span><table width=\\\'100%\\\'><tr><td>Legs</td><th><span class=\\\'q1\\\'>Cloth</span></th></tr></table><span>1 Armor</span><br>Durability 45 / 45</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>17</span></div></td></tr></table>'},
				{name: "Vanguard Legplates", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_pants_03.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 28</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Legs</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>21 Armor</span><br><span>+11 Stamina</span><br><span class=\\\'q2\\\'>+17 Versatility</span><br>Durability 85 / 85</td></tr></table><table><tr><td>Requires Level 22<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>68</span> <span class=\\\'moneycopper\\\'>53</span></div></td></tr></table>'},
				{name: "Abyssal Disharmony Breeches", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_pant_leather_oribosdungeon_c_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 158</span><br>Binds when picked up<table width=\\\'100%\\\'><tr><td>Legs</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>62 Armor</span><br><span>+43 [Agility or Intellect]</span><br><span>+70 Stamina</span><br><span class=\\\'q2\\\'>+34 Haste</span><br><span class=\\\'q2\\\'>+58 Versatility</span><br>Durability 120 / 120</td></tr></table><table><tr><td>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>64</span> <span class=\\\'moneysilver\\\'>69</span> <span class=\\\'moneycopper\\\'>88</span></div></td></tr></table>'},
				{name: "Bonded Soulsmelt Greaves", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_mail_mawraid_d_01_pants.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 226</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Legs</td><th><span class=\\\'q1\\\'>Mail</span></th></tr></table><span>129 Armor</span><br><span>+81 [Agility or Intellect]</span><br><span>+149 Stamina</span><br><span class=\\\'q2\\\'>+49 Critical Strike</span><br><span class=\\\'q2\\\'>+93 Versatility</span><br>Durability 120 / 120</td></tr></table><table><tr><td>Requires Level 60<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>89</span> <span class=\\\'moneysilver\\\'>23</span> <span class=\\\'moneycopper\\\'>97</span></div></td></tr></table>'},
				{name: "Pillars of the Dark Portal", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_pants_cloth_raidwarlock_i_01.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Legs</td><th><span class=\\\'q1\\\'>Cloth</span></th></tr></table><span>11 Armor</span><br><span>+14 Intellect</span><br><span>+21 Stamina</span><br><span class=\\\'q2\\\'>+16 Critical Strike</span><br><span class=\\\'q2\\\'>+10 Haste</span><br><span class=\\\'q2\\\'>+12 Mastery</span><br>Durability 145 / 145<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=9\\\' class=\\\'c9\\\'>Warlock</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=217519\\\' class=\\\'q2\\\'>Demonic Gateway now casts instantly and you can use Demonic Gateways twice before triggering a cooldown.</a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;Corrupted by the demonlord Sargeras, Medivh contacted the orc warlock Gul\\\'dan and together they opened the Dark Portal, allowing the Burning Legion to begin its invasion of Azeroth.&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>15</span> <span class=\\\'moneysilver\\\'>17</span> <span class=\\\'moneycopper\\\'>38</span></div></td></tr></table>'},
			],
			[//boot
				{name: "Frayed Shoes", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_09.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 2</span><table width=\\\'100%\\\'><tr><td>Feet</td><th><span class=\\\'q1\\\'>Cloth</span></th></tr></table><span>1 Armor</span><br>Durability 30 / 30</td></tr></table><table><tr><td><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>9</span></div></td></tr></table>'},
				{name: "Gray Fur Booties", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_05.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 4</span><table width=\\\'100%\\\'><tr><td>Feet</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>2 Armor</span><br>Durability 35 / 35</td></tr></table><table><tr><td>Requires Level 2<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneycopper\\\'>58</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Ravenous Darkhound</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 0.09%</div></td></tr></table>'},
				{name: "Bloodforged Sabatons", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_02.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 25</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Feet</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>14 Armor</span><br><span>+5 [Strength or Intellect]</span><br><span>+7 Stamina</span><br>Durability 55 / 55</td></tr></table><table><tr><td>Requires Level 18<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>36</span> <span class=\\\'moneycopper\\\'>87</span></div></td></tr></table>'},
				{name: "Grim Sabatons", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_plate_06.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 30</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Feet</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>16 Armor</span><br><span>+6 [Strength or Intellect]</span><br><span>+9 Stamina</span><br>Durability 65 / 65</td></tr></table><table><tr><td>Requires Level 25<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneysilver\\\'>73</span> <span class=\\\'moneycopper\\\'>73</span></div><div class=\\\'whtt-extra whtt-droppedby\\\'>Dropped by: Doomsayer Jurim</div><div class=\\\'whtt-extra whtt-dropchance\\\'>Drop Chance: 26.25%</div></td></tr></table>'},
				{name: "Voidforged Greaves", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_chain_08.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 32</span><br>Binds when equipped<table width=\\\'100%\\\'><tr><td>Feet</td><th><span class=\\\'q1\\\'>Plate</span></th></tr></table><span>17 Armor</span><br><span>+6 [Strength or Intellect]</span><br><span>+9 Stamina</span><br><span class=\\\'q2\\\'>+12 Critical Strike</span></td></tr></table><table><tr><td>Requires Level 27<div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>1</span> <span class=\\\'moneysilver\\\'>14</span> <span class=\\\'moneycopper\\\'>83</span></div></td></tr></table>'},
				{name: "Kirel Narak", icon: "https://wow.zamimg.com/images/wow/icons/large/inv_boots_leather_dungeonleather_c_06.jpg", html:'<table><tr><td><span class=\\\'q\\\'><br>Item Level 50</span><br>Binds when picked up<br>Unique-Equipped: Legion Legendary (1)<table width=\\\'100%\\\'><tr><td>Feet</td><th><span class=\\\'q1\\\'>Leather</span></th></tr></table><span>14 Armor</span><br><span>+11 [Agility or Intellect]</span><br><span>+16 Stamina</span><br><span class=\\\'q2\\\'>+8 Versatility</span><br><span class=\\\'q2\\\'>+14 Mastery</span><br>Durability 95 / 95<div class=\\\'wowhead-tooltip-item-classes\\\'>Classes: <a href=\\\'/class=12\\\' class=\\\'c12\\\'>Demon Hunter</a></div></td></tr></table><table><tr><td><span class=\\\'q2\\\'>Equip: <a href=\\\'/spell=210970\\\' class=\\\'q2\\\'>The instant initial damage from your Immolation Aura reduces the remaining cooldown on Fiery Brand by 2 sec for each enemy hit.</a></span><br>Requires Level 40<br><span class=\\\'q\\\'>&quot;Witness the flames that have consumed countless worlds. All will burn in the legion\\\'s fire!&quot;</span><div class=\\\'whtt-sellprice\\\'>Sell Price: <span class=\\\'moneygold\\\'>12</span> <span class=\\\'moneysilver\\\'>21</span> <span class=\\\'moneycopper\\\'>9</span></div></td></tr></table>'},
			]
		];
		//render a piece of equipment on the stats page. Props to WowHead. HTML was copied from them and tweaked.
		AkaMod.renderEquipment=(slot, flip)=>{
			const equipment = AkaMod.blizzDays.equipment[slot];
			if(equipment < 0){
				return "[Empty Slot]";
			}
			const equipmentType = AkaMod.equipmentTypes[slot][equipment];
			let classString = "";
			if(flip && slot !== 3){
				//if(flip && slot===3){classString += "flippedVertical";}
				classString = "class='flipped'";
				if(slot === 6 && equipment === 5){
					classString = "";
				}
			} else if(slot === 6 && equipment === 5){
				classString = "class='flipped'";
			} 
			if(slot === 3){
				//special rendering rule for gloves to get them oriented right.
				if(flip){
					switch(equipment){
						case 2: 
							classString = "class='flippedBoth'";
							break;
						case 1: case 3:
							classString = "class='flippedVertical'";
							break;
						case 4: case 5:
							break;
						default:
							classString = "class='flipped'";
							break;
					}
				} else {
					switch(equipment){
						case 2:
							classString = "class='flippedVertical'";
							break;
						case 1: case 3:
							classString = "class='flippedBoth'";
							break;
						case 4: case 5:
							classString = "class='flipped'";
							break;
					}
				}
			}
			return "<span "+classString+" style='border: 2px solid "+AkaMod.getEquipmentColor(equipment)+";border-radius:3px;display: inline-block;width:56px;height:56px;background-image:url("+equipmentType.icon+")' " 
				+ Game.getDynamicTooltip("(temp = function(){return \'<div style=\\\'width:"+(130 + 20 * equipment)+"px\\\'><span class=\\\'q"+equipment+"\\\'>"+equipmentType.name+"</span>"+equipmentType.html+"</div>\';})", 'this') +"/>";
		};
		AkaMod.getEquipmentColor=(level)=>{
			switch(level) {
				case 1:
					return "white";
				case 2:
					return "green";
				case 3:
					return "#0070dd";
				case 4:
					return "#a335ee";
				case 5:
				case 6:
					return "#ff8000";
			}
			return "gray";
		};
		AkaMod.initFarmingTweaks=()=>{
			if(!Game.Objects['Farm'].minigame){
				setTimeout(AkaMod.initFarmingTweaks, 100);
				return;
			}
			AkaMod.oldFarmUseTool = Game.Objects['Farm'].minigame.useTool;
			Game.Objects['Farm'].minigame.useTool=function(what,x,y){
				const outcome = AkaMod.oldFarmUseTool(what, x, y);
				if(AkaMod.blizzDays.questType === 1 && outcome){
					AkaMod.updateQuestProgress(1);
				}
				return outcome;
			};
			AkaMod.oldFarmHarvest = Game.Objects['Farm'].minigame.harvest;
			Game.Objects['Farm'].minigame.harvest = function(x,y,manual){
				if(AkaMod.blizzDays.questType === 1){
					AkaMod.updateQuestProgress(1);
				}
				AkaMod.oldFarmHarvest(x,y,manual);
			};
		}
		AkaMod.initFarmingTweaks();
		//generates the quest goal and sets it on the upgrade.
		AkaMod.prepareQuest=()=>{
			AkaMod.blizzDays.questTarget = 0;
			AkaMod.blizzDays.questStart = 0;
			AkaMod.blizzDays.questType = Math.floor(Math.random() * 7);
			switch(AkaMod.blizzDays.questType){
				case 0: //cookie clicks;
					AkaMod.blizzDays.questTarget = (1 + AkaMod.blizzDays.completedQuests) * 5;
					AkaMod.blizzDays.questDesc = "Click the Big Cookie " + AkaMod.blizzDays.questTarget + " times.";
					break;
				case 1: //farm
					AkaMod.blizzDays.questTarget = 1 + Math.floor(AkaMod.blizzDays.completedQuests/6);
					AkaMod.blizzDays.questDesc = "Plant or Harvest in the farm " + AkaMod.blizzDays.questTarget + " times.";
					break;
				case 2: //golden cookies;
					AkaMod.blizzDays.questTarget = 1 + Math.floor(AkaMod.blizzDays.completedQuests/7);
					AkaMod.blizzDays.questDesc = "Click " + AkaMod.blizzDays.questTarget + " Golden Cookies.";
					break;
				case 3: //catch pokemon
					AkaMod.blizzDays.questTarget = 1 + Math.ceil(AkaMod.blizzDays.completedQuests / 2);
					AkaMod.blizzDays.questDesc = "Catch " + AkaMod.blizzDays.questTarget + " Creatures.";
					break;
				case 4: //cast spells
					AkaMod.blizzDays.questTarget = 1 + Math.floor(AkaMod.blizzDays.completedQuests / 5);
					AkaMod.blizzDays.questDesc = "Cast " + AkaMod.blizzDays.questTarget + " Spells.";
					break;
				case 5: //sell idleverse
					AkaMod.blizzDays.questTarget = 1 + Math.floor(AkaMod.blizzDays.completedQuests / 10);
					AkaMod.blizzDays.questDesc = "Sell Idleverses " + AkaMod.blizzDays.questTarget + " times";
					break;
				case 6: //Pet sundae
					AkaMod.blizzDays.questTarget = (1 + AkaMod.blizzDays.completedQuests) * 2;
					AkaMod.blizzDays.questDesc = "Pet Sundae " + AkaMod.blizzDays.questTarget + " times";
					break;

			}
			Game.Lock("Start A Quest");
			Game.Unlock("Start A Quest");
			Game.Upgrades["Start A Quest"].ddesc = Game.Upgrades["Start A Quest"].desc = "Start a Quest: " + AkaMod.blizzDays.questDesc;
		};
		AkaMod.oldIdleverseSell=Game.Objects["Idleverse"].sellFunction;
		Game.Objects["Idleverse"].sellFunction=function(){
			AkaMod.updateQuestProgress(1);
			if(AkaMod.oldIdleverseSell){
				AkaMod.oldIdleverseSell();
			}
		};
		AkaMod.startQuest=()=>{
			AkaMod.updateProgressBar(AkaMod.blizzDays.questStart, AkaMod.blizzDays.questTarget, "questBar", AkaMod.blizzDays.questDesc);
			Game.Popup(AkaMod.blizzDays.questDesc);
		};
		AkaMod.getGearValue=()=>{
			let value = 0;
			for(var i = 0; i < AkaMod.blizzDays.equipment.length; i++){
				value += AkaMod.blizzDays.equipment[i] + 1;
			}
			return value;
		};
		//completes a quest and get a reward.
		AkaMod.completeQuest=()=>{
			AkaMod.blizzDays.completedQuests++;
			AkaMod.blizzDays.totalQuests++;
			if(AkaMod.blizzDays.completedQuests === 11 && AkaMod.blizzDays.nextDay === 11) {
				AkaMod.nextDay(12);
			}
			if(AkaMod.blizzDays.totalQuests >= 20){
				Game.Win("BlizzBlues: Quest Newb");
				if(AkaMod.blizzDays.totalQuests >= 100){
					Game.Win("BlizzBlues: Quest Amatuer");
					if(AkaMod.blizzDays.totalQuests >= 200){
						Game.Win("BlizzBlues: Quest Professional");
						if(AkaMod.blizzDays.totalQuests >= 500){
							Game.Win("BlizzBlues: Quest Expert");
							if(AkaMod.blizzDays.totalQuests >= 1000){
								Game.Win("BlizzBlues: Quest Master");
							}
						}
					}
				}
			}
			AkaMod.hideProgressBar("questBar");
			AkaMod.blizzDays.questType = -1;
			AkaMod.blizzDays.questTimer = 5 * AkaMod.blizzDays.completedQuests + 30;
			//reward
			let slot = Math.floor(Math.random()*8);
			let amount = 1;
			if(slot != 7 && AkaMod.blizzDays.equipment[slot] >= AkaMod.equipmentTypes[slot].length - 1) {
				slot = 7; //no equipment to get here.
				amount = 2; //buff cookies to make up for not getting equipment.
			}
			if(slot === 7){
				amount *= AkaMod.getGearValue() * Game.cookiesPsRaw * AkaMod.blizzDays.completedQuests;
				if(Game.HasAchiev("13 Days of Blizz Blues, 8th Run")){
					amount *= 2;
				}
				Game.Earn(amount);
				Game.Popup("Earned " + Beautify(amount, 0) + " cookies!");
				AkaMod.blizzDays.questCookies += amount;
			} else {
				AkaMod.blizzDays.equipment[slot]++;
				Game.Popup("Earned <span style='color:"+AkaMod.getEquipmentColor(AkaMod.blizzDays.equipment[slot])+"'>[" + AkaMod.equipmentTypes[slot][AkaMod.blizzDays.equipment[slot]].name + "]</span>!");
				switch(AkaMod.blizzDays.equipment[slot]){
					case 1: Game.Win("BlizzBlues: Your First Common Gear Piece"); break;
					case 2: Game.Win("BlizzBlues: Your First Uncommon Gear Piece"); break;
					case 3: Game.Win("BlizzBlues: Your First Rare Gear Piece"); break;
					case 4: Game.Win("BlizzBlues: Your First Epic Gear Piece"); break;
					case 5: Game.Win("BlizzBlues: Your First Legendary Gear Piece"); break;
				}
				let minEquipmentTier = 10;
				for(let e=0; e < AkaMod.blizzDays.equipment.length;e++){
					minEquipmentTier = Math.min(minEquipmentTier, AkaMod.blizzDays.equipment[e]);
				}
				switch(minEquipmentTier){
					case 0: Game.Win("BlizzBlues: Poor Gear Set"); break;
					case 1: Game.Win("BlizzBlues: Common Gear Set"); break;
					case 2: Game.Win("BlizzBlues: Uncommon Gear Set"); break;
					case 3: Game.Win("BlizzBlues: Rare Gear Set"); break;
					case 4: Game.Win("BlizzBlues: Epic Gear Set"); break;
					case 5: Game.Win("BlizzBlues: Legendary Gear Set"); break;
				}
			}
		};
		//update quest progress and the UI when something happens..
		AkaMod.updateQuestProgress=(amount)=>{
			if(!Game.Has("Start A Quest") || AkaMod.blizzDays.questStart >= AkaMod.blizzDays.questTarget){
				return;
			}
			AkaMod.blizzDays.questStart += amount;
			AkaMod.updateProgressBar(AkaMod.blizzDays.questStart, AkaMod.blizzDays.questTarget, "questBar", AkaMod.blizzDays.questDesc);
			if(AkaMod.blizzDays.questStart >= AkaMod.blizzDays.questTarget) {
				Game.Lock("Complete A Quest");
				Game.Unlock("Complete A Quest");
				AkaMod.hideProgressBar("questBar");
			}
		};
		AkaMod.oldAscend=Game.Ascend;
		Game.Ascend=function(bypass){
			if(Game.Has(AkaMod.Month12Upgrade) && AkaMod.blizzDays.nextDay === 12 && !Game.Has("The 13th Day of Blizz Blues?")){
				Game.Prompt('<h3>Ascend</h3><div class="block">Unable to Ascend<div class=\"line\"></div>You are currently locked into a 12-month contract and are unable to ascend.<div class=\"line\"></div>For more information, please check the contract on the Stats page.',[["Okay",'Game.ClosePrompt();']]);
			} else {
				AkaMod.oldAscend(bypass);
			}
		};
		AkaMod.break12MonthContract=()=>{
			Game.Prompt("Would you like to end your 12-month contract? You will keep your CPS bonus, but lose the Beta Access, your Mount, and your free copy of Diablo 3.", [["Not Yet", 'Game.ClosePrompt();'], ["Yes", 'Game.ClosePrompt();AkaMod.nextDay(13);']]);
		};
		//starts the final day of blizz blues
		AkaMod.startFinalDay=()=>{
			const url = "https://machinex7.github.io/akamikebccmod/audio/12days.mp3";
			if (typeof Sounds[url]==='undefined'){
				Sounds[url]=new Audio(url);
				Sounds[url].onloadeddata=AkaMod.startFinalDay;
				return;
			}
			PlaySound(url);
			AkaMod.PlaySound = PlaySound; //disable for a bit.
			PlaySound = ()=>{};

			setTimeout(()=>AkaMod.finalDayTick(1),1000);
			if(AkaMod.songData){
				return;
			}
			AkaMod.songData = [];
			AkaMod.songData[9] = {count: 1, icons: [[14,8]]};
			AkaMod.songData[18] = {count: 2, icons: [[1, 10]]};
			AkaMod.songData[26] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[36] = {count: 4, icons: [[26, 11]]};
			AkaMod.songData[38] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[49] = {duration: 3, icons: [[25, 12]]};
			AkaMod.songData[53] = {count: 4, icons: [[26, 11]]};
			AkaMod.songData[54] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[56] = {count: 2, icons: [[1, 10]]};
			AkaMod.songData[59] = {count: 1, icons: [[14,8]]};
			AkaMod.songData[66] = {count: 6, icons: [[7,11],[8,11],[9,11],[10,11],[11,11],[12,11]]};
			AkaMod.songData[69] = {count: 1, icons: [[9,9]]};
			AkaMod.songData[60+14] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+15] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+17] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+18] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+25] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+27] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+28] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+29] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[60+31] = {count: 6, icons: [[7,11],[8,11],[9,11],[10,11],[11,11],[12,11]]};
			AkaMod.songData[60+32] = {duration: 3, icons: [[25, 12]]};
			AkaMod.songData[60+36] = {count: 4, icons: [[26, 11]]};
			AkaMod.songData[60+38] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[60+39] = {count: 2, icons: [[1, 10]]};
			AkaMod.songData[60+41] = {duration: 2, icons: [[14, 8]]};
			AkaMod.songData[60+50] = {count: 1, icons: [[13,8]]};
			AkaMod.songData[60+58] = {duration: 8, icons: [[8, 22]]};
			AkaMod.songData[126] = {count: 1, icons: [[13,8]]};
			AkaMod.songData[127] = {count: 2, icons: [[22,12]]};
			AkaMod.songData[128] = {count: 6, icons: [[7,11],[8,11],[9,11],[10,11],[11,11],[12,11]]};
			AkaMod.songData[120+10] = {duration: 2, icons: [[25, 12]]};
			AkaMod.songData[120+13] = {count: 4, icons: [[26, 11]]};
			AkaMod.songData[120+15] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[120+16] = {count: 2, icons: [[1, 10]]};
			AkaMod.songData[120+18] = {count: 1, icons: [[14,8]]};
			AkaMod.songData[120+25] = {count: 10, icons: [[0,12],[18,4],[14,8],[13,8],[15,8],[26,11],[31,20],[12,7],[19,8],[0,11]]};
			AkaMod.songData[120+32] = {duration: 1, icons: [[8, 22]]};
			AkaMod.songData[120+33] = {count: 1, icons: [[13,8]]};
			AkaMod.songData[120+34] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[120+36] = {count: 6, icons: [[7,11],[8,11],[9,11],[10,11],[11,11],[12,11]]};
			AkaMod.songData[120+37] = {duration: 3, icons: [[25, 12]]};
			AkaMod.songData[120+41] = {count: 4, icons: [[26, 11]]};
			AkaMod.songData[120+42] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[120+44] = {count: 2, icons: [[1, 10]]};
			AkaMod.songData[120+46] = {duration: 2, icons: [[14, 8]]};
			AkaMod.songData[120+54] = {duration: 3, icons: [[1,7],[0,7]]};
			AkaMod.songData[181] = {count: 10, icons: [[0,12],[18,4],[14,8],[13,8],[15,8],[26,11],[31,20],[12,7],[19,8],[0,11]]};
			AkaMod.songData[182] = {count: 1, icons: [[8, 22]]};
			AkaMod.songData[183] = {count: 1, icons: [[13,8]]};
			AkaMod.songData[185] = {count: 1, icons: [[22,12]]};
			AkaMod.songData[186] = {count: 6, icons: [[7,11],[8,11],[9,11],[10,11],[11,11],[12,11]]};
			AkaMod.songData[187] = {duration: 3, icons: [[25, 12]]};
			AkaMod.songData[180+11] = {count: 4, icons: [[26, 11]]};
			AkaMod.songData[180+12] = {count: 3, icons: [[0, 12]]};
			AkaMod.songData[180+14] = {count: 2, icons: [[1, 10]]};
			AkaMod.songData[180+16] = {duration: 2, icons: [[14, 8]]};
			AkaMod.songData[180+24] = {duration: 8, icons: [[15,9]]};
		};
		//particles for the 13th day
		Game.shimmerTypes.blizz13 = {
			reset:()=>{},
			spawnsOnTimer:false,
			spawned:0,
			missFunc:function(me){},
			popFunc:function(me){
				let toEarn = Game.cookiesPsRaw * (1 + AkaMod.blizzDays.finaleClicks/10);
				if(Game.HasAchiev("13 Days of Blizz Blues, 10th Run")){
					toEarn *= 8;
				}
				Game.Earn(toEarn);
				Game.Popup("Earned " + Beautify(toEarn) + " Cookies");
				AkaMod.blizzDays.finaleClicks++;
				if(AkaMod.blizzDays.finaleClicks >= 248){Game.Win("Crazy Blizz Blues Clicker");}
				me.die();
			},
			updateFunc:function(me){ //copied from orteil's reindeer
				me.l.style.transform='translate('+(me.x+(Game.bounds.right-Game.bounds.left)*(1-me.life/(Game.fps*me.dur)))+'px,'+(me.y-Math.abs(Math.sin(me.life*0.1))*128)+'px) rotate('+(Math.sin(me.life*0.2+0.3)*10)+'deg) scale('+(me.sizeMult*(1+Math.sin(me.id*0.53)*0.1))+')';
				me.life--;
				if (me.life<=0) {
					this.missFunc(me);me.die();
				}
			},
			initFunc:function(me){
				me.x=-96;
				me.y=(Game.bounds.bottom-Game.bounds.top)/2 + 24 - (Math.random()*48);
				me.l.style.height = me.l.style.width = '96px';
				me.l.style.backgroundImage='url(img/icons.png?v='+Game.version+')';
				me.l.style.display='block';
				me.l.style.opacity="1";
				me.l.style.backgroundPosition=(-96*me.forceObj.icon[0]) + "px " + (-96*me.forceObj.icon[1]) + "px";
				me.l.style.backgroundSize=(1632*2) + "px " + (1632*2) + "px";
				me.l.style.cursor="pointer";
				
				me.dur=6;//duration; the cookie's lifespan in seconds before it despawns
				me.life=Math.ceil(Game.fps*(me.dur+(me.forceObj.offset)));
				me.sizeMult=1;
			}
		};
		Game.shimmerTypes.bbBunny={
			reset:()=>{},
			spawnsOnTimer:false,
			spawned:0,
			missFunc:function(me){},
			popFunc:function(me){
				let toEarn = Game.cookiesPsRaw * (1 + AkaMod.blizzDays.caughtBunnies/1000);
				Game.Earn(toEarn);
				Game.Popup("Earned " + Beautify(toEarn) + " Cookies");
				AkaMod.blizzDays.caughtBunnies++;
				me.die();
				if(Math.random() < 0.75){
					let spawnNewBunnies = Math.ceil(Math.random() * 4);
					for(;spawnNewBunnies > 0; spawnNewBunnies--){
						new Game.shimmer("bbBunny",{icon: spawnNewBunnies%4, offset: spawnNewBunnies / 2});
					}
				}
				if(AkaMod.blizzDays.caughtBunnies >= 100){
					Game.Win("BlizzBlues: Bunny Farm");
					if(AkaMod.blizzDays.caughtBunnies >= 1000){Game.Win("BlizzBlues: Bunny Plantation");}
				}
			},
			updateFunc:function(me){ //copied from orteil's reindeer
				const jumpHeight = 256;
				me.l.style.transform='translate('+(me.x+(Game.bounds.right-Game.bounds.left)*(1-me.life/(Game.fps*me.dur)))+'px,'+(me.y-Math.abs(Math.sin(me.life*0.1))*jumpHeight)+'px) rotate('+(Math.sin(me.life*0.2+0.3)*10)+'deg) scale('+(me.sizeMult*(1+Math.sin(me.id*0.53)*0.1))+')';
				me.life--;
				if (me.life<=0) {
					this.missFunc(me);me.die();
				}
			},
			initFunc:function(me){
				me.x=-96;
				me.y=(Game.bounds.bottom-Game.bounds.top)/2 + 24 - (Math.random()*48);
				me.l.style.height = me.l.style.width = '96px';
				me.l.style.backgroundImage='url(img/bunnies.png)';
				me.l.style.display='block';
				me.l.style.opacity="1";
				me.l.style.backgroundPosition=(-96*me.forceObj.icon) + "px 0px";
				//me.l.style.backgroundSize="96px 96px";
				me.l.style.cursor="pointer";
				
				me.dur=6;//duration; the cookie's lifespan in seconds before it despawns
				me.life=Math.ceil(Game.fps*(me.dur+(me.forceObj.offset)));
				me.sizeMult=1;
			}
		};
		//handles determining if we spawn a particle.
		AkaMod.finalDayTick=(time)=>{
			if(time >= 180+36) {
				Playsound = AkaMod.PlaySound;
				buff=Game.gainBuff('cookie storm',20,7); //3:36 start cookie storm
				setTimeout(()=>{Game.Popup("A Merry Christmas to all, and to all a good night!");}, 15000)
				AkaMod.blizzDays.completions++;
				switch(AkaMod.blizzDays.completions){
					case 1: Game.Win("13 Days of Blizz Blues"); break;
					case 2: Game.Win("13 Days of Blizz Blues Again"); break;
					case 3: Game.Win("13 Days of Blizz Blues, 3rd Run"); break;
					case 4: Game.Win("13 Days of Blizz Blues, 4th Run"); break;
					case 5: Game.Win("13 Days of Blizz Blues, 5th Run"); break;
					case 6: Game.Win("13 Days of Blizz Blues, 6th Run"); break;
					case 6: Game.Win("13 Days of Blizz Blues, 7th Run"); break;
					case 8: Game.Win("13 Days of Blizz Blues, 8th Run"); break;
					case 10: Game.Win("13 Days of Blizz Blues, 10th Run"); break;
					case 12: Game.Win("13 Days of Blizz Blues, 12th Run"); break;
				}
			} else {
				setTimeout(()=>AkaMod.finalDayTick(time+1),1000);
				if(AkaMod.songData[time]) {
					const songFrame = AkaMod.songData[time];
					let count = 1;
					let rate = 1;
					if(songFrame.count) {
						count = songFrame.count;
						rate = 1 / count;
						songFrame.duration = 1;
					} else {
						rate = 3;
						count = songFrame.duration * rate;
						rate = 1 / rate;
					}
					for(let i=0; i<count; i++){
						new Game.shimmer("blizz13",{icon: songFrame.icons[i % songFrame.icons.length], offset: (i * rate)});
					}
				}
			}
		}
	},

	//Register any custom buffs.
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
		new Game.buffType('scratch',function(time){
			return {
				name:'Scratch',
				desc:'Sundae scratched you! CPS reduced by 25%.',
				icon:[18,17],
				time:time*Game.fps,
				add:true,
				multCpS:0.75,
				aura:2
			};
		});
		new Game.buffType('purr',function(time){
			return {
				name:'Purring',
				desc:'Sundae enjoyed her treat! Clicks multiplied by 4.',
				icon:[18,13],
				time:time*Game.fps,
				add:true,
				multClick:4,
				aura:0
			};
		});
		new Game.buffType('gross',function(time){
			return {
				name:'Gross',
				desc:'You saw... things. And touched... things. In fact, you probably shouldn\'t use your finger for a little while.',
				icon:[9,11],
				time:time*Game.fps,
				add:true,
				multClick:-0.5,
				aura:2
			};
		});
		new Game.buffType('blahblah',function(time){
			return {
				name:'Oh my gosh please stop talking.',
				desc:'Click bonus increased by 100% to help pass the time, but CPS decreased by 5% out of boredom. And yes, it is 90 minutes.',
				icon:[28,7],
				time:time*Game.fps,
				add:true,
				multCpS:0.95,
				multClick:2
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

		//Sundae!
		AkaMod.Upgrade("Sundae!","Unlocks Sundae!<q>It's a KITTY KAT</q>",999999999000,[18,0]);
		AkaMod.Upgrade("Good Kitty","Pets give twice as many cookies!",99999999900000,[18,1], () => {AkaMod.sundaeData.cookieGains *= 2});
		AkaMod.Upgrade("Very Good Kitty","Pets give twice as many cookies!",9999999990000000,[18,2], () => {AkaMod.sundaeData.cookieGains *= 2});
		AkaMod.Upgrade("Very Very Good Kitty","Pets give twice as many cookies!",999999999000000000,[18,13], () => {AkaMod.sundaeData.cookieGains *= 2});
		AkaMod.Upgrade("The Best Kitty","Pets give twice as many cookies!",99999999900000000000,[18,14], () => {AkaMod.sundaeData.cookieGains *= 2});
		AkaMod.Upgrade("Filed Claws","Lose fewer cookies per scratch.<q>It still hurts, but not as bad.</q>",cnum(999,'qa'),[28,6], () => {AkaMod.sundaeData.scratchLoss=3});
		AkaMod.Upgrade("Sadistic","Sundae no longer loses contentment when she scratches you.<q>Is she... smiling?</q>",cnum(999,'qa'),[28,6]);
		AkaMod.Upgrade("Content Kitty","Max Contentment increases by 5%.",cnum(99.9,'qi'),[18,13], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Happy Kitty","Max Contentment increases by another 5%.",cnum(.999,'qa'),[18,14], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Happier Kitty","Max Contentment increases by another 5%!",cnum(9.99,'qa'),[18,18], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Happiest Kitty","Max Contentment increases by another 5%!",cnum(99.9,'qa'),[18,19], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Cat Toy","Sundae's mood recovers faster.",cnum(99.9,'qi'),[31,15], () => {AkaMod.sundaeData.moodRecovery++;});
		AkaMod.Upgrade("Cat Food","Sundae's mood recovers even faster.",cnum(.999,'sx'),[33,3], () => {AkaMod.sundaeData.moodRecovery++;});
		AkaMod.Upgrade("Sundae's Gift","Sundae has a rare chance to offer you this strange gift. It increases her mood regeneration under certain circumstances.",cnum(999,'qi'),[16,9]);
		AkaMod.Upgrade("Sundae's Secret Gift","Increases Sundae's max mood based on your prestige level.",cnum(999,'qi'),[16,9], () => {AkaMod.sundaeData.maxMood += Math.round(Math.log10(Game.prestige)) + 1;});
		AkaMod.Upgrade("Sundae's Super Secret Gift","Increases Sundae pet bonuses based on your akamikeb fan level.",cnum(999,'sx'),[16,9], () => {Game.Win("Sundae's Presents");});
		//TODO add upgrades that increase the max petting bonus from consecutive pets. But they require a bunch of fast pets in a short time.
		//TODO add sundae poop mechanic.

		//12 Days of Blizz Blues
		AkaMod.Upgrade("Rogue Only Legendary!","+1% CPS.<q>On the first day of Christmas, Blizzard gave to meeeee...</q>",cnum(1, "m"),[14,8], ()=>{AkaMod.nextDay(2)});
		AkaMod.Upgrade("Double Bladed Lightsabers","+2% CPS, 1 for each blade.<q>On the second day of Christmas, SWOTR gave to me-</q>",cnum(1, "b"),[1,10], ()=>{AkaMod.nextDay(3)});
		//3 bunnies
		AkaMod.Upgrade("First Bouncing Bunny","+1% CPS.<q>On the third day of Christmas, Blizzard gave to me-</q>",cnum(1, "t"),[0,12], ()=>{AkaMod.bunnyUpgrade()});
		AkaMod.Upgrade("Second Bouncing Bunny","+1% CPS.<q>And they ain't fake.</q>",cnum(1, "t"),[0,12], ()=>{AkaMod.bunnyUpgrade()});
		AkaMod.Upgrade("Third Bouncing Bunny","+1% CPS.<q>Boing, boing.</q>",cnum(1, "t"),[0,12], ()=>{AkaMod.bunnyUpgrade()});
		//4 holo dancers
		AkaMod.Upgrade("First Holo Dancer","+1% CPS.<q></q>",cnum(500, "t"),[26,11], ()=>{AkaMod.holoDancerUpgrade()});
		AkaMod.Upgrade("Second Holo Dancer","+1% CPS.<q></q>",cnum(500, "t"),[26,11], ()=>{AkaMod.holoDancerUpgrade()});
		AkaMod.Upgrade("Third Holo Dancer","+1% CPS.<q></q>",cnum(500, "t"),[26,11], ()=>{AkaMod.holoDancerUpgrade()});
		AkaMod.Upgrade("Fourth Holo Dancer","+1% CPS.<q></q>",cnum(500, "t"),[26,11], ()=>{AkaMod.holoDancerUpgrade()});
		//5 moonguard server
		AkaMod.Upgrade("Connect to Moonguard Server","<q>Mooooonguard RPEEEEEEE!</q>",cnum(21, "qa"),[21,1], ()=>{
			Game.Popup("Connecting to server, please wait...");
			setTimeout(()=>{
				Game.Unlock("Travel to Goldshire");
				Game.Popup("Connected");
			}, 4000);
		});
		AkaMod.Upgrade("Travel to Goldshire","<q>Wasup.</q>",cnum(21, "qa"),[21,1], ()=>{
			Game.Popup("Traveling to Goldshire, please wait...");
			setTimeout(()=>{
				Game.Popup("Almost there...");
			}, 5000);
			setTimeout(()=>{
				Game.Unlock("Enter the Lion's Pride Inn");
				Game.Popup("Welcome to Goldshire!");
			}, 10000);
		});
		AkaMod.Upgrade("Enter the Lion's Pride Inn","+5% CPS, but you might see some things you regret.<q>Wasup.</q>",cnum(21, "qa"),[21,1], ()=>{
			AkaMod.nextDay(6);
			Game.gainBuff('gross',120);
			Game.Win("Moonguard Survivor");
		});
		Game.RequiresConfirmation(Game.last, '<h3>Warning</h3><div class="block">Are you sure you want to enter the Goldshire Lion\'s Pride Inn?</div>');
		//6 re-used boss models
		AkaMod.Upgrade("Belphegor Again","+1% CPS, but starts a boss fight against Belphegor.<q>A demon of shortcuts and laziness.</q>",cnum(1, "qa"),[7,11], ()=>{AkaMod.startBoss(1)});
		AkaMod.Upgrade("Mammon Again","+1% CPS, but starts a boss fight against Mammon.<q>The demonic emodiment of wealth.</q>",cnum(2, "qa"),[8,11], ()=>{AkaMod.startBoss(2)});
		AkaMod.Upgrade("Abaddon Again","+1% CPS, but starts a boss fight against Abaddon.<q>Master of overindulgence.</q>",cnum(3, "qa"),[9,11], ()=>{AkaMod.startBoss(3)});
		AkaMod.Upgrade("Satan Again","+1% CPS, but starts a boss fight against Satan.<q>The counterpoint to everything righteous.</q>",cnum(4, "qa"),[10,11], ()=>{AkaMod.startBoss(4)});
		AkaMod.Upgrade("Asmodeus Again","+1% CPS, but starts a boss fight against Asmodeus.<q>This demon with three heads.</q>",cnum(5, "qa"),[11,11], ()=>{AkaMod.startBoss(5)});
		AkaMod.Upgrade("Beelzebub Again","+1% CPS, but starts a boss fight against Beelzebub.<q>The festering incarnation of blight and disease.</q>",cnum(6, "qa"),[12,11], ()=>{AkaMod.startBoss(6)});
		AkaMod.Upgrade("Lucifer Again","Secret Boss! +2% CPS, but starts a difficult boss fight against Lucifer.<q>Also known as Lightbringer.</q>",cnum(1000, "qa"),[13,11], ()=>{AkaMod.startBoss(7)});
		AkaMod.Upgrade("Stan?","+2% CPS, but starts a boss fight against... Stan?<q>Satan's little-known kid brother. Both are in the Soul-Tormenting business, but Stan decided to go the corporate route.</q>",cnum(666, "sx"),[1,33], ()=>{AkaMod.startBoss(8)});
		AkaMod.Upgrade("Angry Sundae","Now you've gone and done it. Sundae's pissed. This will be a VERY tricky fight.",cnum(900, "sx"),[18,17], ()=>{AkaMod.startBoss(9)});
		//abilities to use with bosses.
		AkaMod.Upgrade("Cookie Throw","Attack the Boss.",cnum(1, "m"),[1,5], ()=>{AkaMod.fightBoss("attack")});
		AkaMod.Upgrade("Critical Cookie Throw","Critically Attack the Boss!",cnum(1, "m"),[3,5], ()=>{AkaMod.fightBoss("crit")});
		AkaMod.Upgrade("Counter","Counter the boss's attack.",cnum(1, "m"),[22,7], ()=>{AkaMod.fightBoss("counter")});
		AkaMod.Upgrade("Cookie Shield","Block the boss's attack.",cnum(1, "m"),[7,10], ()=>{AkaMod.fightBoss("block")});
		AkaMod.Upgrade("Summon Protective Grandma","Deals damage over time",cnum(1, "m"),[10,9], ()=>{AkaMod.fightBoss("dot")});
		//7 Thesaurus
		AkaMod.Upgrade("Thesaurus","Want to increase CPS by 7%?<q>Absolutely.</q>",cnum(100, "qa"),[22,12], ()=>{AkaMod.absolPrompt(1);AkaMod.nextDay(8);});
		Game.RequiresConfirmation(Game.last, '<h3>Warning</h3><div class="block">Are you Absolutely sure you want to buy this upgrade?</div>');
		//8 coming soon
		AkaMod.Upgrade("Exciting New Feature!","Brand new features that will revolutionize your Cookie Clicker experience! Including a 8% CPS boost!<q>Finally completed after months of development, countless user requests and cutting edge features!</q>",cnum(1, "qi"),[1,7], ()=>{AkaMod.comingSoonUpdate()});
		//9 90 minutes of unneccesary commentary.
		AkaMod.Upgrade("90 Minutes of Unneccesary Commentary So You Can Like, Go And Kill Some Swamp Rats And Stuff.","Increases CPS by 9%.<q>Blah blah blah blah blah.</q>- Random SWTOR Guy", cnum(10, "qi"), [8,15], ()=>{
			AkaMod.nextDay(10);
			Game.gainBuff('blahblah',60*90);
		});
		//10 Pandas And Pokemon
		AkaMod.Upgrade("Pandas And Pokemon","<q>Boom.</q>",cnum(100, "qi"),[31,13], ()=>{
			Game.Unlock("Toast Bait");
			Game.Prompt("<div class='block'>Click the Big Cookie repeatedly to discover wild <span style='text-decoration: line-through'>pokemon</span> non-copyright infringing creatures that boost your CPS!<br />Click the Big Cookie, collect and level up your creatures, and buy bait to improve your odds of catching them.<br />Catch all 10 to move on!</div>", [["Got it!", 'Game.ClosePrompt();']])
		});
		for(let p = 0; p < AkaMod.pokemonTypes.length; p++) {
			const pokemonType = AkaMod.pokemonTypes[p];
			AkaMod.Upgrade("Try to Catch " + pokemonType.name,"Gotta catch em all.",cnum(1, "qi"),pokemonType.icon, ()=>{AkaMod.tryCatch(p)});
		}
		for(let b = 0; b < AkaMod.baitTypes.length; b++){
			const baitType = AkaMod.baitTypes[b];
			AkaMod.Upgrade(baitType.name,baitType.desc,cnum(1, "qi"),baitType.icon, ()=>{AkaMod.setBait(b)});
		}
		AkaMod.Upgrade("Easy Creature Click","This upgrade unlocks a button on the Stats page to instantly spawn a random creature for you to catch! The price decreases as you catch more creatures.",cnum(1, "sx"),[22,7]);		
		//11 WoW Reskin
		AkaMod.Upgrade("WoW Reskin with Voices and Lightsabers.","Minus the voices and lightsabers.",cnum(1000, "qi"),[1,7], ()=>{AkaMod.blizzDays.questTimer = 5;});
		AkaMod.Upgrade("Start A Quest","Start a random new quest.",333000000,[1,7], ()=>{AkaMod.startQuest()});
		AkaMod.Upgrade("Complete A Quest","Turn in your Quest and get a reward!",11,[0,7], ()=>{AkaMod.completeQuest()});
		//12
		AkaMod.Month12Upgrade = "A 12 month contract locking you into a 7 year old game paying over $150 for beta access that everyone else gets for free, a midget mount, and a copy of Diablo 3.";
		AkaMod.Upgrade(AkaMod.Month12Upgrade, "+12% CPS, but you can't Prestige for 1 year unless you break your contract!",cnum(10000, "qi"),[15,9]);
		//13
		AkaMod.Upgrade("The 13th Day of Blizz Blues?", "+13% CPS. Turn up your audio!",cnum(10000, "qi"),[17,9], ()=>{AkaMod.startFinalDay()});
		Game.RequiresConfirmation(Game.last, '<h3>Check your audio</h3><div class="block">Make sure you have your audio up. Are you ready to continue?</div>');

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
		AkaMod.Achievement("An Entire Stream", "Watched 3 hours of Mike stream without closing Cookie Clicker!", [0,10]);
		AkaMod.Achievement("Glued To The Screen", "Watched 12 hours of Mike stream without closing Cookie Clicker!!", [1,10]);
		AkaMod.Achievement("Is This... Mike?", "Watched 24 hours of Mike stream without closing Cookie Clicker!!!", [17,5]);

		//Sundae!
		AkaMod.Achievement("Pet Owner", "Pet Sundae!", [18,0]);
		AkaMod.Achievement("Pet Petter", "Pet Sundae 200 Times", [18,1]);
		AkaMod.Achievement("Petting Pet Petter", "Pet Sundae 2000 Times", [18,2]);
		AkaMod.Achievement("Petting Pet Petter Who Pets Pets", "Pet Sundae 20000 Times", [18,13]);
		AkaMod.Achievement("She Likes You!", "Pet Sundae 50 Times Without Getting Scratched", [18,14]);
		AkaMod.Achievement("Do You Even Like Cats?", "Hit 0% Contentment.", [29,6]);
		AkaMod.Achievement("Sundae Bloody Sundae", "Get Scratched 200 Times", [11,8]);
		AkaMod.Achievement("Risky Moves", "Pet Successfully With Less Than 10% Contentment", [1,7]);
		AkaMod.Achievement("Nothing But The Best For My Kitty", "Spend a Sugar Lump on Sundae", [29,21]);
		AkaMod.Achievement("Smokin Sundae", "Why Are Sundae's Eyes Red?", [18, 32]);
		AkaMod.Achievement("Tokin Sundae", "Sundae's Eyes Are Very Red.", [18, 32]);
		AkaMod.Achievement("Sundae's Presents", "Collected All Of Sundae's Gifts", [16, 9]);

		//12 days of blizz blues
		AkaMod.Achievement("Moonguard Survivor", "Passed the Moonguard Day of Christmas", [21, 1]);
		AkaMod.Achievement("Christmas Boss Fighter", "Defeat your first Boss", [7, 11]);
		AkaMod.Achievement("Christmas Boss Conqueror", "Defeat all Bosses", [12, 11]);
		AkaMod.Achievement("Defeated Lucifer", "Unlocked and beat the secret boss Lucifer", [13, 11]);
		AkaMod.Achievement("Defeated Stan", "Unlocked and beat the secret boss... Stan?", [1, 33]);
		AkaMod.Achievement("Pacified Sundae", "Sundae is appeased... for now.", [18, 17]);
		AkaMod.Achievement("Christmas Boss Professional", "Perfectly defeat a boss without any extranous actions.", [8, 13]);
		AkaMod.Achievement("Christmas Boss Mastery", "Perfectly defeat all bosses without any extranous actions.", [8, 14]);
		AkaMod.Achievement("Christmas Boss Proficiency", "Perfectly defeat all bosses, including the secret bosses, without any extranous actions.", [8, 15]);
		AkaMod.Achievement("A Squad of Christmas Bosses", "Beat 20 total Bosses", [8, 11]);
		AkaMod.Achievement("A Platoon of Christmas Bosses", "Beat 50 total Bosses", [9, 11]);
		AkaMod.Achievement("A Company of Christmas Bosses", "Beat 100 total Bosses", [10, 11]);
		AkaMod.Achievement("A Battalion of Christmas Bosses", "Beat 200 total Bosses", [11, 11]);
		//creatures
		AkaMod.Achievement("Creature Amateur", "Caught your first Creature", [0, 12]);
		AkaMod.Achievement("Filling Out Your CreatureDex", "Caught 6 Unique Creatures", [21, 7]);
		AkaMod.Achievement("A Full CreatureDex", "Caught All Known Creatures", [32, 33]);
		AkaMod.Achievement("A Completed CreatureDex", "Caught All Known and Secret Creatures! Doubles your XP gains.", [22, 12]);
		AkaMod.Achievement("CreatureDex: Voideater", "Caught the Voideater", [21,25]);
		AkaMod.Achievement("CreatureDex: Hungerer", "Caught the Hungerer", [21, 32]);
		AkaMod.Achievement("CreatureDex: Chimera", "Caught the Chimera", [24, 7]);
		AkaMod.Achievement("CreatureDex: MISSINGNO", "Caught the SDG*@!$!^(DGS[", [0, 7]);
		AkaMod.Achievement("Creature Hobbyist", "Caught 100 total Creatures", [2, 6]);
		AkaMod.Achievement("Creature Collector", "Caught 1000 total Creatures", [3, 6]);
		AkaMod.Achievement("Creature Connoisseur", "Caught 2000 total Creatures", [4, 6]);
		AkaMod.Achievement("Creature Authority", "Caught 5000 total Creatures", [5, 6]);
		AkaMod.Achievement("Discovered Chocolate Cake", "Bought the Chocolate Cake Bait", [25, 27]);
		AkaMod.Achievement("Amatuer Baiter", "Bought 100 Baits", [27, 10]);
		AkaMod.Achievement("Enthusiast Baiter", "Bought 1000 Baits", [16, 8]);
		AkaMod.Achievement("Professional Baiter", "Bought 2000 Baits", [28, 30]);
		AkaMod.Achievement("Master Baiter", "Bought 5000 Baits. You knew this achievement was coming.", [31, 9]);
		AkaMod.Achievement("First Creature to 99", "One of your creatures hit Max Level for the first time", [12, 5]);
		AkaMod.Achievement("All Creatures to 99", "Max Leveled your 10 creatures", [13, 5]);
		AkaMod.Achievement("Really All Creatures to 99", "Max Leveled all 13 creatures", [14, 5]);
		AkaMod.Achievement("On the Origin of Creatures", "Evolved a creature for the first time", [22, 12]);
		AkaMod.Achievement("Making Darwin Proud", "Evolved all creatures to their highest level.", [1, 33]);
		AkaMod.Achievement("BlizzBlues: A Bit of XP", "Collect 10,000 XP", [4, 5]);
		AkaMod.Achievement("BlizzBlues: A Stack of XP", "Collect 50,000 XP", [5, 5]);
		AkaMod.Achievement("BlizzBlues: A Pile of XP", "Collect 100,000 XP", [6, 5]);
		AkaMod.Achievement("BlizzBlues: A Boatload of XP", "Collect 200,000 XP", [7, 5]);
		AkaMod.Achievement("BlizzBlues: A Crapload of XP", "Collect 400,000 XP", [8, 5]);
		AkaMod.Achievement("BlizzBlues: A Crapton of XP", "Collect 800,000 XP", [8, 5]);
		AkaMod.Achievement("BlizzBlues: Bunny Farm", "Captured 100 Bunnies", [0, 12]);
		AkaMod.Achievement("BlizzBlues: Bunny Plantation", "Captured 1000 Bunnies", [0, 12]);
		AkaMod.Achievement("You Fail as Much as Ash Ketchum", "Have a LOT more failures catches than successes. Like, a lot. Really bad. Honestly, if you have this achievement, you should just feel ashamed.", [13, 9]);
		//gear and quests
		AkaMod.Achievement("BlizzBlues: Poor Gear Set", "Have at least a Poor rarity equipment in each slot.", [4, 23]);
		AkaMod.Achievement("BlizzBlues: Common Gear Set", "Have at least a Common rarity equipment in each slot.", [4, 0]);
		AkaMod.Achievement("BlizzBlues: Uncommon Gear Set", "Have at least a Uncommon rarity equipment in each slot.", [4, 19]);
		AkaMod.Achievement("BlizzBlues: Rare Gear Set", "Have at least a Rare rarity equipment in each slot.", [4, 20]);
		AkaMod.Achievement("BlizzBlues: Epic Gear Set", "Have at least a Epic rarity equipment in each slot.", [4, 21]);
		AkaMod.Achievement("BlizzBlues: Legendary Gear Set", "Have at least a Legendary rarity equipment in each slot.", [4, 31]);
		AkaMod.Achievement("BlizzBlues: Your First Common Gear Piece", "Get your first piece of Common gear.", [4, 0]);
		AkaMod.Achievement("BlizzBlues: Your First Uncommon Gear Piece", "Get your first piece of Uncommon gear.", [4, 19]);
		AkaMod.Achievement("BlizzBlues: Your First Rare Gear Piece", "Get your first piece of Rare gear.", [4, 20]);
		AkaMod.Achievement("BlizzBlues: Your First Epic Gear Piece", "Get your first piece of Epic gear.", [4, 21]);
		AkaMod.Achievement("BlizzBlues: Your First Legendary Gear Piece", "Get your first piece of Legendary gear.", [4, 31]);
		AkaMod.Achievement("BlizzBlues: Quest Newb", "Complete 20 BlizzBlues Quests", [0, 10]);
		AkaMod.Achievement("BlizzBlues: Quest Amatuer", "Complete 100 BlizzBlues Quests", [1, 10]);
		AkaMod.Achievement("BlizzBlues: Quest Professional", "Complete 200 BlizzBlues Quests", [2, 10]);
		AkaMod.Achievement("BlizzBlues: Quest Expert", "Complete 500 BlizzBlues Quests", [3, 10]);
		AkaMod.Achievement("BlizzBlues: Quest Master", "Complete 1000 BlizzBlues Quests", [4, 10]);
		//for completing the 13 days of christmas.
		AkaMod.Achievement("Crazy Blizz Blues Clicker", "Clicked all the bouncing icons during the finale!", [12, 0]);
		AkaMod.Achievement("13 Days of Blizz Blues", "Completed the 13 days of Blizz Blues! What will happen if you complete it again?", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues Again", "Bosses further increase CPS based on how quickly you defeated them.", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 3rd Run", "Halves the time for each Blizz Blues day to occur.", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 4th Run", "+50% CPS bonus from EACH Blizz Blues upgrade.", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 5th Run", "Halves the time again for each Blizz Blues day to occur.", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 6th Run", "CPS Increased by your creature catch chance.", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 7th Run", "CPS Increased by your Item Level.", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 8th Run", "Increased Cookie rewards from completing quests!", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 10th Run", "Greatly increased rewards for the Blizz Blues finale!", [17, 9]);
		AkaMod.Achievement("13 Days of Blizz Blues, 12th Run", "CPS bonus from Blizz Blues upgrades are now DOUBLE their original value.", [17, 9]);

		//rank silliness
		AkaMod.Achievement("Streamer Rank 7000", "Ranked up to 7000!", [28,6]);
		AkaMod.Achievement("Streamer Rank 6000", "Ranked up to 6000!", [21,2]);
		AkaMod.Achievement("Streamer Rank 5000", "Ranked up to 5000!", [22,2]);
		AkaMod.Achievement("Streamer Rank 4000", "Ranked up to 4000!", [23,2]);
		AkaMod.Achievement("Streamer Rank 3000", "Ranked up to 3000!", [24,2]);
		AkaMod.Achievement("Streamer Rank 2000", "Ranked up to 2000!", [25,2]);
		AkaMod.Achievement("Streamer Rank 1000", "Ranked up to 1000!", [26,2]);
		AkaMod.Achievement("Streamer Rank 100", "Ranked up to 100!", [27,2]);
		AkaMod.Achievement("Streamer Rank 10", "Ranked up to 10!", [28,2]);
		AkaMod.Achievement("Streamer Rank 1!", "Ranked up to 1!", [29,2]);

		//misc
		AkaMod.Achievement("BlizzBlues: Bunny Fan", "Captured 10 Bunnies", [0, 12]);
		Game.Achievements["BlizzBlues: Bunny Fan"].order = Game.Achievements["BlizzBlues: Bunny Farm"].order - 0.001;

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
		str += AkaMod.streamData.lastStream + ";";
		str += AkaMod.streamData.minutesWatched + ";";
		str += AkaMod.streamData.rank;

		//sundae!
		str += "|";
		str += JSON.stringify(AkaMod.sundaeData);

		//blizzdays
		str += "|";
		str += JSON.stringify(AkaMod.blizzDays);
		str += "|";
		str += JSON.stringify(AkaMod.blizzDays.pokemon);
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
			if(strarr.length < 3) {
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
			AkaMod.streamData.minutesWatched=loadHelper(vars, 2);
			AkaMod.streamData.rank=loadHelper(vars, 3);
			if(AkaMod.streamData.rank == 0) {
				AkaMod.streamData.rank = 7777;
			}

			//sundae!
			if(strarr.length > 3) {
				AkaMod.sundaeData = JSON.parse(strarr[3]);
				if(AkaMod.sundaeData.cookiesEarned === undefined) {
					AkaMod.sundaeData.cookiesEarned = 0;
				}
			}

			//blizzdays
			if(strarr.length > 4) {
				AkaMod.blizzDays = JSON.parse(strarr[4]);
				if(AkaMod.blizzDays.currentBoss > 0 && AkaMod.blizzDays.bossHP > 0) {
					//refresh the boss stuff after loading has had a chance to finish. So we get the right CPS.
					setTimeout(() => {AkaMod.nextBossRound(AkaMod.blizzDays.bossCombatText, AkaMod.blizzDays.bossDamage);}, 100);
				}
				if(AkaMod.blizzDays.questType != -1) {
					AkaMod.updateQuestProgress(0);
				}
				if(!AkaMod.blizzDays.questCookies){
					AkaMod.blizzDays.questCookies = 0;
				}
			}
			if(strarr.length > 5) {
				AkaMod.blizzDays.pokemon = JSON.parse(strarr[5]);
				AkaMod.updatePokemonUpgrade();
				setTimeout(()=>{if(!Game.Has("Easy Creature Click") && AkaMod.blizzDays.pokemon.length >= 6){
					Game.Unlock("Easy Creature Click");
					Game.Upgrades["Easy Creature Click"].basePrice = 100 + Game.cookiesPsRaw * 60 * Math.pow(2, 10 - AkaMod.blizzDays.pokemon.length);
				}}, 100);
			}

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
					AkaMod.streamData.minutesWatched++;
					if(AkaMod.streamData.minutesWatched >= 60 * 3) {
						Game.Win("An Entire Stream");
						if(AkaMod.streamData.minutesWatched >= 60 * 12) {
							Game.Win("Glued To The Screen");
							if(AkaMod.streamData.minutesWatched >= 60 * 24) {
								Game.Win("Is This... Mike?");
							}
						}
					}
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