<template>
    <div class="row projectAccounts">
        <div class="col-12 accordion block" role="tablist"> 
            <div class="panel">
                <div v-for="(account, index) in accounts" :key="index">
                    <b-card-header header-tag="header" class="p-1" role="tab" >
                        
                        <b-button
                            class="header_button"
                            block 
                            :class="collapseList[index] ? null : 'collapsed'"
                            :aria-expanded="collapseList[index] ? 'true' : 'false'"
                            :aria-controls="`collapse-${index}`"
                            @click="togglePanel(index)"
                        >
                            <div class="row">
                                <div class="col-4 account_info">
                                    Tipo de cuenta: <strong>{{ $store.state.accountType[ account.accountType - 1 ] }}</strong> <br>
                                    Total: <strong> ${{ moneyFormat(account.total) }}</strong>
                                    <br>
                                    <i class="fas fa-angle-down" v-if="!collapseList[index]"></i>
                                    <i class="fas fa-angle-up" v-if="collapseList[index]"></i>
                                </div>
                                <div class="col-8">
                                    <table class="headData">
                                        <thead>
                                            <tr>
                                                <th>Capítulo 1000</th>
                                                <th>Capítulo 2000</th>
                                                <th>Capítulo 3000</th>
                                                <th>Capítulo 4000</th>
                                                <th>Capítulo 5000</th>
                                            </tr>   
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td v-for="chap in account.chapters" :key="chap.id"> 
                                                    ${{ moneyFormat(chap.total) }} 
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </b-button>
                    </b-card-header>

                    <b-collapse class="accordion_body" :id="`collapse-${index}`" accordion="my-accordion" v-model="collapseList[index]" role="tabpanel">
                        <div class="col-12 text-center">
                            <h5>Desglose de capítulos por mes</h5>
                            <table class="infoData">
                                <thead>
                                    <tr>
                                        <th>Capítulo</th>
                                        <th v-for="month in $store.state.monthList" :key="month">
                                            {{ month.substring(0,3) }}
                                        </th>
                                    </tr>
                                </thead>
                                
                                <tbody>
                                    <tr v-for="chap in account.chapters" :key="chap.id">
                                        <th> Cap. {{chap.chapter}}000 </th>
                                        <td v-for="index in 12" :key="index"> 
                                            ${{ moneyFormat(chap[`month${index}`]) }} 
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                         <div class="col-12 text-center">
                            <h5>Desglose de partidas</h5>
                            <div class="part_list_container">
                                <div class="part_list" v-for="part in account.parts" :key="part.id">
                                    <table>
                                        <tr>
                                            <th colspan="12"> {{part.partNumber}} - {{part.partName}} </th>
                                            <th> Total: ${{part.total}} </th>
                                        </tr>
                                        <tr>
                                            <td v-for="month in $store.state.monthList" :key="month">
                                                {{ month.substring(0,3) }}
                                            </td>
                                            <td> Acciones </td>
                                        </tr>
                                        <tr>
                                            <td v-for="index2 in 12" :key="index2">
                                                ${{ moneyFormat(part[`month${index2}`]) }}
                                            </td>
                                            <td>
                                                <button class="update" v-b-tooltip.hover title="Modificar" @click="$parent.showPartForm(account.accountType, account.projectNumber, 'update', part)"><i class="fas fa-edit"></i></button>
                                                <button class="delete" v-b-tooltip.hover title="Eliminar" @click="askForDelete(part.id)"><i class="fas fa-trash-alt"></i></button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>             
                            </div>
                        </div>

                        <div class="col-12 text-right">
                            <button class="actionBtn infoBtn" @click="$parent.showPartForm(account.accountType, account.projectNumber, 'create')" > 
                                <i class="fas fa-puzzle-piece"></i>
                                NUEVA PARTIDA
                            </button>
                        </div>
                    </b-collapse>
                </div>     
            </div>    
        </div>
    </div>
</template>

<script>
import GlobalFunctions from '../../mixins/GlobalFunctions';

export default {
    name: 'ProjectAccounts',
    mixins: [ GlobalFunctions ],
    props: [
        'accounts'
    ],
    data() {
        return {
            visible: true,
            collapseList: [false, false]
        }
    },
    methods: {
        askForDelete( id ) {
            this.$swal.fire({
                title: 'Deseas eliminar esta partida!?',
                type: 'question',
                showCancelButton: true,
                showConfirmButton: true,                
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Aceptar',
                reverseButtons: true
            }).then((result) => {
                if (result.value) {
                    this.deletePart( id );
                }
            });
        },

        async deletePart( id ){
            // delete selected part 
            const res = await fetch(`${process.env.apiUrl}/part/delete`,{
                method: 'POST',
                headers: {
                    'Content-type' : 'application/json'
                },
                body: JSON.stringify({ id: id })
            });

            // if api response is ok 
            if( res.status === 200 ){
                //convert response to json
                const resData = await res.json();
                // console.log(resData);
                // send success message 
                this.$parent.$refs.toast.makeToast('success', `La partida se eliminó exitosamente`);

                //load updated project data
                this.$parent.getProjectData( resData.project );                           
            } else {
                this.$parent.$refs.toast.makeToast('error', `Ocurrió un problema, intente nuevamente`);
            }
        },

        togglePanel(index) {
            this.$set( this.collapseList, index, !this.collapseList[index] );
        },
    }
}
</script>

<style scoped>
    .panel {
        padding: 0;
    }

    
    .header_button {
        background-color: #282a57;
        border: solid 0px #fff;
        border-radius: 5px;
        font-size: 0.95em;
    }
    .header_button:hover, .header_button:active {
        background-color: #3D416D;
    }
    .btn-secondary:focus, .btn-secondary.focus {
        background-color: #3D416D;
        border-color: #3D416D;
    }
    
    .account_info {
        line-height: 1.5em;
    }
    .account_info i{
        font-size: 1.5em;
    }

   table.headData {
        border: 0px solid #170655;
        background-color: #261441;
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    table.headData td, table.headData th {
        border: 1px solid #555555;
        padding: 0.5em 1em;
    }
    table.headData tbody td {
        font-weight: bold;
        color: #FFFFFF;
    }
    table.headData td:nth-child(even) {
        background: #4D396A;
    }
    table.headData thead {
        background: #685584;
        border-bottom: 2px solid #6E02BA;
    }
    table.headData thead th {
        font-weight: bold;
        color: #F6F6F6;
        text-align: center;
        border-left: 2px solid #433755;
    }
    table.headData thead th:first-child {
        border-left: none;
    }

    .accordion_body div{
        padding-top: 1em;
    }

    .part_list_container{
        background-color: #272b72;
        border-radius: 5px;
    }

    table.infoData {
        border: 0px solid #555555;
        background-color: #555555;
        width: 100%;
        text-align: center;
        border-collapse: collapse;
    }
    table.infoData td, table.infoData th {
        border: 1px solid #555555;
        padding: 0.5em 0.5em;
    }
    table.infoData tbody td {
        font-size: 0.7em;
        font-weight: bold;
        color: #FFFFFF;
        letter-spacing: 1.1px;
    }
    table.infoData tr:nth-child(even) {
        background: #1C7C80;
    }
    table.infoData thead {
        background: #16B8B8;
        border-bottom: 10px solid #1C7C80;
    }
    table.infoData th {
        font-size: 0.9em;
        font-weight: bold;
        color: #FFFDD5;
    }
    table.infoData thead th {
        font-weight: bold;
        color: #333333;
        text-align: center;
        border-left: 2px solid #1C7C80;
    }
    table.infoData thead th:first-child {
        border-left: none;
    }

    .part_list{
        /* background: whitesmoke; */
        color: #F6F6F6;
        font-size: 0.8em;
        padding: 1em;
    }
    .part_list table{
        width: 100%;
    }
    .part_list table,
    .part_list tr,
    .part_list td,
    .part_list th {
        border: solid 1px #555;
        padding: 0.3em;
    }
    .part_list button {
        font-size: 1.8em;
        margin: 0 0.5em;
        background: none; 
        border: none;
        padding: 0.1em 0.2em;
        border-radius: 5px;
    }
    .part_list button:hover {
        background-color: #3D416D;
    }
    .part_list button.update {
        color: #99ccff;
    }
    .part_list button.delete {
        color: #ff9999;
    }
    
    button.add_part {
        box-shadow: 0px 0px 5px 0px #00ccff;
        background-color:#16b8b8;
        border-radius:10px;
        display:inline-block;
        cursor:pointer;
        color:#ffffff;
        font-family:Arial;
        font-size:17px;
        padding: 0.5em;
        text-decoration:none;
        text-shadow:0px 1px 0px #00a6ff;
        margin-bottom: 1em;
    }
    button.add_part i{
        font-size: 1.3em;
        margin-right: 0.2em;
    }
    button.add_part:hover {
        background-color:#05949e;
    }
    button.add_part:active {
        position:relative;
        top:1px;
    }
</style>