const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: { type: String, required: true, maxLength: 100 },
    last_name: { type: String, required: true, maxLength: 100 },
    username: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, minLength: 9 },
    password: { type: String, required: true, minLength: 8 },
    membership_status: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

// Virtual property for user's full name
UserSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.first_name} ${this.last_name}`;
  }
  if (!this.first_name || !this.last_name) {
    fullname = "doesn't exist";
  }
  return fullname;
});

module.exports = mongoose.model("User", UserSchema);
