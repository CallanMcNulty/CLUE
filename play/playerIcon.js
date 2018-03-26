class PlayerIcon extends Component {
  constructor(game, player, size=100) {
    super();
    this.g = game;
    this.player = this.g.players.find(p => p.id===player);
    this.isMyPlayer = this.g.myPlayer===this.player.id;
    this.size = size;
  }
  template() {
    // let latestSuggestion = this.g.history[this.g.history.length-1];
    return $(`
      <div style="
        border-radius:50%;width:${this.size}px;height:${this.size}px;position:relative;
        border:${this.size/12}px solid ${cardInfo[this.player.character].color};box-shadow:0 0 6px black;
        background-image:url(${cardInfo[this.player.character].img});background-size:200%;
        background-position-x:center;background-color:#d0d0b0;background-position-y:15%;
      ">
        ${this.isMyPlayer?`
          <div style="position:absolute;left:70%;top:-25%;font-size:${this.size*.5}px;color:orange;">&#9733;</div>
        `:""}
      </div>
    `)[0];
  }
}
