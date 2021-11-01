<template>
  <div class="row">
    <div class="col-12 welcome">
      <h2>
        Hola! {{ getUser }} 
      </h2>
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

<style>

</style>