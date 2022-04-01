<template>
  <main>
    <div class="container">
      <div class="row text-center">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="title-wrapper">
            <h1>Ghiceste melodia</h1>
          </div>
          <div v-if="!this.level" class="button-wrapper">
            <button @click="playGame" type="button" class="btn btn-primary">Start</button>
          </div>
          <div  class="current-question-wrapper">
            <div class="progress-wrapper" v-if="questions && this.level">
              <i
                  :class="[progressClass(index) ]"
                 v-for="(item, index) in questions"></i>
            </div>
            <div class="player-wrapper">
              <div>
                <Spinner v-if="!this.playerClass && this.level"></Spinner>
                <div @click="toggleAudio()" id="youtube-audio">
                  <i id="youtube-icon" :class="playerClass"/>
                  <div id="youtube-player"></div>
                </div>
                <div style="clear:both;margin:10px;text-align:center">
                </div>
              </div>
            </div>
            <div class="answers-wrapper" v-if="currentQuestion">
              <div class="list-group">
                <a :class="answerClass(item)"
                   @click="verifyAnswer(item)" v-for="(item, index) in currentQuestion.answers"
                   :key="index">{{ item.name }}</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import {checkQuestion, getQuestions} from "../api/questionsEndpoints";
import Spinner from "../components/Spinner/Spinner.vue";

export default {
  components: {Spinner},
  data() {
    return {
      isLoading: true,
      answers: [],
      questions: [],
      result: [],
      level: 0,
      currentAnswer: null,
      correctAnswer: null,
      playerClass: null,
      playerStateIcons: {
        play: "bi bi-play-circle",
        pause: "bi bi-pause-circle",
        next: "bi bi-skip-forward-circle",
        stop: "bi bi-stop-circle",
      },
    }
  },
  mounted() {
    this.isLoading = true;
    let ajaxScript = document.createElement('script')
    ajaxScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js')
    document.head.appendChild(ajaxScript)

    let youtubeApi = document.createElement('script')
    youtubeApi.setAttribute('src', 'https://www.youtube.com/s/player/3d7ef0b0/www-widgetapi.vflset/www-widgetapi.js')
    document.head.appendChild(youtubeApi)
    this.setQuestions()

    this.isLoading = false;

  },
  created() {
  },
  computed: {
    currentQuestion: function () {
      if (!this.questions) {
        return null
      }
      return this.questions[this.currentQuestionIndex]
    },
    currentQuestionIndex: function () {
      return this.level - 1;
    }
  },
  methods: {
    progressClass(index) {
      return {
        red: this.result.length > index && this.result[index] === false,
        green: this.result.length > index && this.result[index] === true,
        "bi bi-circle-fill": this.result.length > index,
        "bi bi-circle": this.result.length <= index ,
      }
    },
    answerClass(answer) {
      return {
        'answer list-group-item bt-1 mt-3': true,
        'active': this.currentAnswer && this.currentAnswer.id === answer.id && this.correctAnswer,
        'error': this.currentAnswer && this.currentAnswer.id === answer.id && !this.correctAnswer,
      }
    },
    playGame() {
      this.initPlayer()
    },
    play() {
      this.globalPlayer.playVideo();
      this.playerClass = this.playerStateIcons.pause;
    },
    pause() {
      this.globalPlayer.pauseVideo();
      this.playerClass = this.playerStateIcons.play;
    },
    stop() {
      this.globalPlayer.stopVideo();
      this.playerClass = this.playerStateIcons.play
    },
    next() {
      console.log(this.result);
      if (!this.globalPlayer) {
        return
      }
      this.updateLevel()
      if(this.currentQuestion) {
        this.globalPlayer.loadVideoById({
          videoId: this.currentQuestion.video_id,
          startSeconds: this.currentQuestion.start,
          endSeconds: this.currentQuestion.end,
        })
        this.play()
      } else {
        this.playerClass = this.playerStateIcons.stop
      }

    },
    updateLevel() {
      this.level = this.level + 1;
    },
    end(){
      alert('end');
    },
    async setQuestions() {
      this.isLoading = true
      try {
        let response = await getQuestions()
        this.questions = response.data
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false
      }
    },
    async verifyAnswer(answer) {
      this.isLoading = true
      this.currentAnswer = answer
      try {
        let response = await checkQuestion(this.currentQuestion.id, answer.id)
        this.correctAnswer = response.data ? answer : false
        if(this.result[this.currentQuestionIndex] === undefined){
          this.result[this.currentQuestionIndex] = (response.data)
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.isLoading = false
      }
      if(this.questions[this.currentQuestionIndex + 1] === undefined) {
        this.playerClass = this.playerStateIcons.stop
      } else {
        this.playerClass = this.playerStateIcons.next
      }
    },
    initPlayer() {
      if (this.isLoading) {
        return
      }
      if (this.globalPlayer) {
        return
      }
      if (!this.level) {
        this.level = 1;
      }

      this.globalPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: this.currentQuestion.video_id,
        playerVars: {
          autoplay: 1,
          loop: 1,
          start: this.currentQuestion.start,
          end: this.currentQuestion.end,
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
    },
    onPlayerReady(event) {
      event.target.playVideo();
      this.globalPlayer.setPlaybackQuality("small"); //highres, hd1080, hd720, large, medium, small
      document.getElementById("youtube-audio").style.display = "block";
      this.playerClass = this.playerStateIcons.pause
    },
    onPlayerStateChange(event) {

    },
    toggleAudio() {
      switch (this.playerClass) {
        case this.playerStateIcons.play:
          this.play()
          break;
        case this.playerStateIcons.pause:
          this.pause()
          break;
        case this.playerStateIcons.next:
          this.next()
          break;
        case this.playerStateIcons.stop:
          this.stop()
          break;
        default:
          alert('icon have no class');
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

#youtube-icon {
  font-size: 300px;
  display: inline-block;
  margin: 0 auto;
  width: 100%;
}
.answer.error {
  background-color: red;
  border-color: red;
}
i.bi.bi-circle-fill.red {
  color:red;
}
i.bi.bi-circle-fill.green {
  color:green;
}
</style>