<template>
  <div class="row ingDesg">
    <div class="col-12">

      <div class="row">
        <div class="col-8 pageTitle">
          Reporte de Ingresos Desglozados
        </div>
      </div>

      <div class="row block">
        <div class="col-12 panel">

          <VueGoodTable
            :columns="columns"
            :rows="incData"
            styleClass="vgt-table bordered"
            :pagination-options="{
              enabled: true,
              mode: 'pages',
              perPage: 30,
              perPageDropdown: [30, 50],
              dropdownAllowAll: true,
              setCurrentPage: 1,
              jumpFirstOrLast : true,
              firstLabel : 'Primer.',
              lastLabel : 'Última.',
              nextLabel: 'sig.',
              prevLabel: 'pre.',
              rowsPerPageLabel: 'RESULTADOS POR PÁGINA',
              ofLabel: 'DE',
              pageLabel: 'PAG.', // for 'pages' mode
            }"
            :search-options="{
              enabled: true,
              placeholder: 'Buscar en esta tabla',
            }"
            v-if="incData.length > 0"
          />

        </div>
      </div>

      <Toast ref="toast"></Toast>        
      <LogTest ref="logTest" /> 

    </div>  
  </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
  name: 'RepIngDesglozados',
  components: { VueGoodTable, Toast, LogTest   },
  mixins: [ GlobalFunctions ],
  data() {
    return {
      dataObject: {
        year: '',
        id: '',
        fullAccess: 0,
        projectList: []
      },
      incData: [],
      
      columns: [
        { label:'#', field:'sfNum' }, { label:'TIPO', field:this.typeFn }, { label:'S.F.', field:'sfId' },
        { label:'PROYECTO', field:'projectNumber' }, { label:'CUENTA', field:this.accFn }, { label:'MES', field:this.monthFn },
        { label:'AUTORIZACIÓN', field:'caps.authNum' }, { label:'SOLICITADO', field:this.reqFn }, { label:'MINISTRADO', field:this.minFn },
        { label:'CAP1', field:this.cap1Fn }, { label:'CAP2', field:this.cap2Fn }, { label:'CAP3', field:this.cap3Fn },
        { label:'CAP4', field:this.cap4Fn }, { label:'CAP5', field:this.cap5Fn }, { label:'X MINISTRAR', field:this.xMinFn },
      ],
    }
  },
  mounted() {
    // get working year and number
    if(process.client){
        this.dataObject.year = localStorage.getItem('year');
        this.dataObject.id = localStorage.getItem('id');
        this.dataObject.fullAccess = localStorage.getItem('fullAccess');
        if(this.dataObject.fullAccess == 0){
            this.dataObject.projectList = localStorage.getItem('projectList');
        }
    }

    this.$refs.logTest.hasSesion();
    this.$refs.logTest.hasLevel( 3 );

    this.getAllIncomes();
  },
  methods: {
    async getAllIncomes() {            
      const res = await fetch(`${process.env.apiUrl}/incomes/full_list`, {
          method: 'post',
          headers: {
              'content-type': 'application/json'
          },
          body: JSON.stringify(this.dataObject)
      });

      if( await res.status === 200){
        //convert response to json
        const resData = await res.json();
        this.incData = resData.results;
      } else {
          this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
      }
    },

    typeFn(rowObj){
      if(rowObj.type == 'ing'){  return 'Ingreso'; }
      else if(rowObj.type == 'rei'){  return 'Reintegro'; }
    },
    accFn(rowObj){  return this.$store.state.accountType[ rowObj.account - 1 ];  },
    monthFn(rowObj){  return this.$store.state.monthList[ rowObj.month - 1 ];  },
    reqFn( rowObj ){  return( `$${this.moneyFormat(rowObj.requested)}` );   },
    minFn( rowObj ){  return( `$${this.moneyFormat(rowObj.ministered)}` );  },
    cap1Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.cap1)}` );  },
    cap2Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.cap2)}` );  },
    cap3Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.cap3)}` );  },
    cap4Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.cap4)}` );  },
    cap5Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.cap5)}` );  },
    xMinFn( rowObj ) {
      return( `$${ this.moneyFormat(parseFloat(rowObj.requested) - parseFloat(rowObj.ministered)) }` );
    },
  }
}
</script>

<style>
  
  .ingDesg .vgt-table th:nth-child(1){
    width: 3% !important;
  }
  .ingDesg .vgt-table th:nth-child(3){
    width: 10% !important;
  }

</style>