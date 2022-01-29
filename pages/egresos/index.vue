<template>
  <div class="row outcomeList">
    <div class="col-12">

      <div class="row">
        <div class="col-4 pageTitle">
          Lista de Egresos
        </div>

        <div class="col-4 text-center">
          <nuxt-link to="/egresos/formulario">
              <button class="actionBtn saveBtn" v-b-tooltip.hover title="Nuevo proyecto" alt="Nuevo proyecto">
                  <i class="fas fa-folder-plus"></i>
                  NUEVO EGRESO
              </button>
          </nuxt-link>                    
        </div>

        <div class="col-4 proyForm">
          <ProjectFilter></ProjectFilter>
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
        projectList: {},
        selectedProject: ''
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

        // console.log(await res);
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

        // console.log(await res);
        this.showLoader('Cancelando Egreso');
        await res;                
        this.hideLoader();

        if( res.status === 200 ){
          this.$refs.toast.makeToast('success', `Egreso cancelado exitosamente`);
          this.getProjectsOut();
        } else {
          this.$refs.toast.makeToast('error', `Error al cancelar el egreso, intenta nuevamente`);
        }
      }
    }
}
</script>

<style>

</style>