const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const signupSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // Add any additional fields for signup
    fullName: {
        type: String,
        required: true
    }
}, {timestamps: true});

const loginSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


const userSchema = new Schema({
   signup : signupSchema,
   login : loginSchema
}, {timestamps: true});

userSchema.statics.register = async function (email, password, fullName) {
    if (!email || !password || !fullName) {
        throw Error("All fields are required");
      }

      if (!validator.isEmail(email)) {
        throw Error("Email is not valid");
      }
  
      if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough");
      }
  
      const userExists = await this.findOne({'signup.email' : email });
  
      if (userExists) {
        throw Error("Email already exists");
      }
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
  
      const user = await this.create({ signup : {email, password: hash, fullName }});
      return user;  
}

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields are required");
      }

      const user = await this.findOne({ 'signup.email' : email });

      if (!user) {
        throw Error("Email does not exist");
      }

      const match = await bcrypt.compare(password, user.signup.password);

      if (!match) {
        throw Error("Incorrect password");
      }

      return user;
}

module.exports = mongoose.model("User", userSchema);