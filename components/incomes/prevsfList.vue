<template>
    <div class="row panel" v-if=" ($parent.prevSF).length > 0 ">
        <div class="col-12 title">
            LISTA DE S.F. CAPTURADAS ANTERIORMENTE PARA EL PROYECTO({{$parent.incomeData.projectNumber}}) - CUENTA({{$store.state.accountType[ $parent.incomeData.account - 1 ]}}) - MES({{ $store.state.monthList[ $parent.incomeData.month - 1] }})
        </div>

        <div class="col-12" v-for="sf in $parent.prevSF" :key="sf.sdId">
            <table class="sfTable" v-if="sf.sfId != $parent.incomeData.sfId">
                <thead>
                    <th>S.F. #</th>
                    <th>S.F. ID</th>
                    <th>FECHA DE ELABORACIÓN</th>
                    <th>CONCEPTO</th>
                    <th>SOLICITADO</th>
                </thead>
                <tbody>
                    <tr>
                        <td> {{sf.sfNum}} </td>
                        <td> {{sf.sfId}} </td>
                        <td> {{sf.elabDate}} </td>
                        <td class="text-left"> {{sf.concept}} </td>
                        <td class="text-right">${{moneyFormat(sf.requested)}}</td>
                    </tr>
                    <tr>
                        <th colspan="3" :rowspan="(sf.partList).length + 1">LISTA DE PARTIDAS</th>
                        <th>PARTIDA</th>
                        <th>MONTO</th>
                    </tr>
                    <tr v-for="(part,index) in sf.partList" :key="index">
                        <td class="text-left">{{part.partNumber}} - {{part.partName}}</td>
                        <td class="text-right">${{moneyFormat(part.total)}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '@/mixins/GlobalFunctions';

export default {
    name: 'prevsfList',
    mixins: [ GlobalFunctions ],
}
</script>

<style>
    table.sfTable{
        max-width: 100%;
        word-wrap: break-word; 
        margin-bottom: 0.5em;
        text-align: center;
        width: 100%;
    }
    table.sfTable th{
        padding: 0.5em 0.5em;
        background-color: #111;
        font-size: 0.7em !important;
        letter-spacing: 1.3px;
        border: solid 1px #000;
    }
    table.sfTable td{
        background-color: #565656;
        color: whitesmoke;
    }
</style>