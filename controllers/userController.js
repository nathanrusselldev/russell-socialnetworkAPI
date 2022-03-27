const User = require('../models/User')

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
		User.findOneAndDelete({ _id: params.id })
			.then((deletedUser) => {
				if (!deletedUser) {
					res.status(404).json({ message: "No user found with this ID!" });
					return;
				}
				User.updateMany(
					{ _id: { $in: deletedUser.friends } },
					{ $pull: { friends: params.id } }
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
};
