const getters = {
    getUser: state => {
        console.log("state in getUser getter is below");
        console.log(state);
        console.log(state.user);
        return state.user;
    },
    isAuthenticated: state => {
        return state.user.emailVerified === "1";
    }
};

export default getters