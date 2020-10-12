const getters = {
    getUser: state => {
        return state.user;
    },
    isAuthenticated: state => {
        return state.user.email? true: false;
    }
};

export default getters