<?php
require_once('PHPMailer/class.phpmailer.php');

$mail = new PHPMailer(); // create a new object
$mail->IsSMTP(); // enable SMTP
$mail->SMTPDebug = 1; // debugging: 1 = errors and messages, 2 = messages only
$mail->SMTPAuth = true; // authentication enabled
$mail->SMTPSecure = 'ssl'; // secure transfer enabled REQUIRED for Gmail
$mail->Host = "smtp.gmail.com";
$mail->Port = 465; // or 587
$mail->IsHTML(true);
$mail->Username = "helloadrianoesch@gmail.com";
$mail->Password = "slalaphi157";
$mail->SetFrom("helloadrianoesch@gmail.com");
$mail->Subject = "Test";
$mail->Body = "hello";
$mail->AddAddress("adrianoesch@gmx.ch");

$mail->From = 'MyUsername@gmail.com';
$mail->FromName = 'Timgroup Experiment';

$mail->IsHTML(false);
$mail->Subject    = "PHPMailer Test Subject via Sendmail, basic";
$mail->Body    = "Hello";

if(!$mail->Send())
{
  echo "Mailer Error: " . $mail->ErrorInfo;
}
else
{
  echo "Message sent!";
}
?>
