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
$turnNumber = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT turn_number FROM games WHERE id=$gameId;"))[0];
$waitingForResolution = mysqli_fetch_array(mysqli_query($mysqli,
  "SELECT COUNT(turn_number) FROM history WHERE game_id=$gameId AND turn_number=$turnNumber AND resolving_player IS NOT NULL AND shown_card IS NULL;")
)[0];
if($waitingForResolution == "1") {
  die('{"success":false, "error":2, "message":"awaiting unresolved suggestion"}');
}
include_once 'routines/endTurnRoutine.php';
endTurn($mysqli, $gameId, $playerId, $turnNumber);
mysqli_close($mysqli);
echo '{"success":true, "error":0, "message":"success"}';
?>
