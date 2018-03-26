<?php
include_once "checkTurn.php";
function endTurn($mysqli, $gameId, $playerId, $turnNumber) {
  $playerCount = getNumberOfPlayers($gameId, $mysqli);
  $nextTurn = $turnNumber;
  do {
    $nextTurn++;
    $playerInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT id,active FROM players WHERE game_id=$gameId AND turn=".($nextTurn%$playerCount).";"), MYSQLI_ASSOC)[0];
    if($nextTurn > $turnNumber+$playerCount) {
      mysqli_query($mysqli, "UPDATE games SET winner=-1 WHERE id=$gameId;");
      return -1;
    }
  } while($playerInfo["active"] != "1");
  mysqli_query($mysqli, "UPDATE games SET roll=NULL, turn_number=$nextTurn WHERE id=$gameId;");
  mysqli_query($mysqli, "UPDATE players SET can_suggest=false WHERE id=$playerId;");
  $playerInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT id,ai,can_suggest,piece_space,character_id FROM players WHERE game_id=$gameId AND turn=".($nextTurn%$playerCount).";"), MYSQLI_ASSOC)[0];
  if($playerInfo["ai"] == "1") {
    include_once "performAITurn.php";
    performAITurn($mysqli, $gameId, $playerInfo, $nextTurn);
  }
}
?>
