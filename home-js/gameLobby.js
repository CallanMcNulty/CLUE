class GameLobby extends Component {
  constructor(gameInfo) {
    super();
    this.gameInfo = gameInfo;
    this.g = null;
    this.aiPlayerFormShowing = false;
    this.updateId = this.startAutoUpdate();
  }
  template() {
    let el = $(`<div><h3 style="text-align:center;">${this.gameInfo.name}</h3></div>`);
    let currentPlayersRow = $(`
      <div style="display:flex;align-items:center;justify-content:center;">
        <div>Players: </div>
      </div>
    `);
    el.append(currentPlayersRow);
    if(this.g) {
      this.g.players.forEach(p => {
        let icon = new PlayerIcon(this.g, p.id, 45);
        icon.insert(currentPlayersRow[0]);
        $(icon.element).css("margin-left","1em");
      });
    }
    if(this.aiPlayerFormShowing) {
      let aiPlayerForm = $(`<div style="text-align:center;margin:1em;">Character: </div>`);
      el.append(aiPlayerForm);
      let characterSelect = $(`<select></select>`);
      aiPlayerForm.append(characterSelect);
      for(let i=0; i<6; i++) {
        if(this.g && this.g.players.findIndex(p => p.character===i)===-1) {
          let o = $(`<option value="${i}">${cardInfo[i].name}</option>`);
          characterSelect.append(o);
        }
      }
      let createAi = $(`<button style="margin-left:1em;">Create AI Player</button>`);
      aiPlayerForm.append(createAi);
      createAi.click(() => {
        $.ajax({
          url: `join.php?gameId=${this.gameInfo.id}&characterId=${characterSelect.val()}&isAI=true`,
          success: (result) => {
            let r = JSON.parse(result);
            console.log(r);
            if(r.success) {
              this.aiPlayerFormShowing = false;
            }
            this.update()
          }
        });
      });
      let cancelButton = $(`<button style="margin-left:1em;">Cancel</button>`);
      aiPlayerForm.append(cancelButton);
      cancelButton.click(() => {this.aiPlayerFormShowing = false;this.update();})
    } else {
      let addAi = $(`<button style="margin-left:1em;">Add AI</button>`);
      currentPlayersRow.append(addAi);
      addAi.click(() => {this.aiPlayerFormShowing = true;this.update();})
    }
    let label = $(`<div style="text-align:center;margin:1em;">waiting for players to join...</div>`);
    el.append(label);
    let begin = $(`<div style="text-align:center;margin:1em;"></div>`);
    el.append(begin);
    let beginButton = $(`<button>Start Game</button>`);
    begin.append(beginButton);
    beginButton.click(() => {
      $.ajax({
        url: `startGame.php?gameId=${this.gameInfo.id}`,
        success: (result) => {
          let data = JSON.parse(result);
          window.location.href = window.location.origin+`/play?gameId=${this.gameInfo.id}&playerId=${this.gameInfo.player}`;
        }
      });
    });
    return el[0];
  }
  startAutoUpdate() {
    return window.setInterval(() => {
      $.ajax({
        url: `update.php?gameId=${this.gameInfo.id}&playerId=${this.gameInfo.player}&token=${this.gameInfo.token}`,
        success: (result) => {
          let data = JSON.parse(result);
          console.log(data);
          let prevPlayerCount = 0;
          if(this.g) {
            prevPlayerCount = this.g.players.length;
          }
          this.g = {players:[], myPlayer:this.gameInfo.player};
          data.pieces.forEach(piece => this.g.players.push({id:piece.player,character:piece.character}));
          if(this.g.players.length!==prevPlayerCount) {
            this.update();
          }
          if(data.currentTurn!==null) {
            window.location.href = window.location.origin+`/play?gameId=${this.gameInfo.id}&playerId=${this.gameInfo.player}`;
          }
        }
      });
    }, 1000);
  }
  stopAutoUpdate() {
    window.clearInterval(this.updateId);
  }
}
