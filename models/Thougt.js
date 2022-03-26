const { Schema, model } = require('mongoose');
const dateFormat = require("../util/dateFormat.js");



const thoughtSchema = new Schema({
    
        thoughtText : {
            type: String,
            required: true,
            minlength: 1,
            maxLenght: 280
        },
        createdAt : {
            type: Date,
            default: true,
            default: Date.now,
        },
        username : {
            type: String,
            required: true
        },
        reactions : [{
            type: Schema.Types.ObjectId,
            ref: 'reactionSchema'
        }],
        toJSON: {
            virtuals: true,
            gettters: true
        },
        id: false
});

thoughtSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
})

const reactionSchema = new Schema({
    
    reactionId : {
        type: Schema.Types.ObjectId,
        default: '500'
    },
    reationBody : {
        type: String,
        required: true,
        trim: true,
        maxlength: 280
    },
    username : {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
},
        {
            toJSON: {
                getters: true,
            }
        }
)

const Thought = model('Thought', thoughtSchema)

module.exports = Thought;