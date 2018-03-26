<?php
include_once "checkAuth.php";

$gameId = $_GET['gameId'];
$characterId = $_GET['characterId'];
$isAI = $_GET['isAI'];
include "makeConnection.php";

if(mysqli_fetch_array(mysqli_query($mysqli, "SELECT turn_number FROM games WHERE id=$gameId;"))[0] != null) {
  die('{"success":false, "error":1, "message":"game has already begun"}');
}
if((int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT COUNT(id) FROM players WHERE game_id=$gameId AND character_id=$characterId;"))[0] > 0) {
  die('{"success":false, "error":2, "message":"character already chosen"}');
}
include_once "pullInBoard.php";
$space = array_search("-".(string)((int)$characterId+11), $board);
$maxIdInDb = mysqli_fetch_array(mysqli_query($mysqli, "SELECT MAX(id) FROM players;"))[0];
$playerId = $maxIdInDb + 1;
mysqli_query($mysqli, "INSERT INTO players VALUES ($playerId, $gameId, $characterId, -1, $space, false, true, $isAI);");

mysqli_close($mysqli);
echo '{"success":true, "error":0, "id":'.$playerId.', "token":"'.createToken($gameId, $playerId).'", "message":"success"}';
?>
