
jsPsych.plugins["anna"] = (function() {

		var plugin = {};

		plugin.trial = function(display_element, trial) {
			console.log(trial)

			var interTrialInterval = 1000;
			var interResponseInterval = 500;

			var env = {
			      screenW: screen.width,
			      screenH : screen.height,
			      centX : screen.width*0.5,
			      centY : screen.height*0.5,
			      centLX : screen.width*0.25,
			      centRX : screen.width*0.75
			    };

			var imgSize = 'height:420px;width:300px;background-size: 300px 420px;';
			var imgStyle = 'position:absolute;margin:8px;';
			var valStyle = 'position:absolute;height:32px;width:100px;text-align:center;font-size:25px;font-weight:bold;'
			var styles = {
				valDivLeft : valStyle+'top:190px;left:20px;',
				valDivRight : valStyle+'top:190px;left:180px;',
				valDivUpper : valStyle+'top:60px;left:100px;',
				valDivLower : valStyle+'top:340px;left:100px;',
				progressCont : 'position:absolute;width:500px;height:40px;left:'+(env.centX-250)+'px;top:20px;',
				single: {
					imgDiv : imgSize+imgStyle+'left:'+(env.centX-150-4).toString()+'px;top:'+(env.centY-210-4).toString()+'px;'
				},
				double : {
					left : {
						imgDiv : imgSize+imgStyle+'left:'+(env.centX-250-150-4).toString()+'px;top:'+(env.centY-210-4).toString()+'px;'
					},
					right : {
						imgDiv : imgSize+imgStyle+'left:'+(env.centX+250-150-4).toString()+'px;top:'+(env.centY-210-4).toString()+'px;'
					}
				},
				feedbackDiv : 'position:absolute;font-size:20px;font-weight:bold;top:'+(env.centY-90).toString()+'px;left:'+(env.centX-80).toString()+'px;',
				noResponseDiv : 'position:absolute;font-size:20px;font-weight:bold;top:'+(env.centY-30).toString()+'px;left:'+(env.centX-110).toString()+'px;',
				choosePar : 'position:absolute;text-align:center;width:150px;left:'+(env.centX-75).toString()+'px;top:'+(env.centY+230).toString()+'px;'
			};

			timeOutHandlers = []

			var keyMap = {
				'root':{
					'leftarrow' : 0,
					'rightarrow' : 1
				},
				'leftarrow' : {
					s: 0,
					c: 1
				},
				'rightarrow' : {
						s: 2,
						c: 3
					}
			};
			// function to end trial when it is time
			var end_trial = function(response) {

				for(t=0;t<timeOutHandlers.length;t++){ clearTimeout(timeOutHandlers[t])};
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

				// gather the data to store for the trial
				var trial_data = {
					responseroot : response[0].key_string,
					timingroot : response[0].rt/1000.0,
				};

					if (response.length==trial.combination.length){
					var rootChoice = keyMap['root'][response[0].key_string];
					var rootP = trial.combination.length == 2 ? trial.p[rootChoice] : trial.p[0];
					var finalResponse = response[response.length-1];
					trial_data.payoffS = rootP[keyMap[finalResponse.key_string]['s']];
					trial_data.payoffC = rootP[keyMap[finalResponse.key_string]['c']];
					if(trial.combination.length==2){
						trial_data.response2nd = response[1].key_string
						trial_data.timing2nd = (response[1].rt - response[0].rt) / 1000.0
					};
				};

				JSON.flatten = function(data) {
					var result = {};
			    function recurse (cur, prop) {
			        if (Object(cur) !== cur) {
			            result[prop] = cur;
			        } else if (Array.isArray(cur)) {
			             for(var i=0, l=cur.length; i<l; i++)
			                 recurse(cur[i], prop + "[" + i + "]");
			            if (l == 0)
			                result[prop] = [];
			        } else {
			            var isEmpty = true;
			            for (var p in cur) {
			                isEmpty = false;
			                recurse(cur[p], prop ? prop+"."+p : p);
			            }
			            if (isEmpty && prop)
			                result[prop] = {};
			        }
			    }
			    recurse(data, "");
			    return result;
				}
				var flatItem = JSON.flatten(trial);
				for (var key in flatItem){
					trial_data[key] = flatItem[key];
				};

				// move on to the next trial
				function moveOn(){
					var cur = parseInt(jsPsych.currentTimelineNodeID().split('-')[2]);
					percStr = Math.round((cur+1)/Experiment.nTrials*100).toString()+'%';
					$('#jspsych-progressbar-inner').css('width',percStr);
					setTimeout(function(){
						display_element.html('');
						jsPsych.finishTrial(trial_data);}
					,interTrialInterval);
				};

				if(trial.condition=="D"){
					display_element.html('');
					moveOn();
				}else if (response.length==trial.combination.length){
					var feedBackStr = "<div id='feedback' style='"+styles.feedbackDiv+"'>"+
														"<p>Final Outcome</p>"+
														"<p>Business: "+trial_data.payoffS.toString()+"</p>"+
														"<p>Society: "+trial_data.payoffC.toString()+"</p>"+
														"</div>"
					// clear the display
					display_element.html(feedBackStr);
					moveOn();
				}else{
					display_element.html("<div id='feedback' style='"+styles.noResponseDiv+"'><p>No response recorded.</p></div>");
					moveOn();
				}
			};


			var kbResps = []
			// function to handle responses by the subject
			var keyboardCallback = function(kbInfo) {
				kbResps.push(kbInfo)
				if (trial.combination.length==1){
					end_trial(kbResps)
				}else{
					timeOutHandlers.push(setTimeout(end_trial,interResponseInterval,kbResps));
					if (kbResps.length==1){
						if(kbInfo.key_string=='leftarrow'){
							$('#rightImgDiv').remove();
							$('#leftImgDiv').css('border','solid 8px rgb(60,255,0)');
							$('#leftImgDiv').css('margin','0px');
						}else{
							$('#leftImgDiv').remove();
							$('#rightImgDiv').css('border','solid 8px rgb(60,255,0)');
							$('#rightImgDiv').css('margin','0px');
						}
					}else{
						end_trial(kbResps)
					}
				};
			};

			//display images
			displayStimuli = {
				imgs : function(){
					if (trial.arrangement.length==1){
					display_element.html(
					"<div id='singleImgDiv' class='imgDiv' style='"+
						styles.single.imgDiv+
						"background-image:url(./"+
						trial.imgs[0].path+
						");'></div>"
					);
					}else{
						display_element.html(
						"<div id='leftImgDiv' class='imgDiv' style='"+
							styles.double.left.imgDiv+");'>"+
							"<img src="+trial.imgs[0].path+"/></div>"+
						"<div id='rightImgDiv' class='imgDiv' style='"+
							styles.double.right.imgDiv+");'>"+
								"<img src="+trial.imgs[1].path+"/></div>"
						);
					}
				},
				values : function(){
					var imgDivs = document.getElementsByClassName('imgDiv')
					for(i=0;i<imgDivs.length;i++){
						var valStyle1 = trial.imgs[i].position == 'h' ? styles.valDivLeft : styles.valDivUpper
						var valStyle2 = trial.imgs[i].position == 'h' ? styles.valDivRight : styles.valDivLower
						if (trial.arrangement[i]=='1'){ //1=P
							var s1 = [ trial.d[i][0], trial.d[i][1] ].join('/')
							var s2 = [ trial.d[i][2], trial.d[i][3] ].join('/')
							imgDivs[i].innerHTML = "<div id='singleVal' style="+valStyle1+"background-color:"+
								trial.imgs[i].bgColor+";>\
								<p style='margin:auto;color:"+trial.imgs[i].textColor+";'>"+s1+"</p></div>"+
								"<div id='singleVal' style="+valStyle2+"background-color:"+
								trial.imgs[i].bgColor+";>\
								<p style='margin:auto;color:"+trial.imgs[i].textColor+";'>"+s2+"</p></div>";
						}else{
							imgDivs[i].innerHTML = "<div id='singleVal' style="+valStyle1+"background-color:black;>\
								<p style='margin:auto;color:white;'>##/##</p></div>"+
								"<div id='singleVal' style="+valStyle2+"background-color:black;>\
								<p style='margin:auto;color:white;'>##/##</p></div>";
						}
					}
				},
				choose : function(){
					var choosePar = "<p class='choose' style="+styles.choosePar+">Choose \< OR \></p>";
					display_element.append(choosePar);
				},
				init : function(){
					this.imgs();
					this.values();
					this.choose()
				}
			};

			displayStimuli.init()

			// start the response listener
			var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
				callback_function: keyboardCallback,
				valid_responses: [37,39],
				rt_method: 'date',
				persist: true,
				allow_held_key: false
			});
		};

		return plugin;
})();
