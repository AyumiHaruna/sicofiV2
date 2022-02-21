<template>
  <div class="row IngProy">
    <div class="col-12">

      <div class="row">
        <div class="col-8 pageTitle">
          Reporte de Ingresos por proyecto
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
    name: 'IngresosXProyecto',
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
          { label:'#', field:'projectNumber' }, { label:'NOMBRE DEL PROYECTO', field:'projectName' }, 
          { label:'CUENTA', field:this.accFn }, { label:'TIPO', field:this.typeFn },
          { label:'SOLICITADO', field:this.reqFn }, { label:'MINISTRADO', field:this.minFn },
           { label:'CAP 1000', field:this.cap1Fn }, { label:'CAP 2000', field:this.cap2Fn }, { label:'CAP 3000', field:this.cap3Fn },
          { label:'CAP 4000', field:this.cap4Fn }, { label:'CAP 5000', field:this.cap5Fn }, { label:'X MINISTRAR', field:this.xMinFn },
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
        const res = await fetch(`${process.env.apiUrl}/incomes/incXProj`, {
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
        switch (rowObj.type) {
          case 'pro':
              return 'Proyecto'
            break;
          case 'gb':
              return 'Gasto Básico'
            break;
          case 'nom':
                return 'Nómina'
              break;
          default:
              return 'Proyecto'
            break;
        }
      },
      accFn(rowObj){  return this.$store.state.accountType[ rowObj.accountType - 1 ];  },
      reqFn( rowObj ){  return( `$${this.moneyFormat(rowObj.incomesInfo.requested)}` );   },
      minFn( rowObj ){  return( `$${this.moneyFormat(rowObj.incomesInfo.ministered)}` );  },
      cap1Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.caps[0])}` );  },
      cap2Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.caps[1])}` );  },
      cap3Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.caps[2])}` );  },
      cap4Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.caps[3])}` );  },
      cap5Fn( rowObj ){  return( `$${this.moneyFormat(rowObj.caps[4])}` );  },
      xMinFn( rowObj ) {
        return( `$${ this.moneyFormat(parseFloat(rowObj.incomesInfo.requested) - parseFloat(rowObj.incomesInfo.ministered)) }` );
      }
    },
}
</script>

<style>
.IngProy .vgt-table th:nth-child(1){
  width: 5% !important;
}
.IngProy .vgt-table th:nth-child(2){
  width: 20% !important;
}
</style>