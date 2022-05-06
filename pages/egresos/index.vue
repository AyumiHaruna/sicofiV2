<template>
  <div class="row outcomeList">
    <div class="col-12">

      <div class="row">
        <div class="col-4 pageTitle">
          Lista de Egresos
        </div>

        <div class="col-4 text-center">
          <div class="row">

            <div class="col-6">
              <input type="number" v-model="printForm.start" @keypress="isNumber($event)">
              <label for="starPrint">IMPRIMIR DESDE </label>        
            </div>
            <div class="col-6">
              <input type="number" v-model="printForm.end" @keypress="isNumber($event)">
              <label for="endPrint">HASTA</label> 
            </div>

            <div class="col-6 text-center">
              <button class="actionBtn warningBtn" v-b-tooltip.hover title="Imprimir en grupo" alt="Imprimir en grupo" @click="validatePrint('poliza')">
                <i class="fas fa-print"></i>
                POLIZAS IMP. EN GRUPO
              </button>
            </div>

            <div class="col-6 text-center">
              <button class="actionBtn warningBtn" v-b-tooltip.hover title="Imprimir en grupo" alt="Imprimir en grupo" @click="validatePrint('cheque')">
                <i class="fas fa-money-check-alt"></i>
                CHEQUES IMP. EN GRUPO
              </button>
            </div>
          </div>
        </div>

        <div class="col-4 proyForm">
          <ProjectFilter></ProjectFilter>
          <nuxt-link to="/egresos/formulario">
              <button class="actionBtn saveBtn" v-b-tooltip.hover title="Nuevo proyecto" alt="Nuevo proyecto">
                  <i class="fas fa-folder-plus"></i>
                  NUEVO EGRESO
              </button>
          </nuxt-link>                    
        </div>
      </div>

      <OutcomeList v-model="selectedProject"></OutcomeList>

      <Toast ref="toast"></Toast>     
      <LogTest ref="logTest" />                 

    </div>
  </div>
</template>

<script>
import ProjectFilter from '@/components/general/ProjectFilter.vue';
import OutcomeList from '~/components/outcomes/list/OutcomeList.vue';

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'eg_list',
    components: {  ProjectFilter, OutcomeList, Toast, LogTest  },
    mixins: [ GlobalFunctions ],
    data() {
      return {
        savedProject: '',
        projectList: {},
        selectedProject: '',
        printForm: {
          start: '',
          end: ''
        }
      }
    },
    created() {
      if( this.$nuxt.$route.query.code ){
        this.savedProject = this.$nuxt.$route.query.code;
      }
    },
    mounted() {
      this.$refs.logTest.hasSesion();
      this.$refs.logTest.hasLevel( 2 );

      this.getProjectsOut();

      
    },
    methods: {
      async getProjectsOut() {
        const res = await fetch(`${process.env.apiUrl}/outcomes/proy_out/${localStorage.getItem('year')}`);

        if( await res.status === 200){
            //convert response to json
            const resData = await res.json();
            this.projectList = resData.results;
        } else {
            this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
        }
      },
      async changeStatus(id, e) { 
        const res = await fetch(`${process.env.apiUrl}/outcomes/set_status`, {
          method: 'POST',
          header: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: id,
            status: e.target.value,
          })
        });

        this.showLoader('Actualizando Status');
        await res;                
        this.hideLoader();

        if( res.status === 200 ){                
          const resData = await res.json();                
          this.$refs.toast.makeToast('success', `Status actualizado correctamente`);
          this.getProjectsOut();            
        } else {
          this.$refs.toast.makeToast('error', `No se pudo actualizar, intenta nuevamente`);
        }
      },
      
      async cancelOutcome(id){
        // cancel post function
        let res = await fetch(`${process.env.apiUrl}/outcomes/delete`, {
          method: 'POST',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: id
          })
        });

        this.showLoader('Cancelando Egreso');
        await res;                
        this.hideLoader();

        if( res.status === 200 ){
          this.$refs.toast.makeToast('success', `Egreso cancelado exitosamente`);
          this.getProjectsOut();
        } else {
          this.$refs.toast.makeToast('error', `Error al cancelar el egreso, intenta nuevamente`);
        }
      },

      validatePrint( type ) {
        //test startNumber 
        if( this.printForm.start == '' ){ this.$refs.toast.makeToast('warning', `Para imprimir por grupo captura el "Numero inicial"`); return  }
        //test startNumber 
        if( this.printForm.end == '' ){ this.$refs.toast.makeToast('warning', `Para imprimir por grupo captura el "Numero final"`); return  }

        window.open(`${this.getApiUrl}/print/${type}/${this.printForm.start}/${this.printForm.end}`, '_blank');
      }
    }
}
</script>

<style>

</style>