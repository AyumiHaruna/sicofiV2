<template>
    <div class="row other">
        <div class="col-12">

            <div class="row">
                <div class="col-4 text-center">
                    <button class="actionBtn infoBtn" v-b-tooltip.hover title="Añadir año" alt="Añadir año" @click="activeWindow = 'años'">
                        AÑOS ACTIVOS
                    </button>
                </div>
                <div class="col-4 text-center">
                    <button class="actionBtn infoBtn" v-b-tooltip.hover title="Añadir año" alt="Añadir año" @click="activeWindow = 'autoridades'">
                        AUTORIDADES
                    </button>
                </div>
                <div class="col-4 text-center">
                    <button class="actionBtn infoBtn" v-b-tooltip.hover title="Añadir año" alt="Añadir año" @click="activeWindow = 'partidas'">
                        PARTIDAS
                    </button>
                </div>
            </div>

            <div class="row">
                <div class="col-12" v-show="activeWindow == 'años'">
                    <YearAdmin />
                </div>
                <div class="col-12" v-show="activeWindow == 'autoridades'">
                    <AuthAdmin />
                </div>
                <div class="col-12" v-show="activeWindow == 'partidas'">
                    <PartAdmin />
                </div>
            </div>

            <Toast ref="toast"></Toast>     
            <LogTest ref="logTest" />  

        </div>
    </div>
</template>

<script>
import YearAdmin from '@/components/other/YearAdmin.vue';
import AuthAdmin from '~/components/other/AuthAdmin.vue';
import PartAdmin from '@/components/other/PartAdmin.vue';

import Toast from '@/components/general/Toast.vue';
import LogTest from '@/components/general/LogTest.vue';

export default {
    name: 'Other',
    components: { YearAdmin, AuthAdmin, PartAdmin, Toast, LogTest  },
    data() {
        return {
            activeWindow: 'partidas'
        }
    },
    mounted() {
        this.$refs.logTest.hasSesion();
        this.$refs.logTest.hasLevel( 1 );
    },
}
</script>

<style>

</style>