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

$cards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT card_id FROM cards WHERE player_id=$playerId;"));
echo "[";
foreach($cards as $i => $card) {
  echo $card[0];
  if($i<count($cards)-1) {
    echo ",";
  }
}
echo "]";

mysqli_close($mysqli);
?>
