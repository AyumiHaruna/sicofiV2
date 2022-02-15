<template>
    <div class="row reintegros">
        <div class="col-12 block">

            <div class="row">
                <div class="col-6 pageTitle">
                    Formulario de Reintegros
                </div>
            </div>

            <div class="row">
                <div class="col-12 block">
                    <DataForm />
                </div>
            </div>
        </div>

        <Toast ref="toast"></Toast>     
        <LogTest ref="logTest" /> 
    </div>
</template>

<script>
import DataForm from '@/components/incomes/incReturn/DataForm.vue';

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'Reintegros',
    components: {   DataForm, Toast, LogTest   },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            incomeData: {
                projectNumber: '',
                type: 'rei',
                concept: '',
                account: '',
                opType: '',
                month: '',
                elabDate: '',
                authNum: '',
                cap1: 0,
                cap2: 0,
                cap3: 0,
                cap4: 0,
                cap5: 0,
                total: 0,
                year: ''
            }
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 );

        this.incomeData['year'] = localStorage.getItem('year');
    },
    methods: {
        validateForm() {
            this.incomeData.total = this.total;

            //test projectNumber 
            if( !this.incomeData['projectNumber'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir un "Proyecto"`); return  }
            //test concept 
            if( !this.incomeData['concept'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar un "Concepto"`); return  }
            //test account 
            if( !this.incomeData['account'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir una "Cuenta"`); return  }
            //test optype
            if( !this.incomeData['opType'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir un "Tipo de operación"`); return  }
            //test month 
            if( !this.incomeData['month'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar un "Mes"`); return  }
            //test month 
            if( !this.incomeData['elabDate'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar una "Fecha de elaboración"`); return  }
            //test month 
            if( !this.incomeData['authNum'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar un "No. de autorización"`); return  }
            //test total
            if( this.incomeData['total'] == 0 ){ this.$refs.toast.makeToast('warning', `Favor de capturar un "Monto"`); return  }

            this.saveIncRet();
        },

        async saveIncRet() {
            const res = await fetch(`${process.env.apiUrl}/incomes/inc_return`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(this.incomeData)                
            });

            this.showLoader('Guardando S.F.');
            const resData = await res.json();                
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `Reintegro guardada exitosamente`);                
                setTimeout(function(){
                    window.location.href = `ingresos`;
                }, 1500);
            } else {
                this.$refs.toast.makeToast('error', `No se pudo guardar, intenta nuevamente`);
            }
        }
    },
    computed: {
        total: function() {
            let count = 0;
            for (let i = 1; i <= 5; i++) {
                count += parseFloat(this.incomeData[`cap${i}`]);
            }
            return count;
        }
    }
}
</script>

<style>

</style>