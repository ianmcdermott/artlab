'use strict'
const mongoose = require('mongoose');

const animationSchema = mongoose.Schema({
    title: {type: String, required: true},
    lastDrawnDate: {type: Date, required: true},
    lastFrame: [{
        color: String,
        lines: [{
          mouseX: Number, 
          mouseY: Number, 
          pmouseX: Number, 
          pmouseY: Number
        }],
        points: [{
          x: Number,
          y: Number
        }],
        radius: Number
    }],
    frameCount: {type: Number, required: true}
});

//virtual for formatted date
animationSchema.virtual('formatDate').get(function(){

})

animationSchema.methods.apiRepr = function(){
  return {
    id: this._id,
    title: this.title,
    lastDrawnDate: this.lastDrawnDate,
    lastFrame: this.lastFrame,
    frameCount: this.frameCount
  };
}

const Animations = mongoose.model('Animations', animationSchema);

module.exports = {Animations}; 
