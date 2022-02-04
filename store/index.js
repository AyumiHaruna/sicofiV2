export const state = () => ({
    lastSF: '',
    accountType: ["Coordinación", "Instituto"],
    monthList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
})

export const mutations = {
    setLastSF( state, payload){
        state.lastSF = payload
    },
}

export const actions = {
    setLastSF({commit}, value){
        commit('setLastSF', value);
    }
}