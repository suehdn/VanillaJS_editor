import Data from './data.js';
import SideBar from './SideBar.js';
import Editor from './Editor.js';

export default class App {
    constructor({ $target }) {
        this.$target = $target;
        const data = new Data();
        data.getDocumentStructure().then(x => {
            const sideBar = new SideBar({
                $target: this.$target,
                initialState: x
            })
            const editor = new Editor({
                $target: this.$target,
                initialState: x
            })
        })
    }


}


