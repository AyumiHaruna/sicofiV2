<template>
    <div class="row sf_validacion">
        <div class="col-12">

            <div class="row">
                <div class="col-6 pageTitle">
                    Validación de S.F.
                </div>
            </div>

            <SfMainInfo :income="income" type="validacion" v-if="income != ''"></SfMainInfo>

            <SFValList :valList='income.validations' v-if="income != ''"></SFValList>

            <sfValForm :income="income" v-if="income != ''"></sfValForm>

            <Toast ref="toast"></Toast>    
            <LogTest ref="logTest" /> 
        </div>
    </div>
</template>

<script>
import SfMainInfo from '@/components/incomes/SfMainInfo.vue';
import SFValList from '@/components/incomes/validation/SFValList';
import sfValForm from '~/components/incomes/validation/sfValForm.vue'

import LogTest from '@/components/general/LogTest.vue'
import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sf_validacion',
    components: { SfMainInfo, SFValList, sfValForm, Toast, LogTest },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            sfId: '',
            income: '',
            formData: {
                sfId: '',
                depDate: '',
                authNum: '',
                cap1: 0,
                cap2: 0,
                cap3: 0,
                cap4: 0,
                cap5: 0,
                obs: '',
                year: '',
            },
            formVisible: false,
            formType: '',
            valId: '',
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 );

        if( this.$nuxt.$route.query.code ){
            this.sfId = this.$nuxt.$route.query.code;
            this.getSFInfo( this.sfId );
        } else {
            this.$refs.toast.makeToast('error', `Error al buscar la S.F. intenta nuevamente`);
            setTimeout( function() {
                window.location.href = `ingresos`;  
            }, 3000)
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

        async saveValidation(){
            let submitURL = '';
            let errMsg = ''
            let postObj = '';

            // set submit url 
            switch (this.formType) {
                case 'create':
                        submitURL = `${process.env.apiUrl}/incomes/sfVal_save`;
                        errMsg = 'guardada';
                        postObj = this.formData;
                    break;
                
                case 'delete':
                        submitURL = `${process.env.apiUrl}/incomes/sfVal_delete`;
                        errMsg = 'eliminada';
                        postObj = {id: this.valId, sfId: this.sfId};
                    break;
            
                default:
                        alert('wrong formType');
                    break;
            }

            const res = await fetch( submitURL, {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },                
                body: JSON.stringify(postObj)
            });
        
            this.showLoader('Guardando S.F.');
            const resData = await res.json();                
            this.hideLoader();

            if( resData.status === 200 ){
                //send success message
                this.$refs.toast.makeToast('success', `Validación ${errMsg} exitosamente`);
                //close form
                this.formVisible = false;
                //load SF income again 
                this.getSFInfo(this.sfId);
            } else {
                //send error message
                this.$parent.$refs.toast.makeToast('error', `Su validación no pudo ser ${errMsg}, intenta nuevamente`);
            }            
        },

        closeForm(){
            // hide form
            this.formVisible = false;
        },
        openform(type){
            //set formType
            this.formType = type;
            if(type === 'create'){
                // reset form values
                this.formData = {
                    sfId: this.sfId,
                    depDate: '',
                    authNum: '',
                    cap1: 0,
                    cap2: 0,
                    cap3: 0,
                    cap4: 0,
                    cap5: 0,
                    obs: '',
                    year: localStorage.getItem('year')
                };
            }
            // open form 
            this.formVisible = true;
        },

        validateForm(){
            //test depDate 
            if( !this.formData['depDate'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir una "Fecha de depósito"`); return  }
            //test depDate 
            if( !this.formData['authNum'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar un "Folio de autorización"`); return  }
            
            this.formData.total = this.formTotal;
            //test depDate 
            if( this.formData['total'] <= 0 ){ this.$refs.toast.makeToast('warning', `Aun no capturas montos para algún caítulo`); return  }
            
            this.saveValidation();
        }
    },
    computed: {
        formTotal: function(){
            let total = 0; 
            for (let i = 1; i <= 5; i++) {
                total  += parseFloat( this.formData[`cap${i}`] );
            }
            return total;
        },
    }
}
</script>

<style>

</style>