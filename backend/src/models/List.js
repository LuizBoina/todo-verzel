const moongose = require('mongoose');

const ListSchema = new moongose.Schema({
  title: { type: String, required: true },
  userId: { type: String, require: true },
  tasks: [
    {
      taskName: { type: String, require: true },
      isDone: { type: Boolean, default: false },
      createdDate: { type: Date, default: Date() },
      doneDate: { type: Date },
    },
  ]
});

module.exports = moongose.model('List', ListSchema);