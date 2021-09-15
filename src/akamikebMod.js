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
AkamikebMod = {
	streamData: {
		twitchViewers: Math.round(Math.random() * 100),
		akamikebStreaming: false,
		caughtStreams: 0
	},

	upgrades: [],
	achivements: [],

	//set up the hooks.
	init:function(){
		//Boost CPS
		Game.registerHook('cps', (oldCps) => {
			if(AkamikebMod.streamData.akamikebStreaming) {
				return oldCps * (1 + AkamikebMod.computeStreamingBuff() * AkamikebMod.streamData.twitchViewers / 100);
			}
			return oldCps;
		});

		//Boost clicks.
		Game.registerHook("cookiesPerClick", (oldClicks) => {
			if(AkamikebMod.streamData.akamikebStreaming) {
				return oldClicks * AkamikebMod.computeStreamingBuff();
			}
			return oldClicks;
		});

		//initial resource loading.
		Game.registerHook("create", () => {
			//Game.Upgrade=function(name,desc,price,icon,buyFunction)
			Game.order = 1000;
			this.upgrades.push(new Game.Upgrade("I'm a fan","Double bonus from watching live streams!<q>How's this twitch thing work?</q>",cnum(700,'t'),[19,3]));

			//Game.Achievement=function(name,desc,icon)
			new Game.Achievement("Streamerman", "Catch a live stream!", [16,5]);
		})

		//slowtick
		Game.registerHook("check", () => {
			
		});

		setTimeout(AkamikebMod.streamingPoll, 1000 * 60 * 5);
	},

	//Figures out the CPS and click boost from mike streaming.
	computeStreamingBuff: () => {
		let factor = 1;
		if(Game.Has("I'm a fan")) {
			factor = 2;
		}
		return factor;
	},

	save:function(){
		//use this to store persistent data associated with your mod
		let str = "";
		//save ugprades
		for (var i in AkamikebMod.upgrades) { //upgrades
			var me=AkamikebMod.upgrades[i];
			str += me.unlocked + ',' + me.bought + ';';
		}
		str = str.substr(0, str.length-1);

		//save achievements
		str+='|';
		for (var i in AkamikebMod.achievements) {
			var me=AkamikebMod.achievements[i];
			str += me.won + ';';
		}
		str = str.substr(0, str.length-1);

		//streaming stuff
		str += "|";
		str += AkamikebMod.streamData.caughtStreams
		return str;
	},

	load:function(str){
		//do stuff with the string data you saved previously
		var strarr=str.split('|');
		//load upgrades
		var upgradeData = strarr[0].split(';');
		for(var i in upgradeData){
			var u = upgradeData[i];
			AkamikebMod.upgrades[i].unlocked = parseInt(u.charAt(0));
			AkamikebMod.upgrades[i].bought = parseInt(u.charAt(2));
		}

		//load achievements
		var achieves = strarr[1].split(';');
		for(var i in achieves){
			if(achieves[i]=='1'){
				AkamikebMod.achievements[i].won=1;
				Game.AchievementsOwned++;
			}
		}

		//load streaming stuff
		var vars = strarr[2].split(';');
		AkamikebMod.streamData.caughtStreams=parseInt(loadHelper(vars, 0));

		//recalculate gains at the end.
		//TODO does CC do this on its own now?
		Game.CalculateGains();
		Game.RebuildUpgrades();
	},

	//Check if mike is streaming
	streamingPoll: () => {
		//AkamikebMod.akamikebStreaming = Math.random()
		//Game.Win("Achievement?")
		//Game.buffs["akamikeb"] = {};
		setTimeout(this.streamingPoll, 1000 * 60 * 5);
	}
};
Game.registerMod("akamikeb", AkamikebMod);



/*Give a buff based on viewers on mikeb streams.
https://stackoverflow.com/a/60075629

Passive +1% CPS for each 100 bits given in a week. For example: 1000 Bits means 10% boost for the week.
Passive +1% CPS for each Gifted sub in a week.
If Mike is live, +1% CPS per viewer.
If Mike is live 2^(hypeTrainLevel + 1)x cookie clicks.
Hash the name of mike's game. Map it to a building. Reduce building price by 50%?

[I'm a fan / Catch 2 live streams] Double bonuses from watching live streams!
[I'm a big fan / Catch 10 live streams] Quadruple bonuses from watching live streams!
[I'm a super fan / Catch 20 live streams] Quadruple bonuses from watching live streams!
[I'm a MEGA fan / Catch 80 live streams] Octuple bonuses from watching live streams!
[I'm a ridiculous fan / Catch 240 live streams] Sexdecuple[spl] bonuses from watching live streams!

<Streamerman> Catch a live stream.
<It's a classic!> Mike is playing Trials or Oxygen Not Included.
<No you're not> Rename your bakery to akamikeb.
*/

/*Sundae is an unlockable pet. Single icon in twitch that I could use for her.
Poop icon spawns periodically and lowers CPS until clicked.
Clicking Sundae gives a bunch of cookies but each time you click she has an increased chance to scratch back (Lose 3 Pets of cookies). Give her time or catnip to recover.
	Max 80% contentment. (Starts at 100 when first unlocking.)
	Reduce contentment by 10% per pet.
	Recover 1% every 1 minute.
	Gain 5 Clicks of cookies per Pet.
	Lose 3 Pets of cookies per scratch. (still lose the contentment)
	Poop spawns randomly between 5 and 30 minutes. Reduces CPS by 10%. Click to remove.
Add catnip to the farm. Bought through Sundae Upgrade.
Sundae Upgrades unlock based on number of pets, scratches, and poop cleanups.
Use kitten upgrade icons. There are 18 normal tiers. And 1 red, 1 business, 1 green in buildings,

[Good Kitty / Pet 100 times] Pets give twice as many cookies!
[Very Good Kitty / Pet 200 times] Pets give twice as many cookies!
[Very, Very Good Kitty / Pet 500 times] Pets give twice as many cookies!
[The Best Kitty / Pet 1000 times] Pets give twice as many cookies!
[Filed Claws / Scratched 20 times] Lose fewer cookies per scratch. (2x pet amount instead of 3x)
[Sadistic / Scratched 100 times] Sundae no longer loses contentment when scratching you.
[Happy Kitty / Pet 10 times without getting scratched] Max Contentment increases to 85%.
[Petting Professional / ?] Sundae is less annoyed when you pet her. Contentment loss down to 8% per pet.
[Cat Bed / Hit 40% contentment] +1% Contentment recovery per minute.
[Cat Toy / ?] ?
[Litter Box / Clean up 10 poops this run] No more poopies to clean up!

<Do you even understand cats?> Hit 0% Contentment.
<She likes you> Pet 8 times in a minute without getting scratched.
<Risky Moves> Pet successfully with less than 20% contentment.
<Master Pet Owner> Buy All Sundae Upgrades.
*/

//Darnell offers periodic quests. You have certain amount of time to complete the task, and he'll give you a reward if you do.
//	Icons: Darnell Head, RIP, mikebDarnair, mikebDarnThumb
//	Unlock upgrades and new quests by completing quests.
//	Where is the Darnell UI?
//	Can I make more interesting quests than Buy/Sell/Click X thing Y times?
//	Get my a nice tall glass of orange juice. (Have to have Orange juice selected in the milk selector.)

//Donkey? New building?
//Otamatone?