<template>
    <div class="row eg_comprobacion">
        <div class="col-12 block">

            <div class="row">
                <div class="col-8 pageTitle">
                    Comprobación de Egresos
                </div>
            </div>

            <div class="col-12 panel">
                <div class="row">
                    <div class="col-12">
                        <OutcomeInfo v-if="outcome != ''"></OutcomeInfo>
                    </div>

                    <div class="col-6">
                        <CompList></CompList>
                    </div>
                    <div class="col-6">
                        <BillList></BillList>
                    </div>

                    <div class="col-12">
                        <GncForm v-if="isGnc"></GncForm>
                    </div>
                </div>
            </div>
            

            <CompForm v-if="formShown"></CompForm>
            <BillForm v-if="showBill"></BillForm>

            <Toast ref="toast"></Toast>
            <LogTest ref="logTest" /> 
        </div>
    </div>
</template>

<script>
import OutcomeInfo from '@/components/outcomes/comp/OutcomeInfo.vue'
import GncForm from '@/components/outcomes/comp/GncForm.vue'
import CompList from '@/components/outcomes/comp/CompList.vue'
import CompForm from '@/components/outcomes/comp/CompForm.vue'
import BillList from '@/components/outcomes/comp/BillList.vue'
import BillForm from '@/components/outcomes/comp/BillForm.vue'

import LogTest from '@/components/general/LogTest.vue';
import Toast from '@/components/general/Toast.vue';
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'Out_comp',
    components: { OutcomeInfo, GncForm, CompList, CompForm, BillList, BillForm, Toast, LogTest },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            id: '',
            outcome: '',
            formShown: false,
            showBill: false,
            formData: {
                id: '',
                compDate: '',
                total: 0,
                gnc: 0
            },
            billData: {
                foil: '', 
                total: 0,
                repeated: false, 
                authorize: '',
                obs: '',
            },
            duplicatedNumber: '',
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 2 );
        
        // get url code, if not exists redirect
        if( this.$nuxt.$route.query.code ){
            this.id = this.$nuxt.$route.query.code;
            this.getOutcome();
        } else {
            this.$refs.toast.makeToast('error', `Error al buscar el egreso, intenta nuevamente`);
            setTimeout( function() {
                window.location.href = `egresos/`;  
            }, 2000);
        }
    },
    methods: {
        async getOutcome(){
            const res = await fetch(`${process.env.apiUrl}/outcomes/get_outcome/${this.id}`);

            if( await res.status === 200 ){
                const resData = await res.json();
                this.outcome = resData.results;
            } else {
                this.$refs.toast.makeToast('error', `Error al buscar el egreso, intenta nuevamente`);
            }
        },
        async saveComp(){
            let postUrl;
            if( this.formData.id == ''){
                postUrl = `${process.env.apiUrl}/outcomes/comp/create`;
            }

            const res = await fetch(postUrl, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({     
                    id: this.outcome.id,               
                    compDate: this.formData.compDate,
                    total: this.formData.total,
                    gnc: this.formData.gnc,
                    year: this.outcome.year
                })
            });

            this.showLoader('Guardando comprobación.');
            const resData = await res.json();                          
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `Comprobación guardada exitosamente`);  
                // update outcome info 
                this.getOutcome();
                // hide form 
                this.formShown = false;
            } else {
                this.$refs.toast.makeToast('error', `No se pudo guardar la comprobación, intenta nuevamente`);
            }
 
        },
        async deleteComp( id ){
            const res = await fetch(`${process.env.apiUrl}/outcomes/comp/delete`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({     
                    id: id,
                    year: this.outcome.year
                })
            });
            
            this.showLoader('Eliminando comprobación');
            const resData = await res.json();                          
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `Comprobación eliminada exitosamente`);  
                // update outcome info 
                this.getOutcome();
            } else {
                this.$refs.toast.makeToast('error', `No se pudo eliminar la comprobación, intenta nuevamente`);
            }
        },
        async changeGNC( id, e ){           
            const res = await fetch(`${process.env.apiUrl}/outcomes/comp/gnc`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({     
                    id: id,
                    status: e.target.checked
                })
            });
            
            this.showLoader('Modificando GNC');
            const resData = await res.json();                          
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `GNC modificado exitosamente`);  
                // update outcome info 
                this.getOutcome();
            } else {
                this.$refs.toast.makeToast('error', `No se pudo modificar GNC, intenta nuevamente`);
            }
        },
        openForm( id = null ){
            if( id === null ){  // reset formData
                this.formData =  {
                    id: '',
                    compDate: '',
                    total: 0,
                    gnc: false
                }   
            } 
            this.formShown = true;
        },
        closeForm(){
            this.formShown = false;
        },
        openBill() {
            this.billData =  {
                foil: '', 
                total: 0,
                repeated: false, 
                authorize: '',
                obs: '',
            }  
            this.showBill = true;
        },
        closeBill() {
            this.showBill = false;
        },
        async saveBill(){
            const res = await fetch(`${process.env.apiUrl}/outcomes/comp/bill_create`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    foil: this.billData.foil,
                    total: this.billData.total,
                    repeated: this.billData.repeated,
                    authorize: this.billData.authorize,
                    obs: this.billData.obs,
                    outcomeId: this.outcome.id,
                    year: this.outcome.year
                })
            });

            this.showLoader('Guardando Factura.');
            const resData = await res.json();                          
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `Factura guardada exitosamente`);  
                // update outcome info 
                this.getOutcome();
                // hide form 
                this.closeBill();
            } else {
                this.$refs.toast.makeToast('error', `No se pudo guardar la Factura, intenta nuevamente`);
            }
        },
        async deleteBill(id){
            const res = await fetch(`${process.env.apiUrl}/outcomes/comp/bill_delete`, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    year: this.outcome.year
                })
            });

            this.showLoader('Eliminando Factura.');
            const resData = await res.json();                          
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `Factura eliminada exitosamente`);  
                // update outcome info 
                this.getOutcome();
            } else {
                this.$refs.toast.makeToast('error', `No se pudo eliminar la Factura, intenta nuevamente`);
            }
        }
    },
    computed: {
        isGnc: function() {
            let gnc = false;

            // loop outcome.comps, looking for gnc
            if( this.outcome != '') {
                (this.outcome.comp).forEach(comp => {
                    if( comp.gnc ){
                        gnc = true;
                    }
                });
            }

            return gnc;
        },
    }
}
</script>

<style>

</style>