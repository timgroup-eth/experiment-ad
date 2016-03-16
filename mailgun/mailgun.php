<?php
# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

$to = $_POST['to'];
$deliveryTime = $_POST['deliveryTime'];

# Instantiate the client.
$mgClient = new Mailgun('key-7b3005c3c0cc5a7dc6df8f85dca4a725');
$domain = "sandboxf301d7cdb4cf43e5b9c63425d90850dd.mailgun.org";

# Make the call to the client.
$result = $mgClient->sendMessage("$domain",
                  array('from'    => 'Mailgun Sandbox <postmaster@sandboxf301d7cdb4cf43e5b9c63425d90850dd.mailgun.org>',
                        'to'      => $to,
                        'subject' => 'Timgroup Experiment Notification',
                        'text'    => 'Hi! \n\n The next session of the experiment is now available. Please reopen the link from qualtrics and continue with the next task. \n\n Best regards, the notification bot.',
                        'o:delivertime' => $deliveryTime ));
?>
