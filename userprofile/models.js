'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserProfileSchema = mongoose.Schema({
  username: {type: String},
  firstName: {type: String},
  lastName: {type: String},
  artwork: [{type: String}],
  animations: [{type: String}]
});



UserProfileSchema.virtual('name').get(function(){
  return `${this.firstName} ${this.lastName}`.trim()});


UserProfileSchema.methods.apiRepr = function() {
  return {
  	id: this._id,
    username: this.username,
    name: this.name,
    artwork: this.artwork,
    animations: this.animations
  };
};

const Userprofile = mongoose.model('userProfile', UserProfileSchema);

module.exports = {Userprofile};

  