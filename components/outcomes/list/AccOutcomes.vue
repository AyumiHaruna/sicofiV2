<template>
  <div class="row">
      <div class="col-12 accOutcomes">

          <div class="row">
              <div class="col-12 sectionTitle">
                {{ (outList.accountType == 1)? "CUENTA DE LA COORDINACIÓN" : "CUENTA DEL INSTITUTO" }}
              </div>

              <div class="col-12">
                <table v-for="(outcome, index) in outList.outcomes" :key="index" class="secondLvl">
                    <tr>
                        <th>DB ID</th>
                        <th>NUMERO DE CHEQUE / FOLIO</th>
                        <th>TIPO</th>                        
                        <th>FECHA DE ELABORACIÓN</th>
                        <th>TOTAL</th>
                        <th>COMPROBADO</th>
                        <th>RESTA COMPROBAR</th>
                        <th>% COMPROBACIÓN</th>
                        <th rowspan="2">
                            COMPROBACIONES <br>
                            <nuxt-link :to="`/egresos/comprobaciones?code=${outcome.id}`">
                                <button class="miniBtn infoBtn" v-b-tooltip.hover title="Comprobar egreso" alt="Comprobar egreso" v-if="outcome.active">
                                    <i class="fas fa-clipboard-check"></i>
                                </button>
                            </nuxt-link>
                        </th>
                        <th rowspan="2">
                            IMPRIMIR <br>
                            <a :href="`${getApiUrl}/print/poliza/${outcome.id}`" target="_blank">
                                <button class="miniBtn warningBtn" v-b-tooltip.hover title="Formato de póliza" alt="Formato de póliza" v-if="outcome.active">
                                    <i class="fas fa-print"></i>
                                </button>
                            </a>
                            <a :href="`${getApiUrl}/print/cheque/${outcome.id}`" target="_blank">
                                <button class="miniBtn warningBtn" v-b-tooltip.hover title="Formato de cheque" alt="Formato de cheque" v-if="outcome.active">
                                    <i class="fas fa-money-check-alt"></i>
                                </button>
                            </a>
                        </th>
                    </tr>

                    <tr>
                        <td>{{outcome.id}}</td>
                        <td>
                            {{outcome.checkNumber}} <br>
                            {{ (outcome.foil != outcome.checkNumber)? outcome.foil : '' }}
                        </td>                        
                        <td>{{outcome.payType}}</td>
                        <td>{{outcome.elabDate}}</td>
                        <td>${{moneyFormat(outcome.total)}}</td>
                        <td v-if="outcome.active">${{moneyFormat( getComp(outcome.comp) )}}</td>
                        <td v-if="outcome.active">${{moneyFormat( parseFloat(outcome.total) - getComp(outcome.comp) )}}</td>
                        <td v-if="outcome.active">%{{ ((getComp(outcome.comp) * 100) / outcome.total).toFixed(2) }}</td>
                        <td v-else colspan="3" class="canceled">CANCELADO</td>
                    </tr>

                    <tr>
                        <th rowspan="2">
                            MODIFICAR <br>
                            <nuxt-link :to="`/egresos/formulario?code=${outcome.id}`">
                                <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar egreso" alt="Modificar egreso" v-if="outcome.active">
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
                                v-if="outcome.active"
                            >
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </th>      
                    </tr>
                    
                    <tr>
                        <td colspan="4">{{outcome.concept}} <span class="viatics" v-if="outcome.viatics"><br>(VIATICOS)</span></td>
                        <td colspan="3">{{outcome.name}}</td>
                        <td>
                            <select :value="outcome.status" @change="$parent.$parent.$parent.changeStatus(outcome.id, $event)" v-if="outcome.active">
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
    .accOutcomes .canceled{
        color: orange;
        font-weight: bold;
        font-size: 1.3em;
    }
    .accOutcomes .viatics{
        color: #00d3eb;
        font-weight: bold;
    }
</style>