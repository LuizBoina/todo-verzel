const moongose = require('mongoose');

const ListSchema = new moongose.Schema({
  title: { type: String, required: true },
  tasks: [
    {
      taskName: { type: String, require: true },
      isDone: { type: Boolean, default: false },
      createdDate: { type: Date, default: Date() },
      doneDate: { type: Date }
    },
  ]
});

// ListSchema.method('transform', () => {
//   var obj = this.toObject();
//     obj.id = obj._id;
//     delete obj._id;
 
//     return obj;
// });

module.exports = moongose.model('List', ListSchema);