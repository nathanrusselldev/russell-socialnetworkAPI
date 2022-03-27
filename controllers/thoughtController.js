const User = require('../models/User')
const Thought = require('../models/Thougt');


module.exports = {
    getThoughts(req, res) {
        Thought.find() 
        .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought ({params},res) {
        Thought.findOne({ _id: params.thoughtId })
			.select("-__v")
			.then((data) => {
				if (!data) {
					res.status(404).json({ message: "No thought found with this id." });
					return;
				}
				res.json(data);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},
    createThought(req,res) {
        Thought.create(req.body)
        .then(data => {
            return User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: data._id}},
                {new: true}
            )
        })
        .then(data => {
            if (!data) { res.status(404).json({message: 'No user was found with this id.'})
         } 
         res.status(200).json({message: 'Thought created.'})
        })
    },
    deleteThought(req,res) {
        Thought.findOneAndRemove({_id: req.params.thoughtId})
        .then(data => {
            if(!data) {
                res.status(404).json({message: "No thought found with this id."})
            }
        return User.findOneAndUpdate(
            {thoughts: req.params.thoughtId},
            {$pull: {thoughts: req.params.thoughtId}},
            {new: true}
        )
        })
        .then(data => {
            if (!data) {
                res.status(404)
            }
            else {
                res.json({message: "Thought Deleted"})
            }    
        })
    },
    updateThought(req,res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {new: true, runValidators: true} 
            )
        .then(data => {
            if (!data) { res.status(404).json({message: 'No post was found with this id.'})
            } 
            res.json(data)
        })
        .catch((err) => {
            res.status(500).json(err)
        })
    },
    addReaction(req,res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        )
        .then(data => {
            if (!data) {
            res.status(404).json({message: "not thoguht found with this id."})
            return
            }
            res.status(200).json(data)
        })

    },
    deleteReaction(req,res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
        .then(data => {
            if(!data) {
                res.status(400).json({message: 'No thought found with this id.'})
                return
            } 
            res.json({message: 'Reaction deleted.'})
        })
    }
}