class PlayerDisplay extends Component {
  constructor(game, size=60) {
    super();
    this.g = game;
    this.size = size;
  }
  template() {
    let latestSuggestion = this.g.history[this.g.history.length-1];
    let latestSuggestionIsCurrent = latestSuggestion?latestSuggestion.turnNumber===g.turn:false;
    let currentPlayerData = this.g.players.find(p => p.id===this.g.currentPlayer);
    let containerStyles = `box-shadow:0 0 6px black;margin:1.5em;border-radius:6px;padding:1em;background-color:white;
      display:flex;justify-content:space-around;align-items:center;`;
    let el = $(`
      <div>
        <div id="player-row" style="display:flex;justify-content:space-around;"></div>
        <div style="${containerStyles}">
          ${latestSuggestionIsCurrent?`
            <div id="suggestion" style="display:flex;justify-content:space-between;align-items:center;"></div>
          `:
          this.g.roll && !currentPlayerData.canSuggest?`
            <div style="display:flex;align-items:center;">
              <div>Roll: </div>
              <div style="
                width:30px;height:30px;border:2px solid black;border-radius:6px;;
                display:flex;align-items:center;justify-content:center;margin:6px;
                font-size:20px;font-family:sans-serif;font-weight:bold;
              ">
                ${this.g.roll}
              </div>
              ${this.g.currentPlayer===this.g.myPlayer?
                `<div style="margin:6px;">Use arrow keys to move</div>`:""}
            </div>
          `:`
            <div id="info" style="width:100%;text-align:center;"></div>
          `}
          </div>
        ${this.g.currentPlayer===this.g.myPlayer?`
          <div id="controls" style="${containerStyles}"></div>
        `:""}
      </div>
    `);
    let playerRow = el.find("#player-row");
    this.g.players.forEach(p => {
      let icon = new PlayerIcon(this.g, p.id, this.size);
      icon.insert(playerRow);
      $(icon.element).css("margin", "0 .5em 0 .5em");
      if(latestSuggestionIsCurrent && latestSuggestion.resolvingPlayer===p.id)
        $(icon.element).css("box-shadow", "0 0 36px orange");
      if(this.g.currentPlayer===p.id) $(icon.element).css("top", "2em");

      // $(icon.element).click(() => window.location.href =
      //   `${window.location.origin}${window.location.pathname}?gameId=${this.g.id}&playerId=${p.id}`);
    });

    let suggestion = el.find("#suggestion")[0];
    if(suggestion) {
      let labelStyle = `white-space:nowrap;-webkit-transform:rotate(90deg);-moz-transform:rotate(-90deg);
        -ms-transform:rotate(-90deg);-o-transform:rotate(-90deg);transform:rotate(-90deg);`
      let s = new Card(latestSuggestion.suspect, this.size);
      s.insert(suggestion);
      $(suggestion).append(`<div style="${labelStyle}">with the</div>`);
      let w = new Card(latestSuggestion.weapon, this.size);
      w.insert(suggestion);
      $(suggestion).append(`<div style="${labelStyle}">in the</div>`);
      let r = new Card(latestSuggestion.room, this.size);
      r.insert(suggestion);
      if(latestSuggestion.resolvingPlayer===this.g.myPlayer) {
        [s,w,r].filter(cardElement => this.g.myCards.includes(cardElement.id)).forEach(cardEl => {
          $(cardEl.element).css("box-shadow", "0 0 36px orange");
          $(cardEl.element).css("margin",".5em");
          $(cardEl.element).css("margin-bottom","0");
          $(cardEl.element).click(() => this.g.resolve(cardEl.id, () => startAutoUpdate()));
        });
        el.append(`
          <div style="text-align:center;">Choose a card to reveal to
            ${cardInfo[this.g.players.find(p => p.id===latestSuggestion.suggestingPlayer).character].name}
          </div>
        `);
      }
      let shownCardIndex = [latestSuggestion.suspect,latestSuggestion.weapon,latestSuggestion.room]
        .indexOf(latestSuggestion.shownCard);
      if(shownCardIndex!==-1) {
        let shownCard = [s,w,r][shownCardIndex];
        $(shownCard.element).css("position", "relative");
        $(shownCard.element).append(`
          <div style="
            position:absolute;top:10%;width:100%;text-align:center;
            font-size:${shownCard.width}px;font-weight:bold;color:orangered;
          ">
            &#10005;
          </div>
        `);
      }
    }

    let info = el.find("#info")[0];
    let controls = el.find("#controls")[0];
    if(info) {
      if(this.g.currentPlayer===this.g.myPlayer) {
        if(!this.g.roll) {
          if(!currentPlayerData.canSuggest) $(info).append($(`<span>Your Turn</span>`));
          if(this.g.roll===null) {
            let rollButton = $(`<button>Roll</button>`);
            $(controls).append(rollButton);
            rollButton.click(() => {
              this.g.performRoll(() => {
                this.update();
                boardComponent.changeMovingPlayer();
                tabbedContentComponent.showTab(0);
              });
            });
          }
        }
        if(currentPlayerData.canSuggest) {
          let selector = new CardSelector(this.size*0.8, 6);
          selector.insert(info);
          let suggestButton = $(`<button>Suggest</button>`);
          $(controls).append(suggestButton);
          suggestButton.click(() =>
            this.g.suggest(selector.selectedSuspect, selector.selectedWeapon, () => startAutoUpdate())
          );
        }
      } else {
        $(info).append(`<span>Taking turn...</span>`);
      }
    }

    if(this.g.currentPlayer===this.g.myPlayer) {
      if(this.g.roll && !currentPlayerData.canSuggest && !suggestion) {
        let moveButton = $(`<button>Move</button>`);
        $(controls).append(moveButton);
        moveButton.click(() => this.g.move(boardComponent.path.splice(1,boardComponent.path.length-1), () => {
          boardComponent.path = [];
          boardComponent.update();
          this.update();
        }));
      }
      let accuseButton = $(`<button>Accuse</button>`);
      $(controls).append(accuseButton);
      accuseButton.click(() => {
        $(info).empty();
        let selector = new CardSelector(this.size*0.8, 6, true);
        selector.insert(info);
        $(controls).empty();
        let finalAccuseButton = $(`<button>Submit final accusation</button>`);
        $(controls).append(finalAccuseButton);
        finalAccuseButton.click(() =>
          this.g.accuse(selector.selectedSuspect, selector.selectedWeapon, selector.selectedRoom, () => startAutoUpdate())
        );
      });
      // accuseButton.click(() => this.g.accuse(() => this.update()));
      let endTurnButton = $(`<button>End Turn</button>`);
      $(controls).append(endTurnButton);
      // endTurnButton.click(() => this.g.endTurn(() => this.update()));
      endTurnButton.click(() => this.g.endTurn(() => startAutoUpdate()));
    }

    // if(this.g.currentPlayer===this.g.myPlayer) {
    // }

    return el[0];
  }
}
