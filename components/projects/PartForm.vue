<template>
    <form>
        
        <div class="row smoke">
            <div class="col-10 offset-1">
                <div class="row partForm panel borderedPanel">
                    <div class="col-12">
                        <input type="hidden" ref="selectedId" v-model="formObj.selectedId" />
                        <input type="hidden" ref="selectedAccount" v-model="formObj.selectedAccount" />
                    </div>

                    <div class="col-12 title">
                        <h4>Formulario de partidas</h4>
                    </div>

                    <div class="col-3">
                        <b-form-select ref="selectedChapter" name="selectedChapter" v-model="formObj.selectedChapter">
                            <b-form-select-option value="">Elige un capítulo</b-form-select-option>
                            <b-form-select-option :value="index" v-for="index in 5" :key="index">
                                Cap. {{index}}000
                            </b-form-select-option>
                        </b-form-select>
                        <label for="selectedChapter">CAPÍTULO</label>
                    </div>
                    <div class="col-7">
                        <b-form-select ref="selectedPart" name="selectedPart" v-model="formObj.selectedPart">
                            <b-form-select-option value="">Elige una partida</b-form-select-option>
                            <b-form-select-option :value="part.partNumber" v-for="part in filterPartList" :key="part.partNumber">
                                {{part.partNumber}} - {{part.partName}}
                            </b-form-select-option>                                                        
                        </b-form-select>
                        <label for="selectedPart">PARTIDA</label>
                    </div>             
                    
                    <div class="col-2">
                        <input type="text" name="total" class="blockedField" v-model="partTotal" disabled />
                        <label for="total">TOTAL ($)</label>
                    </div>

                    <div class="col-12">
                        <div class="row">
                            <div class="col-2" v-for="month, index in $store.state.monthList" :key="index">
                                <input type="number" :name="`month${index}`" v-model="formObj.months[index]" min="0" /> 
                                <label :for="`month${index}`"> {{ (month.substring(0,3)).toUpperCase() }} </label>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 text-right">
                        <button class="actionBtn closeBtn" @click.prevent="$parent.closePartForm">
                            <i class="fas fa-times"></i>
                            CANCELAR
                        </button>

                        <button class="actionBtn saveBtn" @click.prevent="validateForm()" :disabled="isSaving">
                            <i class="fas fa-save"></i>
                            <span v-if="formObj.formType === 'create'">AÑADIR</span>
                            <span v-if="formObj.formType === 'update'">ACTUALIZAR</span> 
                            PARTIDA
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
    </form>
</template>

<script>
import GlobalFunctions from '../../mixins/GlobalFunctions';

export default {
    name: 'PartForm',
    mixins: [ GlobalFunctions ],
    prop: [
        'value'
    ],
    data() {
        return {
            partList: [],
            formObj: {
                selectedId: '',
                selectedAccount: '',
                selectedChapter: '',
                selectedPart: '',
                selectedProject: '',
                months: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                formType: 'create',
                year: ''
            },
            isSaving: false
        }
    },
    computed: {
        partTotal: function() {
            let calc = 0;
            
            (this.formObj.months).forEach(elm => {
                if( isNaN(parseFloat(elm)) ) {  elm = 0; }
                calc += parseFloat(elm)
            });
            
            return calc;
        },

        filterPartList: function() {
            // return this.partListData.partList;
            return (this.partList).filter((elm)=>{
                if( (elm.partNumber).substring(0, 1) == this.formObj.selectedChapter )
                    return elm; 
            });
        },
    },
    created() {
        this.getPartsList();
    },
    updated() {
        // console.log('value', this.$attrs.value);
        this.formObj = this.$attrs.value
    },
    methods: {
        //get authorized parts info
        async getPartsList() {
            const res = await fetch(`${process.env.apiUrl}/parts/list`);
             // if api response is ok 
            if( res.status === 200 ){
                const resData = await res.json();                
                // assign resData to partList
                this.partList = resData.results;                
                
            } else {
                this.$parent.$refs.toast.makeToast('error', `No se pudo obtener la lista de partidas, intenta nuevamente`);
            }
        },

        // validate form fields 
        validateForm(){            
            //test selectedChapter 
            if( !this.formObj.selectedChapter ){ this.$refs.selectedChapter.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir un capítulo"`); return  }
            //test selectedPart 
            if( !this.formObj.selectedPart ){ this.$refs.selectedPart.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir una partida"`); return  }
            //autofill empty numbers    
            for (let i = 0; i < 12; i++) {
                if( this.formObj['months'][i] === '' ){  this.formObj['months'][i] = 0  }                
            }
            // if all ok
            this.savePart();            
        },

        //submit part form data
        async savePart() {
            let fetchUrl = '';
            if( this.formObj.formType === 'create'){  //is a create
                fetchUrl = `${process.env.apiUrl}/parts/save`;
            } else {     //is an update
                fetchUrl = `${process.env.apiUrl}/parts/update`;
            }
                        
            // this.isSaving = true;

            // create dataObject
            const dataObject = [{
                partId: this.formObj.selectedId,
                projectNumber: this.formObj.selectedProject,
                accountType: this.formObj.selectedAccount,
                chapter: this.formObj.selectedChapter,
                partNumber: this.formObj.selectedPart,
                total: this.partTotal,
                year: this.formObj.year,
                months: this.formObj.months,
            }];

            const res = await fetch( fetchUrl , {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(dataObject)
            });

            // console.log( await res );
            // if api response is ok 
            if( res.status === 200 ){
                //convert response to json
                const resData = await res.json();
                // console.log(resData);
                if( resData.action === 'created') {
                    // send success message 
                    this.$parent.$refs.toast.makeToast('success', `La partida se añadió exitosamente`);
                } else if( resData.action === 'updated') {
                    this.$parent.$refs.toast.makeToast('success', `La partida se actualizó exitosamente`);
                }
                //load created project data
                    this.$parent.closePartForm();
                    this.$parent.getProjectData( this.formObj.selectedProject );                                
            } else {
                this.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
            this.isSaving = false;
        }
    }
}
</script>

<style>
    .smoke {
        background-color: rgba(0,0,0,0.5);
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        z-index: 2;
    }

    .partForm {
        margin-top: 15em;
        padding: 2em;
    }

    .title{
        margin-bottom: 1.5em;
    }
    
</style>