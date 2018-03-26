<?php
include "makeConnection.php";

$games = mysqli_fetch_all(mysqli_query($mysqli, "SELECT id,turn_number,password FROM games;"), MYSQLI_ASSOC);
echo "[";
for($i=0; $i<count($games); $i++) {
  echo '{"name":"'.$games[$i]["password"].'","id":'.$games[$i]["id"].',"joinable":'.($games[$i]["turn_number"]==NULL?"true":"false").'}';
  if($i<count($games)-1) { echo ","; }
}
echo "]";

mysqli_close($mysqli);
?>
