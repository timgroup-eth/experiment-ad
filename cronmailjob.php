<?php
//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('CET');
require './PHPMailer/PHPMailerAutoload.php';

$openshift_data_dir = $_ENV["OPENSHIFT_DATA_DIR"];
$notifFile = $openshift_data_dir.'notifications.txt';
$notifStr = file_get_contents($notifFile);
$notifList = explode("\n",$notifStr);
$t0 = strtotime('Now');

function sendNotification($to){
  //Create a new PHPMailer instance
  $mail = new PHPMailer;
  $mail->isSMTP();
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = 'html';
  $mail->Host = 'mail.ethz.ch';
  $mail->Port = 587;
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = "oescha";
  $mail->Password = $_ENV["aomail"];
  $mail->setFrom('adereky@ethz.ch', 'Timgroup Experiment');
  $mail->addAddress($to, '');
  $mail->Subject = 'Online Experiment Notification';
  $mail->msgHTML("<p>Dear participant,<br><br>Your next session of the online experiment is now ready!<br><br>Best regards,<br>The Timgroup notification bot");
};

for($i=0;$i<sizeof($notifList);$i++){
  $row = explode("\t",$notifList[$i]);
  $done = $row[0];
  if($done=='1'){
    echo "done: ".implode("\t",$row);
    continue;
  };
  $t1 = strtotime($row[1]);
  if($t1>$t0){
    echo "not yet: ".implode("\t",$row);
    continue;
  };
  $mailTo = $row[2];
  if($mailTo==''){
    continue;
  };
  sendNotification($mailTo);
  echo "sent: ".implode("\t",$row);
  $row[0] = '1';
  $notifList[$i] = implode("\t",$row);
};

file_put_contents(implode("\n",$notifList));
