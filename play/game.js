class Game {
  constructor(gameId, playerId, token) {
    this.id = gameId;
    this.turn = null;
    this.currentPlayer = null;
    this.myPlayer = playerId;
    this.myCards = null;
    this.myToken = token;
    this.roll = null;
    this.players = [];
    this.board = [];
    this.history = [];
  }
  init(callback) {
    $.when(
      $.ajax({
        url: "board.txt",
        success: (result) => this.board = JSON.parse("["+result+"]")
      }),
      $.ajax({
        url: `getPlayers.php?gameId=${this.id}`,
        success: (result) => this.players = JSON.parse(result).sort((a,b) => a.turn-b.turn)
      }),
      $.ajax({
        url: `getCards.php?gameId=${this.id}&playerId=${this.myPlayer}&token=${this.myToken}`,
        success: (result) => this.myCards = JSON.parse(result)
      })
    ).done(this.update(callback));
  }
  update(callback) {
    $.when(
      $.ajax({
        url: `update.php?gameId=${this.id}&playerId=${this.myPlayer}&token=${this.myToken}`,
        success: (result) => {
          let data = JSON.parse(result);
          console.log(data);
          this.turn = data.currentTurn;
          this.currentPlayer = data.currentPlayer;
          this.players.find(p => p.id===data.currentPlayer).canSuggest = data.currentPlayerCanSuggest;
          data.pieces.forEach(piece => this.players.find(p => p.id===piece.player).pieceSpace = piece.space);
          // data.latestSuggestion.suggestingPlayer = this.currentPlayer;
          // data.latestSuggestion.turnNumber = this.turn;
          // this.history.append(data.latestSuggestion);
          this.roll = data.latestRoll;
        }
      }),
      $.ajax({
        url: `getHistory.php?gameId=${this.id}&playerId=${this.myPlayer}&token=${this.myToken}`,
        success: (result) => this.history = JSON.parse(result)
      })
    ).done(() => callback?callback():null);
  }
  performRoll(callback) {
    $.ajax({
      url: `roll.php?gameId=${this.id}&playerId=${this.myPlayer}&token=${this.myToken}`,
      success: (result) => {
        let r = JSON.parse(result);
        console.log(r);
        this.update(callback);
      }
    });
  }
  move(path, callback) {
    $.ajax({
      url: `move.php?gameId=${this.id}&playerId=${this.myPlayer}&spaces=${path.join(",")}&token=${this.myToken}`,
      success: (result) => {
        let r = JSON.parse(result);
        console.log(r);
        this.update(callback);
      }
    });
  }
  suggest(suspectId, weaponId, callback) {
    $.ajax({
      url: `suggest.php?gameId=${this.id}&playerId=${this.myPlayer}&suspect=${suspectId
            }&weapon=${weaponId}&token=${this.myToken}`,
      success: (result) => {
        let r = JSON.parse(result);
        console.log(r);
        this.update(callback);
      }
    });
  }
  resolve(card, callback) {
    $.ajax({
      url: `resolve.php?gameId=${this.id}&playerId=${this.myPlayer}&card=${card}&token=${this.myToken}`,
      success: (result) => {
        let r = JSON.parse(result);
        console.log(r);
        this.update(callback);
      }
    });
  }
  endTurn(callback) {
    $.ajax({
      url: `endTurn.php?gameId=${this.id}&playerId=${this.myPlayer}&token=${this.myToken}`,
      success: (result) => {
        let r = JSON.parse(result);
        console.log(r);
        this.update(callback);
      }
    });
  }
  accuse(suspectId, weaponId, roomId, callback) {
    $.ajax({
      url: `accuse.php?gameId=${this.id}&playerId=${this.myPlayer}&suspect=${suspectId
            }&weapon=${weaponId}&room=${roomId}&token=${this.myToken}`,
      success: (result) => {
        console.log(result);
        let r = JSON.parse(result);
        this.update(callback);
      }
    });
  }
}
