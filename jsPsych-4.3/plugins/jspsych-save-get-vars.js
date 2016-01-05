/**
 * Adrian Oesch
 * Oktober 2015
 *
 * this plugin stores the given variables from the URL in the data object.
 * input is array paramter with the name 'vars' containing the interested
 * variables or the parameter 'all' set to "True"
 *
 */
jsPsych['save-get-vars'] = (function(){

  var plugin = {};
  var $_GET = {};

  if(document.location.toString().indexOf('?') !== -1) {
        var query = document.location
                       .toString()
                       .replace(/^.*?\?/, '')
                       .replace(/#.*$/, '')
                       .split('&');

        for(var i=0, l=query.length; i<l; i++) {
           var aux = decodeURIComponent(query[i]).split('=');
           $_GET[aux[0]] = aux[1];
        }
    }

  plugin.create = function(params){
    var trials = new Array();
    keys = Object.keys($_GET);
    all=0;
    if (typeof(params.all) != 'undefined'){
      if (params.all=="True"){
        all=1;
      }
    }

    if (keys.length==0){
      trials[0] = {};
      trials[0].var = 'None';
      trials[0].data = (typeof params.data === 'undefined') ? {} : params.data[i];
    }else if (all==1){
      for (i=0;i<keys.length;i++){
        trials[i] = {};
        trials[i].var = keys[i];
        trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
      }
    }else{
      for (i=0;i<params.vars.length;i++){
        trials[i] = {};
        trials[i].var = params.vars[i];
        trials[i].data = (typeof params.data === 'undefined') ? {} : params.data[i];
      }
    }
    return trials;
  }

  plugin.trial = function(display_element, trial){
    if (trial.var=='None'){
      value = 'No GET variables found.';
    }else{
      value = $_GET[trial.var]
    }

    trial_data = {
      'name' : trial.var,
      'value' : value
    };
    jsPsych.data.write(trial_data);
    jsPsych.finishTrial();
  }

  return plugin;

})();
