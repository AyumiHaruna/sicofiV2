<template>
    <form>
        <div class="row block">
            <div class="col-8 block">
                <div class="row">
                    <div class="col-12 panel">
                        <div class="row bordered">
                            <div class="col-12 sectionTitle">
                                Datos del proyecto
                            </div>

                            <div class="col-3">
                                    <input type="text" ref="projectNumber" name="projectNumber" v-model="formObj.projectNumber" 
                                        maxlength="10"  @input="$emit('input', formObj)" :disabled="projBlock"
                                        :class="(projBlock)? 'blockedField' : ''" required
                                    >
                                    <label for="projectNumber"># DE PROYECTO</label>
                            </div>
                            <div class="col-9">
                                    <input type="text" ref="projectName" name="projectName" v-model="formObj.projectName">
                                    <label for="projectName">NOMBRE DEL PROYECTO</label>
                            </div>

                            <div class="col-3">
                                    <b-form-select ref="degree" name="degree" v-model="formObj.degree" >
                                        <b-form-select-option value="">Elige un título</b-form-select-option>
                                        <b-form-select-option value="Lic">Lic.</b-form-select-option>
                                        <b-form-select-option value="Ing">Ing.</b-form-select-option>
                                        <b-form-select-option value="Mtra">Mtra.</b-form-select-option>
                                        <b-form-select-option value="Mtro">Mtro.</b-form-select-option>
                                        <b-form-select-option value="Dra">Dra.</b-form-select-option>
                                        <b-form-select-option value="Dr">Dr.</b-form-select-option>
                                    </b-form-select>
                                    <label for="degree">TÍTULO DEL ENCARGADO</label>
                            </div>
                            <div class="col-9">
                                    <input type="text" ref="manager" name="manager" v-model="formObj.manager" maxlength="100"  @input="changeToUpper()">
                                    <label for="manager">NOMBRE DEL ENCARGADO</label>    
                            </div>

                            <div class="col-3">
                                <b-form-select ref="type" name="type" v-model="formObj.type">
                                    <b-form-select-option value="">Elige un tipo de proyecto</b-form-select-option>
                                    <b-form-select-option value="pro">Proyecto</b-form-select-option>
                                    <b-form-select-option value="gb">Gasto Básico</b-form-select-option>
                                    <b-form-select-option value="nom">Nómina</b-form-select-option>
                                </b-form-select>
                                <label for="type">TIPO DE PROYECTO</label>    
                            </div>
                            <div class="col-9 text-right">
                                    <button class="actionBtn saveBtn" @click.prevent="validateForm()" :disabled="isSaving"> 
                                        <i class="far fa-save"></i>
                                        GUARDAR PROYECTO
                                    </button>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            <div class="col-4 block">
                <div class="row">
                    <div class="col-12 panel">
                        <div class="row bordered">
                            <div class="col-12 sectionTitle"> 
                                Totales 
                            </div>
                            <div class="col-12">
                                <table class="secondLvl">
                                    <tr>
                                        <th>T. Autorizado:</th>
                                        <td>${{moneyFormat(value.totalAuth)}}</td>
                                    </tr>
                                    <tr>
                                        <th>T. Coordinación:</th>
                                        <td>${{moneyFormat(value.coordAuth)}}</td>
                                    </tr>
                                    <tr>
                                        <th>T. Instituto:</th>
                                        <td>${{moneyFormat(value.instAuth)}}</td>
                                    </tr>
                                    <tr>
                                        <th>Cap. 1000:</th>
                                        <td>${{moneyFormat(value.cap1)}}</td>
                                    </tr>
                                    <tr>
                                        <th>Cap. 2000:</th>
                                        <td>${{moneyFormat(value.cap2)}}</td>
                                    </tr>
                                    <tr>
                                        <th>Cap. 3000:</th>
                                        <td>${{moneyFormat(value.cap3)}}</td>
                                    </tr>
                                    <tr>
                                        <th>Cap. 4000:</th>
                                        <td>${{moneyFormat(value.cap4)}}</td>
                                    </tr>
                                    <tr>
                                        <th>Cap. 5000:</th>
                                        <td>${{moneyFormat(value.cap5)}}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                        
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'ProjectForm',
    mixins: [ GlobalFunctions ],
    props: [ 'value', 'blocked' ],    
    data() {
        return {
            formObj: {
                type: '',
                projectNumber: '',
                projectName: '',
                degree: '',
                manager: '',
                year: '',
                month: '',
                totalAuth: 0,
                coordAuth: 0,
                instAuth: 0,
                cap1: 0,
                cap2: 0,
                cap3: 0,
                cap4: 0,
                cap5: 0,
                accounts: []
            },
            isSaving: false,
            projBlock: false
        }
    },
    mounted() {
        this.formObj = this.value;  
    },
    updated() {
        this.formObj = this.value;  
        if(this.blocked){
            this.projBlock = true;
        }     
    },
    methods: {
        validateForm() {
             //test projectNumber 
            if( !this.formObj.projectNumber ){ this.$refs.projectNumber.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Numero de proyecto"`); return  }
            //test projectName
            if( !this.formObj.projectName ){ this.$refs.projectName.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de capturar el "Nombre de proyecto"`); return  }
            //test degree
            if( !this.formObj.degree ){ this.$refs.degree.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir el "Título del encargado"`); return  }
            //test manager
            if( !this.formObj.manager ){ this.$refs.manager.focus(); this.$parent.$refs.toast.makeToast('warning', `Favor de elegir el "Nombre del encargado"`); return  }

            //if all ok 
            this.saveProject();
        },

        //submit project form data
        async saveProject() {
            //disable submit button 
            this.isSaving = true;   

            //make fetch to api 
            const res = await fetch(`${process.env.apiUrl}/projects/save`,{
                method: 'post',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify(this.formObj)
            });

            // if api response is ok 
            if( res.status === 200 ){
                //convert response to json
                const resData = await res.json();
                // console.log(resData);
                if( resData.action === 'created') {
                    //disable project number field
                    this.blockedField = true;
                    // send success message 
                    this.$parent.$refs.toast.makeToast('success', `El Proyecto ${this.formObj.projectNumber} se creó exitosamente`);

                    //load created project data
                    this.$parent.getProjectData( this.formObj.projectNumber );
                    this.projBlock = true;

                } else if( resData.action === 'updated') {
                    this.$parent.$refs.toast.makeToast('success', `El Proyecto ${this.formObj.projectNumber} se actualizó exitosamente`);
                }                                
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
            //enable submit button 
            this.isSaving = false;
        },

        changeToUpper() {
            this.formObj.manager = (this.formObj.manager).toUpperCase();
        },
        
    }
}
</script>

<style>

</style>