const mongoose = require('mongoose');
const validator = require('validator');

const taskSchema = mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        required: true,
        type: mongoose.Schema.Types.ObjectId, // act as foreign key for user 
        ref: 'User' // reference to the model name
    } 
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;