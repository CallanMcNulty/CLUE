<?php
$password = $_GET['password'];
include "makeConnection.php";

$numGamesInDb = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT MAX(id) FROM games;"))[0];
$gameId = $numGamesInDb + 1;
mysqli_query($mysqli, 'INSERT INTO games VALUES ('.$gameId.', "'.$password.'", NULL, NULL, NULL);');

mysqli_close($mysqli);
echo '{"success":true, "gameId":'.$gameId.', "error":0, "message":"success"}';
?>
