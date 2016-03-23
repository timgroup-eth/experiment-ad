<?php
$code = $_GET['code'];
$url = 'https://angel.co/api/oauth/token?';
$data = array(
  'client_id' => 'value1',
  'client_secret' => 'value2',
  'code' => $code,
  'grant_type' => 'authorization_code');

// use key 'http' even if you send the request to https://...
$options = array(
    'http' => array(
        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    )
);
$context  = stream_context_create($options);
$result = file_get_contents($url, false, $context);
if ($result === FALSE) { /* Handle error */ }

var_dump($result);
?>
