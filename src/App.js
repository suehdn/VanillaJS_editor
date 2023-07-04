import Data from './data.js';
import SideBar from './SideBar.js';
import Editor from './Editor.js';
import { initRouter } from './router.js';

export default class App {
    constructor({ $target }) {
        this.$target = $target;
        this.data = new Data();

        this.data.getDocumentStructure().then(x => {
            this.editor = new Editor({
                $target: this.$target,
                initialState: {},
                onEditing: (post) => {
                    if (this.timer !== null) {
                        clearTimeout(this.timer);
                    }
                    if (this.sideBar.state.postId) {
                        this.timer = setTimeout(async () => {
                            this.data.editDocument(this.sideBar.state.postId, post.title, post.content);
                            this.sideBar.render();
                        }, 1000)
                    }
                }
            })
            this.sideBar = new SideBar({
                $target: this.$target,
                initialState: { list: x },
                editorsetState: this.editor.setState
            })
            this.route();
        })



        initRouter(() => this.route());
    }

    route = () => {
        const { pathname } = window.location;

        if (pathname.indexOf('/posts/') === 0) {
            const [, , postId] = pathname.split('/');
            console.log(this.sideBar);
            this.sideBar.setState({ postId: postId })
        }
    }
}


