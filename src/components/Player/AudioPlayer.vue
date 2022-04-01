
<template>
  <Spinner v-if="!this.playerIsReady"></Spinner>
  <div @click="toggleAudio()" id="youtube-audio">
    <i id="youtube-icon" :class="this.playerStore.playerIcon"/>
    <div id="youtube-player"></div>
  </div>
  <div style="clear:both;margin:10px;text-align:center"></div>
</template>
<script >
import Spinner from "../Spinner/Spinner.vue";
import playerStateIcons from "../constants/player.js";
import {usePlayerStore} from "../../stores/player.js";
import {useGameStore} from "../../stores/game.js";
import {toRefs} from "vue";

export default {
  name: "AudioPlayer",
  components: {Spinner},
  props: {
    videoId: {
      type: String,
    },
    startSeconds: {
      type: Number,
    },
    endSeconds: {
      type: Number,
    },
  },
  setup(){
    const playerStore = usePlayerStore();
    const gameStore = useGameStore();
    return {
      playerStore, gameStore
    }
  },
  data() {
    return {
      ajaxScriptIsLoaded: false,
      youtubeApiScriptIsLoaded: false,
      playerIsReady: false,
    }
  },
  mounted() {
    this.gameStore.setLoading(true)

    let ajaxScript = document.createElement('script')
    ajaxScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js')
    document.head.appendChild(ajaxScript)
    ajaxScript.onload = () => {
      console.log('here1');
      this.ajaxScriptIsLoaded = true
    }

    let youtubeApi = document.createElement('script')
    youtubeApi.setAttribute('src', 'https://www.youtube.com/s/player/3d7ef0b0/www-widgetapi.vflset/www-widgetapi.js')
    document.head.appendChild(youtubeApi)
    youtubeApi.onload = () => {
      console.log('here2');
      this.youtubeApiScriptIsLoaded = true
    }
  },
  computed: {
    youtubeIsDefined() {
      return this.ajaxScriptIsLoaded && this.youtubeApiScriptIsLoaded
    }
  },
  watch: {
    youtubeIsDefined(status) {
      if(status === true) {
        this.gameStore.setLoading(false)
        this.initPlayer()
      }
    }
  },
  created(){
    console.log('created');
  },
  updated(){
    console.log('updated');
    console.log(this.gameStore.getPlayerIsReady);
  },
  methods: {
    play() {
      this.playerStore.globalPlayer.playVideo();
      this.playerStore.playerIcon = playerStateIcons.pause;
    },
    pause() {
      this.playerStore.globalPlayer.pauseVideo();
      this.playerStore.playerIcon = playerStateIcons.play;
    },
    stop() {
      this.playerStore.globalPlayer.stopVideo();
      this.playerStore.playerIcon = playerStateIcons.hidden
      this.gameStore.currentQuestion = null
    },
    next() {
      if (!this.playerStore.globalPlayer) {
        return
      }
      this.$emit('next', true)
      if(!this.gameStore.currentQuestion) {
        this.playerStore.playerIcon = this.playerStateIcons.stop
      }

    },
    initPlayer() {
      if (!this.youtubeIsDefined) {
        return
      }
      if (this.playerStore.globalPlayer) {
        return
      }

      this.playerStore.globalPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: this.videoId,
        playerVars: {
          autoplay: 1,
          loop: 1,
          start: this.startSeconds,
          end: this.endSeconds,
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
    },
    onPlayerReady(event) {
      console.log('onPlayerReady');
      event.target.playVideo();
      this.playerStore.globalPlayer.setPlaybackQuality("small"); //highres, hd1080, hd720, large, medium, small
      document.getElementById("youtube-audio").style.display = "block";
      this.playerStore.playerIcon = playerStateIcons.pause
      console.log(this.playerStore.playerIcon);
      this.playerIsReady = true

    },
    onPlayerStateChange(event) {
      console.log('onPlayerStateChange');
    },
    toggleAudio() {
      switch (this.playerStore.playerIcon) {
        case playerStateIcons.play:
          this.play()
          break;
        case playerStateIcons.pause:
          this.pause()
          break;
        case playerStateIcons.next:
          this.next()
          break;
        case playerStateIcons.stop:
          this.stop()
          break;
        default:
          this.initPlayer()
          break;
      }
    },
  }
}
</script>
<style scoped>
#youtube-audio {
  cursor: pointer;
  display: none
}

#youtube-icon {
  font-size: 200px;
  display: inline-block;
  margin: 0 auto;
  width: 100%;
}
</style>
