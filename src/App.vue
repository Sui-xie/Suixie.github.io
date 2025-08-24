<script>
//import debug from './components/debug.vue';
export default {
  name: 'App',
  data(){
    return {

    }
  },
  mounted(){
    console.log('初始化完成')
  },
  components: {
    //debug
  },
}
</script>
<template>
<RouterView id="view"></RouterView>
  <!--<div><debug></debug></div>-->
</template>

<style scoped>

</style>
