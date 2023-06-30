import Data from './data.js';
import SideBar from './SideBar.js';
import Editor from './Editor.js';
import { initRouter } from './router.js';

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
        this.route();
        initRouter(() => this.route());
    }

    route = () => {
        //     const {pathname} = window.location;

        //     if(pathname === '/'){

        //     }
    }



}


