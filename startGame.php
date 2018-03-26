<?php
$gameId = $_GET['gameId'];
include "makeConnection.php";

$result = mysqli_fetch_all(mysqli_query($mysqli, "SELECT * FROM players WHERE game_id=$gameId;"), MYSQLI_ASSOC);
$numPlayers = count($result);
$deck = range(0,20);
$envelope = [rand(0,5), rand(6,11), rand(12,20)];
for($i=2; $i>=0; $i--) {
  array_splice($deck, $envelope[$i], 1);
  mysqli_query($mysqli, "INSERT INTO cards VALUES ($gameId, $envelope[$i], NULL);");
}
shuffle($deck);
for($i=0; $i<=17; $i++) {
  mysqli_query($mysqli, "INSERT INTO cards VALUES ($gameId, $deck[$i], ".$result[$i%$numPlayers]["id"].");");
}

$turn = 0;
$firstPlayerIndex = -1;
$characterOrder = [4,0,5,2,3,1];
for($i=0; $i<6; $i++) {
  $char = $characterOrder[$i];
  for($j=0; $j<$numPlayers; $j++) {
    if($result[$j]["character_id"] == $char) {
      mysqli_query($mysqli, "UPDATE players SET turn=$turn WHERE id=".$result[$j]["id"].";");
      if($turn == 0) {
        $firstPlayerIndex = $j;
      }
      $turn++;
    }
  }
}
mysqli_query($mysqli, "UPDATE games SET turn_number=0;");
if($result[$firstPlayerIndex]["ai"]) {
  include_once "performAITurn.php";
  performAITurn($mysqli, $gameId, $result[$firstPlayerIndex], 0);
}

mysqli_close($mysqli);
echo '{"success":true, "error":0, "message":"success"}';
?>
