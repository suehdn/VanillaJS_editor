import Data from './data.js';
import SideBar from './SideBar.js';
import Editor from './Editor.js';
import { request } from './api.js';
import { initRouter } from './router.js';
import { setItem } from './storage.js';

export default class App {
    constructor({ $target }) {
        this.$target = $target;
        const data = new Data();
        data.getDocumentStructure().then(x => {
            this.sideBar = new SideBar({
                $target: this.$target,
                initialState: { list: x },
                editorsetState: this.editor.setState,
            })
        })
        this.editor = new Editor({
            $target: this.$target,
            initialState: {},
            onEditing: (post) => {
                if (this.timer !== null) {
                    clearTimeout(this.timer);
                }
                if (this.sideBar.state.postId) {
                    this.timer = setTimeout(async () => {
                        // setItem(this.postLocalSavekey, {
                        //     ...post,
                        //     tempSaveDate: new Date()
                        // })
                        await request(`/${this.sideBar.state.postId}`, {
                            method: 'PUT',
                            body: JSON.stringify({
                                title: post.title,
                                content: post.content
                            })
                        })
                        // removeItem(this.postLocalSavekey)
                        this.sideBar.render();
                    }, 1000)
                }
            }
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


