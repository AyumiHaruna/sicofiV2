<template>
  <div class="row sf_comprobacion">
      <div class="col-12">
          
          <div class="row">
              <div class="col-12">
                  <h1>Comprobación de S.F.</h1>
              </div>
          </div>

          <SfMainInfo :income="income" type="comprobacion" v-if="income != ''"></SfMainInfo>

          <!-- <SFCompList v-if="income != ''"></SFCompList> -->

          <Toast ref="toast"></Toast>    
      </div>
  </div>
</template>

<script>    
import SfMainInfo from '@/components/incomes/SfMainInfo.vue';
import SFCompList from '~/components/incomes/checking/SFCompList.vue';

import Toast from '@/components/general/Toast.vue';

export default {
    name: 'sf_comprobaciones',
    components: { SfMainInfo, SFCompList, Toast },
    data() {
        return {
            sfId: '',
            income: '',
        }
    },
    created() {
        if( this.$nuxt.$route.query.code ){
            this.sfId = this.$nuxt.$route.query.code;
            this.getSFInfo( this.sfId );
        } else {
            this.$refs.toast.makeToast('error', `Error al buscar la S.F. intenta nuevamente`);
            setTimeout( function() {
                window.location.href = `ingresos`;  
            }, 3000)
        }      
    },
    mounted() {
        // save last visited SF for subNav
        console.log(this.sfId);
        localStorage.setItem('lastSF', (this.sfId).replace('/', '') );
    },
    methods: {
        async getSFInfo( sfId ){
            const res = await fetch(`${process.env.apiUrl}/incomes/getSF/${sfId}`);
            if( await res.status === 200 ){
                const resData = await res.json();
                this.income = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Error al buscar la S.F. (${sfId}), intenta nuevamente`);
            }
        },
    },
    computed: {
        valCap: function(){
            let totalValCap = [0,0,0,0,0];
            (this.income.validations).forEach(elm => {
                for (let i = 1; i <= 5; i++) {
                    totalValCap[i-1] +=  parseFloat(elm[`cap${i}`]);
                }
            });
            return totalValCap;
        },
    }
}
</script>

<style>

</style>