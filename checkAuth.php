<?php
function verifyToken($token, $gameId, $playerId) {
  return $token == createToken($gameId, $playerId);
}
function createToken($gameId, $playerId) {
  $credentials = json_decode(file_get_contents("credentials.json"));
  return hash("sha256", "$gameId.$playerId.".$credentials->password);
}
?>
