const getAdminResource = async () => {
    return {
        data: "This is Admin-Only resource, if you are seeing this, that means you are an admin."
    }
}

const getGuestResource = async () => {
    return {
        data: "This is Guest resource, if you are seeing this, that means you are either an admin, user or guest."
    }
}

const getUserResource = async () => {
    return {
        data: "This is User resource, if you are seeing this, that means you are a user."
    }
}

export const ResourceService = {
    getAdminResource,
    getGuestResource,
    getUserResource,
}