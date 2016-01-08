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
			var interTrialInterval = 1000;

			var imgSize = 'height:420px;width:300px;background-size: 300px 420px;';
			var imgStyle = 'position:absolute;margin:4px;';
			var styles = {
				single: {
					imgDiv : imgSize+imgStyle+'left:'+(env.centX-150-4).toString()+'px;top:'+(env.centY-210-4).toString()+'px;',
					valDiv : ''
				},
				double : {
					left : {
						imgDiv : imgSize+imgStyle+'left:'+(env.centX-250-150-4).toString()+'px;top:'+(env.centY-210-4).toString()+'px;',
						valDiv : ''
					},
					right : {
						imgDiv : imgSize+imgStyle+'left:'+(env.centX+250-150-4).toString()+'px;top:'+(env.centY-210-4).toString()+'px;',
						valDiv : ''
					}
				}
			};


			// store response
			var response = {rt: -1, key: -1};

			// function to end trial when it is time
			var end_trial = function(response) {
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
				setTimeout(jsPsych.finishTrial(),interTrialInterval)
			};

			var kbResps = []
			// function to handle responses by the subject
			var keyboardCallback = function(kbInfo) {
				kbResps.push(kbInfo)
				if (trialLength==1){
					end_trial(kbResps)
				}else{
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

			//display stimulus
			if (trial.item.arrangement.length==1){
				display_element.html(
				"<div id='singleImgDiv' style='"+
					styles.single.imgDiv+
					"background-image:url(./"+
					trial.item.imgs[0].path+
					");'></div>"
				);
			}else{
				display_element.html(
				"<div id='leftImgDiv' style='"+
					styles.double.left.imgDiv+
					"background-image:url(./"+
					trial.item.imgs[0].path+
					");'></div>"+

				"<div id='rightImgDiv' style='"+
					styles.double.right.imgDiv+
					"background-image:url(./"+
					trial.item.imgs[1].path+
					");'></div>"
				);
			}

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
