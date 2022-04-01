<template>
  <Header></Header>
  <div class="container">
    <div class="content py-5">
      <h1>Manage songs</h1>
      <Spinner v-if="gameStore.loading"></Spinner>
      <div  class="mt-3 mb-3">
        <a @click.prevent="$router.push('/admin/song-create')" href="#" class="btn btn-primary">Add new song</a>
      </div>
      <div class="text-center">
        <audio-player v-if="play"></audio-player>
      </div>
      <table v-if="songs.length" class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Video id</th>
            <th scope="col">Image</th>
            <th scope="col">start</th>
            <th scope="col">end</th>
            <th scope="col">answers</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
        <template v-for="(song, index) in songs"
                  key="index">
            <tr>
              <th scope="row">{{index}}</th>
              <td>{{song.video_id}}</td>
              <td>
                <img alt="youtube_image"
                     :src="'https://img.youtube.com/vi/' + song.video_id + '/default.jpg'">
              </td>
              <td>{{song.start}}</td>
              <td>{{song.end}}</td>
              <td>
                <a @click.prevent="$router.push(`/admin/song/${song.id}/answers`)" href="#" class="btn btn-primary"><i
                    class="bi bi-binoculars"></i></a>
              </td>
              <td>
                <button @click.prevent="$router.push(`/admin/song-update/${song.id}`)"   type="button"
                   class="btn btn-primary"><i class="bi bi-pencil"></i> </button>
                <button @click="handleDelete(song)" type="button"
                   class="btn btn-primary mx-2"><i class="bi bi-archive"></i> </button>
                <button @click="handlePlay(song)"  class="btn btn-primary play"><i
                    class="bi bi-play"></i></button>

              </td>
            </tr>
          </template>

        </tbody>
      </table>

    </div>

  </div>
</template>
<script>
import Header from "../../../components/Header/Header.vue";
import {useGameStore} from "../../../stores/game";
import {deleteSong, getSongs} from "../../../api/admin/song";
import Spinner from "../../../components/Spinner/Spinner.vue";
import AudioPlayer from "../../../components/Player/AudioPlayer.vue";
import {usePlayerStore} from "../../../stores/player";
import playerStateIcons from "../../../components/constants/player";

export default {
  components: {AudioPlayer, Spinner, Header},
  setup(){
    const gameStore = useGameStore();
    const playerStore = usePlayerStore();
    return {gameStore, playerStore}
  },
  data() {
    return {
      play:false,
      songs: [],
    }
  },
  created() {
    this.setSongs()
  },
  methods: {
    handlePlay(song) {
      if(!this.play) {
        this.play = true;
        this.gameStore.setCurrentSong(song)
      } else {
        this.playerStore.globalPlayer.loadVideoById({
          videoId: song.video_id,
          startSeconds: song.start,
          endSeconds: song.end,
        })
        this.playerStore.playerIcon = playerStateIcons.pause;

      }

    },
    async setSongs() {
      this.gameStore.setLoading(true)
      try{
        let response = await getSongs()
        console.log(response);
        this.songs = response.data
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
    },
    async handleDelete(song) {
      this.gameStore.setLoading(true)
      try{
         await deleteSong(song.id)
      } catch (e) {
        console.log(e);
      } finally {
        this.setSongs()
        this.gameStore.setLoading(false)
      }
    }
  }
}

</script>
<style>

</style>
