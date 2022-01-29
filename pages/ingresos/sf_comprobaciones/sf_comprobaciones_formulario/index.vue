<template>
  <div class="row sf_comprobacion_formulario">
    <div class="col-12">
      
      <div class="row">
        <div class="col-6 pageTitle">
            Formulario de Comprobación
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
      <LogTest ref="logTest" /> 
    </div>
  </div>
</template>

<script>
import SFAmountInfo from '@/components/incomes/SFAmountInfo.vue'
import SFCompMainForm from '~/components/incomes/checking/SFCompMainForm.vue'
import SFCompPartList from '~/components/incomes/checking/SFCompPartList.vue'
import SFCompPartForm from '@/components/incomes/checking/SFCompPartForm'

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
  name: 'sf_comprobaciones_formulario',
  components: { SFAmountInfo, SFCompMainForm, SFCompPartList, SFCompPartForm, Toast, LogTest },
  mixins: [ GlobalFunctions ],
  data() {
    return {
      updId: null,
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
    // test login data
    this.$refs.logTest.hasSesion();
    this.$refs.logTest.hasLevel( 2 );

    // get url code, if not exists redirect
    if( this.$nuxt.$route.query.code ){
        this.sfId = this.$nuxt.$route.query.code;
        this.getSFInfo( this.sfId );
    } else {
        this.$refs.toast.makeToast('error', `Error al buscar la S.F. intenta nuevamente`);
        setTimeout( function() {
            window.location.href = `ingresos/sf_comprobaciones?code=${localStorage.getItem('lastSF')}`;  
        }, 2000);
    }

    // if url id exists, then is an update form config
    if( this.$nuxt.$route.query.id ){
      this.updId = this.$nuxt.$route.query.id;
      this.urlType = 'update';
    }

    // set current date
    let current = new Date();
    current = current.getFullYear()+'-'+(current.getMonth()+1)+'-'+current.getDate();
    //set current date 
    this.currentDate = current;

    //if urlType = create - auto set current date as elabDate
    if(this.urlType === 'create'){  
      // auto set elabDate
      this.formData.elabDate = this.currentDate; 
      // get and set last cover # + 1
      this.getLastCover();
    } else if (this.urlType === 'update'){
      // get checking data
      this.getCheckingData( this.updId );
    }
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
        updId: this.updId,
        sfId: this.sfId,
        cover: this.formData.cover,
        transfer: this.formData.transfer,
        elabDate: this.formData.elabDate,
        checked: this.compTotal,
        type: (this.compTotal == this.income.requested) ? 1 : 0,
        updDate: this.currentDate,
        obs: '',
        name: localStorage.getItem('name'),
        year: localStorage.getItem('year'),
        partList: this.compPartList,
        caps: this.capTotal,
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
          this.getSFInfo( this.sfId );
      } else {
          this.$refs.toast.makeToast('error', `No se pudo guardar, intenta nuevamente`);
      }

    },
    async getLastCover(){
      // get last cover number 
      const res = await fetch(`${process.env.apiUrl}/incomes/compLastCover/${this.sfId}`);
      const resData = await res.json();  
      if( res.status === 200 ){                
          this.formData.cover = resData.results + 1;
      } else {
          this.$refs.toast.makeToast('error', `Error al obtener el último # de carátula, intenta nuevamente`);
      }
    },
    async getCheckingData( checkId ){
      const res = await fetch(`${process.env.apiUrl}/incomes/checkInfo/${checkId}`);
      if( await res.status === 200 ){
        const resData = await res.json();
        this.formData = {
          cover: resData.results.cover,
          elabDate: resData.results.elabDate,
          total: resData.results.checked,
          transfer: resData.results.transfer,
        }
        this.compPartList = resData.results.checkList;
      } else {
        this.$refs.toast.makeToast('error', `Error al buscar la comprobación, intenta nuevamente`);
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
      let total = 0;
      this.compPartList.forEach(elm => {
        total += parseFloat( elm.total );
      });
      return total;
    },

    capTotal: function() {
      let caps = [0,0,0,0,0];
      this.compPartList.forEach(elm => {
        // total += parseFloat( elm.total );
        caps[ parseInt((elm.partNumber).charAt(0)) - 1 ] += parseFloat(elm.total); 
      });
      return caps;
    }
  }
}
</script>

<style>
 
</style>