// إعداد Firebase
const firebaseConfig = {
  databaseURL: "https://ahsnhadeeath-default-rtdb.firebaseio.com/"
};
alret(74)
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// عرض نافذة الإضافة
function openModal() {
  document.getElementById('studentModal').style.display = 'flex';
}

// إغلاق نافذة الإضافة
function closeModal() {
  document.getElementById('studentModal').style.display = 'none';
}

// تفريغ الفورم
function clearForm() {
  document.getElementById('studentName').value = '';
  document.getElementById('studentPhone').value = '';
  document.getElementById('studentEmail').value = '';
  document.getElementById('teacherName').value = '';
  document.getElementById('courseSelect').value = '';
}

// إضافة طالب إلى Firebase
function addStudent() {
  const name = document.getElementById('studentName').value;
  const phone = document.getElementById('studentPhone').value;
  const email = document.getElementById('studentEmail').value;
  const teacher = document.getElementById('teacherName').value;
  const course = document.getElementById('courseSelect').value;

  if (!name  !phone  !email  !teacher  !course) {
    alert("رجاءً املأ جميع الحقول.");
    return;
  }

  const student = {
    name,
    phone,
    email,
    teacher,
    course
  };

  firebase.database().ref("students").push(student, () => {
    closeModal();
    clearForm();
    loadStudents(); // إعادة عرض الطلاب
  });
}

// عرض الطلاب
function loadStudents() {
  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  firebase.database().ref("students").once("value", snapshot => {
    const data = snapshot.val();
    if (!data) return;
    Object.entries(data).forEach(([id, student]) => {
      const card = document.createElement('div');
      card.className = 'student-card';
      card.innerHTML = 
        <strong>${student.name}</strong><br>
        📞 ${student.phone}<br>
        📧 ${student.email}<br>
        🧕 المعلمة: ${student.teacher}<br>
        📚 الكورس: ${student.course}<br>
      ;
      list.appendChild(card);
    });
  });
}

// البحث
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('search').addEventListener('input', function () {
    const value = this.value.toLowerCase();
    const cards = document.querySelectorAll('.student-card');
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(value) ? 'block' : 'none';
    });
  });

  // تحميل الطلاب عند فتح الصفحة
  loadStudents();
});
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(value) ? 'block' : 'none';
    });
  });
