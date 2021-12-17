<template>
    <div class="row">
        <div class="col-6">
            <div class="row block">
                <div class="col-12 panel">
                    <div class="row">
                        <div class="col-12">
                            <label> LISTA DE PARTIDAS SOLICITADAS EN LA S.F.</label>
                        </div>
                        <div class="col-12">
                            <table>
                                <tr>
                                    <th>#</th>
                                    <th>PARTIDA</th>
                                    <th>MONTO</th>
                                    <th>AÑADIR</th>
                                </tr>
                                <tr v-for="(part, index) in $parent.income.partList" :key="part.id">
                                    <td>{{index + 1}}</td>
                                    <td>{{part.partNumber}} - {{part.partName}}</td>
                                    <td>${{moneyFormat(part.total)}}</td>
                                    <td>
                                        <button class="actionBtn infoBtn"   @click="$parent.openForm('add', index)"> 
                                            <i class="fas fa-chevron-right"></i>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-6">
            <div class="row block">
                <div class="col-12 panel">
                    <div class="row">
                        <div class="col-6">
                            <label> LISTA DE PARTIDAS EN LA CARÁTULA DE COMPROBACIÓN</label>
                        </div>
                        <div class="col-6">
                            <button class="actionBtn infoBtn" @click="$parent.openForm('create')"> 
                                <i class="fas fa-puzzle-piece"></i>
                                AÑADIR PARTIDA
                            </button>
                        </div>
                        <div class="col-12">
                            <table>
                                <tr>
                                    <th>#</th>
                                    <th>PARTIDA</th>
                                    <th># NOTAS</th>
                                    <th>MONTO</th>
                                    <th>ACCIONES</th>
                                </tr>
                                <tr v-for="(part, index) in $parent.compPartList" :key="index">
                                    <td>{{index + 1}}</td>
                                    <td>{{part.partNumber}} - {{part.partName}}</td>
                                    <td>{{part.notes}}</td>
                                    <td>{{moneyFormat(part.total)}}</td>
                                    <td>
                                        <button class="actionBtn closeBtn"  @click="$parent.quitFromList(index)"> 
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            </table>
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
    name: 'SFCompPartList',
    mixins: [ GlobalFunctions ], 
}
</script>

<style>

</style>