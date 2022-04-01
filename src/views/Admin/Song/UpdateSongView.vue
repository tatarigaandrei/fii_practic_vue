<template>
  <Header></Header>
  <div class="container">
    <h1>Update song</h1>
    <form>
      <div class="mb-3">
        <label for="video_id" class="form-label">Video id</label>
        <input required type="text" name="video_id" class="form-control" v-model="song.video_id" id="video_id">
      </div>
      <div class="mb-3">
        <label for="start" class="form-label">Start</label>
        <input required type="number" name="start" class="form-control" v-model="song.start" id="start">
      </div>
      <div class="mb-3">
        <label for="end" class="form-label">End</label>
        <input required type="number" name="end" class="form-control"  v-model="song.end" id="end">
      </div>
      <button type="button" @click="updateSong()" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
<script>
import Header from "../../../components/Header/Header.vue";
import {useGameStore} from "../../../stores/game";
import {getQuestions} from "../../../api/questionsEndpoints";
import {createSong, getSong, getSongs, updateSong} from "../../../api/admin/song";
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
        video_id: null,
        start:null,
        end: null
      },
    }
  },
  mounted() {
    this.getSong()
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  methods: {
    async getSong() {
      this.gameStore.setLoading(true)
      try{
        let response = await getSong(this.id)
        this.song.video_id = response.data.video_id
        this.song.start = response.data.start
        this.song.end = response.data.end
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
    },
    async updateSong() {
      this.gameStore.setLoading(true)
      try{
        let response = await updateSong(this.id, this.song)
        this.song = response.data
        this.$router.push({ path: '/admin/song'});
        this.toast("Success!");
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
