class TabbedContent extends Component {
  constructor(componentArray, tabNames) {
    super();
    this.components = componentArray;
    this.tabNames = tabNames;
    this.activeTab = 0;
  }
  template() {
    let el = $(`<div style="width:100%"></div>`);
    let tabRow = $(`<div style="margin:0 1.5em 0 1.5em;display:flex;"></div>`);
    el.append(tabRow);
    let content = $(`
      <div id="content" style="
        display:flex;justify-content:center;padding:1em;z-index:1;position:relative;
        border-radius:6px;box-shadow:0 0 6px;background-color:white;
      "></div>
    `);
    el.append(content);
    this.tabNames.forEach((name,i) => {
      let tab = $(`
        <div style="
          margin-right:.6em;border-radius:6px 6px 0 0;box-shadow:0 0 6px;padding:.5em;cursor:pointer;
          position:relative;background-color:${this.activeTab===i?"white;z-index:2":"whitesmoke;"};
        ">
          ${name}
          ${this.activeTab===i?`
            <div style="
              height:50%;background-color:inherit;left:0;position:absolute;width:100%;
            "></div>
          `:""}
        </div>
      `);
      tabRow.append(tab);
      tab.click(() => this.showTab(i));
    });
    this.components[this.activeTab].insert(content[0]);
    if(this.components[this.activeTab]===notebookComponent)
      notebookComponent.chooseIteration(g.history.length);
    return el[0];
  }
  showTab(index) {
    this.activeTab = index;
    this.update();
  }
}
