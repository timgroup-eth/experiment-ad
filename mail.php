<?php
//SMTP needs accurate times, and the PHP time zone MUST be set
//This should be done in your php.ini, but this is how to do it if you don't have access to that
date_default_timezone_set('Etc/UTC');

require './PHPMailer/PHPMailerAutoload.php';

//Create a new PHPMailer instance
$mail = new PHPMailer;
$mail->isSMTP();
$mail->SMTPDebug = 2;
$mail->Debugoutput = 'html';
$mail->Host = 'smtp.gmail.com';
$mail->Port = 587;
$mail->SMTPSecure = 'tls';
$mail->SMTPAuth = true;
$mail->Username = "helloadrianoesch@gmail.com";
$mail->Password = "slalaphi-158";
$mail->setFrom('', 'Timgroup Experiment');
$mail->addAddress('adereky@ethz.ch', '');
$mail->Subject = 'Timgroup Experiment Notification';

$mail->msgHTML("<h4>Hi!</h4><p>Your next session of the Timgroup experiment is now ready!</p><p>Best regards,<br> the notifciation bot.</p>");

//send the message, check for errors
if (!$mail->send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message sent!";
}
