
<template>
  <Spinner v-if="!this.playerIsReady"></Spinner>
  <div @click="toggleAudio()" id="youtube-audio">
    <i id="youtube-icon" :class="this.playerStore.playerIcon"/>
    <div id="youtube-player"></div>
  </div>
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
  emits: ["next"],
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
      donePlaying: false,
    }
  },
  mounted() {
    this.gameStore.setLoading(true)
    let youtubeApi = document.createElement('script')
    youtubeApi.setAttribute('src', 'https://www.youtube.com/s/player/3d7ef0b0/www-widgetapi.vflset/www-widgetapi.js')
    document.head.appendChild(youtubeApi)
    youtubeApi.onload = () => {
      this.youtubeApiScriptIsLoaded = true
    }
  },
  computed: {
    youtubeIsDefined() {
      return this.youtubeApiScriptIsLoaded
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
  methods: {
    play() {
      this.playerStore.globalPlayer.playVideo();
      this.playerStore.playerIcon = playerStateIcons.pause;
    },
    pause() {
      this.playerStore.globalPlayer.pauseVideo();
      this.playerStore.playerIcon = playerStateIcons.play;
    },
    replay() {
      this.playerStore.globalPlayer.loadVideoById({
        videoId: this.gameStore.currentSong.video_id,
        startSeconds: this.gameStore.currentSong.start,
        endSeconds: this.gameStore.currentSong.end,
      })
      this.playerStore.playerIcon = playerStateIcons.pause;
    },
    stop() {
      this.playerStore.globalPlayer.stopVideo();
      this.playerStore.playerIcon = playerStateIcons.hidden
      this.gameStore.currentSong = null
    },
    next() {
      if (!this.playerStore.globalPlayer) {
        return
      }
      this.$emit('next', true)
      if(!this.gameStore.currentSong) {
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
        videoId: this.gameStore.currentSong.video_id,
        playerVars: {
          autoplay: 1,
          loop: 1,
          start: this.gameStore.currentSong.start,
          end: this.gameStore.currentSong.end,
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange
        }
      });
    },
    onPlayerReady(event) {
      event.target.playVideo();
      document.getElementById("youtube-audio").style.display = "block";
      this.playerStore.playerIcon = playerStateIcons.pause
      this.playerIsReady = true

    },
    onPlayerStateChange(event) {
      if(event.data === 0 && !this.donePlaying) {
        this.playerStore.playerIcon = playerStateIcons.replay
        this.donePlaying = true
      } else if (event.data === 1) {
        this.donePlaying = false;
      }
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
        case playerStateIcons.replay:
          this.replay()
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
