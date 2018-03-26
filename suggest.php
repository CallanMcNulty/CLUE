<?php
include_once "checkTurn.php";

$gameId = $_GET['gameId'];
$playerId = $_GET['playerId'];
$suspect = $_GET['suspect'];
$weapon = $_GET['weapon'];
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
if(!(bool)mysqli_fetch_array(mysqli_query($mysqli, "SELECT can_suggest FROM players WHERE id=$playerId;"))[0]) {
  mysqli_close($mysqli);
  die('{"success":false, "error":2, "message":"not able to suggest at this time"}');
}
$roomIndex = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT piece_space FROM players WHERE id=$playerId;"))[0];
include_once "pullInBoard.php";
$room = $board[$roomIndex] + 11;
if((int)$suspect < 0 || (int)$suspect > 5 || (int)$weapon < 6 || (int)$weapon > 11 || (int)$room < 12 || (int)$room > 20) {
    mysqli_close($mysqli);
    die('{"success":false, "error":3, "message":"suggestion parameters malformed"}');
}

include_once "routines/suggestRoutine.php";
$resolverInfo = suggest($mysqli, $gameId, $playerId, $suspect, $weapon, $room);
echo '{"success":true, "error":0, "message":"success", "resolvingPlayer":'.(
  $resolverInfo["resolver"]==null?"null":$resolverInfo["resolver"]).'}';

mysqli_close($mysqli);
?>
