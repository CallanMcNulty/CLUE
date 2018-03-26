<?php
include_once "checkTurn.php";

$gameId = $_GET['gameId'];
$playerId = $_GET['playerId'];
$spaces = $_GET['spaces'];
$token = $_GET['token'];
include_once "checkAuth.php";
if(!verifyToken($token, $gameId, $playerId)) {
  die('{"success":false, "error":100, "message":"not authenticated"}');
}
include "makeConnection.php";

if($playerId != getCurrentPlayer($gameId, $mysqli)) {
  mysqli_close($mysqli);
  die('{"success":false, "error":1, "message":"not your turn"}');
}

$playerInfo = mysqli_fetch_all(mysqli_query($mysqli, "SELECT piece_space, can_suggest FROM players WHERE id=$playerId;"), MYSQLI_ASSOC)[0];
if($playerInfo["can_suggest"] == "1") {
  mysqli_close($mysqli);
  die('{"success":false, "error":10, "message":"you already moved"}');
}

$gameInfo = mysqli_fetch_array(mysqli_query($mysqli, "SELECT roll, turn_number FROM games WHERE id=$gameId;"), MYSQLI_ASSOC);
include_once "pullInBoard.php";
$path = explode(",",$spaces);
// $currentSpace = (int)mysqli_fetch_array(mysqli_query($mysqli, "SELECT piece_space FROM players WHERE id=$playerId;"))[0];
$currentSpace = $playerInfo["piece_space"];
$occupiedSpaces = mysqli_fetch_all(mysqli_query($mysqli, "SELECT piece_space FROM players WHERE game_id=$gameId;"));
for($i=0; $i<count($occupiedSpaces); $i++) { $occupiedSpaces[$i] = (int)$occupiedSpaces[$i][0]; }
$beginsInRoom = $board[$currentSpace];
$hasMoved = 0;
for($i=0; $i<count($path); $i++) {
  $currentSpaceContents = $board[$currentSpace];
  $nextSpace = (int)$path[$i];
  $nextSpaceContents = $board[$nextSpace];
  if($nextSpaceContents==0 || $currentSpaceContents==0) {
    $hasMoved++;
  }
  if($hasMoved > $gameInfo["roll"]) {
    mysqli_close($mysqli);
    die('{"success":false, "error":9, "movement":'.$hasMoved.', "message":"movement exceeds roll"}');
  }
  // $currentSpaceContents = $board[$currentSpace];
  // $nextSpace = (int)$path[$i];
  // $nextSpaceContents = $board[$nextSpace];
  // check for invalid space
  if($nextSpaceContents==-1) {
    mysqli_close($mysqli);
    die('{"success":false, "error":5, "message":"attempting to move off the board"}');
  }
  // check for walking through walls
  if(($nextSpaceContents==0 && $currentSpaceContents>0 && $currentSpaceContents<10) ||
      ($currentSpaceContents==0 && $nextSpaceContents>0 && $nextSpaceContents<10)) {
    mysqli_close($mysqli);
    die('{"success":false, "error":7, "message":"attempting to walk through walls"}');
  }
  // check for re-entry
  if($beginsInRoom>0 && $nextSpaceContents==$beginsInRoom*10 && $currentSpaceContents==0) {
    mysqli_close($mysqli);
    die('{"success":false, "error":5, "message":"attempting to re-enter a room"}');
  }
  // check for leaving entered room
  if($beginsInRoom!=$currentSpaceContents && $nextSpaceContents>=10 && $currentSpaceContents>0 && $currentSpaceContents<10) {
    mysqli_close($mysqli);
    die('{"success":false, "error":6, "message":"attempting to leave an entered room"}');
  }
  // check for crossing path
  for($j=0; $j<$i; $j++) {
    if($path[$i]==$path[$j]) {
      mysqli_close($mysqli);
      die('{"success":false, "error":3, "message":"moving through same space twice"}');
    }
  }
  // check for occupied space
  if(in_array($nextSpace, $occupiedSpaces) && $nextSpaceContents<1) {
    mysqli_close($mysqli);
    die('{"success":false, "error":4, "message":"path blocked by another piece"}');
  }
  // check for contiguity
  if(abs($nextSpace-$currentSpace)!=24 && abs($nextSpace%24-$currentSpace%24)!=1 &&
    !($beginsInRoom > 0 && $currentSpaceContents>10 && (string)$nextSpaceContents==strrev((string)$currentSpaceContents))) {
    mysqli_close($mysqli);
    die('{"success":false, "error":2, "message":"non-contiguous path"}');
  }
  $currentSpace = $nextSpace;
}
if(in_array($currentSpace, $occupiedSpaces) || $nextSpaceContents>=10) {
  mysqli_close($mysqli);
  die('{"success":false, "error":8, "message":"cannot end movement on a door, secret passage, or occupied space"}');
}

include_once "routines/moveRoutine.php";
move($mysqli, $gameId, $playerId, $currentSpace, $nextSpaceContents, $beginsInRoom);

mysqli_close($mysqli);
echo '{"success":true, "error":0, "message":"success"}';
?>
