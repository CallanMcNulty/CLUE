class Notebook extends Component {
  constructor(game) {
    super();
    this.g = game;
    this.chooseIteration(this.g.history.length);
  }
  template() {
    let cellStyles = `text-align:center;min-width:1.5em;border:1px solid grey;`;
    let el = $(`<div></div>`);
    let table = $(`<table style="border-collapse:collapse;"></table>`);
    el.append(table);
    let navigationStyles = `min-width:0;width:2em;height:2em;border-radius:50%;font-weight:bold;
      border:none;margin:.5em 0 .5em 0;box-shadow:0 0 6px black;cursor:pointer;outline:none;`;
    let playerRow = $(`
      <tr>
        <style>#back,#forward{background-color:beige;}#back:hover,#forward:hover {background-color:#d0d0b0;}</style>
        <th><button id="back" style="${navigationStyles}">&#8701;</button></th>
        <th><button id="forward" style="${navigationStyles}">&#8702;</button></th>
      </tr>
    `);
    table.append(playerRow);
    let latestSuggestion = this.g.history[this.iteration-1];
    this.g.players.forEach(p => playerRow.append($(`
      <th style="${cellStyles}background-color:${cardInfo[p.character].color};color:orange;position:relative;">
        ${p.id===this.g.myPlayer?"&#9733;":""}
        ${(latestSuggestion && p.id===latestSuggestion.suggestingPlayer)?`
          <div style="
            position:absolute;width:100%;height:100%;top:0;left:0;box-sizing:border-box;border:3px solid orange;
          "></div>
        `:""}
      </th>
    `)));
    this.notes.forEach((notesRow,i) => {
      let row = $(`
        <tr style="background-color:beige;">
          <th style="
            min-width:1.5em;background-image:url(${cardInfo[i].img});background-size:contain;
            background-position:center;background-repeat:no-repeat;border:1px solid grey;border-right:0;
          "></th>
          <th style="border:1px solid grey;border-left:0;">${cardInfo[i].name}</th>
        </tr>
      `);
      table.append(row);
      notesRow.forEach((token,j) => {
        let cellSuggested = latestSuggestion&&this.g.players[j].id===latestSuggestion.resolvingPlayer&&
          (i===latestSuggestion.suspect||i===latestSuggestion.weapon||i===latestSuggestion.room);
        row.append($(`
          <td style="${
            cellStyles}color:${token===0?"red":token===1?"green":"blue"};
            ${cellSuggested?'background-color:orange;':""}
          ">${
            token!==null?(
              token>=0?["&#10007;","&#10003;"][token]
              :
              (token*-1+"").split("").join(", ")
            ):""}
          </td>
        `));
      });
    });
    el.find("#back").click(() => {this.chooseIteration(this.iteration-1); this.update();});
    el.find("#forward").click(() => {this.chooseIteration(this.iteration+1); this.update();});
    return el[0];
  }
  chooseIteration(it) {
    it = Math.max(0,it);
    it = Math.min(this.g.history.length,it);
    this.iteration = it;
    this.notes = createNotes(this.g, this.g.myPlayer, this.g.myCards, this.iteration);
  }
}
