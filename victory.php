<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://code.jquery.com/jquery-3.2.1.min.js" integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4=" crossorigin="anonymous"></script>
    <title>CLUE</title>
    <script src="/play/cardInfo.js"></script>
    <script src="/play/framework-core.js"></script>
    <script src="/play/card.js"></script>
  </head>
  <style media="screen">
    button {
      background-color: beige;
      border: none;
      min-width: 5em;
      padding: .5em;
      box-shadow: 0 0 6px;
      border-radius: 6px;
      cursor: pointer;
    }
    button:hover {
      background-color: #d0d0b0;
    }
  </style>
  <?php
    $gameId = $_GET['gameId'];
    include "makeConnection.php";
    $winner = mysqli_fetch_array(mysqli_query($mysqli, "SELECT winner FROM games WHERE id=$gameId;"))[0];
  ?>
  <body style="margin:0;background-color:beige;padding:1em;text-align:center;">
    <?php
      if($winner === NULL) {
        echo "Game still in progress.";
      } else {
        $character = mysqli_fetch_array(mysqli_query($mysqli, "SELECT character_id FROM players WHERE id=$winner AND game_id=$gameId;"))[0];
        $envelopeCards = mysqli_fetch_all(mysqli_query($mysqli, "SELECT card_id FROM cards WHERE game_id=$gameId AND player_id IS NULL;"));
    ?>
    <script type="text/javascript">
      let cards = <?php echo json_encode($envelopeCards); ?>;
      for(let i=0; i<3; i++) {
        cards[i] = parseInt(cards[i][0]);
      }
      cards.sort((a,b) => a-b);
      let character = <?php echo $character; ?>;
      let el = $(`
        <div style="
          display:inline-block;background-color:white;border-radius:6px;box-shadow:0 0 6px;padding:1em;
        ">
          <h1>The winner is...</h1>
          <h2>${cardInfo[character].name}</h2>
          <img src="${cardInfo[character].img}" style="background-color:darkslategrey;border-radius:6px;max-width:220px;">
          <h3>It was...</h3>
        </div>
      `);
      $("body").append(el);
      let cardRow = $(`<div style="display:flex;justify-content:center;"></div>`);
      el.append(cardRow);
      let labelStyle = `white-space:nowrap;-webkit-transform:rotate(90deg);-moz-transform:rotate(-90deg);
        -ms-transform:rotate(-90deg);-o-transform:rotate(-90deg);transform:rotate(-90deg);`
      cards.forEach(cardId => {
        let cel = new Card(cardId, 90);
        cel.insert(cardRow[0]);
        $(cel.element).css("margin", "0 1em 2em 1em");
      });
      let home = $(`<button>Home</button>`);
      el.append(home);
      home.click(() => window.location.href = window.location.origin);
    </script>
    <?php
      }
    ?>
  </body>
<html>
