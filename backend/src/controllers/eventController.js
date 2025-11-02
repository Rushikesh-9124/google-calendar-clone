import Event from "../models/Event.js";

// ✅ Get all events created by the logged-in user
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

// ✅ Create a new event for the logged-in user
export const createEvent = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = {
      ...req.body,
      createdBy: userId, // attach user ID
    };

    const newEvent = new Event(payload);
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Error creating event", error });
  }
};


// ✅ Update an event (only if created by the logged-in user)
export const updateEvent = async (req, res) => {
  try {
    const updated = await Event.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Event not found or not authorized" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating event", error });
  }
};

// ✅ Delete an event (only if created by the logged-in user)
export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Event not found or not authorized" });
    }
    res.status(204).json({
      success: true,
      message: "Event Deleted!"
    });
  } catch (error) {
    res.status(400).json({ message: "Error deleting event", error });
  }
};
