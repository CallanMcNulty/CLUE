class SuggestionHistory extends Component {
  constructor(g) {
    super();
    this.g = g;
  }
  template() {
    let el = $(`<div style="width:100%;height:80vh;overflow:auto;background-color:whitesmoke;padding-top:1em;"></div>`);
    this.g.history.forEach(his => {
      let row = $(`
        <div style="display:flex;justify-content:center;align-items:center;margin:.3em 0 1.5em 0;"></div>
      `);
      el.prepend(row);
      el.prepend($(`<div style="text-align:center;">Turn ${his.turnNumber+1}</div>`));
      let labelStyle = `white-space:nowrap;-webkit-transform:rotate(90deg);-moz-transform:rotate(-90deg);
        -ms-transform:rotate(-90deg);-o-transform:rotate(-90deg);transform:rotate(-90deg);
        font-size:12px;height:2em;width:5em;text-align:center;margin:0 -1.5em 0 -1em;`
      let suggestingIcon = new PlayerIcon(this.g, his.suggestingPlayer, 40);
      suggestingIcon.insert(row[0]);
      row.append($(`<div style="${labelStyle}">${his.isAccusation?"accused":"suggested"}</div>`));
      let s = new Card(his.suspect, 40);
      s.insert(row[0]);
      $(s.element).css("margin", "0 .7em 0 .7em");
      let w = new Card(his.weapon, 40);
      w.insert(row[0]);
      $(w.element).css("margin", "0 .7em 0 .7em");
      let r = new Card(his.room, 40);
      r.insert(row[0]);
      $(r.element).css("margin", "0 .7em 0 .7em");
      if(his.resolvingPlayer) {
        row.append($(`<div style="${labelStyle}">resolved by</div>`));
        let resolvingIcon = new PlayerIcon(this.g, his.resolvingPlayer, 40);
        resolvingIcon.insert(row[0]);
        if(his.shownCard) {
          row.append($(`<div style="${labelStyle}">who showed</div>`));
          let c = new Card(his.shownCard, 40);
          c.insert(row[0]);
          // $(c.element).css("margin-left", "1.5em");
        }
      }
    });
    return el[0];
  }
}
