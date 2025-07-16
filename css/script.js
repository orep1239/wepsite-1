// script.js (كامل وموسع + متكامل مع Firebase)

// 1. تهيئة Firebase
const firebaseConfig = {
  databaseURL: "https://ahsnhadeeath-default-rtdb.firebaseio.com/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let students = [];

// 2. تحميل الطلاب من Firebase عند بداية التشغيل
function loadStudents() {
  db.ref("students").on("value", snapshot => {
    const data = snapshot.val();
    students = data ? Object.values(data) : [];
    displayStudents();
  });
}

// 3. حفظ طالب جديد في Firebase
function addStudent() {
  const name = document.getElementById('studentName').value;
  const phone = document.getElementById('studentPhone').value;
  const email = document.getElementById('studentEmail').value;
  const teacher = document.getElementById('teacherName').value;
  const course = document.getElementById('courseSelect').value;

  if (!name || !phone || !email || !teacher || !course) {
    alert("رجاءً املأ جميع الحقول.");
    return;
  }

  const id = Date.now();
  const student = {
    id,
    name,
    phone,
    email,
    teacher,
    course
  };

  db.ref("students/" + id).set(student);
  closeModal();
  clearForm();
}

function clearForm() {
  document.getElementById('studentName').value = '';
  document.getElementById('studentPhone').value = '';
  document.getElementById('studentEmail').value = '';
  document.getElementById('teacherName').value = '';
  document.getElementById('courseSelect').value = '';
}

function displayStudents() {
  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  for (const student of students) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <strong>${student.name}</strong><br>
      📞 ${student.phone}<br>
      📧 ${student.email}<br>
      🧕 المعلمة: ${student.teacher}<br>
      📚 الكورس: ${student.course}<br>
      <button onclick="viewStudent(${student.id})">📂 فتح ملف الطالب</button>
    `;
    list.appendChild(card);
  }
}

function viewStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  document.getElementById("studentDetails").innerHTML = `
    <strong>👤 الاسم:</strong> ${student.name}<br>
    <strong>📚 الكورس:</strong> ${student.course}<br>
    <strong>🧕 المعلمة:</strong> ${student.teacher}<br>
    <strong>📞 الهاتف:</strong> ${student.phone}<br>
    <strong>📧 البريد:</strong> ${student.email}<br><br>
  `;

  const courseArea = document.getElementById("studentCourseDetails");
  courseArea.innerHTML = '';

  if (student.course === "الأربعون النووية") {
    for (let i = 1; i <= 40; i++) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `hadith_${i}`;
      checkbox.checked = student[`hadith_${i}`] || false;
      checkbox.onchange = function () {
        student[`hadith_${i}`] = this.checked;
        db.ref("students/" + student.id).update({ [`hadith_${i}`]: this.checked });
      };

      const label = document.createElement('label');
      label.htmlFor = `hadith_${i}`;
      label.innerText = `الحديث ${i}`;

      courseArea.appendChild(checkbox);
      courseArea.appendChild(label);
      courseArea.appendChild(document.createElement('br'));
    }
  }
  else if (student.course === "تحفة الأطفال") {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = "سمع حتى...";
    input.value = student.tuhfa || '';
    input.oninput = () => {
      student.tuhfa = input.value;
      db.ref("students/" + student.id).update({ tuhfa: input.value });
    };
    courseArea.appendChild(input);
  }
  else if (student.course === "جزء عم") {
    const from = document.createElement('input');
    from.type = 'text';
    from.placeholder = "من سورة...";
    from.value = student.juzFrom || '';
    from.oninput = () => {
      student.juzFrom = from.value;
      db.ref("students/" + student.id).update({ juzFrom: from.value });
    };

    const to = document.createElement('input');
    to.type = 'text';
    to.placeholder = "إلى سورة...";
    to.value = student.juzTo || '';
    to.oninput = () => {
      student.juzTo = to.value;
      db.ref("students/" + student.id).update({ juzTo: to.value });
    };

    courseArea.appendChild(from);
    courseArea.appendChild(to);
  }
  else if (student.course === "احفظي القرآن في 30 شهر") {
    const path = document.createElement('input');
    path.type = 'text';
    path.placeholder = "المسار";
    path.value = student.path || '';
    path.oninput = () => {
      student.path = path.value;
      db.ref("students/" + student.id).update({ path: path.value });
    };

    const sura = document.createElement('input');
    sura.type = 'text';
    sura.placeholder = "اسم السورة";
    sura.value = student.sura || '';
    sura.oninput = () => {
      student.sura = sura.value;
      db.ref("students/" + student.id).update({ sura: sura.value });
    };

    const fromAyah = document.createElement('input');
    fromAyah.type = 'number';
    fromAyah.placeholder = "من آية";
    fromAyah.value = student.fromAyah || '';
    fromAyah.oninput = () => {
      student.fromAyah = fromAyah.value;
      db.ref("students/" + student.id).update({ fromAyah: fromAyah.value });
    };

    const toAyah = document.createElement('input');
    toAyah.type = 'number';
    toAyah.placeholder = "إلى آية";
    toAyah.value = student.toAyah || '';
    toAyah.oninput = () => {
      student.toAyah = toAyah.value;
      db.ref("students/" + student.id).update({ toAyah: toAyah.value });
    };

    courseArea.appendChild(path);
    courseArea.appendChild(sura);
    courseArea.appendChild(fromAyah);
    courseArea.appendChild(toAyah);
  }

  // ملاحظات عامة
  const notesArea = document.createElement('div');
  notesArea.innerHTML = `
    <textarea placeholder="ملاحظات عن الواجب" oninput="students.find(s => s.id === ${id}).homework = this.value; firebase.database().ref('students/${id}').update({homework: this.value})">${student.homework || ''}</textarea>
    <textarea placeholder="ملاحظات عن السلوك" oninput="students.find(s => s.id === ${id}).behavior = this.value; firebase.database().ref('students/${id}').update({behavior: this.value})">${student.behavior || ''}</textarea>
    <textarea placeholder="سلبيات" oninput="students.find(s => s.id === ${id}).negatives = this.value; firebase.database().ref('students/${id}').update({negatives: this.value})">${student.negatives || ''}</textarea>
    <textarea placeholder="إيجابيات" oninput="students.find(s => s.id === ${id}).positives = this.value; firebase.database().ref('students/${id}').update({positives: this.value})">${student.positives || ''}</textarea>
  `;
  courseArea.appendChild(document.createElement('br'));
  courseArea.appendChild(notesArea);

  document.getElementById('studentFileModal').style.display = 'flex';
}

function openModal() {
  document.getElementById('studentModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('studentModal').style.display = 'none';
}

function closeStudentFile() {
  document.getElementById('studentFileModal').style.display = 'none';
}

document.getElementById('search').addEventListener('input', function () {
  const value = this.value.toLowerCase();
  const filtered = students.filter(s => s.name.toLowerCase().includes(value));
  const list = document.getElementById('studentsList');
  list.innerHTML = '';
  for (const student of filtered) {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <strong>${student.name}</strong><br>
      📞 ${student.phone}<br>
      📧 ${student.email}<br>
      🧕 المعلمة: ${student.teacher}<br>
      📚 الكورس: ${student.course}<br>
      <button onclick="viewStudent(${student.id})">📂 فتح ملف الطالب</button>
    `;
    list.appendChild(card);
  }
});

window.onload = () => {
  loadStudents();
};
    cards.forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(value) ? 'block' : 'none';
    });
  });
