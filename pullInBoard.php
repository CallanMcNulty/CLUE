<?php
$board = explode(",", file_get_contents('board.txt'));
for($i=0; $i<count($board); $i++) {
  $board[$i] = (int)$board[$i];
}
?>
