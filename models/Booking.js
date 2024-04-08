import mongoose from "mongoose";
// const PlaceModel = require("./Place")
const { Schema } = mongoose;

const BookingSchema = new Schema({
  place: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "place" },
  user: { type: mongoose.Schema.Types.ObjectId, require: true },
  checkIn: { type: Date, require: true },
  checkOut: { type: Date, require: true },
  numberOfGuests: { type: Number },
  name: { type: String, require: true },
  phone: { type: String, require: true },
  price: Number,
});

const BookingModel = mongoose.model("booking", BookingSchema);

export default { BookingModel };