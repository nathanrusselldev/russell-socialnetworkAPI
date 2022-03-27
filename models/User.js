const { Schema, model, } = require('mongoose');

const userSchema = new Schema({
    
        username : {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        email : {
            type: String,
            require: true,
            unique: true,
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        thoughts: [
			{
				type: Schema.Types.ObjectId,
				ref: "Thought"
			},
		],
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: "User"
			},
		],
    },
        {
            toJSON: {
                virtuals: true,
                getters: true
            },
            id: false
});

userSchema.virtual('friendscount').get(function(){
    return this.friends.length + 1;
})

const User = model('User', userSchema)

module.exports = User;