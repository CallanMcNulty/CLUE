<?php
include_once "routines/endTurnRoutine.php";

function makeSuggestion($mysqli, $gameId, $playerId, $unseenSuspects, $unseenWeapons, $currentSpace, $nextTurn) {
  include_once "routines/suggestRoutine.php";
  $s = (string)($unseenSuspects[rand(1, count($unseenSuspects))-1]);
  $w = (string)($unseenWeapons[rand(1, count($unseenWeapons))-1]);
  $r = (string)($currentSpace+11);
  $resolverInfo = suggest($mysqli, $gameId, $playerId, $s, $w, $r);
  if($resolverInfo["resolutionFinished"]) {
    endTurn($mysqli, $gameId, $playerId, $nextTurn);
  }
}
function performAITurn($mysqli, $gameId, $playerInfo, $nextTurn) {
  $playerCards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT card_id FROM cards WHERE player_id=".$playerInfo["id"].";"));
  $shownCards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT shown_card,suggested_room FROM history WHERE suggesting_player=".$playerInfo["id"].";"));
  $innocentSuspects = [];
  $innocentWeapons = [];
  $innocentRooms = [];
  foreach(array_merge($playerCards,$shownCards) as $i => $card) {
    if($card[0] < 6) {
      array_push($innocentSuspects, $card[0]);
    } else if($card[0] < 12) {
      array_push($innocentWeapons, $card[0]);
    } else {
      array_push($innocentRooms, $card[0]);
    }
  }
  $unseenSuspects = array_values(array_diff(range(0,5),$innocentSuspects));
  $unseenWeapons = array_values(array_diff(range(6,11),$innocentWeapons));
  $unseenRooms = array_values(array_diff(range(12,20),$innocentRooms));

  if(count($unseenSuspects)==1 && count($unseenWeapons)==1 && count($unseenRooms)==2) {
    include_once "routines/accuseRoutine.php";
    accuse($mysqli, $gameId, $playerInfo["id"], $unseenSuspects[0], $unseenWeapons[0], $unseenRooms[0]);
    return 0;
  }

  include "pullInBoard.php";
  $currentSpace = $board[$playerInfo["piece_space"]];
  if($playerInfo["can_suggest"]) {
    makeSuggestion($mysqli, $gameId, $playerInfo["id"], $unseenSuspects, $unseenWeapons, $currentSpace, $nextTurn);
  } else {
    // MOVE OTHERWISE
    include_once 'routines/rollRoutine.php';
    $roll = roll($mysqli, $gameId, $playerInfo["id"]);

    $paths = array(
      "start-0" => array("3" => [190,189,188,187,186,185,209]),
      "start-1" => array("9" => [121,122,123,124,125,126,102]),
      "start-2" => array("5" => [561,560,559,535,511,487,463]),
      "start-3" => array("6" => [433,434,435,436,437,461]),
      "start-4" => array("2" => [40,64,88,112,136,160,161]),
      "start-5" => array("5" => [566,567,568,544,520,496,472]),
      "9" => array("1" => [102,103,104], "8" => [102,103,127,151,175,199], "4" => []),
      "8" => array("9" => [199,175,151,127,103,102], "1" => [199,200,176,152,128,104], "7" => [267,266,265]),
      "7" => array("8" => [265,266,267], "6" => [366,390,414,438,462,461], "5" => [366,367,368,369,393]),
      "6" => array("5" => [461,462,463], "7" => [461,462,438,414,390,366], "2" => []),
      "5" => array("6" => [463,462,461], "4" => [472,473,449,425,426,427],
        "3" => [398,374,350,326,302,303], "7" => [393,369,368,367,366]
      ),
      "4" => array("3" => [427,426,402,378,377,376,375,351,327,303], "5" => [427,426,425,449,473,472], "9" => []),
      "3" => array("2" => [209,185,161], "4" => [303,327,351,375,376,377,378,402,426,427],
        "5" => [303,302,326,350,374,398], "1" => [209,185,184,183,182,181,180]
      ),
      "2" => array("3" => [161,185,209], "1" => [161,185,184,183,182,181,180], "6" => []),
      "1" => array("1" => [180,181,182,183,184,185,161], "9" => [104,103,102],
        "3" => [180,181,182,183,184,185,209], "8" => [104,128,152,176,200,199]
      )
    );
    if($currentSpace < -1) {
      $availablePaths = $paths["start-".$playerInfo["character_id"]];
    } else if($currentSpace > 0) {
      $availablePaths = $paths["$currentSpace"];
    } else {
      $availablePaths = array();
      foreach($paths as $key1 => $pathSet) {
        foreach ($pathSet as $key2 => $workingPath) {
          foreach ($workingPath as $i => $spaceInPath) {
            if($spaceInPath == $playerInfo["piece_space"]) {
              $availablePaths[$key2] = array_slice($workingPath, $i+1);
              break;
            }
          }
        }
      }
    }
    $occupiedSpaces = mysqli_fetch_all(mysqli_query($mysqli, "SELECT piece_space FROM players WHERE game_id=$gameId;"));
    for($i=0; $i<count($occupiedSpaces); $i++) { $occupiedSpaces[$i] = (int)$occupiedSpaces[$i][0]; }
    $previouslySuggestedRooms = [];
    foreach($shownCards as $i => $row) { array_push($previouslySuggestedRooms, $row[1]); }

    $lowPriorityDestinations = array_merge($innocentRooms, array_values(array_diff($previouslySuggestedRooms,$innocentRooms)));
    $sortedDestinations = array_merge($lowPriorityDestinations, array_values(array_diff(range(12,20), $lowPriorityDestinations)));

    $chosenPath = null;
    while(count($availablePaths)>0) {
      do {
        $destinationRoom = array_pop($sortedDestinations)-11;
      } while(!array_key_exists($destinationRoom, $availablePaths) && $destinationRoom > 0);
      if($destinationRoom < 0) {
        break;
      }
      $chosenPath = $availablePaths[$destinationRoom];
      foreach($chosenPath as $i => $space) {
        if(in_array($space,$occupiedSpaces)) {
          unset($chosenPath);
          $chosenPath = null;
        }
      }
      if($chosenPath) {
        break;
      }
    }
    if($chosenPath != null) {
      if($roll<count($chosenPath)+1) {
        $moveTo = $chosenPath[$roll-1];
      } else {
        $defaultLocationsInRoom = array(57, 66, 282, 522, 490, 504, 336, 169, 25);
        $moveTo = $defaultLocationsInRoom[$destinationRoom-1];
        while(in_array($moveTo, $occupiedSpaces)) {
          $moveTo++;
        }
      }
      include_once "routines/moveRoutine.php";
      $inNewRoom = move($mysqli, $gameId, $playerInfo["id"], $moveTo, $board[$moveTo], $board[$playerInfo["piece_space"]]);
      if($inNewRoom) {
        makeSuggestion($mysqli, $gameId, $playerInfo["id"], $unseenSuspects, $unseenWeapons, $board[$moveTo], $nextTurn);
      } else {
        endTurn($mysqli, $gameId, $playerInfo["id"], $nextTurn);
      }
    } else {
      endTurn($mysqli, $gameId, $playerInfo["id"], $nextTurn);
    }
  }
}
?>
