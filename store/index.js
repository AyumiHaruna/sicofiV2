export const state = () => ({
    lastSF: '',
    isLoading: 0,
    accountType: ["Coordinación", "Instituto"],
    monthList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
})

export const mutations = {
    setIsLoading( state, payload ){
        state.isLoading = payload;
    },
    setLastSF( state, payload){
        state.lastSF = payload
    },
}

export const actions = {
    // change is loading state value
    setIsLoading({commit}, value){
    //   console.log('isLoading is changing to: ' + value);
      commit( 'setIsLoading', value );
    },

    setLastSF({commit}, value){
        commit('setLastSF', value);
    }
}