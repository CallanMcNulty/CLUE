<?php
function accuse($mysqli, $gameId, $playerId, $suspect, $weapon, $room) {
  $turn = mysqli_fetch_array(mysqli_query($mysqli, "SELECT turn_number FROM games WHERE id=$gameId;"))[0];
  $envelopeCards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT card_id FROM cards WHERE game_id=$gameId AND player_id IS NULL;"));
  $correct = true;
  foreach($envelopeCards as $cardId) {
    if($cardId[0] <= 5 && $cardId[0] != $suspect) {
      $correct = false;
    }
    if($cardId[0] > 5 && $cardId[0] <= 11 && $cardId[0] != $weapon) {
      $correct = false;
    }
    if($cardId[0] > 11 && $cardId[0] != $room) {
      $correct = false;
    }
  }
  mysqli_query($mysqli, "INSERT INTO history VALUES ($gameId, $turn, $playerId, $suspect, $weapon, $room, NULL, NULL, true);");

  if($correct) {
    mysqli_query($mysqli, "UPDATE games SET winner=$playerId WHERE id=$gameId;");
    // mysqli_query($mysqli, "UPDATE players SET active=FALSE WHERE game_id=$gameId;");
  } else {
    mysqli_query($mysqli, "UPDATE players SET active=FALSE WHERE id=$playerId;");
    include_once 'routines/endTurnRoutine.php';
    endTurn($mysqli, $gameId, $playerId, $turn);
  }
  return array("correct" => $correct, "envelopeCards" => $envelopeCards);
}
?>
