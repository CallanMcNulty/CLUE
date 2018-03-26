<?php
function roll($mysqli, $gameId, $playerId) {
  // srand(0);
  $roll = rand(1,6)+rand(1,6);
  mysqli_query($mysqli, "UPDATE games SET roll=$roll WHERE id=$gameId;");
  mysqli_query($mysqli, "UPDATE players SET can_suggest=false WHERE id=$playerId;");
  return $roll;
}
?>
