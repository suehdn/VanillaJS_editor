import Data from './data.js';
import SideBar from './SideBar.js';

import { initRouter } from './router.js';
import { setItem } from './storage.js';

export default class App {
    constructor({ $target }) {
        this.$target = $target;
        const data = new Data();
        data.getDocumentStructure().then(x => {
            this.sideBar = new SideBar({
                $target: this.$target,
                initialState: { list: x }
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


