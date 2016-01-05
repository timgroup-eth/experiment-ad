/**
 * Adrian Oesch
 * Oktober 2015
 *
 *
 */
 jsPsych['response-table'] = (function(){

   var plugin = {};

   plugin.create = function(params) {
     var trials = new Array();
     trials[0] = {};
     trials[0].type = "response-table";
     trials[0].words = params.words
     trials[0].header = params.header
     trials[0].rows = params.rows
     trials[0].cols = params.cols
     trials[0].tdStyle = (typeof params.tdStyle === 'undefined') ? {} : params.tdStyle ;
     trials[0].tableStyle = (typeof params.tableStyle === 'undefined') ? {} : params.tableStyle ;
     // supporting the generic data object with the following line
     // is always a good idea. it allows people to pass in the data
     // parameter, but if they don't it gracefully adds an empty object
     // in it's place.
     trials[0].data = (typeof params.data === 'undefined') ? {} : params.data[0];
     return trials;
   };

   plugin.trial = function(display_element, trial){
    //  prepare html table
     trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
     $('*').css('cursor', '')
     rows = trial.rows;
     cols = trial.cols;
     tdStyle = trial.tdStyle;
     tableStyle = trial.tableStyle;

     response_table = "<table id='response_table' style='"+tableStyle+"'>";
     idx=0;
     for (i=0;i<rows;i++){
       response_table = response_table.concat('<tr>');
       for(j=0;j<cols;j++){
         tdStr = "<td class='teAc' style='"+tdStyle+"'id='r"+(i+1).toString()+"-c"+(j+1).toString()+"'>"+trial.words[idx]+"</td>";
         response_table = response_table.concat(tdStr);
         idx+=1;
       }
       response_table = response_table.concat('</tr>');
     }
     response_table = response_table.concat("</table>");

     // prepare end function
     var endTrial = function(){
       var lastTable = jsPsych.data.getTrialsOfType('response-table');
       var repetition = lastTable.length>1 ? trialIdx == lastTable[lastTable.length-1]['trial_idx'] : false;

       trial_data = {
         "words_presented" :trial.words,
         "rt": JSON.stringify(responseTimes),
         "location": JSON.stringify(responseLocation),
         "text": JSON.stringify(responseContent),
         "trial_idx" : trialIdx,
         "repetition" : repetition
       };
       jsPsych.data.write(trial_data);
       // clear the display
       display_element.html('')
       $('*').css('cursor', 'none')
       // move on to the next trial
       jsPsych.finishTrial();
     }

     //  prepare response arrays
     responseTimes = [];
     responseLocation = [];
     responseContent = [];

    //  show table
     display_element.html(trial.header+response_table);
     $(".teAc").mouseenter(function(){$(this).css("background", "rgb(180,180,180)")});
     $(".teAc").mouseleave(function(){$(this).css("background", "")});

    // and start listening and recording
     idx = 0;
     t0 = Date.now();
     $(".teAc").click(function(event){
       t1 = Date.now();
       responseTimes.push(t1-t0);
       responseContent.push(event.target.textContent);
       responseLocation.push(event.target.id);
       var that = this
       $(that).css("background", "rgb(100,100,100)");
       setTimeout(function(){
         if ($(that).is(':hover')){
            $(that).css("background", "rgb(180,180,180)")
         }else{
           $(that).css("background", "")
         };
       },100);
       t0=t1;
       if (idx==4){setTimeout(endTrial,150);}
       idx+=1;
     });
  }

  return plugin;
})();
