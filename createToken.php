<?php
include_once "checkAuth.php";
echo createToken($_GET['gameId'], $_GET['playerId']);
?>
