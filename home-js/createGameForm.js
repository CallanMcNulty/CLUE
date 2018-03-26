class CreateGameForm extends Component {
  constructor() {
    super();
  }
  template() {
    let el = $(`
      <div>
        <h3 style="text-align:center;">Create Game</h3>
        <span>Game Name: </span>
      </div>
    `);
    let nameField = $(`<input type="text" required />`);
    el.append(nameField);
    let submit = $(`<div style="text-align:center;margin:1em;"></div>`);
    el.append(submit);
    let submitButton = $(`<button>Create</button>`);
    submit.append(submitButton);
    submitButton.click(() => {
      let name = nameField.val();
      if(name.length<3) return;
      submitButton.hide();
      $.ajax({
        url: `createGame.php?password=${name}`,
        success: (result) => {
          let data = JSON.parse(result);
          console.log(data);
          if(data.success) {
            let join = new JoinInterface(data.gameId, name);
            join.parent = this.element.parentNode;
            this.element.remove();
            join.insert();
          } else {
            submitButton.show();
          }
        }
      });
    });
    return el[0];
  }
}
