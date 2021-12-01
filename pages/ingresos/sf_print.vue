<template>
  <div>
      printing

      <Toast ref="toast"></Toast>     
  </div>
</template>

<script>
import Toast from '../../components/general/Toast.vue';

export default {
    name: 'sf_print',
    components: { Toast },
    data() {
        return {
            income: {}
        }
    },
    mounted() {
        if( this.$nuxt.$route.query.code ){
            this.getIncomeData( this.$nuxt.$route.query.code );
        } else {
            this.$refs.toast.makeToast('error', `No elegiste una S.F. para imprimir`);
            setTimeout(function(){
                window.location.href = '/';                       
            }, 2500);
        }
    },
    methods: {
        async getIncomeData( incId ){
            console.log(incId);
            const res = await fetch( `${process.env.apiUrl}/incomes/getSF/${incId}`);
            
            if( res.status === 200 ){
                const resData = await res.json();   
                this.income = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `No se pudo obtener los datos de la SF. intenta nuevamente`);
            }
        }
    }
}
</script>

<style>

</style>