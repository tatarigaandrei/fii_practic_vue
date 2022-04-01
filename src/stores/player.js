import { defineStore } from 'pinia'

export const usePlayerStore = defineStore({
    id: 'player',
    state: () => ({
        playerIcon: null,
        globalPlayer: null,
    }),
    getters: {
        getPlayerIcon: (state) => {
            return state.playerIcon
        },
        getPlayerGlobal: (state) => {
            return state.globalPlayer
        }
    },
    actions: {
       setPlayerIcon: (playerIcon) => {
            this.playerIcon = playerIcon
       },
       setGlobalPlayer: (globalPlayer) => {
           this.globalPlayer = globalPlayer
        }
    },

})

