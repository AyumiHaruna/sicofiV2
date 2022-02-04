<template>
  <div class="row names">
    <div class="col-12">

      <div class="row">
        <div class="col-6 pageTitle">
          Lista de nombres
        </div>

        <div class="col-6 text-center">
          <button class="actionBtn saveBtn" v-b-tooltip.hover title="Nuevo usuario" alt="Nuevo usuario" @click="openForm()">
            <i class="fas fa-user-plus"></i>
            NUEVO NOMBRE
          </button>
        </div>
      </div>

      <NameList />
      <NameForm v-show="showForm" />

      <Toast ref="toast"></Toast>     
      <LogTest ref="logTest" />   

    </div>
  </div>
</template>

<script>
import NameList from '@/components/names/NameList.vue';
import NameForm from '@/components/names/NameForm.vue';

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'nombres',
    mixins: [ GlobalFunctions ],
    components: { NameList, NameForm, Toast, LogTest  },
    data() {
      return {
        people: [],
        nameForm: {
          id: '',
          name: '',
          active: true
        },
        showForm: false,
      }
    },
    mounted() {
      this.$refs.logTest.hasSesion();
      this.$refs.logTest.hasLevel( 1 )

      this.getNameList();
    },
    methods: {
      async getNameList() {
        const res = await fetch(`${process.env.apiUrl}/names/list`);

        if( await res.status === 200){
          const resData = await res.json();
          this.people = resData.results;
        } else {
          this.$refs.toast.makeToast('error', `No se pudo cargar nombres, intente nuevamente`);
        }
      },

      async saveName() {
        const res = await fetch(`${process.env.apiUrl}/names/save`, {
          method: 'post',
          headers: {
              'Content-type': 'application/json'
          },
          body: JSON.stringify(this.nameForm)
        });

        this.showLoader('Guardando S.F.');
        await res;                
        this.hideLoader();

        if( await res.status === 200){
            // //convert response to json
            const resData = await res.json();
            
            if( resData.results == 'exists'){
                this.$refs.toast.makeToast('error', `El nombre capturado ya existe, intente con otro`);
            }

            if( resData.results == 'ok'){
                this.$refs.toast.makeToast('success', `Nombre guardado exitosamente`);
                // close form 
                this.showForm = false;
                // update user list
                this.getNameList();
            }
        } else {
            this.$refs.toast.makeToast('error', `No se pudo guardar, intente nuevamente`);
        }
      },

      openForm( key=null ){
        if( key == null ){
          this.nameForm= {
            id: '',
            name: '',
            active: true
          };
        } else {
          this.nameForm= {
            id: this.people[key]['id'],
            name: this.people[key]['name'],
            active: this.people[key]['active'],
          };
        }
        this.showForm = true;
      }
    }
}
</script>

<style>
  .nameForm{
    margin-top: 10vw;
  }
</style>