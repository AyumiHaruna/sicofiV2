<template>
    <div class="row">
        <div class="col-6">
            <div class="row block">
                <div class="col-12 panel">
                    <div class="row">
                        <div class="col-12 sectionTitle">
                            LISTA DE PARTIDAS SOLICITADAS EN LA S.F.
                        </div>
                        <div class="col-12">
                            <table class="secondLvl">
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
                                        <button class="miniBtn infoBtn"   @click="$parent.openForm('add', index)"> 
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
                        <div class="col-6 sectionTitle">
                            LISTA DE PARTIDAS EN LA CARÁTULA DE COMPROBACIÓN
                        </div>
                        <div class="col-6 text-right">
                            <button class="actionBtn infoBtn" @click="$parent.openForm('create')"> 
                                <i class="fas fa-puzzle-piece"></i>
                                AÑADIR PARTIDA
                            </button>
                        </div>
                        <div class="col-12">
                            <table class="secondLvl">
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
                                        <button class="miniBtn closeBtn"  @click="$parent.quitFromList(index)"> 
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