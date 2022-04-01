import {createRouter, createWebHistory} from 'vue-router'
import GameView from "../views/Game/GameView.vue";
import SongView from "../views/Admin/Song/SongView.vue";
import CreateSongView from "../views/Admin/Song/CreateSongView.vue";
import UpdateSongView from "../views/Admin/Song/UpdateSongView.vue";
import PageNotFound from "../components/PageNotFound/PageNotFound.vue";
import AnswerView from "../views/Admin/Answer/AnswerView.vue";
import LoginView from "../views/Admin/LoginView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/',
            name: 'game',
            component: GameView
        },
        {
            path: '/admin/song',
            name: 'admin',
            component: SongView,
        },
        {
            path: '/admin/song-create',
            name: 'create-song',
            component: CreateSongView
        },
        {
            path: '/admin/song-update/:id',
            name: 'update-song',
            component: UpdateSongView
        },
        {
            path: '/admin/song/:id/answers',
            name: 'song-answers-create',
            component: AnswerView
        },
        {
            path: '/404',
            component: PageNotFound,
            hidden: true
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/404',
            hidden: true
        }
    ]
})

export default router
