<?php
include_once "checkTurn.php";

$gameId = $_GET['gameId'];
$playerId = $_GET['playerId'];
$token = $_GET['token'];
include_once "checkAuth.php";
if(!verifyToken($token, $gameId, $playerId)) {
  die('{"success":false, "error":100, "message":"not authenticated"}');
}
include "makeConnection.php";

if($playerId != getCurrentPlayer($gameId, $mysqli)) {
  mysqli_close($mysqli);
  die('{"success":false, "error":1, "message":"not your turn"}');
}

$gameInfo = mysqli_fetch_array(mysqli_query($mysqli, "SELECT roll,turn_number FROM games WHERE id=$gameId;"), MYSQLI_ASSOC);
$roll = $gameInfo["roll"];
$waitingForResolution = mysqli_fetch_array(mysqli_query($mysqli, "SELECT COUNT(turn_number) FROM history WHERE game_id=$gameId AND turn_number=".$gameInfo["turn_number"].";"))[0];
if($waitingForResolution == "1") {
  die('{"success":false, "error":3, "message":"awaiting unresolved suggestion"}');
}
if($roll != NULL) {
  die('{"success":false, "roll":'.$roll.', "error":2, "message":"you already rolled"}');
}

include_once 'routines/rollRoutine.php';
$roll = roll($mysqli, $gameId, $playerId);

mysqli_close($mysqli);
echo '{"success":true, "roll":'.$roll.', "error":0, "message":"success"}';
?>
