class Board extends Component {
  constructor(game, spaceSize=21) {
    super();
    this.g = game;
    this.remainingRoll = this.g.roll;
    this.spaceSize = spaceSize;
    this.player = this.g.myPlayer;
    this.path = [];
    this.npcPositions = [null,null,null,null,null,null,null,null,null,null,null,null];
    this.defaultNpcPositions = [84,68,308,501,491,507,338,195,51];
    this.spaceColors = ["beige","#b48a72","#f9f8a9","#b5e3e4","#d5ffe6",
                      "#8d2424","#d3d3d3","#188518","#9b7c92","#a39644"];
    this.northDoors = [233,289,417,422,451];
    this.eastDoors = [198,365,471,460];
    this.southDoors = [78,137,155,156,243];
    this.westDoors = [105,304,464];
    this.roomLabelPositions = [59,114,331,547,513,504,336,169,25];
  }
  template() {
    let el = $(`
      <div style="
        display:inline-block;position:relative;
        width:${this.spaceSize*24}px;height:${this.spaceSize*25}px;
      "></div>
    `);
    // <img src="boardimages/board.png" style="width:${this.spaceSize*24}px;" />
    // ${this.player!==null?`
    //   <div style="text-align:center;">
    //     <button id="finish">Make Move</button>
    //     <button id="cancel">Cancel</button>
    //   </div>
    // `:""}
    this.g.board.forEach((s,i) => {
      let background = "";
      let sString = s+"";
      if(s===0 || s<-1) {
        background = `background-image:url(${baseHref}art/hallway-space.png);`;
      } else if(sString.length===2 && sString[1]==="0") {
        let direction = -90;
        if(this.northDoors.includes(i)) {
          direction = 0;
        } else if(this.eastDoors.includes(i)) {
          direction = 90;
        } else if(this.southDoors.includes(i)) {
          direction = 180;
        }
        background = `
          background-color:${this.spaceColors[s/10]};
          transform:rotate(${direction}deg);
          background-image:url(${baseHref}art/north-door-space.png);
        `;
      } else if(s>0 && sString.length===1) {
        background = `background-color:${this.spaceColors[s]};`;
      } else if(s>0) {
        background = `background-image:url(${baseHref}art/secret-passage-space.png);`;
      }
      el.append(`
        <div style="
          position:absolute;width:${this.spaceSize}px;height:${this.spaceSize}px;
          left:${Math.floor((i%24)*this.spaceSize)}px;
          top:${Math.floor(Math.floor(i/24)*this.spaceSize)}px;
          ${background}background-size:cover;
        "></div>
      `);
    });
    this.roomLabelPositions.forEach((pos,i) => {
      el.append(`
        <div style="
          position:absolute;max-width:${this.spaceSize*6}px;text-align:center;color:rgba(0,0,0,.5);
          font-size:${this.spaceSize}px;font-weight:bold;
          left:${Math.floor((pos%24)*this.spaceSize)}px;top:${Math.floor(Math.floor(pos/24)*this.spaceSize)}px;
        ">
          ${i===5?cardInfo[i+12].name.toUpperCase().split("").join("&shy;"):cardInfo[i+12].name.toUpperCase()}
        </div>
      `);
    });
    // background-color:${this.spaceColors[s]};
    // ${s===0?"background-image:url(art/hallway-space.png);background-size:cover;":""}
    // ${(s+"").length===2&&(s+"")[1]==="0"?"background-image:url(art/hallway-space.png);background-size:cover;":""}
    this.path.forEach((p,i) => {
      el.append(`
        <div style="
          position:absolute;width:${this.spaceSize}px;height:${this.spaceSize}px;
          display:flex;justify-content:center;align-items:center;
          left:${Math.floor((p%24)*this.spaceSize)}px;
          top:${Math.floor(Math.floor(p/24)*this.spaceSize)}px;
        ">
          <div style="
            background-color:orangered;border-radius:50%;box-shadow:0 0 4px black;text-align:center;
            color:white;font-weight:bold;font-size:${Math.floor(this.spaceSize*.7)}px;
            width:${Math.floor(this.spaceSize*.7)}px;height:${Math.floor(this.spaceSize*.7)}px;
          ">
            ${(i===this.path.length-1&&this.path.length>1)?this.remainingRoll:""}
          </div>
        </div>
      `);
    });
    // this.g.players.forEach(p => {
    //   el.append(`
    //     <div style="
    //       position:absolute;width:${this.spaceSize}px;height:${this.spaceSize}px;text-align:center;
    //       left:${Math.floor((p.pieceSpace%24)*this.spaceSize)}px;
    //       top:${Math.floor(Math.floor(p.pieceSpace/24)*this.spaceSize)}px;
    //       color:${cardInfo[p.character].color};font-size:${this.spaceSize}px;
    //     ">
    //       &#9823;
    //     </div>
    //   `);
    // });
    for(let i=0; i<12; i++) {
      let tokenPosition = this.positionNpc(i);
      let player = this.g.players.find(p => p.character===i);
      if(player) {
        tokenPosition = player.pieceSpace;
      } else {
        for(let j=this.g.history.length-1; j>=0; j--) {
          let his = this.g.history[j];
          if(his.weapon===i || his.suspect===i) {
            if(tokenPosition===null || this.g.board[tokenPosition]!==his.room-11) {
              this.positionNpc(i,his.room);
            }
            break;
          }
        }
      }
      if(tokenPosition !== null) {
        el.append(`
          <div style="
            position:absolute;width:${this.spaceSize*1.5}px;height:${this.spaceSize*1.5}px;
            left:${Math.floor((tokenPosition%24)*this.spaceSize - this.spaceSize*.25)}px;
            top:${Math.floor(Math.floor(tokenPosition/24)*this.spaceSize - this.spaceSize*.65)}px;
            background-image:url(${cardInfo[i].img});background-size:cover;
          ">
          </div>
        `);
      }
    }
    // el.find("#finish").click(() => this.g.move(this.path.splice(1,this.path.length-1), () => {
    //   playerDisplayComponent.update();
    //   this.path = [];
    //   this.update();
    //   playerDisplayComponent.update();
    // }));
    return el[0];
  }
  positionNpc(id, newRoom=null) {
    if(newRoom===null) {
      return this.npcPositions[id];
    }
    let newPosition = this.defaultNpcPositions[newRoom-12];
    while(this.g.board[newPosition]!==newRoom-11 || this.npcPositions.indexOf(newPosition)>-1 ||
      this.g.players.findIndex(p => p.pieceSpace===newPosition)>-1) {
      let rand = Math.random();
      if(rand<.25) {
        newPosition+=24;
      } else if(rand<.5) {
        newPosition-=24;
      } else if(rand<.75) {
        newPosition++;
      } else {
        newPosition--;
      }
    }
    this.npcPositions[id] = newPosition;
    return newPosition;
  }
  changeMovingPlayer(playerId=null) {
    this.player = playerId?playerId:this.player;
    this.path = [this.g.players.find(p => p.id===this.player).pieceSpace];
    this.remainingRoll = this.g.roll;
    this.update();
  }
  move(direction) {
    if(!this.player || this.remainingRoll===null) return;
    let current = this.path[this.path.length-1];
    let next;
    switch(direction) {
      case "right":
        next = current+1;
        break;
      case "left":
        next = current-1;
        break;
      case "down":
        next = current+24;
        break;
      case "up":
        next = current-24;
        break;
    }
    let playerInNextSpace = this.g.players.find(p=>p.pieceSpace===next);
    let currentContents = this.g.board[current];
    let nextContents = this.g.board[next];
    if(next<0 || next>600 || ((current%24)+(next%24)===23 && (current%24)*(next%24)===0) ||
      (playerInNextSpace && playerInNextSpace.id!==this.player && nextContents===0) ||
      (this.path.includes(next) && next!==this.path[this.path.length-2]) ||
      (currentContents+nextContents>0 && currentContents+nextContents<10 &&
      currentContents*nextContents===0) || nextContents===-1) {
      return;
    }
    if(next===this.path[this.path.length-2]) {
      this.path.splice(this.path.length-1, 1);
      if(nextContents===0 || currentContents===0) this.remainingRoll++;
    } else {
      if(this.remainingRoll<=0 && (nextContents===0 || currentContents===0)) return;
      this.path.push(next);
      if(nextContents===0 || currentContents===0) this.remainingRoll--;
      if(nextContents>10 && nextContents%10!==0) {
        let targetPassage = parseInt((nextContents+"").split("").reverse().join(""));
        this.path.push(this.g.board.indexOf(targetPassage));
        this.remainingRoll = 0;
      }
    }
    this.update();
  }
}
