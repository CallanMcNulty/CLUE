class GamesList extends Component {
  constructor(games, open) {
    super();
    this.games = games;
    this.open = open;
  }
  template() {
    let el = $(`<div class="window" style="width:20em;margin:1em;"><h2>${this.open?"Open":"My"} Games</h2></div>`);
    let noItems = true;
    this.games.forEach(g => {
      if(g.joinable || !this.open) {
        noItems = false;
        let listing = $(`<div>${g.name}: </div>`);
        el.append(listing);
        let joinButton = $(`<button style="margin:.5em;">${this.open?"Join":"Resume"}</button>`);
        listing.append(joinButton);
        joinButton.click(() => {
          if(this.open) {
            $("#overlay").css("display", "flex");
            var joinComponent = new JoinInterface(g.id, g.name);
            joinComponent.insert($("#overlay div")[0]);
          } else {
            linkToChildPath(`play?gameId=${g.id}&playerId=${g.player}`);
          }
        });
      }
    });
    if(noItems) {
      el.append(`<div>No games at this time</div>`);
    }
    return el[0];
  }
}
