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
  /* table.partData {
      border: 0px solid #550652;
      background-color: #411438;
      width: 100%;
      text-align: center;
      border-collapse: collapse;
      font-size: 0.9em;
  }
  table.partData td, table.partData th {
      border: 1px solid #555555;
      padding: 0.5em 1em;
  }
  table.partData tbody td {
      color: #FFFFFF;
      text-align: left;
  }
  table.partData .actionCell{
    text-align: center;
    padding: 0.5em 0;
  }
  table.partData td:nth-child(even) {
      background: #68396a;
  }
  table.partData thead {
      background: #845580;
      border-bottom: 2px solid #6E02BA;
  }
  table.partData thead th {
      font-weight: bold;
      color: #F6F6F6;
      text-align: center;
      border-left: 2px solid #553751;
  }
  table.partData thead th:first-child {
      border-left: none;
  }
  table.partData button{
    background-color: #41143d;
    border: none;
    color: #fff;
    font-size: 1.8em;
    padding: 0.2em 0.3em;
    border-radius: 5px;
  }
  table.partData button:hover{
    background-color: #802779;
  } */
</style>