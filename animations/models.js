'use strict'
const mongoose = require('mongoose');

const linesSubSchema = mongoose.Schema(
{
   mouseX: Number, 
   mouseY: Number, 
   pmouseX: Number, 
   pmouseY: Number
},
{_id: false});

const pointsSubSchema = mongoose.Schema(
          { 
            x: Number,
            y: Number
          },
            {_id: false}
);

const lastFrameSubSchema = mongoose.Schema({
        color: String,
        lines: [linesSubSchema],
        points: [pointsSubSchema],
        radius: Number,
    
  },{_id: false});

const animationSchema = mongoose.Schema({
    title: {type: String, required: true},
    lastDrawnDate: {type: Date, required: true},
    lastFrame: lastFrameSubSchema,
    frameCount: {type: Number, required: true},
    guideUrl: {type: String, required: true}
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
    frameCount: this.frameCount,
    guideUrl: this.guideUrl
  };
}

const Animations = mongoose.model('Animations', animationSchema);

module.exports = {Animations}; 
