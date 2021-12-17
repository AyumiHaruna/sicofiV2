<template>
  <div class="row sf_comprobacion_formulario">
    <div class="col-12">
      
      <div class="row">
        <div class="col-12 text-center ">
            <h1>Formulario de Comprobación</h1>
        </div>
      </div>

      <div class="row block">
        <div class="col-12 panel">
          <SFAmountInfo :income="income" v-if="income!=''"></SFAmountInfo>

          <SFCompMainForm v-if="income!=''"></SFCompMainForm>
        </div>
      </div>

      <SFCompPartList v-if="income!=''"></SFCompPartList>     

      <SFCompPartForm v-show="showForm"></SFCompPartForm>

      <Toast ref="toast"></Toast>   
    </div>
  </div>
</template>

<script>
import SFAmountInfo from '@/components/incomes/SFAmountInfo.vue'
import SFCompMainForm from '~/components/incomes/checking/SFCompMainForm.vue'
import SFCompPartList from '~/components/incomes/checking/SFCompPartList.vue'
import SFCompPartForm from '@/components/incomes/checking/SFCompPartForm'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
  name: 'sf_comprobaciones_formulario',
  components: { SFAmountInfo, SFCompMainForm, SFCompPartList, SFCompPartForm, Toast },
  mixins: [ GlobalFunctions ],
  data() {
    return {
      urlType: 'create',
      sfId: '',
      income: '',
      currentDate: '',
      compPartList: [],
      partForm: {
        partNumber: '',
        partName: '',
        notes: '',
        total: ''
      },
      formData: {
        elabDate: '',
        total: 0,
        cover: 1,
        transfer: '',
      },
      showForm: false,
    }
  },
  mounted() {
    // get url code, if isnt exists redirect
    if( this.$nuxt.$route.query.code ){
        this.sfId = this.$nuxt.$route.query.code;
        this.getSFInfo( this.sfId );
    } else {
        this.$refs.toast.makeToast('error', `Error al buscar la S.F. intenta nuevamente`);
        setTimeout( function() {
            window.location.href = `ingresos/sf_comprobaciones?code=${localStorage.getItem('lastSF')}`;  
        }, 2000)
    }

    // set current date
    let current = new Date();
    current = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
    //set current date 
    this.currentDate = current;
    //auto set current date as elabDate
    this.formData.elabDate = this.currentDate;
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
    async saveComp() {
      //prepare Data
      let sendObj = {
        sfId: this.sfId,
        cover: this.formData.cover,
        transfer: this.formData.transfer,
        elabDate: this.formData.elabDate,
        checked: this.compTotal,
        type: (this.compTotal == this.income.requested) ? 1 : 0,
        updDate: this.currentDate,
        obs: '',
        year: localStorage.getItem('year'),
        partList: this.compPartList
      };

      let url;

      if( this.urlType === 'create' ) {
        url = `${process.env.apiUrl}/incomes/comp/create`;
      } else if ( this.urlType === 'update' ){
        url = `${process.env.apiUrl}/incomes/comp/update`;
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(sendObj)
      });
      
      this.showLoader('Guardando S.F.');
      const resData = await res.json();                
      this.hideLoader();

      if( res.status === 200 ){                
          this.$refs.toast.makeToast('success', `Comprobación guardada exitosamente`);  
          this.urlType = 'update';
      } else {
          this.$refs.toast.makeToast('error', `No se pudo guardar, intenta nuevamente`);
      }

    },

    openForm(type, id=null){
      if(type === 'create'){
        //reset form
        this.partForm = {
          partNumber: '',
          partName: '',
          notes: '',
          total: ''
        };
      } else if( type === 'add'){
        //set values
        this.partForm = {
          partNumber: this.income.partList[id]['partNumber'],
          partName: this.income.partList[id]['partName'],
          notes: '',
          total: this.income.partList[id]['total']
        }
      }
      //show form
      this.showForm = true;
    },
    hideForm(){
      this.showForm = false;
    },

    quitFromList(id){
      this.$swal.fire({
          title: 'Deseas eliminar esta partida!?',
          type: 'question',
          showCancelButton: true,
          showConfirmButton: true,                
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar',
          reverseButtons: true
      }).then((result) => {
          if (result.value) {
            (this.compPartList).splice( id, 1 );
          }
      });
    },
  },
  computed: {
    compTotal: function() {
      let total = 0
      this.compPartList.forEach(elm => {
        total += parseFloat( elm.total );
      });
      return total;
    }
  }
}
</script>

<style>
  table.incomeInfo {
    border: 0px solid #170655;
    background-color: #261441;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    font-size: 0.9em;
    margin-bottom: 2em;
  }
  table.incomeInfo th {
    border: 1px solid #555555;
    padding: 0.5em 1em;
    font-size: 0.9em;
  }
  table.incomeInfo td {
    font-size: 0.9em;
    color: #FFFFFF;
    padding: 0.5em 1em;
    background: #685584;
  }
  table.incomeInfo th {
    background: #322446;
  }
</style>