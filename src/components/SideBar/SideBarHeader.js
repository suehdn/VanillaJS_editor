export default class SideBarHeader {
  constructor({ $target }) {
    this.$sideBarHeader = document.createElement("section");
    this.$sideBarHeader.className = "sidebar__section--header";
    this.$sideBarHeader.innerHTML = `H의 Notion
                <div class = 'filePage__root-add--add'>         
                <button class = "filePage__button--add" data-id="null"><span class = 'filePage__root-add--add'>새로운 페이지 추가 <img src="../png/square_plus_icon_24.png"></span></button>
            </div>`;
    $target.appendChild(this.$sideBarHeader);
  }
}
