<?php
include_once "checkTurn.php";
function suggest($mysqli, $gameId, $playerId, $suspect, $weapon, $room) {
  mysqli_query($mysqli, "UPDATE players SET can_suggest=false WHERE id=$playerId;");

  $movedPlayer = mysqli_fetch_array(mysqli_query($mysqli, "SELECT id FROM players WHERE character_id=$suspect;"))[0];
  if($movedPlayer != $playerId && $movedPlayer != NULL) {
    $defaultLocationsInRoom = array(57, 66, 282, 522, 490, 504, 336, 169, 25);
    $shiftLocation = $defaultLocationsInRoom[$room-12];
    while(mysqli_fetch_array(mysqli_query($mysqli, "SELECT id FROM players WHERE game_id=$gameId AND piece_space=$shiftLocation;"))[0] != NULL) {
      $shiftLocation++;
    }
    mysqli_query($mysqli, "UPDATE players SET can_suggest=true, piece_space=$shiftLocation WHERE game_id=$gameId AND character_id=$suspect;");
  }

  $numOfPlayers = getNumberOfPlayers($gameId, $mysqli);
  $turn = mysqli_fetch_array(mysqli_query($mysqli, "SELECT turn_number FROM games WHERE id=$gameId;"))[0];
  $playerTurn = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT turn FROM players WHERE id=$playerId"))[0];
  $t = $playerTurn + 1;
  $t = $t==$numOfPlayers?0:$t;
  while($t != $playerTurn) {
    $resolverInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT id,ai FROM players WHERE game_id=$gameId AND turn=$t;"))[0];
    $resolverId = $resolverInfo[0];
    $heldCards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT card_id FROM cards WHERE game_id=$gameId AND player_id=$resolverId;"));
    for($i=0; $i<count($heldCards); $i++) { $heldCards[$i] = $heldCards[$i][0]; }
    $suggestedHeld = array();
    if(in_array($suspect, $heldCards)) { array_push($suggestedHeld, $suspect); }
    if(in_array($weapon, $heldCards)) { array_push($suggestedHeld, $weapon); }
    if(in_array($room, $heldCards)) { array_push($suggestedHeld, $room); }
    if(count($suggestedHeld) > 0) {
      mysqli_query($mysqli, "INSERT INTO history VALUES ($gameId, $turn, $playerId, $suspect, $weapon, $room, $resolverId, ".($resolverInfo[1]?$suggestedHeld[0]:"NULL").", false);");
      return array("resolver" => $resolverId, "resolutionFinished" => $resolverInfo[1]?true:false);
    }
    $t++;
    if($t >= $numOfPlayers) {
      $t = 0;
    }
  }
  if($t==$playerTurn) {
    mysqli_query($mysqli, "INSERT INTO history VALUES ($gameId, $turn, $playerId, $suspect, $weapon, $room, NULL, NULL, false);");
    return array("resolver" => null, "resolutionFinished" => true);
  }
}
?>
