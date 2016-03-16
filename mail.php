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
$mail->setFrom('adereky@ethz.ch', 'Timgroup Experiment');
$mail->addReplyTo('adereky@ethz.ch', 'Anna Dereky');
$mail->addAddress('adrianoesch@gmx.ch', '');
$mail->Subject = 'Reminder Notification';

//Read an HTML message body from an external file, convert referenced images to embedded,
//convert HTML into a basic plain-text alternative body
$mail->msgHTML("<h3>Hi</h3><p>Your next session of the Timgroup experiment is now ready!</p><p>Best regards, the notifciation bot.</p>");

//send the message, check for errors
if (!$mail->send()) {
    echo "Mailer Error: " . $mail->ErrorInfo;
} else {
    echo "Message sent!";
}
