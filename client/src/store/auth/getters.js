const getters = {
    getUser: state => {
        return state.user;
    },
    isAuthenticated: state => {
        return state.user.emailVerified === true;
    }
};

export default getters