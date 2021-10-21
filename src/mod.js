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
		minutesWatched: 0
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
		cookieGains: 3,
		scratchLoss: 3,
		cookiesEarned: 0
	},

	upgrades: [],
	achievements: [],

	//set up the hooks.
	init:function(){
		//hook for cps and cookiesPerClick

		//initial resource loading.
		Game.registerHook("create", () => {
			//This seems to only be called in the APP. It is called after all the other upgrades and achievments are registered.
			AkaMod.registerUpgrades();
			AkaMod.registerAchivements();
			AkaMod.registerBuffs();
		});

		//slowtick
		Game.registerHook("check", AkaMod.check);

		Game.registerHook('ticker', () => {
			const list = [];

			list.push("Bruh.");
			list.push("Twitch streamer talks constantly about donuts and sundays. Inspires new Ben and Jerry's flavor: Donut Sundae.");
			list.push('After years of having his name mispronounced, popular streamer says, "My name is Mike now. Just Mike. Can you get that one right?"');
			list.push("News: No more models on OnlyFans. Now it's just pictures of cookies.");
			if(AkaMod.streamData.mikeStreaming) {
				list.push("<a href='https://www.twitch.tv/akamikeb' target='_blank'>Mike is Streaming! Click Here!</a>"); //TODO test this on the steam version.
			}

			if(Game.Has("Sundae!")) {
				list.push("Streamer rockets to most-watched after promoting his cat to take his place.");
				list.push("<q>Meow.</q>");
				if(AkaMod.sundaeData.mood < 40) {
					list.push("<q>Hiss!</q>");
				}
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

		//'reset' - called whenever the player resets; parameter is true if this is a hard reset, false if it's an ascension

		//'reincarnate' - called when the player has reincarnated after an ascension
		Game.registerHook('reincarnate', () => {
			//reset upgrades
			for (var i in AkaMod.upgrades) {
				var me=AkaMod.upgrades[i];
				me.unlocked=0;me.bought=0;
			}
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
				cookieGains: 3,
				scratchLoss: 3,
				cookiesEarned: 0
			};
		});

		AkaMod.initSundaeStuff();

		//render some stats for the mod.
		AkaMod.UpdateMenu = Game.UpdateMenu;
		Game.UpdateMenu = function(){
			AkaMod.UpdateMenu();
			
			if (Game.onMenu==='stats') {
				let newSection = "<div class='subsection'>"
					+ "<div class='title'><b>MikeB Mod Stats</div>"
					+ "<div class='listing'><b>Watched Streams: </b>" + AkaMod.streamData.caughtStreams + "</div>";
				if(AkaMod.streamData.minutesWatched < 120) {
					newSection += "<div class='listing'><b>Minutes Watched: </b>" + AkaMod.streamData.minutesWatched + "</div>";
				} else {
					newSection += "<div class='listing'><b>Hours Watched: </b>" + (Math.round(AkaMod.streamData.minutesWatched/6)/10) + "</div>";
				}
				if(Game.Has("Sundae!")) {
					newSection += "<div class='listing'><b>Sundae Pets(This run): </b>" + AkaMod.sundaeData.pets + "</div>";
					newSection += "<div class='listing'><b>Sundae Pets(All-time): </b>" + AkaMod.sundaeData.totalPets + "</div>";
					newSection += "<div class='listing'><b>Sundae Scratches: </b>" + AkaMod.sundaeData.totalScratches + "</div>";
					newSection += "<div class='listing'><b>Pets in a Row: </b>" + AkaMod.sundaeData.consecutivePets + "</div>";
					newSection += "<div class='listing'><b>Cookies Gained From Petting: </b><div class=\"price plain\">"+Game.tinyCookie() + Beautify(AkaMod.sundaeData.cookiesEarned) + "</div></div>";
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
					moremood *= 3;
				} else if(Game.hasBuff("Dragon Harvest")) {
					moremood *= 4;
				} else if(Game.hasBuff("Clot")) {
					moremood *= 2;
				}
			}
			return moremood;
		}

		//Handles petting Sundae.
		AkaMod.SundaePetGains = () => {
			let gain = Game.computedMouseCps * AkaMod.sundaeData.cookieGains * Math.max((1 + AkaMod.sundaeData.consecutivePets/10), 8);
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
							if(AkaMod.sundaeData.pets >= 400) {
								Game.Unlock("Very Very Good Kitty");
								if(AkaMod.sundaeData.pets >= 420) {
									Game.Win("Tokin Sundae");
									if(AkaMod.sundaeData.pets >= 2000) {
										Game.Unlock("The Best Kitty");
									}
								}
							}
						}
					}
					if(AkaMod.sundaeData.consecutivePets >= 10) {
						Game.Unlock("Content Kitty");
						if(AkaMod.sundaeData.consecutivePets >= 13) {
							Game.Unlock("Happy Kitty");
							if(AkaMod.sundaeData.consecutivePets >= 18) {
								Game.Unlock("Happier Kitty");
								if(AkaMod.sundaeData.consecutivePets >= 25) {
									Game.Unlock("Happiest Kitty");
									Game.Win("She Likes You!");
									if(AkaMod.sundaeData.consecutivePets >= 30 && Game.Has("Happiest Kitty") && Game.Has("Sundae's Gift")) {
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

					if(Math.random() < 0.01) { //1% chance
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
				desc:'Sundae scratched you!',
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
				desc:'Sundae enjoyed her treat! Clicks boosted.',
				icon:[18,13],
				time:time*Game.fps,
				add:true,
				multClick:4,
				aura:0
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
		AkaMod.Upgrade("The Best Kitty","Pets give 4 times as many cookies!",99999999900000000000,[18,14], () => {AkaMod.sundaeData.cookieGains *= 4});
		AkaMod.Upgrade("Filed Claws","Lose fewer cookies per scratch.<q>It still hurts, but not as bad.</q>",cnum(999,'qa'),[28,6], () => {AkaMod.sundaeData.scratchLoss=3});
		AkaMod.Upgrade("Sadistic","Sundae no longer loses contentment when she scratches you.<q>Is she... smiling?</q>",cnum(999,'qa'),[28,6]);
		AkaMod.Upgrade("Content Kitty","Max Contentment increases to 85%.",cnum(99.9,'qi'),[18,13], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Happy Kitty","Max Contentment increases to 90%.",cnum(.999,'qa'),[18,14], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Happier Kitty","Max Contentment increases to 95%.",cnum(9.99,'qa'),[18,18], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Happiest Kitty","Max Contentment increases to 100%.",cnum(99.9,'qa'),[18,19], () => {AkaMod.sundaeData.maxMood += 5;});
		AkaMod.Upgrade("Cat Toy","Sundae's mood recovers faster.",cnum(99.9,'qi'),[31,15], () => {AkaMod.sundaeData.moodRecovery++;});
		AkaMod.Upgrade("Cat Food","Sundae's mood recovers even faster.",cnum(.999,'sx'),[33,3], () => {AkaMod.sundaeData.moodRecovery++;});
		AkaMod.Upgrade("Sundae's Gift","Sundae has a rare chance to offer you this strange gift...",cnum(999,'qi'),[16,9]);
		AkaMod.Upgrade("Sundae's Secret Gift","Increases Sundae's max mood based on your prestige level.",cnum(999,'qi'),[16,9], () => {AkaMod.sundaeData.maxMood += Math.round(Math.log10(Game.prestige)) + 1;});
		AkaMod.Upgrade("Sundae's Super Secret Gift","Increases Sundae pet bonuses based on your akamikeb fan level.",cnum(999,'sx'),[16,9], () => {Game.Win("Sundae's Presents");});
		//TODO add upgrades that increase the max petting bonus from consecutive pets. But they require a bunch of fast pets.

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
		AkaMod.Achievement("An Entire Stream", "Watched 3 hours of Mike stream without closing Cookie Clicker!", [0,8]);
		AkaMod.Achievement("Glued To The Screen", "Watched 12 hours of Mike stream without closing Cookie Clicker!!", [1,8]);
		AkaMod.Achievement("Is This... Mike?", "Watched 24 hours of Mike stream without closing Cookie Clicker!!!", [2,8]);

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
		str += AkaMod.streamData.minutesWatched;

		//sundae!
		str += "|";
		str += JSON.stringify(AkaMod.sundaeData);
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

			//sundae!
			if(strarr.length > 3) {
				AkaMod.sundaeData = JSON.parse(strarr[3]);
				if(AkaMod.sundaeData.cookiesEarned === undefined) {
					AkaMod.sundaeData.cookiesEarned = 0;
				}
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