<?php

# Include the Autoloader (see "Libraries" for install instructions)
require 'vendor/autoload.php';
use Mailgun\Mailgun;

# Instantiate the client.
$mgClient = new Mailgun('key-7b3005c3c0cc5a7dc6df8f85dca4a725');
$domain = "sandboxf301d7cdb4cf43e5b9c63425d90850dd.mailgun.org";

# Make the call to the client.
$result = $mgClient->sendMessage("$domain",
                  array('from'    => 'Mailgun Sandbox <postmaster@sandboxf301d7cdb4cf43e5b9c63425d90850dd.mailgun.org>',
                        'to'      => 'Adrian Oesch <oescha@ethz.ch>',
                        'subject' => 'Hello Adrian Oesch',
                        'text'    => 'Congratulations Adrian Oesch, you just sent an email with Mailgun!  You are truly awesome!  You can see a record of this email in your logs: https://mailgun.com/cp/log .  You can send up to 300 emails/day from this sandbox server.  Next, you should add your own domain so you can send 10,000 emails/month for free.'));
?>
