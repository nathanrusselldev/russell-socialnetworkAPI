const User = require('../models/User')
const Thought = require('../models/Thougt')

module.exports = {
    getUsers(req, res) {
        User.find()
          .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
      },
      getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
          .select('-__v')
            .then((user) =>
                !user
                ? res.status(404).json({ message: 'No user with that ID' })
                : res.json(user))   
          .catch((err) => res.status(500).json(err));
      },
      createUser(req, res) {
        User.create(req.body)
          .then((dbUserData) => res.json(dbUserData))
          .catch((err) => res.status(500).json(err));
      },
      deleteUser({ params }, res) {
		User.findOneAndDelete({ _id: params.userId })
			.then((deletedUser) => {
				if (!deletedUser) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				User.updateMany(
					{ _id: { $in: deletedUser.friends } },
					{ $pull: { friends: params.userId } }
				)
				.then(() => {
					Thought.deleteMany({ username: deletedUser.username })
				.then(() => {
							res.json({ message: "User deleted" });
						})
						.catch((err) => res.status(400).json(err));
				})
				.catch((err) => res.status(400).json(err));
			})
			.catch((err) => res.status(400).json(err));
	},
	addFriend({params}, res) {
		User.findOneAndUpdate(
			{_id: params.userId},
			{$addToSet: {friends: params.friendId}},
			{new: true, runValidators: true}
		)
		.then((data) => {
			if(!data) {
				res.status(400).json({message: 'No User found with this Id.'})
			}
			res.json(data)
		})
		.catch((err) => res.json(err))
	},
	removeFriend({params}, res) {
		User.findOneAndUpdate(
			{_id: params.userId},
			{ $pull: {friends: params.friendId}},
			{new : true}
		)
		.then((data) => res.json(data))
		.catch((err) => res.json(err))
	}
};
