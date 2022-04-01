<template>
  <main>
    <div class="container">
      <div class="row text-center">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="title-wrapper">
            <h1>Ghiceste melodia</h1>
          </div>
          <div v-if="!gameStore.level" class="button-wrapper">
            <button @click="start" type="button" class="btn btn-primary">Start</button>
          </div>
          <div class="current-question-wrapper">
            <div class="progress-wrapper" v-if="questions && this.gameStore.level">
              <i
                  :class="[progressClass(index)]"
                  v-for="(item, index) in questions"></i>
            </div>
            <div class="player-wrapper">
              <audio-player v-if="gameStore.currentQuestion"
                            :video-id=" gameStore.currentQuestion.video_id"
                            :start-seconds=" gameStore.currentQuestion.start"
                            :end-seconds="gameStore.currentQuestion.end"
                            @next="nextLevel"
              ></audio-player>
            </div>
            <div class="answers-wrapper" v-if="gameStore.currentQuestion">
              <div class="list-group">
                <a
                    v-for="(item, index) in gameStore.currentQuestion.answers"
                    :key="index"
                    @click="verifyAnswer(item)"
                    :class="answerClass(item)"

                >
                  {{ item.name }}</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>
<script>
import {usePlayerStore} from "../stores/player.js";
import HelloWorld from "../components/HelloWorld.vue";
import {checkQuestion, getQuestions} from "../api/questionsEndpoints";
import {useGameStore} from "../stores/game";
import AudioPlayer from "../components/Player/AudioPlayer.vue";
import playerStateIcons from "../components/constants/player";

export default {
  components: {AudioPlayer, HelloWorld},
  setup() {
    const playerStore = usePlayerStore();
    const gameStore = useGameStore();

    return {playerStore, gameStore}
  },
  data() {
    return {
      questions: null,
      currentAnswer: null,
      correctAnswer: null,
      result: [],
    }
  },
  created() {
  },
  mounted() {
    this.setQuestions()
  },
  computed: {},
  methods: {
    async setQuestions() {
      this.gameStore.setLoading(true)
      try {
        let response = await getQuestions()
        this.questions = response.data
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
    },
    start() {
      this.gameStore.setLevel(1)
      this.updateCurrentQuestion()
    },
    updateCurrentQuestion() {
      this.gameStore.setCurrentQuestion(this.questions[this.gameStore.getCurrentQuestionIndex])
    },
    hasNextQuestion() {
      return this.questions[this.gameStore.getCurrentQuestionIndex + 1] !== undefined
    },
    nextLevel(){
      console.log('next-level');
      this.gameStore.setLevel(this.gameStore.level + 1)
      this.updateCurrentQuestion()
      if(this.gameStore.currentQuestion) {
        this.playerStore.globalPlayer.loadVideoById({
          videoId: this.gameStore.currentQuestion.video_id,
          startSeconds: this.gameStore.currentQuestion.start,
          endSeconds: this.gameStore.currentQuestion.end,
        })
      }
    },
    async verifyAnswer(answer) {
      this.gameStore.setLoading(true)
      this.currentAnswer = answer
      try{
        let response = await checkQuestion(this.gameStore.currentQuestion.id, answer.id)
        this.correctAnswer = response.data ? answer : false
        if (this.result[this.gameStore.getCurrentQuestionIndex] === undefined) {
          this.result[this.gameStore.getCurrentQuestionIndex] = (response.data)
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
      if (this.hasNextQuestion()) {
        this.playerStore.playerIcon = playerStateIcons.next
        // this.nextLevel()
      } else {
        this.playerStore.playerIcon = playerStateIcons.stop
      }
    },
    answerClass(answer) {
      return {
        'answer list-group-item bt-1 mt-3': true,
        'active': this.currentAnswer && this.currentAnswer.id === answer.id && this.correctAnswer,
        'error': this.currentAnswer && this.currentAnswer.id === answer.id && !this.correctAnswer,
      }
    },
    progressClass(index) {
      return {
        red: this.result.length > index && this.result[index] === false,
        green: this.result.length > index && this.result[index] === true,
        "bi bi-circle-fill p-2": this.result.length > index,
        "bi bi-circle p-2": this.result.length <= index,
      }
    }
  },
}
</script>
<style>

</style>