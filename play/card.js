class Card extends Component {
  constructor(cardId, width) {
    super();
    this.id = cardId;
    this.data = cardInfo[cardId];
    this.width = width;
  }
  template() {
    return $(`
      <div style="width:${this.width}px;box-shadow:0 0 6px;border-radius:.5em;font-size:${this.width/7}px;">
        <div style="
          text-align:center;padding:.5em 0 .5em 0;border-radius:.5em .5em 0 0;
          ${this.width>=70?"font-weight:bold;":""}background-color:${this.data.color};
        ">
          ${this.data.name}
        </div>
        <img src="${this.data.img}" style="display:block;width:100%;background-color:#d0d0b0"/>
        <div style="padding:.5em;border-radius:0 0 .5em .5em;background-color:${this.data.color};"></div>
      </div>
    `)[0];
  }
}
class Hand extends Component {
  constructor(hand, width) {
    super();
    this.cards = hand;
    this.width = width;
  }
  template() {
    let el = $(`<div style="display:flex;justify-content:space-around;flex-wrap:wrap;"></div>`);
    this.cards.forEach(c => {
      let card = new Card(c, 100);
      card.insert(el[0]);
      $(card.element).css("margin", ".7em");
    });
    return el[0];
  }
}
