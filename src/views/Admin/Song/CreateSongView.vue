<template>
  <Header></Header>
  <div class="container">
    <h1>Add new song</h1>
    <form>
      <div class="mb-3">
        <label for="video_id" class="form-label">Video id</label>
        <input required type="text" name="video_id" class="form-control" v-model="song.videoId" id="video_id">
      </div>
      <div class="mb-3">
        <label for="start" class="form-label">Start</label>
        <input required type="number" name="start" class="form-control" v-model="song.start" id="start">
      </div>
      <div class="mb-3">
        <label for="end" class="form-label">End</label>
        <input required type="number" name="end" class="form-control"  v-model="song.end" id="end">
      </div>
      <button type="button" @click="createSong()" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
<script>
import Header from "../../../components/Header/Header.vue";
import {useGameStore} from "../../../stores/game";
import {createSong} from "../../../api/admin/song";
import { useToast } from "vue-toastification";
export default {
  components: {Header},
  setup(){
    const gameStore = useGameStore();
    const toast = useToast();
    return {toast, gameStore}
  },
  data() {
    return {
      song: {
        videoId: null,
        start:null,
        end: null
      },
    }
  },
  created() {

  },
  methods: {
    async createSong() {
      this.gameStore.setLoading(true)
      try{
        const data = {
          video_id: this.song.videoId,
          start: this.song.start,
          end: this.song.end,
        }
        let response = await createSong(data)

        this.song.videoId = response.data.video_id
        this.song.start = response.data.start
        this.song.end = response.data.end
        this.toast("Success!");
        this.$router.push({ path: '/admin/song'});
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
    }
  }
}

</script>
<style>

</style>
