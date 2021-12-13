<template>
  <div class="row block">
    <div class="col-12 panel">
      
      <div class="row">

        <div class="col-12">
          <!-- sf main info table  -->
          <table class="incomeInfo">
            <tr>              
              <th>S.F. ID</th>
              <th>CONCEPTO</th>
              <th>OPERACIÓN</th>
              <th>OP. TIPO</th>
              <th>FECHA ELAB.</th>
            </tr>
            
            <tr>
              <td>{{income.sfId}}</td>
              <td>{{income.concept}}</td>
              <td>{{ (income.type == 'ing') ? 'Ingreso': 'Reintegro' }}</td>
              <td>{{opType}}</td>
              <td>{{income.elabDate}}</td>
            </tr>
          </table>

          <!-- sf cap ammount table  -->
          <table class="amountInfo">            
            <tr>
              <th v-for="num in 5" :key="num">CAP. {{num}}000</th>
            </tr>

            <tr>
              <td v-for="cap in 5" :key="cap">${{moneyFormat(income.sfData[`cap${cap}`])}}</td>
            </tr>

            <tr>
              <th>SOLICITADO</th>
              <th>VALIDADO</th>
              <th>POR VALIDAR</th>
              <th>% VALIDACIÓN</th>
              <th>AÑADIR VALIDACIÓN</th>
            </tr>

            <tr>
              <td>${{moneyFormat(income.requested)}}</td>
              <td>${{moneyFormat(income.ministered)}}</td>
              <td>${{ moneyFormat(income.requested - income.ministered) }}</td>
              <td>{{ ((income.ministered * 100) / income.requested).toFixed(2) }} % </td>
              <td>
                <button class="plusBtn infoBtn" v-b-tooltip.hover title="Validaciones" alt="Validaciones" @click="$parent.openform('create')">
                  <i class="fas fa-hand-holding-usd"></i>
                </button>
              </td>
            </tr>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions'

export default {
  name: 'SfMainInfo',
  props: [ 'income' ],
  mixins: [ GlobalFunctions ],
  computed: {
    opType: function(){
      switch ( this.income.opType ) {
        case 'gba':
                return 'Gasto Básico';
            break;
        case 'gop':
                return 'Gastos de operación';
            break;
        case 'inv':
                return 'Inversión';
            break;
        case 'pro':
                return 'Recursos fiscales';
            break;
        case 'gad':
                return 'Gastos de administración';
            break;
        case 'ter':
                return 'Con aportación de terceros';
            break;
    
        default:
                return '';
            break;
      }
    },
  }
}
</script>

<style>
  table.incomeInfo {
    border: 0px solid #170655;
    background-color: #261441;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
    font-size: 1em;
  }
  table.incomeInfo th {
    border: 1px solid #555555;
    padding: 0.5em 1em;
    font-size: 0.9em;
  }
  table.incomeInfo tbody td {
    font-size: 0.9em;
    color: #FFFFFF;
    padding: 0em 0em;
  }
  table.incomeInfo td:nth-child(even) {
    background: #4D396A;
  }
  table.incomeInfo thead {
    background: #685584;
    border-bottom: 2px solid #6E02BA;
  }
  table.incomeInfo thead th {
    font-weight: bold;
    color: #F6F6F6;
    text-align: center;
    border-left: 2px solid #433755;
    font-size: 0.9em;
  }
  table.incomeInfo thead th:first-child {
    border-left: none;
  }


  table.amountInfo{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 1em;
  }
  table.amountInfo th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.8em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
  }
  table.amountInfo tr{
    background-color: #565656;
  }
  table.amountInfo td{
    font-size: 0.9em;
    width: 7.14%;
    border: solid 1px #000;
  }
  
  table.amountInfo .conceptCell{
    font-size: 0.8em;
    width: 14.2%
  }

  .plusBtn{        
    border: solid 0px #fff;
    border-radius:5px;
    display:inline-block;
    cursor:pointer;
    color:#ffffff;
    font-weight: bold;
    padding: 0.8em 1.1em;
    text-decoration:none;
    margin: 0.5em 1em;
    letter-spacing: 1.3px;
}
.plusBtn i{
  font-size: 1.5em;
}
.plusBtn:active {
  position:relative;
  top:1px;
}
</style>