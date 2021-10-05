<template>
  <v-card flat dark color="#203864">
    <v-card-title v-if="editflag==0">New {{target}}</v-card-title>
    <v-card-title v-if="editflag==1">Edit {{target}}</v-card-title>
    <v-card-text>
      <v-text-field :label="target + ' Name'" :value="title" outlined dense v-on:keyup="commitTargets"
      :error-messages="Object.keys(error).indexOf('project_name') !== -1 ? [error['project_name'][0]] : []"></v-text-field>
      <v-text-field label="Editor" :value="editor.username" outlined dense readonly></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: ['target','editflag','title','editor','error'],
  data() {
    return {
        projectname:""
    }
  },
  methods: {
    commitTargets: function (e) {
      this.projectname = e.target.value
      this.$emit('submitProject',this.projectname);
    }
  }
}
</script>

<style>
</style>
