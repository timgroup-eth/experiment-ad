<?php
$openshift_data_dir = $_ENV["OPENSHIFT_DATA_DIR"];
$notifFile = $openshift_data_dir.'notifications.txt';
$notifStr = file_get_contents($notifFile);
file_put_contents( $notifFile, $notifStr.$_POST['notifJob']);
?>;
