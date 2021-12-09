<template>
  <div class="row panel">
      <div class="col-12 title">
        PARTIDAS PRESUPUESTADAS EN "{{ ($parent.incomeData['month'] === '')? '---' : ($store.state.monthList[ $parent.incomeData['month'] - 1 ]).toUpperCase() }} "
      </div>
      <div class="col-12">
        <table class="proyData">
          <thead>
            <tr>
              <th>Partida</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>            
          </thead>
          <tbody>
            <tr v-for="(part, index) in $parent.proyPartList" :key="index">
              <td>{{part.partNumber}} - {{part.partName}}</td>
              <td>${{ moneyFormat(part.amount) }}</td>
              <td class="actionCell">
                <button class="move" v-b-tooltip.hover title="Añadir a S.F." @click="$parent.movePartToSF( part )">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script>

import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'proPartListForm',
    mixins: [ GlobalFunctions ],
}
</script>

<style>
  table.proyData {
      border: 0px solid #170655;
      background-color: #261441;
      width: 100%;
      text-align: center;
      border-collapse: collapse;
      font-size: 0.9em;
  }
  table.proyData td, table.proyData th {
      border: 1px solid #555555;
      padding: 0.5em 1em;
  }
  table.proyData tbody td {
      color: #FFFFFF;
      text-align: left;
  }
  table.proyData .actionCell{
    text-align: center;
  }
  table.proyData td:nth-child(even) {
      background: #4D396A;
  }
  table.proyData thead {
      background: #685584;
      border-bottom: 2px solid #6E02BA;
  }
  table.proyData thead th {
      font-weight: bold;
      color: #F6F6F6;
      text-align: center;
      border-left: 2px solid #433755;
  }
  table.proyData thead th:first-child {
      border-left: none;
  }
  table.proyData button{
    background-color: #261441;
    border: none;
    color: #fff;
    font-size: 1.8em;
    padding: 0.2em 0.5em;
    border-radius: 5px;
  }
  table.proyData button:hover{
    background-color: #4a2780;
  }
</style>