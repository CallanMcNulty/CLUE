class HowTo extends Component {
  constructor(ct) {
    super();
    this.page = 0;
    this.pageCount = ct-1;
  }
  template() {
    let el = $(`
      <div>
        <div style="overflow:auto;max-width:600px;height:80vh;">
          <img src=/how-to-images/page-${this.page}.jpg style="width:100%;" />
        </div>
      </div>
    `);
    let buttonRow = $(`
      <div style="padding:.5em;display:flex;justify-content:space-between;">
        <span>Page ${this.page+1} of ${this.pageCount+1}</span>
      </div>
    `);
    el.prepend(buttonRow);
    if(this.page > 0) {
      let prev = $(`<button style="margin-right:auto;">&#8701;</button>`);
      buttonRow.prepend(prev);
      prev.click(() => {
        this.page--;
        this.update();
      });
    } else {
      buttonRow.find("span").css("margin-left", "auto");
    }
    if(this.page < this.pageCount) {
      let next = $(`<button style="margin-left:auto;">&#8702;</button>`);
      buttonRow.append(next);
      next.click(() => {
        this.page++;
        this.update();
      });
    } else {
      buttonRow.find("span").css("margin-right", "auto");
    }
    let closeRow = $(`<div style="padding:.5em;text-align:center;"></div>`);
    el.append(closeRow);
    let close = $(`<button>Close</button>`);
    closeRow.append(close);
    close.click(() => {
      $("#overlay").hide();
      $(this.element).remove();
    });
    return el[0];
  }
}
