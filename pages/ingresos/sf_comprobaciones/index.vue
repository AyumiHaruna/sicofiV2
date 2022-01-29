<template>
  <div class="row sf_comprobacion">
      <div class="col-12">
          
          <div class="row">
              <div class="col-6 pageTitle">
                  Comprobación de S.F.
              </div>
          </div>

          <SfMainInfo :income="income" type="comprobacion" v-if="income != ''"></SfMainInfo>

          <SFCompList :income="income" v-if="income != ''"></SFCompList>

          <Toast ref="toast"></Toast>    
          <LogTest ref="logTest" /> 
      </div>
  </div>
</template>

<script>    
import SfMainInfo from '@/components/incomes/SfMainInfo.vue';
import SFCompList from '~/components/incomes/checking/SFCompList.vue';

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sf_comprobaciones',
    components: { SfMainInfo, SFCompList, Toast, LogTest },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            sfId: '',
            income: '',
            currentDate: ''
        }
    },
    created() {
        if( this.$nuxt.$route.query.code ){
            this.sfId = (this.$nuxt.$route.query.code).replace('/', '');
            this.getSFInfo( this.sfId );
        } else {
            this.$refs.toast.makeToast('error', `Error al buscar la S.F. intenta nuevamente`);
            setTimeout( function() {
                window.location.href = `ingresos`;  
            }, 3000)
        }      
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 );
        
        // save last visited SF for subNav
        // console.log(this.sfId);
        localStorage.setItem('lastSF', (this.sfId).replace('/', '') );

        // set current date
        let current = new Date();
        current = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
        //set current date 
        this.currentDate = current;
    },
    methods: {
        async getSFInfo( sfId ){
            console.log('getting incomes info');
            const res = await fetch(`${process.env.apiUrl}/incomes/getSF/${sfId}`);
            if( await res.status === 200 ){
                const resData = await res.json();
                this.income = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Error al buscar la S.F. (${sfId}), intenta nuevamente`);
            }
        },

        async deleteComp( id ){
            console.log('delteComp');
            const res = await fetch(`${process.env.apiUrl}/incomes/comp/delete`, {
                method: 'POST',
                headers: {
                'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    sfId: this.sfId,
                    name: localStorage.getItem('name'),
                    updDate: this.currentDate
                })
            });

            this.showLoader('Guardando S.F.');
            const resData = await res.json();                
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `Comprobación eliminada exitosamente`);  
                this.getSFInfo( this.sfId );
            } else {
                this.$refs.toast.makeToast('error', `No se pudo eliminar la comprobación, intenta nuevamente`);
            }
        },

        askForDelete( id ){
            this.$swal.fire({
                title: 'Deseas eliminar esta comprobación!?',
                type: 'question',
                showCancelButton: true,
                showConfirmButton: true,                
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                reverseButtons: true,
            }).then((result) => {
                if (result.value) {
                    this.deleteComp(id);
                }
            });
        }
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