function createNotes(g, playerId, playerCards, limit=null) {
  limit = limit===null?g.players.length-1:limit;
  let history = g.history.slice(0,limit);
  let players = g.players;
  let notes = [];
  cardInfo.forEach(() => {
    let row = [];
    notes.push(row);
    players.forEach(p => row.push(null));
  });
  playerCards.forEach(c => addItemToNotes(players, notes, c, playerId, 1));
  history.forEach(his => {
    if(his.shownCard) {
      addItemToNotes(players, notes, his.shownCard, his.resolvingPlayer, 1);
    } else {
      let hisCards = [his.suspect, his.weapon, his.room];
      let toChange = [];
      let resolvingPlayerData = players.find(p => p.id===his.resolvingPlayer);
      if(resolvingPlayerData) {
        for(let i=0; i<3; i++) {
          let token = notes[hisCards[i]][resolvingPlayerData.turn];
          if(token===1) {
            toChange = [];
            break;
          } else if(token!==0) {
            toChange.push(i);
          }
        }
      }
      if(toChange.length===1) {
        addItemToNotes(players, notes, hisCards[toChange[0]], his.resolvingPlayer, 1);
      } else if(toChange.length>1) {
        let maxDigit = 0;
        for(let c=0; c<cardInfo.length; c++) {
          let t = notes[c][players.find(p => p.id===his.resolvingPlayer).turn];
          if(t<0) {
            tString = t+"";
            for(let i=1; i<tString.length; i++) {
              maxDigit = Math.max(maxDigit, parseInt(tString[i]));
            }
          }
        }
        maxDigit++;
        toChange.forEach(index => {
          addItemToNotes(players, notes, hisCards[index], his.resolvingPlayer, maxDigit*-1);
        });
      }
    }
    if(!his.isAccusation) {
      let workingIndex = players.findIndex(p => p.id===his.suggestingPlayer);
      let resolverIndex = players.findIndex(p => p.id===his.resolvingPlayer);
      resolverIndex = resolverIndex===-1?workingIndex:resolverIndex;
      workingIndex++;
      if(workingIndex===players.length) workingIndex = 0;
      while(workingIndex !== resolverIndex) {
        addItemToNotes(players, notes, his.suspect, players[workingIndex].id, 0);
        addItemToNotes(players, notes, his.weapon, players[workingIndex].id, 0);
        addItemToNotes(players, notes, his.room, players[workingIndex].id, 0);
        workingIndex++;
        if(workingIndex===players.length) workingIndex = 0;
      }
    }
  });
  return notes;
}
function cellMatch(a,b) {
  let stringA = a+"";
  let stringB = b+"";
  for(let i=1; i<stringA.length; i++) {
    let index = stringB.indexOf(stringA[i]);
    if(index>-1)
      return index;
  }
  return 0;
}
function addItemToNotes(players, notes, card, playerId, token, checkColumn=true) {
  let player = players.find(p => p.id===playerId);

  let previousToken = notes[card][player.turn];
  if(token===previousToken || cellMatch(token, previousToken)) {
    return;
  }

  if(previousToken<0 && token<0) {
    notes[card][player.turn] = previousToken*10 + token;
  } else {
    notes[card][player.turn] = token;
  }

  if(token===1) {
    players.forEach(p => {
      if(p.id!==player.id)
      addItemToNotes(players, notes, card, p.id, 0);
    });
  }
  if((token===1 || token===0) && checkColumn) {
    let knownCardsCount = 0;
    notes.forEach(c => c[player.turn]===token?knownCardsCount++:0);
    if(knownCardsCount===(token===0?cardInfo.length-player.cardCount:player.cardCount)) {
      for(let c=0; c<cardInfo.length; c++) {
        if(notes[c][player.turn]!==token)
        addItemToNotes(players, notes, c, player.id, token===0?1:0, false);
      }
    }
  }
  if(token===1 && previousToken<0) {
    for(let c=0; c<cardInfo.length; c++) {
      // if(notes[c][player.turn]===previousToken) {
      let matchIndex = cellMatch(notes[c][player.turn], previousToken);
      if(matchIndex) {
        // addItemToNotes(players, notes, c, player.id, null);
        notes[c][player.turn] = parseInt((notes[c][player.turn]+"").replace((previousToken+"")[matchIndex],""));
        notes[c][player.turn] = isNaN(notes[c][player.turn])?null:notes[c][player.turn]
      }
    }
  }
  if(token===0 && previousToken<0) {
    let previousTokenAlt = -1;
    for(let c=0; c<cardInfo.length; c++) {
      let t = notes[c][player.turn];
      // if(t===previousToken) {
      if(cellMatch(t, previousToken)) {
        if(previousTokenAlt!==-1) {
          previousTokenAlt = -1;
          break;
        } else {
          previousTokenAlt = c;
        }
      }
    }
    if(previousTokenAlt>-1) {
      addItemToNotes(players, notes, previousTokenAlt, player.id, 1);
    }
  }
}
