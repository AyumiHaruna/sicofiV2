<template>
    <form @submit.prevent="$parent.handleSubmit">
        <div class="row indexForm">
            <div class="col-12 sectionTitle">
                INICIAR SESIÓN
            </div>

            <div class="col-12">
                <input type="text" name="user" v-model="$parent.user" required>
                <label for="user">NOMBRE DE USUARIO</label>
            </div>
            <div class="col-12">
                <input type="password" name="password" v-model="$parent.password" required>
                <label for="password">CONTRASEÑA</label>
            </div>
            <div class="col-12">
                <select name="year" v-model="$parent.year" required>
                    <option v-for="year in $parent.activeYears" :value="year.year" :key="year.year">{{year.year}}</option>
                </select>
                <label for="year">¿CON QUE AÑO DESEAS TRABAJAR?</label>
            </div>
            <div class="col-12 text-right">
                <button type="submit" class="actionBtn saveBtn">
                    <i class="fas fa-sign-in-alt"></i>
                    ENVIAR
                </button>
            </div>
        </div>
    </form>
</template>

<script>
import Loader from '../general/Loader.vue';

export default {
    name: 'Login',
    components: { Loader },
}
</script>

<style scoped>
    input, select, textarea {
        text-align: center;
        margin-top: 0.5em;
    }
    .indexForm{
        position: relative;
        z-index: 9;
    }
</style>