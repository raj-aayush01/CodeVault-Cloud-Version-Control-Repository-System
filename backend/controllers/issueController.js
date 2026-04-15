const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");


const createIssue = async (req, res) => {
    const { title, description } = req.body;
    const { id } = req.params;

    try {
        const repo = await Repository.findById(id);
        if (!repo) {
            return res.status(404).json({ error: "Repository not found!" });
        }

        const issue = new Issue({
            title,
            description,
            repository: id,
        });
    
        await issue.save();

        repo.issues.push(issue._id);
        await repo.save();

        res.status(201).json(issue);

    } catch(err) {
        console.error("Error during issue creation : ", err.message);
        res.status(500).send("Server error!");
    }
};

const updateIssueById = async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({error: "Issue not found!"});
        }

        if (title !== undefined) issue.title = title;
        if (description !== undefined) issue.description = description;
        if (status !== undefined) issue.status = status;

        await issue.save();
        res.json({ message: "Issue updated!" , issue});

    } catch(err) {
        console.error("Error during issue updation : ", err.message);
        res.status(500).send("Server error!");
    }
};

const deleteIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findByIdAndDelete(id);

        if(!issue){
            return res.status(404).json({error: "Issue not found!"});
        }

        await Repository.findByIdAndUpdate(issue.repository, {
            $pull: { issues: id }
        });

        res.json({ message: "Issue deleted!" });

    } catch(err) {
        console.error("Error during issue deletion : ", err.message);
        res.status(500).send("Server error!");
    }
};

const getAllIssues = async (req, res) => {
    const { id } = req.params;

    try {
        const issues = await Issue.find({ repository: id });

        if(!issues || issues.length == 0 ){
            return res.status(404).json({error: "Issues not found!"});
        }

        res.status(200).json(issues);

    } catch(err) {
        console.error("Error during issue fetching : ", err.message);
        res.status(500).send("Server error!");
    }
};

const getIssueById = async (req, res) => {
    const { id } = req.params;

    try {
        const issue = await Issue.findById(id);

        if(!issue){
            return res.status(404).json({error: "Issue not found!"});
        }

        res.json(issue);

    } catch(err) {
        console.error("Error during issue fetching : ", err.message);
        res.status(500).send("Server error!");
    }
};


module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById,
}