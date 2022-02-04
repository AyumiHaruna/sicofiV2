<template>
    <div class="row">
        <div class="col-12 sectionTitle">
            DATOS DEL RECIBO GNC
        </div>
        <div class="col-12">
            <div class="row">
                <div class="col-6">
                    <input type="text" list="suggestions" name="gncName" v-model.trim="$parent.outcome.gncName" @input="changeToUpper()" @change="updateGncData()">
                        <datalist id="suggestions">
                            <option v-for="(suggest, index) in suggestions" :key="index">{{suggest.name}}</option>
                        </datalist>
                    <label for="gncName">NOMBRE DEL SOLICITANTE</label>
                </div>
                <div class="col-6">
                    <input type="text" name="gncLocation" v-model.trim="$parent.outcome.gncLocation" @change="updateGncData()">
                    <label for="gncLocation">SITIO DE LA COMISIÓN</label>
                </div>
            </div>
        </div>
        <div class="col-12 text-right">
            <!-- <a :href="`${getApiUrl}/print/recibo_gnc/${$parent.outcome.id}`" target="_blank"> -->
                <button class="actionBtn warningBtn" @click="testGncData()"> 
                    <i class="fas fa-file-invoice-dollar"></i> IMPRIMIR RECIVO GNC
                </button>
            <!-- </a> -->
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'GncForm',
    mixins: [ GlobalFunctions ],
    data() {
        return {
            suggestions: []
        }
    },
    mounted() {
        this.getPeopleList();
    },
    methods: {
        async getPeopleList(){
            // get projects list
            const res = await fetch(`${process.env.apiUrl}/people/list`);
        
            if( res.status === 200 ){
                const resData = await res.json();
                if( resData.status === 200 ){
                    this.suggestions = resData['results'];                 
                }
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema al buscar lista de usuarios, intente nuevamente`);
            }
        },
        async updateGncData(){
            // get month parts and autofill
            const res = await fetch(`${process.env.apiUrl}/outcomes/gnc`,{
                method: 'post',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: this.$parent.outcome.id,
                    gncName: this.$parent.outcome.gncName,
                    gncLocation: this.$parent.outcome.gncLocation,
                    year: this.$parent.outcome.year
                })
            });

            // if api response is ok 
            if( res.status === 200 ){
                this.$parent.$refs.toast.makeToast('success', `datos de GNC modificados exitosamente`);  

            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema al modificar los datos de GNC, intente nuevamente`);
            }
        },
        changeToUpper() {
            this.$parent.outcome['gncName'] = (this.$parent.outcome['gncName']).toUpperCase();
        },
        testGncData() {
            // test gncName
            if( this.$parent.outcome.gncName == '' ) {  this.$parent.$refs.toast.makeToast('error', `El nombre del solicitante de GNC no existe`); return;}
            // test gncLocation
            if( this.$parent.outcome.gncLocation == '' ) {  this.$parent.$refs.toast.makeToast('error', `La locación del recibo GNC no existe`); return;}

            // update data
            this.updateGncData();
            
            setTimeout(()=>{
                window.open(`${this.getApiUrl}/print/recibo_gnc/${this.$parent.outcome.id}`, '_blank');
            }, 1500);
        },
    }
}
</script>

<style>

</style>