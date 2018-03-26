<?php
include_once "checkTurn.php";

$gameId = $_GET['gameId'];
$playerId = $_GET['playerId'];
$suspect = $_GET['suspect'];
$weapon = $_GET['weapon'];
$room = $_GET['room'];
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
if((int)$suspect < 0 || (int)$suspect > 5 || (int)$weapon < 6 || (int)$weapon > 11 || (int)$room < 12 || (int)$room > 20) {
  mysqli_close($mysqli);
  die('{"success":false, "error":3, "message":"suggestion parameters malformed"}');
}

include_once "routines/accuseRoutine.php";
$accusation = accuse($mysqli, $gameId, $playerId, $suspect, $weapon, $room);
if($accusation["correct"]) {
  echo '{"success":true, "error":0, "message":"success", "correct":true}';
} else {
  echo '{"success":true, "error":0, "message":"success", "correct":false, "envelopeCards":['.
    $accusation["envelopeCards"][0][0].','.$accusation["envelopeCards"][1][0].','.$accusation["envelopeCards"][2][0].']}';
}
mysqli_close($mysqli);
?>
