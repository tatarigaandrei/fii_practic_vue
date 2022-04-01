<template>
  <main>
    <div class="container custom-container">
      <div class="row text-center">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="title-wrapper p-5">
            <h1>Guess the song</h1>
          </div>
          <div v-if="!gameStore.level" class="button-wrapper">
            <button @click="start" type="button" class="btn btn-primary">Start</button>
          </div>
          <div class="current-question-wrapper">
            <div class="progress-wrapper" v-if="questions && this.gameStore.level">
              <i
                  :key="index"
                  class="bi bi-circle p2"
                  :data-progress-id="item.id"
                  v-for="(item, index) in questions"></i>
            </div>
            <div class="player-wrapper">
              <audio-player v-if="gameStore.currentSong"
                            @next="nextLevel"
              ></audio-player>
            </div>
            <div class="answers-wrapper" v-if="gameStore.currentSong">
              <div class="">
                <a
                    v-for="(item, index) in gameStore.currentSong.answers"
                    :key="index"
                    :data-answer-id="item.id"
                    @click="verifyAnswer(item)"
                    class="answer"
                >
                  {{ item.text }}</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>
<script>
import {usePlayerStore} from "../../stores/player.js";
import HelloWorld from "../../components/HelloWorld.vue";
import {checkQuestion, getQuestions} from "../../api/questionsEndpoints.js";
import {useGameStore} from "../../stores/game.js";
import AudioPlayer from "../../components/Player/AudioPlayer.vue";
import playerStateIcons from "../../components/constants/player.js";

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
      result: [],
    }
  },
  mounted() {
    this.gameStore.setCurrentSong(null)
    this.setQuestions()
  },
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
      this.updateCurrentSong()
    },
    updateCurrentSong() {
      this.gameStore.setCurrentSong(this.questions[this.gameStore.getCurrentSongIndex])
    },
    hasNextQuestion() {
      return this.questions[this.gameStore.getCurrentSongIndex + 1] !== undefined
    },
    nextLevel() {
      this.gameStore.setLevel(this.gameStore.level + 1)
      this.resetAnswerClass()
      this.updateCurrentSong()
      if (this.gameStore.currentSong) {
        this.playerStore.globalPlayer.loadVideoById({
          videoId: this.gameStore.currentSong.video_id,
          startSeconds: this.gameStore.currentSong.start,
          endSeconds: this.gameStore.currentSong.end,
        })
        this.playerStore.playerIcon = playerStateIcons.pause;
      }
    },
    async verifyAnswer(answer) {
      this.gameStore.setLoading(true)
      try {
        // if (this.result[this.gameStore.getCurrentSongIndex] === undefined) {
        let response = await checkQuestion(this.gameStore.currentSong.id, answer.id)
        this.updateProgressClass(response.data)
        this.updateAnswerClass(answer, response.data)

        this.result[this.gameStore.getCurrentSongIndex] = (response.data)
        // }
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
      if (this.hasNextQuestion()) {
        this.playerStore.playerIcon = playerStateIcons.next
      } else {
        this.playerStore.playerIcon = playerStateIcons.stop
      }
    },
    resetAnswerClass() {
      Array.from(document.querySelectorAll('.answer')).forEach(function (el) {
        el.classList.remove('success');
        el.classList.remove('error');
      });
    },
    updateAnswerClass(answer, status) {
      const currentAnswerElement = document.querySelector(`[data-answer-id="${answer.id}"]`)
      if (currentAnswerElement) {
        console.log('current-answer-element-found');
        if (status) {
          currentAnswerElement.classList.add('success');
        } else {
          currentAnswerElement.classList.add('error');
        }
      }
    },
    updateProgressClass(status) {
      const currentSongId = this.gameStore.currentSong.id;
      let currentProgressElement = document.querySelector(`[data-progress-id="${currentSongId}"]`)
      if (currentProgressElement) {
        currentProgressElement.classList.remove('bi-circle');
        currentProgressElement.classList.add('bi-circle-fill');
        if (status) {
          currentProgressElement.classList.add('success')
        } else {
          currentProgressElement.classList.add('error')
        }
      }
    },
  },
}
</script>
<style>
#youtube-audio {
  cursor: pointer;
  display: none
}

div.container.custom-container {
  max-width: 640px;
  height: 100vh;
}

.answer.error {
  background-color: red;
  border-color: red;
}

.answer.success {
  background-color: green;
  border-color: green;
}

.answer {
  display: block;
  margin: 20px;
  border: 2px solid black;
  border-radius: 20px;
  color: black;
  text-decoration: none;
  font-size: 18px;
}

i.bi {
  margin: 10px;
}

i.bi.bi-circle-fill.error {
  color: red;
}

i.bi.bi-circle-fill.success {
  color: green;
}
</style>