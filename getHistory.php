<?php
$gameId = $_GET['gameId'];
$playerId = $_GET['playerId'];
$token = $_GET['token'];
include_once "checkAuth.php";
if(!verifyToken($token, $gameId, $playerId)) {
  die('{"success":false, "error":100, "message":"not authenticated"}');
}
include "makeConnection.php";

$history = mysqli_fetch_all(mysqli_query($mysqli, "SELECT * FROM history WHERE game_id=$gameId;"), MYSQLI_ASSOC);
echo "[";
foreach($history as $i => $item) {
  echo '{"turnNumber":'.$item["turn_number"].',"suggestingPlayer":'.$item["suggesting_player"].
  ',"isAccusation":'.($item["accusation"]?"true":"false").',"suspect":'.$item["suggested_suspect"].',"weapon":'.$item["suggested_weapon"].
  ',"room":'.$item["suggested_room"].',"resolvingPlayer":'.($item["resolving_player"]?$item["resolving_player"]:'null');
  if($item["suggesting_player"] == $playerId || $item["resolving_player"] == $playerId) {
    echo ',"shownCard":'.($item["shown_card"]?$item["shown_card"]:"null").'}';
  } else {
    echo '}';
  }
  if($i<count($history)-1) {
    echo ",";
  }
}
echo "]";

mysqli_close($mysqli);
?>
