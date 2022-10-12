const express = require('express');
const router = new express.Router();
const Task = require('../models/task');
const User = require('../models/user');
const auth = require('../middleware/auth');
const { findOneAndDelete } = require('../models/task');

router.post('/tasks', auth, async (req, res) => {
    const task = Task({
        ...req.body,
        creator: req.user._id // req.user comes from auth middleware
    })
    try{
        await task.save();
        res.status(201).send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};
    if(req.query.completed){
        match.completed = req.query.completed === 'true'; // cause the data user providing treated as string
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1; 
    }
    try{
        // const tasks = await Task.find({ user: req.user._id });
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit), // cause the number user providing treated as string
                skip: parseInt(req.query.skip),
                sort
            }
        });
        
        res.send(req.user.tasks);
    }catch(e){
        res.status(500).send(e);
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        const task = await Task.findOne({ _id,  user: req.user._id});
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
    }catch(e){
        res.status(500).send();
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const validUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => validUpdates.includes(update));
    if(!isValidOperation){
        return res.status(400).send({ Error: 'Invalid updates!'});
    }
    try{
        const task = await Task.findOne({ _id, user: req.user._id });
        if(!task){
            res.status(404).send();
        }
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        //const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
        res.send(task);
    }catch(e){
        res.status(400).send(e);
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try{
        // const task = await Task.findByIdAndDelete(_id);
        const task = await Task.findOneAndDelete({ _id, user: req.user._id });
        if(!task){
            return res.status(404).send();
        }
        res.send(task);
        
    }catch(e){
        res.status(500).send(e);
    }
})

module.exports = router;