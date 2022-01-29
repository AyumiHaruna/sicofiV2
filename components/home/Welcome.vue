<template>
  <div class="row">
    <div class="col-12 welcomeTitle">
      Hola <span>{{ getUser }}</span>!
    </div>      
    <div class="col-12 welcomeMsg">
      Estas usando los datos de <span>{{ getYear }}</span>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Welcome',
    computed: {
        getUser() {
            return localStorage.getItem('user');
        },
        getYear() {
            return localStorage.getItem('year');
        }
    }
}
</script>

<style scoped>
  .welcomeTitle{
    text-align: center;
    font-size: 2.5em;
    margin-bottom: 1.2em;
  }
  .welcomeMsg{
    text-align: center;
    font-size: 1.2em;
  }
  span{
    color: #c2343e;
    font-weight: bold;
  }
</style>