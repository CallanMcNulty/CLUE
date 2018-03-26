class CardSelector extends Component {
  constructor(cardSize=100, rowLength=3, includeRooms=false) {
    super();
    this.includeRooms = includeRooms;
    this.cardSize = cardSize;
    this.rowLength = rowLength;
    this.selectedSuspect = null;
    this.selectedWeapon = null;
    this.selectedRoom = null;
  }
  template() {
    let el = $("<div></div>");
    let rowStyle = `display:flex;justify-content:space-around;align-items:center;margin-bottom:1em;`;
    let row;
    for(let i=0; i<21; i++) {
      if(i>=12 && !this.includeRooms) break;
      let rowNumber = Math.floor(i/this.rowLength);
      if(i%this.rowLength===0) {
        row = $(`<div style="${rowStyle}"></div>`);
        el.append(row);
      }
      let card = new Card(i, this.cardSize);
      card.insert(row[0]);
      $(card.element).click(() => this.select(card.id));
      $(card.element).css("margin", `0 .5em 0 .5em`);
      if(this.selectedSuspect===i || this.selectedWeapon===i || this.selectedRoom===i)
        $(card.element).css("box-shadow", `0 0 ${this.cardSize/2.5}px orange`);
    }
    return el[0];
  }
  select(cardId) {
    if(cardId<6) {
      this.selectedSuspect = cardId;
    } else if(cardId < 12) {
      this.selectedWeapon = cardId;
    } else if(cardId < 21) {
      this.selectedRoom = cardId;
    }
    this.update();
  }
}
