import Data from './data.js';
import SideBar from './SideBar.js';
import Editor from './Editor.js';

const DUMMY_DATA = [
    {
        "id": 1, // Document id
        "title": "노션을 만들자", // Document title
        "documents": [
            {
                "id": 2,
                "title": "블라블라",
                "documents": [
                    {
                        "id": 3,
                        "title": "함냐함냐",
                        "documents": []
                    }
                ]
            }
        ]
    },
    {
        "id": 4,
        "title": "hello!",
        "documents": []
    }
]

export default class App {
    constructor({ $target }) {
        this.$target = $target;
        const data = new Data();
        const sideBar = new SideBar({
            $target: this.$target,
            initialState: DUMMY_DATA
        })
        const editor = new Editor({
            $target: this.$target,
            initialState: DUMMY_DATA
        })

    }
}


