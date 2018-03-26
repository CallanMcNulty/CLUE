<?php
$credentials = json_decode(file_get_contents("credentials.json"));
$mysqli = mysqli_connect("127.0.0.1", $credentials->username,
  $credentials->password, $credentials->dbName, "3306");
?>
