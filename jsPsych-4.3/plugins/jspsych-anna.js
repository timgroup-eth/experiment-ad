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
			var mefirst = trial.user.mefirst;
			var env = trial.env;
			var trialLength = trial.item.arrangement.length;
			var interTrialInterval = 700;
			var interResponseInterval = 500;
			var imgs = trial.item.imgs;

			var imgSize = 'height:420px;width:300px;background-size: 300px 420px;';
			var imgStyle = 'position:absolute;margin:4px;';
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
				}
			};


			// store response
			var response = {rt: -1, key: -1};
			timeOutHandlers = []

			// function to end trial when it is time
			var end_trial = function(response) {
				for(t=0;t<timeOutHandlers.length;t++){ clearTimeout(timeOutHandlers[t])};
				// give_feedback()
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);


				// gather the data to store for the trial
				var trial_data = {
					"rt": response[0].rt,
					"key_code": response[0].key_code,
					"key_string": response[0].key_string,
				};
				jsPsych.data.write(trial_data);
				// clear the display
				display_element.html('');
				// move on to the next trial
				timeOutHandlers.push(setTimeout(jsPsych.finishTrial,interTrialInterval));
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
							$('#leftImgDiv').css('border','solid 4px rgb(60,255,0)');
							$('#leftImgDiv').css('margin','0px');
						}else{
							$('#leftImgDiv').remove();
							$('#rightImgDiv').css('border','solid 4px rgb(60,255,0)');
							$('#rightImgDiv').css('margin','0px');
						}
					}else{
						end_trial(kbResps)
					}
				};
			};

			//display images
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
					imgDivs[i].innerHTML = "<div id='singleVal' style="+styles.valDivL+"background-color:"+
						imgs[i].bgColor+";>\
						<p style='margin:auto;color:"+imgs[i].textColor+";'>##/##</p></div>"+
						"<div id='singleVal' style="+styles.valDivR+"background-color:"+
						imgs[i].bgColor+";>\
						<p style='margin:auto;color:"+imgs[i].textColor+";'>##/##</p></div>";
				}else{
					imgDivs[i].innerHTML = "<div id='singleVal' style="+styles.valDivL+"background-color:black;>\
						<p style='margin:auto;color:white;'>##/##</p></div>"+
						"<div id='singleVal' style="+styles.valDivR+"background-color:black;>\
						<p style='margin:auto;color:white;'>##/##</p></div>";
				}
			};

			// start the response listener
			var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
				callback_function: keyboardCallback,
				valid_responses: [37,39],
				rt_method: 'date',
				persist: true,
				allow_held_key: false,
			});
		};

		return plugin;
	})();
})(jQuery);
