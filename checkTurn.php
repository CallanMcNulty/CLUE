<?php
function getNumberOfPlayers($gameId, $mysqli) {
  return mysqli_fetch_array(mysqli_query($mysqli, "SELECT COUNT(id) FROM players WHERE game_id=$gameId;"))[0];
}
function getCurrentPlayer($gameId, $mysqli) {
  $gameInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT turn_number,winner FROM games WHERE id=$gameId;"), MYSQLI_ASSOC)[0];
  if($gameInfo["winner"]) {
    return -1;
  }
  $currentTurn = $gameInfo["turn_number"];
  $playerCount = getNumberOfPlayers($gameId, $mysqli);
  $playerTurn = $currentTurn%$playerCount;
  $checkedCount = 0;
  do {
    $playerInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT id,active FROM players WHERE game_id=$gameId AND turn=$playerTurn;"), MYSQLI_ASSOC)[0];
    $playerTurn++;
    if($playerTurn>$playerCount) {
      $playerTurn = 0;
    }
    $checkedCount++;
    if($checkedCount > $playerCount) {
      return -1;
    }
  } while($playerInfo["active"] != "1");
  return (int)$playerInfo["id"];
}
?>
