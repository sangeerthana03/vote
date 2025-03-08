import Vote from "../models/Vote.js";
import Election from "../models/Election.js";
import User from "../models/User.js";

// Cast Vote (Student Only)
export const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const userId = req.user.id;

    const election = await Election.findById(electionId);
    if (!election || !election.isActive) {
      return res.status(400).json({ message: "Election is not active" });
    }

    const existingVote = await Vote.findOne({ student: userId, election: electionId });
    if (existingVote) {
      return res.status(400).json({ message: "You have already voted" });
    }

    const vote = new Vote({ student: userId, election: electionId, candidate: candidateId });
    await vote.save();

    res.status(201).json({ message: "Vote Casted Successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get Election Results
export const getResults = async (req, res) => {
  try {
    const electionId = req.params.id;

    const results = await Vote.aggregate([
      { $match: { election: electionId } },
      { $group: { _id: "$candidate", votes: { $sum: 1 } } },
      { $sort: { votes: -1 } },
    ]);

    const candidates = await User.find({ _id: { $in: results.map(r => r._id) } });
    
    res.json({ results: results.map(r => ({ candidate: candidates.find(c => c._id.equals(r._id)), votes: r.votes })) });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
