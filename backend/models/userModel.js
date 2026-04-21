const mongoose =require("mongoose");
const {Schema}=mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
  },


  googleId: {
    type: String,
    default: null  
  },


  avatar: {
    type: String,
    default: null
  },

  // array of repositories (reference)
  repositories: [
    {
      default:[],
      type: Schema.Types.ObjectId,
      ref: "Repository",
    }
  ],

  followedUsers: [
    {
      default:[],
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ],

  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: []
    }
  ],

  starRepos: [
    {
      default:[],
      type: Schema.Types.ObjectId,
      ref: "Repository",
    }
  ]

}, { timestamps: true });

const User=mongoose.model("User", UserSchema);

module.exports =  User;