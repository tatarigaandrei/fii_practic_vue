import { defineStore } from 'pinia'

export const useGameStore = defineStore({
    id: 'game',
    state: () => ({
        loading: true,
        currentSong: null,
        level: null,
    }),
    getters: {
        getLevel: state => state.level,
        getLoading() {
            return this.loading
        },
        getCurrentSong() {
            return this.currentSong
        },
        getCurrentSongIndex() {
            return this.level > 0 ? this.level - 1 : 0;
        }
    },
    actions: {
        setCurrentSong(currentSong) {
            this.$patch((state) => {
                state.currentSong = currentSong
            })
        },
        setLevel(level) {
            this.$patch((state) => {
                state.level = level
            })
        },
        setLoading(loading) {
            this.$patch((state) => {
                state.loading = loading
            })
        },
    },

})

