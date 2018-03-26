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

$currentPlayer = getCurrentPlayer($gameId, $mysqli);
$gameData = mysqli_fetch_all(mysqli_query($mysqli, "SELECT turn_number,roll FROM games WHERE id=$gameId;"), MYSQLI_ASSOC)[0];
$canSuggest = mysqli_fetch_array(mysqli_query($mysqli, "SELECT can_suggest FROM players WHERE id=$currentPlayer;"))[0];
echo '{"success":true, "error":0, "message":"success", "currentTurn":'.
  ($gameData["turn_number"]!=NULL?$gameData["turn_number"]:"null").', "currentPlayer":'.$currentPlayer.
  ', "currentPlayerCanSuggest":'.($canSuggest?$canSuggest:"null").', "latestRoll":'.($gameData["roll"]!=NULL?$gameData["roll"]:"null").', "pieces": [';

$occupiedSpaces = mysqli_fetch_all(mysqli_query($mysqli, "SELECT id,character_id,piece_space FROM players WHERE game_id=$gameId;"), MYSQLI_ASSOC);
for($i=0; $i<count($occupiedSpaces); $i++) {
  echo '{"player":'.$occupiedSpaces[$i]["id"].',"character":'.$occupiedSpaces[$i]["character_id"].',"space":'.$occupiedSpaces[$i]["piece_space"].'}';
  if($i<count($occupiedSpaces)-1) { echo ","; }
}

$suggestion = mysqli_fetch_all(mysqli_query($mysqli, "SELECT * FROM history WHERE game_id=$gameId AND turn_number=".$gameData["turn_number"].";"), MYSQLI_ASSOC)[0];

if($suggestion["suggested_weapon"]) {
  echo '], "latestSuggestion":{"suspect":'.$suggestion["suggested_suspect"].', "weapon":'.$suggestion["suggested_weapon"].', "room":'.$suggestion["suggested_room"].
    ', "resolvingPlayer":'.($suggestion["resolving_player"]?$suggestion["resolving_player"]:"null").
    ($playerId==$suggestion["suggesting_player"]?', "shownCard":'.($suggestion["shown_card"]?$suggestion["shown_card"]:"null"):"").'}';
} else {
  echo '], "latestSuggestion":null';
}
echo "}";

mysqli_close($mysqli);
?>
