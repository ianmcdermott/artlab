const mongoose = require('mongoose');

function StorageException(message) {
   this.message = message;
   this.name = "StorageException";
}

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

const frameSubSchema = mongoose.Schema({
        color: String,
        lines: [linesSubSchema],
        points: [pointsSubSchema],
        radius: Number
    
  },{_id: false});

const userdrawnSchema = mongoose.Schema({
  frameNumber: { type: Number, index: true},
  frame: frameSubSchema,
  title: {type: String},
  animationId: {type: String},
  artist: {type: String, required: true},
  creationDate: {type: Date, required: true},
  userId: {type: String, required: true}
});

// when creating video player, may want virtual that will allow the arrays to add all content together? 

userdrawnSchema.methods.apiRepr = function(){
  return{
    id: this._id,
    frameNumber: this.frameNumber,
    frame: this.frame,
    title: this.title,
    animationId: this.animationId,
    artist: this.artist,
    creationDate: this.creationDate,
    userId: this.userId
  };
}  

const UserDrawn = mongoose.model('UserDrawn', userdrawnSchema);

module.exports = {UserDrawn}

