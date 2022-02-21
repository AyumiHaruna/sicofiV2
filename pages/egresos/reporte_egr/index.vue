<template>
    <div class="row egrDesg">
        <div class="col-12">

            <div class="row">
                <div class="col-8 pageTitle">
                    Reporte de Egresos Desglozados
                </div>
            </div>

            <div class="row block">
                <div class="col-12 panel">

                    <VueGoodTable
                        :columns="columns"
                        :rows="outData"
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
                        v-if="outData.length > 0"
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
    name: 'Egr_desglozados',
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
            outData: [],

            columns: [
                { label:'#', field:'checkNumber' }, 
                { label:'PROYECTO', field:'projectNumber' }, 
                { label:'CUENTA', field:this.accFn }, 
                { label:'FECHA ELABORACIÓN', field:'elabDate' }, 
                { label:'NOMBRE', field:'name' }, 
                { label:'CONCEPTO', field:'concept' }, 
                { label:'TOTAL', field:this.totalFn }, 
                { label:'COMPROBADO', field:this.checkedFn }, 
                { label:'X COMPROBAR', field:this.xcheckFn }, 
                { label:'STATUS', field:this.statFn }, 
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

        this.getOutcomes();
    },
    methods: {
        async getOutcomes() {            
            const res = await fetch(`${process.env.apiUrl}/outcomes/get_all_outcomes`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(this.dataObject)
            });

            if( await res.status === 200){
                //convert response to json
                const resData = await res.json();
                this.outData = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },
        accFn(rowObj){  return this.$store.state.accountType[ rowObj.account - 1 ];  },
        totalFn(rowObj){  return( `$${this.moneyFormat(rowObj.total)}` ); },
        checkedFn(rowObj){  return( `$${this.moneyFormat(rowObj.checked)}` ); },
        xcheckFn(rowObj){  return( `$${ this.moneyFormat( parseFloat(rowObj.total) - parseFloat(rowObj.checked) ) }` ); },
        statFn(rowObj){  
            if( rowObj.active == 0){
                return 'CANCELADO';
            } else {
                switch (rowObj.status) {
                    case 0:
                        return 'En firma'
                        break;
                    case 1:
                        return 'Para entrega'
                        break;
                    case 2:
                        return 'Entregado'
                        break;
                }
            }
        }
    }
}
</script>

<style>
    .egrDesg .vgt-table th:nth-child(1){
        width: 8% !important;
    }
    .egrDesg .vgt-table th:nth-child(2){
        width: 5% !important;
    }
    .egrDesg .vgt-table th:nth-child(3){
        width: 9% !important;
    }
    .egrDesg .vgt-table th:nth-child(4){
        width: 8% !important;
    }
    .egrDesg .vgt-table th:nth-child(5){
        width: 15% !important;
    }
    .egrDesg .vgt-table th:nth-child(6){
        width: 20% !important;
    }
</style>