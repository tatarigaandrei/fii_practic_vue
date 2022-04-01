import { defineStore } from 'pinia'

export const useGameStore = defineStore({
    id: 'game',
    state: () => ({
        loading: true,
        currentQuestion: null,
        level: null,
    }),
    getters: {
        getLevel: state => state.level,
        getLoading() {
            return this.loading
        },
        getCurrentQuestion() {
            return this.playerIcon
        },
        getCurrentQuestionIndex() {
            return this.level > 0 ? this.level - 1 : 0;
        }
    },
    actions: {
        setCurrentQuestion(currentQuestion) {
            this.$patch((state) => {
                state.currentQuestion = currentQuestion
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

