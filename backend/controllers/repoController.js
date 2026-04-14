const createRepository = (req, res) => {
    res.send("Repo created!");
}

const getAllRepositories = (req, res) => {
    res.send("All Repo fetched!");
}

const fetchRepositoryById = (req, res) => {
    res.send("Repository Details fetched!");
}

const fetchRepositoryByName = (req, res) => {
    res.send("Repository Details fetched!");
}

const fetchRepositoriesForCurrentUser = (req, res) => {
    res.send("Repository for logged in user fetched!");
}

const updateRepositoryById = (req, res) => {
    res.send("Repository updated");
}

const toggleVisibilityById = (req, res) => {
    res.send("visibility toggled!");
}

const deleteRepositoryById = (req, res) => {
    res.send("Repository deleted!");
}

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    deleteRepositoryById,
    toggleVisibilityById,
    
}