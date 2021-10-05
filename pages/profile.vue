<template>
  <v-content wrap>
    <v-container fill-height fluid>
      <v-row>
        <v-col class="px-5">
        </v-col>
      </v-row>

    </v-container>
  </v-content>
</template>

<script>
import BookCover from '~/components/molecules/BookCover.vue'

export default {
  layout: 'project',
  components: {
    BookCover
  },
  data() {
      return {
          title: 'Hello Vue!!'
      }
  },
  computed: {
     loggedInUser () {
       return this.$store.state.user
     },
  }
}
</script>

<style>
</style>
