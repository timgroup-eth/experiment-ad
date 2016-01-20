/**
 * jspsych-single-stim
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/

(function($) {
	jsPsych["anna"] = (function() {

		var plugin = {};

		plugin.create = function(params) {

			params = jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'choices']);

			var trials = new Array(params.items.length);
			for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				trials[i].item = params.items[i];
				trials[i].user = params.user;
				trials[i].env = params.env;
			}
			return trials;
		};

		plugin.trial = function(display_element, trial) {

			var colorcode = trial.user.colorcode;
			var arrowcode = trial.user.arrowcode;
			var mefirst = trial.user.mefirst;
			var env = trial.env;
			var trialLength = trial.item.arrangement.length;
			var interTrialInterval = 1000;
			var interResponseInterval = 500;
			var imgs = trial.item.imgs;
			var mf = trial.user.mefirst;

			var conf = {
				p : trial.item.p,
				D : {
					'0-1' : [1,2,3,4],
					'0-0' : [2,1,4,3],
					'1-1' : [3,4,1,2],
					'1-0' : [4,3,2,1],
					'00-1' : [1,2,3,4,5,6,7,8],
					'00-0' : [2,1,4,3,6,7,8,7],
					'01-1' : [1,2,3,4,7,8,5,6],
					'01-0' : [2,1,4,3,8,7,6,5],
					'10-1' : [3,4,1,2,5,6,7,8],
					'10-0' : [4,3,2,1,6,5,8,7],
					'11-1' : [3,4,1,2,7,8,5,6],
					'11-0' : [4,3,2,1,8,7,6,5]
				},
				R : {
					'0' : [1,2,3,4],
					'1' : [3,4,1,2],
					'00' : [1,2,3,4,5,6,7,8],
					'01' : [1,2,3,4,7,8,5,6],
					'10' : [3,4,1,2,5,6,7,8],
					'11' : [3,4,1,2,7,8,5,6]
				},
				rk : function(){
					return trial.item.combination.map(function(i){ return arrowcode[colorcode.indexOf(i-1)] }).join('').toString();
				},
				dk : function(){
					return [this.rk(),mf].join('-').toString()
				},
				minusOne : function(dic){
					var dicKeys = Object.keys(dic);
					for(i=0;i<dicKeys.length;i++){
						dic[dicKeys[i]]=dic[dicKeys[i]].map(function(j){return j-1});
					};
					return dic
				},
				sortR : function(){
					var t = this.minusOne(this.R);
					return t[this.rk()];
				},
				sortD : function(){
					var t = this.minusOne(this.D);
					return t[this.dk()];
				},
				pr : function(){
					var sR = this.sortR();
					var p = this.p;
					return p.map(function(val,i){
						return p[sR[i]]});
				},
				pd : function(){
					var sR = this.sortD();
					var p = this.p;
					return p.map(function(val,i){
						return p[sR[i]]});
				},
				meFirstSort : function(){
					if (trial.item.mefirst == 0){
						var mfSort = [2,1,4,3,6,7,8,7].map(function(j){return j-1});
					}else{
						var mfSort = [1,2,3,4,5,6,7,8].map(function(j){return j-1});
					}
					return this.p.map(function(val,i){return conf.p[mfSort[i]]});
				}
			};

			var keyMap = {
				'leftarrow' : {
					s: 0,
					c: 1
				},
				'rightarrow' : {
					s: 2,
					c: 3
				},
				'leftarrow-leftarrow' : {
					s: 0,
					c: 1
				},
				'leftarrow-rightarrow': {
					s: 2,
					c: 3
				},
				'rightarrow-leftarrow' : {
					s: 4,
					c: 5
				},
				'rightarrow-rightarrow': {
					s: 6,
					c: 7
				}
			}

			var pr = trial.item.isfoil==0 ? conf.pr() : trial.item.p;
			var pd = trial.item.isfoil==0 ? conf.pd() : conf.meFirstSort();

			var imgSize = 'height:420px;width:300px;background-size: 300px 420px;';
			var imgStyle = 'position:absolute;margin:8px;';
			var valStyle = 'position:absolute;height:32px;width:100px;text-align:center;font-size:25px;font-weight:bold;'
			var styles = {
				valDivL : valStyle+'top:190px;left:20px;',
				valDivR : valStyle+'top:190px;left:180px;',
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
				feedbackDiv : 'position:absolute;font-size:20px;font-weight:bold;top:300px;left:'+(env.centX-100).toString()+'px;'
			};

			timeOutHandlers = []

			// function to end trial when it is time
			var end_trial = function(response) {
				for(t=0;t<timeOutHandlers.length;t++){ clearTimeout(timeOutHandlers[t])};
				// give_feedback()
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				keyMapKey = response.map(function(i){return i.key_string}).join('-')

				// gather the data to store for the trial
				var trial_data = {
					responseroot : response[0].key_string,
					timingroot : response[0].rt/1000.0,
					pnr : pr.join(),
					pnd : pd.join()
				};

				if (response.length==trialLength){
					trial_data.payoffS = pr[keyMap[keyMapKey]['s']];
					trial_data.payoffC = pr[keyMap[keyMapKey]['c']];
					if(trialLength==2){
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

				var flatItem = JSON.flatten(trial.item);
				for (var key in flatItem){
					trial_data[key] = flatItem[key];
				};
				console.log(trial_data)
				jsPsych.data.write(trial_data);

				if (response.length==trialLength){
					var feedBackStr = "<div id='feedback' style='"+styles.feedbackDiv+"'>"+
														"<p>Feedback</p>"+
														"<p>Self: "+trial_data.payoffS.toString()+"</p>"+
														"<p>Charity: "+trial_data.payoffC.toString()+"</p>"+
														"</div>"
					// clear the display
					display_element.html(feedBackStr);
				}else{
					display_element.html('');
				}

				// move on to the next trial
				setTimeout(jsPsych.finishTrial,interTrialInterval);
			};


			var kbResps = []
			// function to handle responses by the subject
			var keyboardCallback = function(kbInfo) {
				kbResps.push(kbInfo)
				if (trialLength==1){
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
			var displayStimuli = function(){
				if (trial.item.arrangement.length==1){
				display_element.html(
				"<div id='singleImgDiv' class='imgDiv' style='"+
					styles.single.imgDiv+
					"background-image:url(./"+
					imgs[0].path+
					");'></div>"
				);
				}else{
					display_element.html(
					"<div id='leftImgDiv' class='imgDiv' style='"+
						styles.double.left.imgDiv+
						"background-image:url(./"+
						imgs[0].path+
						");'></div>"+
					"<div id='rightImgDiv' class='imgDiv' style='"+
						styles.double.right.imgDiv+
						"background-image:url(./"+
						imgs[1].path+
						");'></div>"
					);
				}
				// display values
				var imgDivs = document.getElementsByClassName('imgDiv')
				for(i=0;i<imgDivs.length;i++){
					if (trial.item.arrangement[i]=='1'){ //1=P
						var s1 = [ pd[(i*4)], pd[(i*4)+1] ].join('/')
						var s2 = [ pd[(i*4)+2], pd[(i*4)+3] ].join('/')
						imgDivs[i].innerHTML = "<div id='singleVal' style="+styles.valDivL+"background-color:"+
							imgs[i].bgColor+";>\
							<p style='margin:auto;color:"+imgs[i].textColor+";'>"+s1+"</p></div>"+
							"<div id='singleVal' style="+styles.valDivR+"background-color:"+
							imgs[i].bgColor+";>\
							<p style='margin:auto;color:"+imgs[i].textColor+";'>"+s2+"</p></div>";
					}else{
						imgDivs[i].innerHTML = "<div id='singleVal' style="+styles.valDivL+"background-color:black;>\
							<p style='margin:auto;color:white;'>##/##</p></div>"+
							"<div id='singleVal' style="+styles.valDivR+"background-color:black;>\
							<p style='margin:auto;color:white;'>##/##</p></div>";
					}
				}
			};

			displayStimuli()

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
})(jQuery);
