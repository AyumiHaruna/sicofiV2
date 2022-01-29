<template>
    <div class="row block projectAccounts">
        <div class="col-12" role="tablist"> 
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
                                    Tipo de cuenta: <span>{{ $store.state.accountType[ account.accountType - 1 ] }}</span> <br>
                                    Total: <span> ${{ moneyFormat(account.total) }}</span>
                                    <br>
                                    <i class="fas fa-angle-down" v-if="!collapseList[index]"></i>
                                    <i class="fas fa-angle-up" v-if="collapseList[index]"></i>
                                </div>
                                <div class="col-8">
                                    <table class="firstLvl">
                                        <thead>
                                            <tr>
                                                <th>CAPÍTULO 1000</th>
                                                <th>CAPÍTULO 2000</th>
                                                <th>CAPÍTULO 3000</th>
                                                <th>CAPÍTULO 4000</th>
                                                <th>CAPÍTULO 5000</th>
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
                        <div class="col-12 tableTitle">
                            Desglose de capítulos por mes
                        </div>
                        <div class="col-12 text-center">
                            <table class="secondLvl">
                                <tr>
                                    <th>CAPÍTULO</th>
                                    <th v-for="month in $store.state.monthList" :key="month">
                                        {{ (month.substring(0,3)).toUpperCase() }}
                                    </th>
                                </tr>
                            
                                <tr v-for="chap in account.chapters" :key="chap.id">
                                    <th> CAP. {{chap.chapter}}000 </th>
                                    <td v-for="index in 12" :key="index"> 
                                        ${{ moneyFormat(chap[`month${index}`]) }} 
                                    </td>
                                </tr>
                            </table>
                        </div>

                         <div class="col-12 text-center">
                            <div class="tableTitle">
                                Desglose de partidas
                            </div>
                            <div class="part_list_container">
                                <div class="part_list" v-for="part in account.parts" :key="part.id">
                                    <table class="secondLvl">
                                        <tr>
                                            <th colspan="12"> {{part.partNumber}} - {{part.partName}} </th>
                                            <th colspan="2"> TOTAL: ${{part.total}} </th>
                                        </tr>
                                        <tr>
                                            <th v-for="month in $store.state.monthList" :key="month">
                                                {{ (month.substring(0,3)).toUpperCase() }}
                                            </th>
                                            <th>EDITAR</th>
                                            <th>ELIMINAR</th>
                                        </tr>
                                        <tr>
                                            <td v-for="index2 in 12" :key="index2">
                                                ${{ moneyFormat(part[`month${index2}`]) }}
                                            </td>
                                            <td>
                                                <button class="miniBtn saveBtn" v-b-tooltip.hover title="Modificar" @click="$parent.showPartForm(account.accountType, account.projectNumber, 'update', part)"><i class="fas fa-edit"></i></button>
                                            </td>
                                            <td>
                                                <button class="miniBtn closeBtn" v-b-tooltip.hover title="Eliminar" @click="askForDelete(part.id)"><i class="fas fa-trash-alt"></i></button>
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
import GlobalFunctions from '@/mixins/GlobalFunctions';

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
    .projectAccounts .header_button {
        background-color: #363e4a;
        border: none;
        border-radius: 5px;
        font-size: 0.85rem;
        margin-bottom: 0.5em;
    }
    .projectAccounts .header_button:hover, .projectAccounts .header_button:active,
    .projectAccounts .btn-secondary:focus, .projectAccounts .btn-secondary.focus {
        background-color: #4b5768;
    }
    
    
    .projectAccounts .account_info {
        line-height: 1.2rem;
        margin-top: 1em;
    }
    .projectAccounts .account_info span{
        color: #c7656c;
        font-weight: bold;
        font-size: 1.1em;
        letter-spacing: 1.2px;
    }
    .projectAccounts .account_info i{
        font-size: 2.2em;
    }

    .projectAccounts .tableTitle{
        font-weight: bold;
        text-align: right;
        font-size: 0.85rem;
        letter-spacing: 2px;
        margin: 0.5rem;
        color: #c7656c;
    }
</style>