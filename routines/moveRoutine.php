<?php
function move($mysqli, $gameId, $playerId, $currentSpace, $nextSpaceContents, $beginsInRoom) {
  mysqli_query($mysqli, "UPDATE players SET piece_space=$currentSpace WHERE id=$playerId;");
  if($nextSpaceContents > 0 && $nextSpaceContents != $beginsInRoom) {
    mysqli_query($mysqli, "UPDATE players SET can_suggest=true WHERE id=$playerId;");
    return true;
  } else {
    mysqli_query($mysqli, "UPDATE games SET roll=0 WHERE id=$gameId;");
    return false;
  }
}
?>
