<template>
    <div class="row sf_form">
        <div class="col-12 block">
            
            <div class="row">
                <div class="col-12 m-4 text-center">
                    <h3>Formulario de Solicitudes de Fondos ({{formType}})</h3>
                </div>
            </div>

            <div class="row">
                <div class="col-8 block">
                    <sfMainForm ref="mainForm"></sfMainForm>
                </div>

                <div class="col-4 block">
                    <sfTotalForm></sfTotalForm>
                </div>

                <div class="col-6 block">
                    <proPartListForm></proPartListForm>
                </div>
                <div class="col-6 block">
                    <sfPartListForm></sfPartListForm>
                </div>                

                <div class="col-12">
                    <prevsfList></prevsfList>
                </div>
            </div>

            <sfUpdPartForm v-show="showForm"></sfUpdPartForm>
        </div>

        <Toast ref="toast"></Toast>     
    </div>
</template>

<script>
import sfMainForm from '@/components/incomes/sfMainForm.vue';
import sfTotalForm from '@/components/incomes/sfTotalForm.vue';
import sfPartListForm from '@/components/incomes/sfPartListForm.vue';
import proPartListForm from '@/components/incomes/proPartListForm.vue';
import prevsfList from '@/components/incomes/prevsfList.vue';
import sfUpdPartForm from '@/components/incomes/sfUpdPartForm.vue';

import Toast from '@/components/general/Toast.vue';

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'sf_form',
    components: {   sfMainForm, sfTotalForm, proPartListForm, sfPartListForm, prevsfList, sfUpdPartForm, Toast   },
    mixins: [ GlobalFunctions ],
    data() {
        return {
            formType: 'Alta',
            showForm: false,

            incomeData: {
                projectNumber: '',
                account: '',
                concept: '',
                month: '',
                elabDate: '',
                opType: '',
                sign: '',

                sfNum: '',
                sfId: '',   
                type: 'ing',                
                elabDate: '',
                requested: 0,
                obs: '',
                year: '',

                sfAddData: {
                    sfPrintType: 'pro',
                    sfTaxType: '',
                    taxConfig: [false, false, false],
                    ivaT: 0.16,
                    ivaR: 0.106666,
                    isrR: 0.10
                },
            },
            
            proyPartList: [],
            sfPartList: [],
            prevSF: [],

            partForm: {
                index: '',
                partNumber: '',
                partName: '',
                total: 0,
                type: ''
            },
        }
    },
    mounted() {
        // if has project code / block projectNumber / get projectFullData
        if( this.$nuxt.$route.query.code ){
            this.formType = 'Edición'
            let code = this.$nuxt.$route.query.code;
            this.getProjectData( code );
        }

        this.incomeData['year'] = localStorage.getItem('year');
    },
    methods: {
        showPartForm( type = 'create', formObj = null, index = null){
            if(type == 'create'){
                //clear form data 
                this.partForm = {
                    index: '',
                    type: type,
                    amount: 0,
                    partNumber: '',
                    partName: ''
                }
            } else if(type == 'update') {
                //set form data 
                this.partForm = {
                    index: index,
                    type: type,
                    amount: formObj['total'],
                    partNumber: formObj['partNumber'],
                    partName: formObj['partName']
                }
            }

            //show form 
            this.showForm =  true;
        },

        hidePartForm() {
            this.showForm = false;
        },

        movePartToSF( partObj, index = null, type = 'create' ){

            // check if partObj.partNumber is already in the group
            let isIn = false;
            (this.sfPartList).map( (elm, itInd) => {
                if( type == 'create'){
                    if( elm['partNumber'] === partObj['partNumber'] ){
                        isIn = true;
                    }
                } else if ( type == 'update') {
                    if( elm['partNumber'] === partObj['partNumber'] && index !== itInd ){
                        isIn = true;
                    }
                }
            });

            partObj.total = partObj.amount;
            if( isIn === false ){  //if is not, add new part
                if( type == 'create') {
                    (this.sfPartList).push( partObj );
                } else if( type == 'update') {
                    // this.sfPartList[index] = partObj;
                    this.$set( this.sfPartList, index, partObj )
                }                    
                this.showForm = false;
            } else {
                this.$refs.toast.makeToast('warning', `La partida "${partObj['partNumber']}" ya se encuentra en la S.F.`);
            }          
        },

        validateFullForm(){
            //test projectNumber 
            if( !this.incomeData['projectNumber'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir un "Proyecto"`); return  }
            //test account 
            if( !this.incomeData['account'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir una "Cuenta"`); return  }
            //test concept 
            if( !this.incomeData['concept'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar un "Concepto"`); return  }
            //test month 
            if( !this.incomeData['month'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir un "Mes"`); return  }
            //test elabDate 
            if( !this.incomeData['elabDate'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir una "Fecha de elaboración"`); return  }
            //test opType 
            if( !this.incomeData['opType'] ){ this.$refs.toast.makeToast('warning', `Favor de elegir un "Tipo de operación"`); return  }
            //test sign
            if( (this.incomeData['sign']).length < 3 ){ this.$refs.toast.makeToast('warning', `"A favor de" debe tener mas de 3 caracteres`); return  }
            if( !this.incomeData['sign'] ){ this.$refs.toast.makeToast('warning', `Favor de capturar "A favor de"`); return  }

            //test sfPartList
            if( (this.sfPartList).length <= 0 ){ this.$refs.toast.makeToast('warning', `Favor de capturar almenos una "Partida" en la lista`); return }
            
            //test substraction 
            if( this.substraction < 0 ){ this.$refs.toast.makeToast('warning', `Las partidas capturadas sobrepasan lo presupuestado en el mes`); return }

            // if SF print type == services
            if( this.incomeData.sfAddData.sfPrintType == 'ser' ){
                //test sfTaxType 
                if( !this.incomeData.sfAddData.sfTaxType ){ this.$refs.toast.makeToast('warning', `Favor de elegir el "tipo de servicio"`); return }
            }
            
            this.saveSF();
        },

        async saveSF(){
            let fetchUrl = '';
            if( this.formType == 'Alta') {
                fetchUrl = `${process.env.apiUrl}/incomes/create`;
            } else if( this.formType == 'Edición'){
                fetchUrl = `${process.env.apiUrl}/incomes/update`;
            }
            let redirectUrl = `ingresos/sf_impresion?code=${this.incomeData.sfId}`;

            const dataObject = this.incomeData;
            dataObject['partList'] = this.sfPartList;

            const res = await fetch( fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(dataObject)
            });

            // console.log(await res);
            this.showLoader('Guardando S.F.');
            const resData = await res.json();                
            this.hideLoader();

            if( res.status === 200 ){                
                this.$refs.toast.makeToast('success', `S.F guardada exitosamente`);
                setTimeout(function(){
                    window.open(redirectUrl, "_blank");
                    window.location.href = `ingresos`;                       
                    // this.$router.push(redirectUrl);
                }, 1000);
                
            } else {
                this.$refs.toast.makeToast('error', `No se pudo guardar, intenta nuevamente`);
            }
        },

        //update methods 
        async getProjectData( id ){
            const res = await fetch(`${process.env.apiUrl}/incomes/getSF/${id}`);
            this.showLoader('Guardando S.F.');
            const resData = await res.json();                
            this.hideLoader();

            if( res.status === 200 ){                
                // console.log(resData.results);
                // set income values 
                this.incomeData.account= resData.results.account;
                this.incomeData.concept= resData.results.concept;
                this.incomeData.elabDate= resData.results.elabDate;
                this.incomeData.month= resData.results.month;
                this.incomeData.obs= resData.results.obs;
                this.incomeData.opType= resData.results.opType;
                this.incomeData.projectNumber= resData.results.projectNumber;
                this.incomeData.sfId= resData.results.sfId;
                this.incomeData.sfNum= resData.results.sfNum;
                this.incomeData.sign= resData.results.signName;
                this.incomeData.type= resData.results.type;

                this.incomeData.sfAddData.isrR= resData.results.sfData.isrRC;
                this.incomeData.sfAddData.ivaR= resData.results.sfData.ivaRC;
                this.incomeData.sfAddData.ivaT= resData.results.sfData.ivaTC;
                this.incomeData.sfAddData.sfPrintType= resData.results.sfData.sfPrintType;
                this.incomeData.sfAddData.sfTaxType= resData.results.sfData.sfTaxType;
                this.incomeData.sfAddData.taxConfig[0] = (resData.results.sfData.taxConfig[0] == '1');
                this.incomeData.sfAddData.taxConfig[1] = (resData.results.sfData.taxConfig[1] == '1');
                this.incomeData.sfAddData.taxConfig[2] = (resData.results.sfData.taxConfig[2] == '1');

                this.sfPartList = resData.results.partList

                 this.$refs.mainForm.getMonthParts();
            } else {
                this.$refs.toast.makeToast('error', `Error al buscar la S.F. (${id}), intenta nuevamente`);
            }
        }
    },
    computed: {
        totalBudget: function(){
            let total = 0;
            this.proyPartList.map( (elm) => {
                total += parseFloat(elm.amount);
            })
            return total;
        },
        prevTotal: function(){
            let sumTotal = 0
            this.prevSF.forEach(sf => {
                if( sf.sfId != this.incomeData.sfId )
                sumTotal += parseFloat(sf.requested);
            });
            return sumTotal;
        },
        totalParts: function(){
            let total = 0;
            this.sfPartList.map( (elm) => {
                total += parseFloat(elm.total);
            })
            this.incomeData['requested'] = total;
            return total;
        },
        substraction: function(){
            return (this.totalBudget -  this.prevTotal - this.totalParts);
            // return this.totalBudget - this.prevTotal
            console.log( this.totalBudget, this.prevTotal, this.totalParts);
        },

        ivaTra(){
            if( this.incomeData.sfAddData.taxConfig[0] == true ){
                return ( this.totalParts * this.incomeData.sfAddData.ivaT );
            } else {    return 0;   }
        },
        ivaRet(){
            if( this.incomeData.sfAddData.taxConfig[1] == true ){
                return ( this.totalParts * this.incomeData.sfAddData.ivaR );
            } else {    return 0;   }
        },
        isrRet(){
            if( this.incomeData.sfAddData.taxConfig[2] == true ){
                return ( this.totalParts * this.incomeData.sfAddData.isrR );
            } else {    return 0;   }
        }
    }
}
</script>

<style>
    .panel .title{
        font-size: 1em;
        letter-spacing: 1.2px;
        margin-bottom: 1em;
    }
</style>