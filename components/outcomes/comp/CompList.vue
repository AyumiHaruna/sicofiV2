<template>
    <div class="row compList">
        <div class="col-6 sectionTitle">
            LISTA DE COMPROBACIONES
        </div>
        <div class="col-6 text-right">
            <button class="actionBtn infoBtn" v-b-tooltip.hover title="Añadir Validación" alt="Añadir Validación" @click="$parent.openForm()">
                <i class="fas fa-clipboard-check"></i>
                AÑADIR COMPROBACIÓN
            </button>
        </div>

        <div class="col-12">
            <table class="secondLvl">
                <tr>
                    <th>FECHA DE COMPROBACIÓN</th>
                    <th>TOTAL DE LA COMPROBACIÓN</th>
                    <th>GNC</th>
                    <th>ELIMINAR</th>
                </tr>    
                <tr v-for="comp in $parent.outcome.comp" :key="comp.id">
                    <td> {{comp.compDate}} </td>
                    <td> ${{moneyFormat(comp.total)}} </td>
                    <td> <input type="checkbox" @change="$parent.changeGNC(comp.id, $event)" :checked="comp.gnc == 1" /> </td>
                    <td>
                        <button class="miniBtn closeBtn" @click="askDeleteComp( comp.id )">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'CompList',
    mixins: [ GlobalFunctions ],
    methods: {
        askDeleteComp( id ) {
            this.$swal.fire({
                title: 'Deseas eliminar esta comprobación!?',
                type: 'question',
                showCancelButton: true,
                showConfirmButton: true,                
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    console.log('ask', id);
                    this.$parent.deleteComp(id);
                }
            });
        }
    }
}
</script>

<style>
    .compList .sectionTitle{
        margin-top: 2.5em;
    }
    .compList input{
        width: 1.5rem;
    }
</style>