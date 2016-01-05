/**
 * Adrian Oesch
 * Oktober 2015
 *
 * adapted from https://groups.google.com/forum/#!topic/jspsych/qP1qV82msm0
 */

jsPsych['fullscreen'] = (function(){

    var plugin = {};

    plugin.create = function(params){
        var trials = [];
        trials[0] = {};
        trials[0].text = params.showtext;
        trials[0].button = params.buttontext;
        trials[0].exit = params.exit || false;
        trials[0].buttonStyle = params.buttonStyle || "";
        trials[0].on_fullscreen_abort = params.on_fullscreen_abort || null;
        trials[0].on_hide_abort = params.on_hide_abort || null;
        trials[0].on_launch_fail = params.on_launch_fail || null;
        trials[0].on_hide_fail = params.on_hide_fail || null;
        return trials;
    }

    plugin.trial = function(display_element, trial){

      function checkLaunch(){
        if(typeof document.webkitIsFullScreen != 'boolean' && typeof document.mozFullScreen != 'boolean' && +
        typeof document.msFullscreenElement != 'boolean' && typeof document.fullscreenchange != 'boolean'){
          return false
        }else{
          return true
        }
      };

      function launchIntoFullscreen(element) {
        if(element.requestFullscreen){
            element.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
          } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            document.addEventListener('keydown',function(e){e.preventDefault()});
          } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
          }
      };
      function quitFullscreen(element) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      };

      function checkHide(){
        if(typeof document.webkitHidden != 'boolean' && typeof document.mozHidden != 'boolean' && +
        typeof document.msHidden != 'boolean' && typeof document.hidden != 'boolean'){
          return false
        }else{
          return true
        }
      };

      function addHiddenSurveillance(){
          if (document.webkitHidden != 'undefined'){
            document.addEventListener('webkitvisibilitychange',hideFail,false);
          }else if (typeof document.mozHidden != 'undefined'){
            document.addEventListener('mozvisibilitychange',hideFail,false);
          }else if (typeof document.msHidden != 'undefined'){
            document.addEventListener('msvisibilitychange',hideFail,false);
          }else if (typeof document.hidden != 'undefined'){
            document.addEventListener('visibilitychange',hideFail,false);
          }
      };

      function removeHideSurveillance(){
          document.removeEventListener('webkitvisibilitychange',hideFail,false);
          document.removeEventListener('mozvisibilitychange',hideFail,false);
          document.removeEventListener('msvisibilitychange',hideFail,false);
          document.removeEventListener('visibilitychange',hideFail,false);
      };

      response2 = trial.on_hide_abort

      function hideFail(){
        if (document.webkitHidden){
          response2();
        }else if (document.mozHidden){
          response2();
        }else if (document.msHidden){
          response2();
        }else if (document.hidden){
          response2();
        };
      };

      function addFullScreenSurveillance(fullScreenFail){
          if (!document.webkitIsFullScreen && typeof document.webkitIsFullScreen != 'undefined'){
            document.addEventListener('webkitfullscreenchange',fullScreenFail,false);
          }else if (!document.mozFullScreen && typeof document.mozFullScreen != 'undefined'){
            document.addEventListener('mozfullscreenchange',fullScreenFail,false);
          }else if (!document.msFullscreenElement && typeof document.msFullscreenElement != 'undefined'){
            document.addEventListener('MSFullscreenChange',fullScreenFail,false);
          }else if (!document.fullscreenchange && typeof document.fullscreenchange != 'undefined'){
            document.addEventListener('fullscreenchange',fullScreenFail,false);
          }
      };

      function removeFullScreenSurveillance(){
        // if (document.webkitIsFullScreen){
          document.removeEventListener('webkitfullscreenchange',fullScreenFail);
        // } else if (document.mozFullScreen){
          document.removeEventListener('mozfullscreenchange',fullScreenFail);
        // } else if (document.msFullscreenElement){
          document.removeEventListener('MSFullscreenChange',fullScreenFail);
        // } else if (document.fullscreenchange){
          document.removeEventListener('fullscreenchange',fullScreenFail);
        // }
      };

      response = trial.on_fullscreen_abort

      function fullScreenFail(){
        if (!document.webkitIsFullScreen && typeof document.webkitIsFullScreen != 'undefined'){
          response();
        }else if (!document.mozFullScreen && typeof document.mozFullScreen != 'undefined'){
          response();
        }else if (!document.msFullscreenElement && typeof document.msFullscreenElement != 'undefined'){
          response();
        }else if (!document.fullscreenchange && typeof document.fullscreenchange != 'undefined'){
          response();
        }
      };

      $('#fsDiv').append("<div id='text-container' class='jspsych-display-element'>")
      $('#text-container').append(trial.text)
      $('#text-container').append("<div style="+trial.buttonStyle+"><button id='jspsych-fullscreen-button'>" + trial.button + "</button></div>");

      $('#jspsych-fullscreen-button').on('click',function(){
          if (trial.exit) {
            removeFullScreenSurveillance()
            removeHideSurveillance()
            fullScreenFail = null;
            hideFail = null;
            response = null;
            response2 = null
            quitFullscreen(document.documentElement);
          }else{
            if (checkLaunch()){
              launchIntoFullscreen(document.documentElement);
              if (typeof trial.on_fullscreen_abort != 'undefined'){
                if (typeof trial.on_fullscreen_abort != 'function'){
                  console.error('jspsych-fullscreen response parameter is not a function.');
                }else{
                  addFullScreenSurveillance(fullScreenFail);
                }
              }
            }else{
              trial.on_launch_fail()
            }
            if(checkHide()){
              if (typeof trial.on_hide_fail != 'undefined'){
                if (typeof trial.on_hide_fail != 'function'){
                  console.error('jspsych-fullscreen response parameter is not a function.');
                }else{
                  addHiddenSurveillance(hideFail);
                }
              }
            }else{
              if (typeof trial.on_hide_fail != 'undefined'){
                trial.on_hide_fail()
              }
            }
          }
          display_element.html('');
          jsPsych.finishTrial();
        });
    }

    return plugin;
})();
