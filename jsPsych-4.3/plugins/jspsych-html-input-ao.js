/**
 * html-input-ao
 * adrian oesch
 *
 * plugin for displaying html and save all input fields to data.
 * add list of html strings if input elements etc
 * add inputIDs of requested elements to store from html string
 *
 **/

(function($) {
	jsPsych["html-input"] = (function() {

		var plugin = {};

		plugin.create = function(params) {

			params = jsPsych.pluginAPI.enforceArray(params, ['stimuli', 'choices']);

			var trials = new Array(params.html.length);
			for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				trials[i].html = params.html[i];
				trials[i].inputIDs = params.inputIDs[i];
				trials[i].check = params.check;
				trials[i].error = params.error;
				trials[i].cont_key = params.cont_key || "Button";
			}
			return trials;
		};



		plugin.trial = function(display_element, trial) {

			// function to end trial when it is time
			var checkInput = function() {
				trial_data = getInput()
				if(trial.check(trial_data)){
					endTrial(trial_data)
				}else{
					trial.error.call()
				}
			};

			var endTrial = function(){
				jsPsych.data.write(trial_data);
				display_element.html('');
				jsPsych.finishTrial();
			}


			var getInput = function() {
				var t1 = Date.now()-t0
				var trial_data = {"rt": t1};
				var inputs = trial.inputIDs
				for (i=0;i<inputs.length;i++){
					trial_data[inputs[i]] = $('#'+inputs[i]).val()
				}
				return trial_data
			};

			display_element.append(trial.html);
			var t0 = Date.now()
			$(':button').on('click',function(){
				checkInput()
			});


		};

		return plugin;
	})();
})(jQuery);
