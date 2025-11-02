import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  color: { type: String, default: '#3182ce' },
  start: { type: Date, required: true }, // UTC
  end: { type: Date, required: true },   // UTC
  allDay: { type: Boolean, default: false },
  recurrence: {
    rrule: { type: String }, // rrule string without DTSTART
    exdate: [{ type: Date }] // exception dates in UTC
  },
  overrides: [{ // events that are overrides of instances of this recurring event
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  originalEventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // for override events
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

EventSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

EventSchema.index({ start: 1 });
export default mongoose.model('Event', EventSchema);

