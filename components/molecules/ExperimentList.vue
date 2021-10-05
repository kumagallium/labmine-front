<template>
  <v-list-item class="explist">
    <v-list-item-content>
      <v-list-item-title v-html="title"></v-list-item-title>
      <v-list-item-subtitle v-html="editor"></v-list-item-subtitle>
      <v-list-item-subtitle v-html="startdate"></v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
    props: ['title','editor','startdate']
}
</script>

<style>
</style>
