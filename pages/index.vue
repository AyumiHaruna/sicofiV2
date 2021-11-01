<template>
  <div class="home">
    <Login v-if="sessionStart === 0" />
    <Welcome v-else />
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '../components/home/Login.vue';
import Welcome from '../components/home/Welcome.vue';

export default {
  name: 'Home',
  head() {
    return {
      title: 'Sicofi │ Inicio'
    }
  },
  components: {
    Login,
    Welcome
  },
  data() {
    return {
      sessionStart: 0
    }
  },
  mounted() {
    if(process.client){
        if( localStorage.getItem('user') ){
              this.sessionStart = 1;
        }
    }
  }
}
</script>
