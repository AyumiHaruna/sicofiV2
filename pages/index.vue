<template>
  <div class="row home block">
    <div class="col-4 offset-4 panel homeContent" v-if="sessionStart === 0">
      <div class="row">
        <div class="col-12 bordered">
          <Login />
        </div>
      </div>
    </div>
    <div class="col-6 offset-3 panel homeContent" v-else>
      <div class="row">
        <div class="col-12 bordered">
          <Welcome />
        </div>
      </div>      
    </div>

    <div class="col-12 p-0">
      <Footer />
    </div>
    <Toast ref="toast"></Toast>     
  </div>
</template>

<script>
// @ is an alias to /src
import Login from '../components/home/Login.vue';
import Welcome from '../components/home/Welcome.vue';
import Footer from '@/components/general/Footer.vue'

import Toast from '@/components/general/Toast.vue';
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
  name: 'Home',
  head() {
    return {
      title: 'Sicofi │ Inicio'
    }
  },
  mixins: [ GlobalFunctions ],
  components: { Login, Welcome, Footer, Toast },
  data() {
    return {
      sessionStart: 0,
      user: '',
      password: '',
      year: '',
      activeYears: [],
    }
  },
  mounted() {
    if(process.client){
        if( localStorage.getItem('user') ){
              this.sessionStart = 1;
        }
    }

    this.getActiveYears();
  },
  methods: {
    async getActiveYears(){
      const res = await fetch( `${process.env.apiUrl}/getActiveYears` );

      const resData = await res.json();

      // if is a success data
      if(resData.status === 200) {
        this.activeYears = resData.results;
      } else {    //show error message
        this.$refs.toast.makeToast('error', `No se pudo cargar la lista de años activos, intenta nuevamente`);
      }   
    },

    async handleSubmit() {            
      // create form object
      const formData = [{
          user: this.user,
          password: this.password,
          year: this.year
      }]

      // make fetch request
      const res = await fetch( `${process.env.apiUrl}/users/login` ,  
      {
          method: 'POST',
          headers: {
              // 'Content-type' : 'text/plain',
              'Content-type' : 'application/json'
          },
          body: JSON.stringify(formData)
      });

      //get response & change isLoading
      this.showLoader('Iniciando Sesión');
        const resData = await res.json();
      this.hideLoader();

      // if is a success data
      if(resData.status === 200) {
        this.createSession(resData.results);
        this.$refs.toast.makeToast('success', `Se inició sesión exitosamente`);
      } else {    //show error message
        this.$refs.toast.makeToast('error', `No se pudo iniciar sesión, intenta nuevamente`);
      }   
    },

    createSession( data ){
      localStorage.setItem('id', data.id);
      localStorage.setItem('user', data.user); 
      localStorage.setItem('name', data.name); 
      localStorage.setItem('level', data.level); 
      localStorage.setItem('mail', data.mail); 
      localStorage.setItem('fullAccess', data.fullAccess); 
      localStorage.setItem('year', this.year);
      // if has proyects
      if(data.fullAccess === 0){
          localStorage.setItem('projectList', JSON.stringify(data.projectList));
      }

      // this.$router.push('/')
      this.$router.go();
    },
  },      

  
}
</script>

<style scoped>
  .homeContent{
    margin-top: 6rem;
  }
</style>
