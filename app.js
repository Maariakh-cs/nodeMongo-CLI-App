/*const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/mydatabase'; 
async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, 
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) 
  {
    console.error('❌ Error connecting to MongoDB:', error);
  }
}
connectToMongoDB();

const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/studentdb';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((err) => {
  console.error('❌ Connection failed:', err);
});
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
});
const Student = mongoose.model('mystuds', studentSchema);
const newStudent = new Student({
  name: 'Alice',
  age: 22,
  course: 'Computer Science'
});

newStudent.save()
  .then(() => console.log('🎉 newStudent.save() Student record inserted, DB created'))
  .catch((err) => console.error('❌ Insert failed:', err));

  
const mongoose = require('mongoose');

const mongoURI = 'mongodb://localhost:27017/studentdb';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ Connection failed:', err));

// Schema and Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
});

const Student = mongoose.model('mystuds', studentSchema);

// ✅ Function to update a student's age
const students = [
  { name: 'Alice', age: 22, course: 'Computer Science' },
  { name: 'Bob', age: 23, course: 'Mathematics' },
  { name: 'Charlie', age: 21, course: 'Physics' },
  { name: 'Diana', age: 25, course: 'Chemistry' },
  { name: 'Ethan', age: 20, course: 'Biology' }
];

// Insert multiple documents
Student.insertMany(students)
  .then(() => console.log('🎉 Multiple student records inserted'))
  .catch((err) => console.error('❌ Insert failed:', err)); */

  const mongoose = require('mongoose');
const readline = require('readline');

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/studentdb';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connected to MongoDB');
  showMenu();
}).catch(err => console.error('❌ Connection Error:', err));

// Define Schema & Model
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String
});
const Student = mongoose.model('mystuds', studentSchema);

// CLI Setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu Function
function showMenu() {
  console.log(`\n--- Student Management CLI ---
1. Insert Student
2. View All Students
3. Update Student
4. Delete Student
5. Exit
-------------------------------`);

  rl.question('Choose an option (1-5): ', handleMenu);
}

// Handle Menu Choices
function handleMenu(choice) {
  switch (choice.trim()) {
    case '1':
      insertStudent();
      break;
    case '2':
      viewStudents();
      break;
    case '3':
      updateStudent();
      break;
    case '4':
      deleteStudent();
      break;
    case '5':
      console.log('👋 Exiting...');
      rl.close();
      mongoose.disconnect();
      break;
    default:
      console.log('❌ Invalid choice. Try again.');
      showMenu();
  }
}

// Insert Student
function insertStudent() {
  rl.question('Enter name: ', name => {
    rl.question('Enter age: ', age => {
      rl.question('Enter course: ', course => {
        const student = new Student({ name, age: Number(age), course });
        student.save()
          .then(() => {
            console.log('✅ Student inserted successfully.');
            showMenu();
          })
          .catch(err => {
            console.error('❌ Insert failed:', err);
            showMenu();
          });
      });
    });
  });
}

// View Students
function viewStudents() {
  Student.find()
    .then(students => {
      console.log('\n📄 Student Records:');
      students.forEach((s, index) => {
        console.log(`${index + 1}. ${s.name}, Age: ${s.age}, Course: ${s.course}, ID: ${s._id}`);
      });
      showMenu();
    })
    .catch(err => {
      console.error('❌ Error fetching students:', err);
      showMenu();
    });
}

// Update Student
function updateStudent() {
  rl.question('Enter Student ID to update: ', id => {
    rl.question('New name: ', name => {
      rl.question('New age: ', age => {
        rl.question('New course: ', course => {
          Student.findByIdAndUpdate(id, { name, age: Number(age), course }, { new: true })
            .then(updated => {
              if (updated) {
                console.log('✅ Student updated.');
              } else {
                console.log('❌ No student found with that ID.');
              }
              showMenu();
            })
            .catch(err => {
              console.error('❌ Update error:', err);
              showMenu();
            });
        });
      });
    });
  });
}

// Delete Student
function deleteStudent() {
  rl.question('Enter Student ID to delete: ', id => {
    Student.findByIdAndDelete(id)
      .then(deleted => {
        if (deleted) {
          console.log('🗑️ Student deleted.');
        } else {
          console.log('❌ No student found with that ID.');
        }
        showMenu();
      })
      .catch(err => {
        console.error('❌ Delete error:', err);
        showMenu();
      });
  });
}
