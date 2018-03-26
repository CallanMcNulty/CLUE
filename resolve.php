<?php
$gameId = $_GET['gameId'];
$playerId = $_GET['playerId'];
$card = $_GET['card'];
$token = $_GET['token'];
include_once "checkAuth.php";
if(!verifyToken($token, $gameId, $playerId)) {
  die('{"success":false, "error":100, "message":"not authenticated"}');
}
include "makeConnection.php";

$turn = mysqli_fetch_array(mysqli_query($mysqli, "SELECT turn_number FROM games WHERE id=$gameId;"))[0];
$suggestionInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT * FROM history WHERE game_id=$gameId AND turn_number=$turn AND accusation=0;"), MYSQLI_ASSOC)[0];
$resolvingPlayer = $suggestionInfo["resolving_player"];
if($playerId != $resolvingPlayer) {
  mysqli_close($mysqli);
  die('{"success":false, "error":1, "message":"another player should be resolving this suggestion"}');
}
if($card != $suggestionInfo["suggested_suspect"] && $card != $suggestionInfo["suggested_weapon"] && $card != $suggestionInfo["suggested_room"]) {
  mysqli_close($mysqli);
  die('{"success":false, "error":2, "message":"showed a card that was not part of the suggestion"}');
}
$cards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT card_id FROM cards WHERE player_id=$playerId;"));
if(in_array($card, $cards)) {
  mysqli_close($mysqli);
  die('{"success":false, "error":3, "message":"attempted to show a card that you do not hold"}');
}

mysqli_query($mysqli, "UPDATE history SET shown_card=$card WHERE game_id=$gameId AND turn_number=$turn;");
// mysqli_query($mysqli, "UPDATE games SET roll=NULL, turn_number=".((int)$turn+1)." WHERE id=$gameId;");
if(mysqli_fetch_array(mysqli_query($mysqli, "SELECT ai FROM players WHERE id=".$suggestionInfo["suggesting_player"].";"))[0]) {
  include_once "routines/endTurnRoutine.php";
  endTurn($mysqli, $gameId, $suggestionInfo["suggesting_player"], $turn);
}

mysqli_close($mysqli);
echo '{"success":true, "error":0, "message":"success"}';
?>
