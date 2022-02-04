<template>
  <div class="row panel">
      <div class="col-5 sectionTitle">
        PARTIDAS EN S.F.
      </div>
      <div class="col-7 text-right">
        <button class="actionBtn infoBtn" @click.prevent="$parent.showPartForm()"> 
          <i class="fas fa-puzzle-piece"></i>
          AGREGAR PARTIDA
        </button>
      </div>
      <div class="col-12">
        <table class="secondLvl">
          <tr>
            <th>PARTIDAS</th>
            <th>MONTO</th>
            <th>ACCIONES</th>
          </tr>            
          <tr v-for="(part, index) in $parent.sfPartList" :key="index">
            <td>{{part.partNumber}} - {{part.partName}}</td>
            <td>${{ moneyFormat(part.total) }}</td>
            <td class="actionCell">
                <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar" @click="$parent.showPartForm( 'update', part, index )"><i class="fas fa-pen"></i></button>
                <button class="miniBtn closeBtn" v-b-tooltip.hover title="Eliminar" @click="askForDelete(index)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </table>
      </div>
  </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
  name: 'sfPartListForm',
  mixins: [ GlobalFunctions ],
  methods: {
    askForDelete( index ) {
      this.$swal.fire({
          title: 'Deseas eliminar la partida de la S.F.!?',
          type: 'question',
          showCancelButton: true,
          showConfirmButton: true,                
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar',
          reverseButtons: true
      }).then((result) => {
        if (result.value) {
          ( this.$parent.sfPartList ).splice( index, 1);
        }
      });
    }
  }
}
</script>

<style>
</style>