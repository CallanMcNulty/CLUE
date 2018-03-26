class JoinInterface extends Component {
  constructor(gameId, gameName) {
    super();
    this.characterOptions = [0,1,2,3,4,5];
    this.chosenCharacterIndex = 0;
    this.gameId = gameId;
    this.gameName = gameName;
  }
  template() {
    let el = $(`<div><h3 style="text-align:center;">Choose Your Character</h3></div>`);
    let charRow = $(`
      <div style="
        display:flex;align-items:center;justify-content:center;
        background-color:darkslategrey;padding:1em;max-width:600px;
      "></div>
    `);
    el.append(charRow);
    this.characterOptions.forEach((id,i) => {
      let characterPortrait = $(`
        <img src="${cardInfo[id].img}"
          style="width:15%;border:4px solid;border-radius:10%;
          border-color:${i===this.chosenCharacterIndex?"orange":"transparent"};
        " />
      `);
      characterPortrait.click(() => {
        this.chosenCharacterIndex = i;
        this.update();
      });
      charRow.append(characterPortrait);
    });
    el.append(`
      <h4 style="text-align:center;">
        ${cardInfo[this.characterOptions[this.chosenCharacterIndex]].name}
      </h4>
    `);
    let buttonHolder = $(`<div style="text-align:center;"></div>`);
    el.append(buttonHolder);
    let joinButton = $(`<button>Join</button>`);
    buttonHolder.append(joinButton);
    let messageHolder = $(`<div style="text-align:center;margin-top:1em;"></div>`);
    el.append(messageHolder);
    joinButton.click(() => {
      joinButton.hide();
      $.ajax({
        url: `join.php?gameId=${this.gameId}&characterId=${this.characterOptions[this.chosenCharacterIndex]}&isAI=false`,
        success: (result) => {
          let r = JSON.parse(result);
          console.log(r);
          if(r.success) {
            let info = {"id":this.gameId, "name":this.gameName, "player":r.id, "token":r.token};
            currentGames.push(info);
            localStorage.setItem("current-games", JSON.stringify(currentGames));
            this.element.remove();
            let lobby = new GameLobby(info);
            lobby.previousSibling = this.previousSibling;
            lobby.parent = this.parent;
            lobby.insert();
          } else {
            joinButton.show();
            if(r.error===2) {
              this.characterOptions.splice(this.chosenCharacterIndex,1);
              this.chosenCharacterIndex = 0;
              this.update();
            }
            messageHolder.text(r.message);
          }
        }
      });
    });
    return el[0];
  }
}
