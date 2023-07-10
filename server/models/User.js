const { Schema, model } = require("mongoose"); // import mongoose Schema and model
const bcrypt = require("bcrypt"); // import bcrypt

const userSchema = new Schema({
  // create user schema
  username: {
    // add username field with validation rules
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    // add email field with validation rules
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    // add password field with validation rules
    type: String,
    required: true,
    minlength: 5,
  },
  savedBooks: [
    // add savedBooks field with validation rules
    {
      type: Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

userSchema.pre("save", async function (next) {
  // add pre-save middleware to hash password
  if (this.isNew || this.isModified("password")) {
    // if new user or password has been modified
    const saltRounds = 10; // set salt rounds
    this.password = await bcrypt.hash(this.password, saltRounds); // hash password
  }

  next(); // return next function
});

userSchema.methods.isCorrectPassword = async function (password) {
  // add method to compare hashed password
  return bcrypt.compare(password, this.password); // compare password
};

const User = model("User", userSchema); // create User model using userSchema

module.exports = User; // export User model
