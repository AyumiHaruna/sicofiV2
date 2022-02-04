<template>
    <div class="row yearAdmin block">
        <div class="col-12 panel">
            <div class="row">
                <div class="col-12 bordered">
                    <div class="row">
                        <div class="col-12 sectionTitle text-left">
                            ADMINISTRADOR DE AÑOS ACTIVOS
                        </div>
                        <div class="col-6">
                            <input type="number" name="año" v-model="year" @keypress="isNumber($event)">
                            <label for="año">AÑO</label>
                        </div>
                        <div class="col-6 text-right">
                            <button class="actionBtn saveBtn" v-b-tooltip.hover title="Añadir año" alt="Añadir año" @click="testYear()">
                                <i class="far fa-calendar-plus"></i>
                                AÑADIR AÑO
                            </button>
                        </div>

                        <div class="col-12 lista">
                            <ul>
                                <li v-for="year in activeYears" :key="year.year" @click="askForDelete(year.id)">
                                    {{year.year}} <i class="far fa-trash-alt"></i>    
                                </li>
                            </ul>
                        </div>
                    </div>  
                </div>                
            </div>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'YearAdmin',
    mixins: [ GlobalFunctions ],
    data() {
        return {
            activeYears: {},
            year: '',
        }
    },
    mounted() {
        this.getActiveYears();
    },
    methods: {
        async getActiveYears(){
            const res = await fetch( `${process.env.apiUrl}/getActiveYears` );

            const resData = await res.json();

            // if is a success data
            if(resData.status === 200) {
                this.activeYears = resData.results;
            } else {    //show error message
                this.$refs.toast.makeToast('error', `No se pudo cargar la lista de años activos, intenta nuevamente`);
            }   
        },

        async saveYear(){
            const res = await fetch( `${process.env.apiUrl}/year/create` ,  
            {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    year: this.year
                })
            });

            //get response & change isLoading
            this.showLoader('Guardando año');
                const resData = await res.json();
            this.hideLoader();

            // if is a success data
            if(resData.status === 200) {
                this.$parent.$refs.toast.makeToast('success', `Año guardado exitosamente`);
                this.getActiveYears();
            } else {    //show error message
                this.$parent.$refs.toast.makeToast('error', `No se pudo guardar el año, intenta nuevamente`);
            }   
        },

        async deleteYear( id ) {
            const res = await fetch( `${process.env.apiUrl}/year/delete` ,  
            {
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            });

            //get response & change isLoading
            this.showLoader('Eliminando año');
                const resData = await res.json();
            this.hideLoader();

            // if is a success data
            if(resData.status === 200) {
                this.$parent.$refs.toast.makeToast('success', `Año eliminado exitosamente`);
                this.getActiveYears();
            } else {    //show error message
                this.$parent.$refs.toast.makeToast('error', `No se pudo eliminar el año, intenta nuevamente`);
            } 
        },
        

        askForDelete( index ) {
            this.$swal.fire({
                title: 'Deseas eliminar éste año activo?!',
                type: 'question',
                showCancelButton: true,
                showConfirmButton: true,                
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.deleteYear( index );
                }
            });
        },
        testYear(){
            // test if year exists 
            if( this.year == '' ) {   this.$parent.$refs.toast.makeToast('error', `Favor de capturar el "Año"`);  return;  }
            // test year format
            if( (this.year).length < 4 || (this.year).length > 4 ) {   this.$parent.$refs.toast.makeToast('error', `El "Año" debe contener 4 caracteres`); return;  }
            // test year 2000 range 
            if( this.year < 2000 || this.year > 2999 ) {   this.$parent.$refs.toast.makeToast('error', `El "Año" debe ser mayor a 2000 y menor a 3000`); return;  }

            // check if captured year is already on list
            let exists = false;
            (this.activeYears).forEach(elm => {
                if( this.year == elm.year ) {
                    exists = true;
                }
            });

            if( exists ) {
                this.$parent.$refs.toast.makeToast('error', `El "Año" capturado ya existe`); return;
            } else {
                this.saveYear();
            }
        }
    }
}
</script>

<style>
    .yearAdmin .actionBtn{
        margin: 0;
    }

    .yearAdmin li{
        border: solid 2px orange;
        border-radius: 10px;
        margin: 1em 1em;
        width: fit-content;
        padding: 0.5em;
        color: orange;
    }
    .yearAdmin li:hover{
        opacity: 0.7;
        cursor: pointer;
    }
</style>