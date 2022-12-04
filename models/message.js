const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    title: { type: String, required: true, minLength: 1 },
    timestamp: { type: Date },
    text: { type: String, required: true, minLength: 1 },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

MessageSchema.virtual("date").get(function () {
  return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", MessageSchema);
