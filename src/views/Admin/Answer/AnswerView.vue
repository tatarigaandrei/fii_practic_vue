<template>
  <Header></Header>
  <div class="container">
    <h1 class="py-3">{{type}} answers</h1>
    <Spinner v-if="gameStore.loading"></Spinner>
    <form>
      <template v-for="(answer,index) in answers" :key="index">
        <div class="mb-3 answer-group">
          <div class="answer-item">
            <label :for="'answer' + index" class="form-label">Answer {{index + 1}}</label>
            <input required type="text" class="form-control" v-model="answer.text" :id="'answer' + index">
          </div>
          <div class="answer-group">
            <div class="form-check form-switch">
              <label class="form-label" :for="'switch' + index">Is correct</label>
              <input class="form-check-input" v-model="answer.is_correct" :checked="answer.is_correct"
                     @click="handleSwitch(index,answer)" type="checkbox" :id="'switch' + index">
            </div>
          </div>
        </div>
      </template>

      <button type="button" @click="handleMethod()" class="btn btn-primary">Submit</button>
    </form>
  </div>
</template>
<script>
import Header from "../../../components/Header/Header.vue";
import {useGameStore} from "../../../stores/game";
import {createSong, getSongs} from "../../../api/admin/song";
import {useToast} from "vue-toastification";
import {createAnswers, getAnswers, updateAnswer} from "../../../api/admin/answer";
import Spinner from "../../../components/Spinner/Spinner.vue";

export default {
  components: {Spinner, Header},
  setup() {
    const gameStore = useGameStore();
    const toast = useToast();
    return {toast, gameStore}
  },
  data() {
    return {
      type: 'Create',
      answers: [
        {
          text: "",
          is_correct: false,
          song_id: null
        },
        {
          text: "",
          is_correct: false,
          song_id: null
        },
        {
          text: "",
          is_correct: false,
          song_id: null
        }
      ],
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  created() {
    this.getAnswers()
    this.answers.forEach(item => {
      item.song_id = this.id;
    })
  },
  methods: {
    async getAnswers() {
      this.gameStore.setLoading(true)
      try {
        let {data} = await getAnswers(this.id)
        if (data.length) {
          this.answers = data
          this.type = 'Update';
        }
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
    },
    handleMethod() {
      switch (this.type) {
        case "Update":
          this.updateSongAnswers()
          break;
        case "Create":
          this.createSongAnswers()
          break;
        default:
          alert('error')
      }
    },
    async createSongAnswers() {
      this.gameStore.setLoading(true)
      try {
        this.answers.forEach(item => {
          item.is_correct = item.is_correct ? 1 : 0
        })
        await createAnswers(this.answers)
        this.toast("Success!");
        this.$router.push({path: '/admin/song'})
      } catch (e) {
        console.log(e);
      } finally {
        this.gameStore.setLoading(false)
      }
    },
    async updateSongAnswers() {
        this.gameStore.setLoading(true)
        const promises = [];
        this.answers.forEach(item => {
          item.is_correct = item.is_correct ? 1 : 0
          let id = item.id
          delete item.id;
          promises.push(updateAnswer(id, item))
        })
        Promise.allSettled(promises)
        .then((responses) => {
          this.toast("Updated!");
          this.$router.push({path: '/admin/song'})

        })
        .finally(() => {
          this.gameStore.setLoading(false)
        })

    },
    handleSwitch(answer) {
      this.answers.forEach(item => {
        item.is_correct = false;
      })
    }
  },

}

</script>
<style>
.answer-group {
  display: flex;
}

.answer-group input[type=checkbox] {
  transform: scale(1.5);
}

.answer-group .form-switch {
  display: block;
}

.answer-group .answer-item {
  width: 70%;
}

.answer-group .form-check .form-check-input {
  float: initial;
  display: block;
  padding-left: 2.5em;
  margin-left: 0.5em;
  margin-top: 10px;
}
</style>
