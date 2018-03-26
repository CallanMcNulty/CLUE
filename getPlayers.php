<?php
$gameId = $_GET['gameId'];
include "makeConnection.php";

$players = mysqli_fetch_all(mysqli_query($mysqli, "SELECT * FROM players WHERE game_id=$gameId;"), MYSQLI_ASSOC);
// foreach($players as $i => $player) {
//   $player["card_count"] = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT COUNT(card_id) FROM cards WHERE game_id=$gameId AND player_id=".$player["id"].";"))[0];
//   foreach($player as $key => $value) {
//     $players[$i][$key] = (int)$value;
//   }
// }
// echo json_encode($players);
echo "[";
foreach($players as $i => $p) {
  $cardCount = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT COUNT(card_id) FROM cards WHERE game_id=$gameId AND player_id=".$p["id"].";"))[0];
  echo '{"id":'.$p["id"].',"character":'.$p["character_id"].',"turn":'.$p["turn"].',"cardCount":'.$cardCount.
    ',"pieceSpace":'.$p["piece_space"].',"canSuggest":'.$p["can_suggest"].',"active":'.$p["active"].'}';
  if($i<count($players)-1) {
    echo ",";
  }
}
echo "]";

mysqli_close($mysqli);
?>
