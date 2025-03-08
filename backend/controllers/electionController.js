import Election from "../models/Election.js";
import Nomination from "../models/Nomination.js";
import Vote from "../models/Vote.js";

// Create Election (Admin Only)
export const createElection = async (req, res) => {
  try {
    const { position, startDate, endDate } = req.body;
    const election = new Election({ position, startDate, endDate });
    await election.save();
    res.status(201).json({ message: "Election Created Successfully", election });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Approve Candidate Nomination (Admin Only)
export const approveNomination = async (req, res) => {
  try {
    const nomination = await Nomination.findById(req.params.id);
    if (!nomination) return res.status(404).json({ message: "Nomination not found" });

    nomination.status = "Approved";
    await nomination.save();

    const election = await Election.findOne({ position: nomination.position });
    if (election) {
      election.candidates.push(nomination.studentId);
      await election.save();
    }

    res.json({ message: "Candidate Approved & Added to Election" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const declareResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: "Election not found." });
    }

    if (election.resultsDeclared) {
      return res.status(400).json({ message: "Results have already been declared." });
    }

    // Aggregate vote counts for each candidate
    const results = await Vote.aggregate([
      { $group: { _id: "$candidate", votes: { $sum: 1 } } },
      { $lookup: { from: "nominations", localField: "_id", foreignField: "_id", as: "candidate" } },
      { $unwind: "$candidate" },
      { $project: { "candidate.fullName": 1, "candidate.position": 1, votes: 1 } },
      { $sort: { "votes": -1 } }
    ]);

    // Mark election as completed
    election.status = "Completed";
    election.resultsDeclared = true;
    await election.save();

    res.json({ message: "Results declared successfully!", results });
  } catch (error) {
    console.error("Error declaring results:", error);
    res.status(500).json({ message: "Server error." });
  }
};

export const getElectionResults = async (req, res) => {
  try {
    const election = await Election.findOne({ resultsDeclared: true });

    if (!election) {
      return res.status(400).json({ message: "Results have not been declared yet." });
    }

    const results = await Vote.aggregate([
      { $group: { _id: "$candidate", votes: { $sum: 1 } } },
      { $lookup: { from: "nominations", localField: "_id", foreignField: "_id", as: "candidate" } },
      { $unwind: "$candidate" },
      { $project: { "candidate.fullName": 1, "candidate.position": 1, votes: 1 } },
      { $sort: { "votes": -1 } }
    ]);

    res.json(results);
  } catch (error) {
    console.error("Error fetching election results:", error);
    res.status(500).json({ message: "Server error." });
  }
};
