export const loginUser = (user) => {

    if (user) {
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );
    }

};

export const getUser = () => {

    const user = localStorage.getItem("user");

    if (!user || user === "undefined") {
        return null;
    }

    try {

        return JSON.parse(user);

    } catch (error) {

        console.log("Invalid user data");

        localStorage.removeItem("user");

        return null;
    }
};

export const logoutUser = () => {

    localStorage.removeItem("user");

};

export const isAuthenticated = () => {

    return getUser() !== null;

};