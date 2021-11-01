<template>
    <div class="row projectForm">        
        <div class="col-12">

            <div class="row">
                <div class="col-12">
                    <h3>Formulario de proyectos</h3>
                </div>
            </div>

            <ProjectForm v-model="projectData" />
 
            
            <button class="btn btn-success" @click="getProjectData('021188')">getProjectData</button>
                    
            <div class="row">
                <div class="col-6" v-for="account in projectData.accounts" :key="account.id">
                    <div class="row">
                        <div class="col-6">Tipo de cuenta: {{ $store.state.accountType[ account.accountType - 1 ] }}</div>
                        <div class="col-6">Total: ${{ account.total }} </div>

                        <div class="col-12">
                            <table>
                                <tr>
                                    <th>Capítulo 1000</th>
                                    <th>Capítulo 2000</th>
                                    <th>Capítulo 3000</th>
                                    <th>Capítulo 4000</th>
                                    <th>Capítulo 5000</th>
                                </tr>
                                <tbody>
                                    <tr>
                                        <td v-for="chap in account.chapters" :key="chap.id"> 
                                            ${{ chap.total }} 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-12">
                            Desglose de capítulo por mes
                            <table>
                                <tr>
                                    <th></th>
                                    <th v-for="month in $store.state.monthList" :key="month">
                                        {{ month.substring(0,3) }}
                                    </th>
                                </tr>
                                <tbody>
                                    <tr v-for="chap in account.chapters" :key="chap.id">
                                        <th> Cap. {{chap.chapter}}000 </th>
                                        <td> ${{chap.month1}} </td> <td> ${{chap.month2}} </td> <td> ${{chap.month3}} </td> 
                                        <td> ${{chap.month4}} </td> <td> ${{chap.month5}} </td> <td> ${{chap.month6}} </td> 
                                        <td> ${{chap.month7}} </td> <td> ${{chap.month8}} </td> <td> ${{chap.month9}} </td> 
                                        <td> ${{chap.month10}} </td> <td> ${{chap.month11}} </td> <td> ${{chap.month12}} </td> 
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div class="col-12">
                            Desglose de partidas
                            <div v-for="part in account.parts" :key="part.id">
                                <span>soy una partida</span>
                            </div>                            
                        </div>

                        <div class="col-12">
                            <button class="btn btn-info" @click="openPartForm(account.accountType)" >Añadir nueva partida</button>
                        </div>
                    </div>
                </div>
            </div>

            <form>
                <div class="row">
                    <div class="col-12">
                        <input type="text" ref="selectedId" v-model="partListData.selectedId" />
                        <input type="text" ref="selectedAccount" v-model="partListData.selectedAccount" />
                    </div>

                    <div class="col-3">
                        <b-form-select ref="selectedChapter" v-model="partListData.selectedChapter">
                            <b-form-select-option value="">Elige un capítulo</b-form-select-option>
                            <b-form-select-option :value="index" v-for="index in 5" :key="index">
                                Cap. {{index}}000
                            </b-form-select-option>
                        </b-form-select>
                    </div>
                    <div class="col-6">
                        <b-form-select ref="selectedPart" v-model="partListData.selectedPart">
                            <b-form-select-option value="">Elige una partida</b-form-select-option>
                            <b-form-select-option :value="part.partNumber" v-for="part in filterPartList" :key="part.partNumber">
                                {{part.partNumber}} - {{part.partName}}
                            </b-form-select-option>                                                        
                        </b-form-select>
                    </div>             
                    <div class="col-1">Total:</div>
                    <div class="col-2"><input type="text" v-model="partTotal" disabled /></div>

                    <div class="col-12">
                        <div class="row">
                            <div class="col-2" v-for="month, index in $store.state.monthList" :key="index">
                                <div> {{ month.substring(0,3) }} </div>
                                <div> 
                                    <input type="number" v-model="partListData.months[index]" min="0" /> <br>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12">
                        <button class="btn btn-info" @click.prevent="validateForm('part')">Añadir partida</button>
                    </div>
                </div>
            </form>            

            <Toast ref="toast"></Toast>         
            
        </div>
         
    </div>
</template>

<script>
import ProjectForm from '../../components/projects/ProjectForm.vue';

import Toast from '../../components/general/Toast.vue'

export default {
    name: 'project-form',
    components: { ProjectForm, Toast },
    data() {
        return {
            blockPoject: false,
            isSaving:  false,
            projectData: {
                type: 'gb',
                projectNumber: '333',
                projectName: 'mi proyecto',
                degree: 'Ing',
                manager: 'Ayumi Serna   ',
                year: '2020',
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

            partListData: {
                selectedId: '',
                selectedAccount: '',
                selectedChapter: '',
                selectedPart: '',
                months: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                partList: [],
            },

            pNombre: 'Ayumi',
            formData: {
                nombre: 'Ayumi',
                teléfono: ''
            }
        }
    },
    computed: {
        filterPartList: function() {
            // return this.partListData.partList;
            return (this.partListData.partList).filter((elm)=>{
                if( (elm.partNumber).substring(0, 1) == this.partListData.selectedChapter )
                    return elm; 
            });
        },

        partTotal: function() {
            let calc = 0;
            
            (this.partListData.months).forEach(elm => {
                if( isNaN(parseFloat(elm)) ) {  elm = 0; }
                calc += parseFloat(elm)
            });
            
            return calc;
        }
    },
    created() {
        // set current working year 
        if(process.client){
            this.projectData.year = localStorage.getItem('year');
        }

        // if has project code / block projectNumber / get projectFullData
        if( this.$nuxt.$route.query.code ){

            let code = this.$nuxt.$route.query.code;
            this.blockPoject = true;

            this.getProjectData( code );
        }

        this.getPartsList();
    },
    methods: {
        printFormData(){
            console.log(this.formData);
        },

        //get authorized parts info
        async getPartsList() {
            const res = await fetch(`${process.env.apiUrl}/parts/list`);
             // if api response is ok 
            if( res.status === 200 ){
                const resData = await res.json();                
                // assign resData to partList
                this.partListData.partList = resData.results;                
                
            } else {
                this.$refs.toast.makeToast('danger', `No se pudo obtener la lista de partidas, intenta nuevamente`);
            }
        },

        //get all project data
        async getProjectData( proj ) {
            //make fetch to api 
            const res = await fetch(`${process.env.apiUrl}/projects/projectData/${this.projectData.year}/${proj}`);

             // if api response is ok 
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200) {   //if data response is ok
                    // assign resData to component data
                    this.projectData = resData.data[0];
                } else {    //if data has error
                    this.$refs.toast.makeToast('danger', `${resData.message} / redireccionando...`);
                    setTimeout( ()=>{
                        this.$router.push('/proyectos/lista');        
                    }, 4000);        
                }                            
            } else {
                this.$refs.toast.makeToast('danger', `Ocurrió un problema, intente nuevamente`);
            }
        },

        //open part form
        openPartForm( accountType ){
            this.partListData.selectedAccount = accountType;
        },

        // validate form fields 
        validateForm(form){
            if( form === 'project'){
                //test projectNumber 
                if( !this.projectData.projectNumber ){ this.$refs.projectNumber.focus(); this.$refs.toast.makeToast('warning', `Favor de capturar el "Numero de proyecto"`); return  }
                //test projectName
                if( !this.projectData.projectName ){ this.$refs.projectName.focus(); this.$refs.toast.makeToast('warning', `Favor de capturar el "Nombre de proyecto"`); return  }
                //test degree
                if( !this.projectData.degree ){ this.$refs.degree.focus(); this.$refs.toast.makeToast('warning', `Favor de elegir el "Título del encargado"`); return  }
                //test manager
                if( !this.projectData.manager ){ this.$refs.manager.focus(); this.$refs.toast.makeToast('warning', `Favor de elegir el "Nombre del encargado"`); return  }

                //if all ok 
                this.saveProject();
            }
            if( form === 'part'){   
                //test selectedChapter 
                if( !this.partListData.selectedChapter ){ this.$refs.selectedChapter.focus(); this.$refs.toast.makeToast('warning', `Favor de elegir un capítulo"`); return  }
                //test selectedPart 
                if( !this.partListData.selectedPart ){ this.$refs.selectedPart.focus(); this.$refs.toast.makeToast('warning', `Favor de elegir una partida"`); return  }

                // if all ok
                this.savePart();
            }
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
                body: JSON.stringify(this.projectData)
            });

            // if api response is ok 
            if( res.status === 200 ){
                //convert response to json
                const resData = await res.json();
                // console.log(resData);
                if( resData.action === 'created') {
                    //disable project number field
                    this.blockPoject = true;
                    // send success message 
                    this.$refs.toast.makeToast('success', `El Proyecto ${this.projectData.projectNumber} se creó exitosamente`);

                    //load created project data
                    this.getProjectData( this.projectData.projectNumber );

                } else if( resData.action === 'updated') {
                    this.$refs.toast.makeToast('success', `El Proyecto ${this.projectData.projectNumber} se actualizó exitosamente`);
                }                                
            } else {
                this.$refs.toast.makeToast('danger', `Ocurrió un problema, intente nuevamente`);
            }
            //enable submit button 
            this.isSaving = false;
        },

        //submit part form data
        async savePart() {
            let fetchUrl = '';
            if( !this.partListData.selectedId ){  //is a create
                fetchUrl = `${process.env.apiUrl}/parts/save`;
            } else {     //is an update
                fetchUrl = `${process.env.apiUrl}/parts/update`;
            }
            console.log(fetchUrl);
            
            // create dataObject
            const dataObject = [{
                partId: this.partListData.selectedId,
                projectNumber: this.projectData.projectNumber,
                accountType: this.partListData.selectedAccount,
                chapter: this.partListData.selectedChapter,
                partNumber: this.partListData.selectedPart,
                total: this.partTotal,
                year: this.projectData.year,
                months: this.partListData.months,
            }];

            const res = await fetch( fetchUrl , {
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(dataObject)
            });

            // if api response is ok 
            if( res.status === 200 ){
                //convert response to json
                const resData = await res.json();
                // console.log(resData);
                if( resData.action === 'created') {
                    // send success message 
                    this.$refs.toast.makeToast('success', `El Proyecto ${this.projectData.projectNumber} se creó exitosamente`);
                } else if( resData.action === 'updated') {
                    this.$refs.toast.makeToast('success', `El Proyecto ${this.projectData.projectNumber} se actualizó exitosamente`);
                }
                //load created project data
                    this.getProjectData( this.projectData.projectNumber );                                
            } else {
                this.$refs.toast.makeToast('danger', `Ocurrió un problema, intente nuevamente`);
            }
        }
    }
}
</script>

<style>

</style>