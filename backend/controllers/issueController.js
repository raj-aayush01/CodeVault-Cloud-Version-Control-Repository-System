const createIssue = (req, res) => {
    res.send("Issue Created!");
};

const updateIssueById = (req, res) => {
    res.send("Issue updated!");
};

const deleteIssueById = (req, res) => {
    res.send("Issue deleted!");
};

const getAllIssues = (req, res) => {
    res.send("Issue getted!");
};

const getIssueById = (req, res) => {
    res.send("Issue details!");
};


module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById,
}