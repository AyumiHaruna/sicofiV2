<template>
  <div class="row">
      <div class="col-12">

          <div class="row">
              <div class="col-12 sectionTitle">
                {{ (outList.accountType == 1)? "CUENTA DE LA COORDINACIÓN" : "CUENTA DEL INSTITUTO" }}
              </div>

              <div class="col-12">
                <table v-for="(outcome, index) in outList.outcomes" :key="index" class="secondLvl">
                    <tr>
                        <th>#</th>
                        <th>TIPO</th>
                        <th>NUMERO DE CHEQUE / FOLIO</th>
                        <th>FECHA DE ELABORACIÓN</th>
                        <th>TOTAL</th>
                        <th>COMPROBADO</th>
                        <th>RESTA COMPROBAR</th>
                        <th>% COMPROBACIÓN</th>
                        <th rowspan="2">
                            COMPROBACIONES <br>
                            <nuxt-link :to="`/egresos/comprobaciones?code=${outcome.id}`">
                                <button class="miniBtn infoBtn" v-b-tooltip.hover title="Comprobar egreso" alt="Comprobar egreso">
                                    <i class="fas fa-clipboard-check"></i>
                                </button>
                            </nuxt-link>
                        </th>
                        <th rowspan="2">
                            IMPRIMIR <br>
                            <a :href="`${getApiUrl}/print/poliza/${outcome.id}`" target="_blank">
                                <button class="miniBtn warningBtn" v-b-tooltip.hover title="Formato de póliza" alt="Formato de póliza">
                                    <i class="fas fa-print"></i>
                                </button>
                            </a>
                            <a :href="`${getApiUrl}/print/cheque/${outcome.id}`" target="_blank">
                                <button class="miniBtn warningBtn" v-b-tooltip.hover title="Formato de cheque" alt="Formato de cheque">
                                    <i class="fas fa-money-check-alt"></i>
                                </button>
                            </a>
                        </th>
                    </tr>

                    <tr>
                        <td>{{index+1}}</td>
                        <td>{{outcome.payType}}</td>
                        <td>
                            {{outcome.checkNumber}} <br>
                            {{ (outcome.foil != outcome.checkNumber)? outcome.foil : '' }}
                        </td>
                        <td>{{outcome.elabDate}}</td>
                        <td>${{moneyFormat(outcome.total)}}</td>
                        <td>${{moneyFormat( getComp(outcome.comp) )}}</td>
                        <td>${{moneyFormat( parseFloat(outcome.total) - getComp(outcome.comp) )}}</td>
                        <td>%{{ ((getComp(outcome.comp) * 100) / outcome.total).toFixed(2) }}</td>
                    </tr>

                    <tr>
                        <th rowspan="2">
                            MODIFICAR <br>
                            <nuxt-link :to="`/egresos/formulario?code=${outcome.id}`">
                                <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar egreso" alt="Modificar egreso">
                                    <i class="fas fa-pen"></i>
                                </button>
                            </nuxt-link>
                        </th>
                        <th colspan="4">CONCEPTO</th>
                        <th colspan="3">NOMBRE</th>        
                        <th>STATUS</th>          
                        <th rowspan="2">
                            CANCELAR <br>
                            <button class="miniBtn closeBtn" v-b-tooltip.hover 
                                title="Cancelar egreso" alt="Cancelar egreso"
                                @click="askCancel(outcome.id)"
                            >
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </th>      
                    </tr>
                    
                    <tr>
                        <td colspan="4">{{outcome.concept}}</td>
                        <td colspan="3">{{outcome.name}}</td>
                        <td>
                            <select :value="outcome.status" @change="$parent.$parent.$parent.changeStatus(outcome.id, $event)">
                                <option value="0">En Firma</option>
                                <option value="1">Para Entrega</option>
                                <option value="2">Entregado</option>
                            </select>
                        </td>
                    </tr>
                </table>
              </div>
          </div>

      </div>
  </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'AccOutcomes',
    mixins: [ GlobalFunctions ],
    props: [ 'outList' ],
    methods: {
        askCancel( id ){
            // ask for "cancel outcome"?
            this.$swal.fire({
                title: 'Deseas cancelar este egreso!?',
                type: 'question',
                showCancelButton: true,
                showConfirmButton: true,                
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                reverseButtons: true
            }).then((result) => {
            if (result.value) { 
                this.$parent.$parent.$parent.cancelOutcome( id );
            }
            });
        },
        getComp( compList ){
            let total = 0; 
            compList.forEach(elm => {
                total += parseFloat( elm.total )
            });
            return total;
        }
    }
}
</script>

<style>
/* table.numTable{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 0.9em;
  }
  table.numTable th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.7em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
  }
  table.numTable tr{
    background-color: #565656;
  }
  table.numTable td{
    font-size: 0.8em;
    width: 7.14%;
    border: solid 1px #000;
    padding: 0.5em;
  }
  
  table.numTable .conceptCell{
    font-size: 0.8em;
    width: 14.2%
  }



  table.outcomeTable{
    table-layout: fixed;
    width: 100%;
    word-wrap: break-word; 
    margin-bottom: 0.5em;
    text-align: center;
    font-size: 0.9em;
  }
  table.outcomeTable th{
    padding: 0.5em 0.5em;
    background-color: #111;
    font-size: 0.7em;
    letter-spacing: 1.3px;
    border: solid 1px #000;
  }
  table.outcomeTable tr{
    background-color: #565656;
  }
  table.outcomeTable td{
    font-size: 0.8em;
    width: 7.14%;
    border: solid 1px #000;
    padding: 0.5em;
  } */
</style>