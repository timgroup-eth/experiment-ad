/**
 * Adrian Oesch
 * January 2016
 *
 * adapted from https://groups.google.com/forum/#!topic/jspsych/qP1qV82msm0
 */

var fs_plugin_glob = {}; //global variable to store event triggers

jsPsych.plugins['fullscreen'] = (function(){

    var plugin = {};

    plugin.trial = function(display_element, trial){

      var defaultAbort = function(){
        var str = 'Experiment was terminated by your action.';
        jsPsych.finishTrial()
        jsPsych.endExperiment(str)
      };
      var defaultFail = function(){
        var str = 'Your browser doesn\'t provide the necessary functionality. Please contact the principal investigator of this experiment.';
        jsPsych.finishTrial()
        jsPsych.endExperiment(str)
      };

      // set defaults
      trial.button = trial.buttontext || 'Enter';
      trial.exit = trial.exit || false;
      trial.buttonStyle = trial.buttonStyle || "";
      trial.on_fullscreen_abort = trial.on_fullscreen_abort || defaultAbort;
      trial.on_fullscreen_fail = trial.on_fullscreen_fail || defaultFail;
      trial.on_visibility_abort = trial.on_visibility_abort || defaultAbort;
      trial.on_visibility_fail = trial.on_visibility_fail || defaultFail;

      var fs = {
        check : function (){
          if(typeof document.webkitIsFullScreen == 'undefined' && typeof document.mozFullScreen == 'undefined' && +
          typeof document.msFullscreenEnabled == 'undefined' && typeof document.fullscreenchange == 'undefined'){
            return false;
          }else{
            return true;
          };
        },
        launch : function (elem) {
          if(elem.requestFullscreen){
            elem.requestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
          }else if(elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen(elem.ALLOW_KEYBOARD_INPUT)
          }else if(elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
            if (!(navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") > -1)){
              document.addEventListener('keydown',function(e){e.preventDefault()});
          };
          }else if(elem.msRequestFullscreen) {
            elem.msRequestFullscreen(elem.ALLOW_KEYBOARD_INPUT);
          }
        },
        exit : function () {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          };
        },
        getFullScreenAbort : function (callObj){
          var fullScreenAbort = function(){
            if (!document.webkitIsFullScreen && typeof document.webkitIsFullScreen != 'undefined'){
              callObj.call()
            }else if (!document.mozFullScreen && typeof document.mozFullScreen != 'undefined'){
              callObj.call()
            }else if (!document.msFullscreenElement && typeof document.msFullscreenElement != 'undefined'){
              callObj.call()
            }else if (!document.fullscreenchange && typeof document.fullscreenchange != 'undefined'){
              callObj.call()
            }
          };
          return fullScreenAbort
        },
        addListener : function(){
          if (!document.webkitIsFullScreen && typeof document.webkitIsFullScreen != 'undefined'){
            document.addEventListener('webkitfullscreenchange',fs_plugin_glob.fs_abort,false);
          }else if (!document.mozFullScreen && typeof document.mozFullScreen != 'undefined'){
            document.addEventListener('mozfullscreenchange',fs_plugin_glob.fs_abort,false);
          }else if (!document.msFullscreenElement && typeof document.msFullscreenElement != 'undefined'){
            document.addEventListener('MSFullscreenChange',fs_plugin_glob.fs_abort,false);
          }else if (!document.fullscreenchange && typeof document.fullscreenchange != 'undefined'){
            document.addEventListener('fullscreenchange',fs_plugin_glob.fs_abort,false);
          }
        },
        removeListener : function(){
          document.removeEventListener('webkitfullscreenchange',fs_plugin_glob.fs_abort);
          document.removeEventListener('mozfullscreenchange',fs_plugin_glob.fs_abort);
          document.removeEventListener('MSFullscreenChange',fs_plugin_glob.fs_abort);
          document.removeEventListener('fullscreenchange',fs_plugin_glob.fs_abort);
        }
      };

      var vs = {
        on_abort : trial.on_visibility_abort,
        on_fail : trial.on_visibility_fail,
        check : function(){
          if(typeof document.webkitHidden == 'undefined' && typeof document.mozHidden == 'undefined' && +
          typeof document.msHidden == 'undefined' && typeof document.hidden == 'undefined'){
            return false;
          }else{
            return true;
          };
        },
        addListener : function(){
          if (document.webkitHidden != 'undefined'){
            document.addEventListener('webkitvisibilitychange',fs_plugin_glob.vs_abort,false);
          }else if (typeof document.mozHidden != 'undefined'){
            document.addEventListener('mozvisibilitychange',fs_plugin_glob.vs_abort,false);
          }else if (typeof document.msHidden != 'undefined'){
            document.addEventListener('msvisibilitychange',fs_plugin_glob.vs_abort,false);
          }else if (typeof document.hidden != 'undefined'){
            document.addEventListener('visibilitychange',fs_plugin_glob.vs_abort,false);
          }
        },
        removeListener : function(){
            document.removeEventListener('webkitvisibilitychange',fs_plugin_glob.vs_abort,false);
            document.removeEventListener('mozvisibilitychange',fs_plugin_glob.vs_abort,false);
            document.removeEventListener('msvisibilitychange',fs_plugin_glob.vs_abort,false);
            document.removeEventListener('visibilitychange',fs_plugin_glob.vs_abort,false);
        }
      };

      if (!fs.check()){
        trial.on_fullscreen_fail();
      };
      if (trial.visibility&&!vs.check()){
        trial.on_visibility_fail();
      };

      display_element.append(trial.html)
      display_element.children().append("<button id='jspsych-fullscreen-button' style='"+
          trial.buttonStyle+"'><p>" + trial.button + "</p></button>")

      $('#jspsych-fullscreen-button').on('click',function(){
          if (trial.exit) {
            fs.removeListener()
            vs.removeListener()
            fs.exit();
          }else{
            fs.launch(document.documentElement);
            fs_plugin_glob.fs_abort = fs.getFullScreenAbort(trial.on_fullscreen_abort)
            fs.addListener();
            if (trial.visibility){
                fs_plugin_glob.vs_abort = function(){
                  fs.removeListener();
                  trial.on_visibility_abort();
                };
                vs.addListener();}
            };
          display_element.html('');
          jsPsych.finishTrial();
        });
    };

    return plugin;
})();
