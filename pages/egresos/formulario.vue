<template>
  <div class="row outForm">
    <div class="col-12">

        <div class="row">
          <div class="col-6 pageTitle">
            <h3>Formulario de {{type}} de Egresos</h3>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <OutMainForm v-if="outcome.year != ''" :year="outcome.year"></OutMainForm>
          </div>

          <div class="col-4"> <ProjAvalible></ProjAvalible> </div>
          <div class="col-8"> <CapsForm></CapsForm> </div>
        </div>

        <Toast ref="toast"></Toast>     
        <LogTest ref="logTest" /> 
    </div>
  </div>
</template>

<script>
import OutMainForm from '~/components/outcomes/create/OutMainForm.vue'
import ProjAvalible from '@/components/outcomes/create/ProjAvalible.vue'
import CapsForm from '@/components/outcomes/create/CapsForm.vue'

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'OutForm',
    components: { OutMainForm, ProjAvalible, CapsForm, Toast, LogTest },
    mixins: [ GlobalFunctions ],
    data(){
      return {
        type: 'Alta',

        lastId: 0,
        lastCheckNumber: '',
        
        outcome: {
          checkNumber: '',
          elabDate: '',
          sign: '',
          concept: '',
          projectNumber: '',
          account: '',
          foil: '',
          payType: '',
          obs: '',
          cap1: 0,
          cap2: 0,
          cap3: 0,
          cap4: 0,
          cap5: 0,
          total: 0,
          viatics: false,
          valStart: '',
          valEnd: '',
          year: '',
        },

        avalibleAmounts: {
          total: 0,
          cap1: 0,
          cap2: 0,
          cap3: 0,
          cap4: 0,
          cap5: 0
        },

        outcomeId: '',
      }
    },
    mounted() {
      this.$refs.logTest.hasSesion();
      this.$refs.logTest.hasLevel( 2 );

      this.outcome.year = localStorage.getItem('year');

      // if has project code / block projectNumber / get projectFullData
      if( this.$nuxt.$route.query.code ){
        this.type = 'Edición'
        this.outcomeId = this.$nuxt.$route.query.code;
      }

      if( this.type === 'Alta') {
        // set current elab date
        let current = new Date();
        current = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
        //set current date 
        this.outcome.elabDate = current;
      }      
    },
    methods: {
      async validateForm() {
        // set outcome.total 
        this.outcome.total = this.getTotal;

        //test checkNumber 
        if( this.outcome['checkNumber'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar el "Número de cheque"`); return  }
        //test foil 
        if( this.outcome['foil'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar el "Folio"`); return  }
        //test elabDate
        if( this.outcome['elabDate'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar la "Fecha de Elaboración"`); return  }
        //test payType
        if( this.outcome['payType'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de elegir el "Tipo de pago"`); return  }
        //test projectNumber
        if( this.outcome['projectNumber'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de elegir el "Proyecto"`); return  }
        //test account
        if( this.outcome['account'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de elegir la "Cuenta"`); return  }
        //test sign 
        if( this.outcome['sign'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar el "Nombre"`); return  }
        //test concept
        if( this.outcome['concept'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar el "Concepto"`); return  }

        //if viaticos ask for dates 
        if( this.outcome.viatics == true ){
          //test valStart
          if( this.outcome['valStart'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar el "Inicio de la Vigencia"`); return  }
          //test valEnd
          if( this.outcome['valEnd'] == '' ){ this.$refs.toast.makeToast('warning', `Favor de capturar el "Fin de la Vigencia"`); return  }
        }
        
        //test ammounts
        if( this.outcome['total'] == 0 ){ this.$refs.toast.makeToast('warning', `Favor de capturar algún "Monto"`); return  }

        if( this.type == 'Alta'){
          //  test if checkNumber already exists 
          const res = await fetch(`${process.env.apiUrl}/outcomes/testCheckNumber`, {
            method: 'POST',
            header: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              checkNumber: this.outcome.checkNumber,
              year: this.outcome.year
            })
          });

          if( await res.status === 200 ){
              const resData = await res.json();
              if( resData.results ) { // already exists, stop
                this.$refs.toast.makeToast('error', `El número de cheque capturado ya existe, favor de cambiarlo`);
                return
              }
          } else {
              this.$refs.toast.makeToast('error', `Ocurrió un problema al revisar disponibilidad del numero de cheque, intente nuevamente`);
              return
          }
        }


        //test ammount < ministered
        if( this.outcome['total'] > this.avalibleAmounts.total ){ 
          this.$swal.fire({
              title: 'El monto capturado sobrepasa el disponible, capturar de todos modos!?',
              type: 'question',
              showCancelButton: true,
              showConfirmButton: true,                
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Aceptar',
              reverseButtons: true
          }).then((result) => {
            if (result.value) {
              this.saveOutcome();
            }
          });
        } else {
          this.saveOutcome();
        }   
      },

      async saveOutcome() {
        let submitUrl = '';
        if( this.type === 'Alta') {
          submitUrl = `${process.env.apiUrl}/outcomes/create`;
        } else {
          submitUrl = `${process.env.apiUrl}/outcomes/update`
        }

        const res = await fetch(submitUrl, {
          method: 'POST',
          header: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            outcomeId: this.outcomeId,
            outcome: this.outcome,
            year: this.outcome.year,
          })
        });


        this.showLoader('Guardando S.F.');
          const resData = await res.json();                
        this.hideLoader();

        if( res.status === 200 ){
          this.type = 'Editar';
          this.outcomeId = resData.results;
          this.$refs.toast.makeToast('success', `Egreso guardada exitosamente`);

          this.$router.push(`/egresos?code=${this.outcome.projectNumber}`);
          // window.open(`/egresos?code=${this.outcome.projectNumber}`, '_blank');
          window.open(`${process.env.apiUrl}/print/poliza/${this.outcomeId}`, '_blank');
          window.open(`${process.env.apiUrl}/print/cheque/${this.outcomeId}`, '_blank');
          
        } else {
          this.$refs.toast.makeToast('error', `Error al guardar el egreso, intenta nuevamente`);
        }
      },

      async getOutcomeData( id ){
        const res = await fetch(`${process.env.apiUrl}/outcomes/get_outcome/${id}`);

        if( await res.status === 200){
          const resData = await res.json();
          if( resData.status === 200 ){
            this.outcome = resData.results;
            this.outcome.sign = resData.results['name'];
          }
        } else {
          this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema al buscar los datos del egreso, intente nuevamente`);
        }
      }
    },

    computed: {
      getTotal: function() {
        let total = 0;
        for (let i = 1; i <= 5; i++) {
          if( this.outcome[`cap${i}`] == '' ){
            this.outcome[`cap${i}`] = 0;
          }
          total += parseFloat(this.outcome[`cap${i}`]);
        }
        return total;
      }
    }
}
</script>

<style>

</style>