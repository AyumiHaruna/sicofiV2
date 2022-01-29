<template>
  <div class="row panel">
      <div class="col-12 sectionTitle">
        PARTIDAS PRESUPUESTADAS EN "{{ ($parent.incomeData['month'] === '')? '---' : ($store.state.monthList[ $parent.incomeData['month'] - 1 ]).toUpperCase() }}"
      </div>
      <div class="col-12">
        <table class="secondLvl">
          <tr>
            <th>PARTIDA</th>
            <th>MONTO</th>
            <th>AGREGAR</th>
          </tr>            
          <tr v-for="(part, index) in $parent.proyPartList" :key="index">
            <td>{{part.partNumber}} - {{part.partName}}</td>
            <td>${{ moneyFormat(part.amount) }}</td>
            <td class="actionCell">
              <button class="miniBtn infoBtn" v-b-tooltip.hover title="Añadir a S.F." @click="$parent.movePartToSF( part )">
                <i class="fas fa-chevron-right"></i>
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
    name: 'proPartListForm',
    mixins: [ GlobalFunctions ],
}
</script>

<style>
</style>