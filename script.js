const API_URL = "https://script.google.com/macros/s/AKfycbzttIaoKv95G4NMjc6MYxccIO4bdlM9ooklPZwBcrVwcmDCSiCzuOy0byGPXv6RHWaQFQ/exec";

let allData = [];

const classSecEl = document.getElementById("classSec");
const studentNameEl = document.getElementById("studentName");
const viewBtn = document.getElementById("viewBtn");
const resultCard = document.getElementById("resultCard");

const outClass = document.getElementById("outClass");
const outName = document.getElementById("outName");
const outFather = document.getElementById("outFather");
const outRoll = document.getElementById("outRoll");
const outRank = document.getElementById("outRank");
const outSummary = document.getElementById("outSummary");
const subjectBody = document.getElementById("subjectBody");

function cleanText(value) {
  return (value ?? "").toString().trim();
}

function uniqueValues(arr, key) {
  return [...new Set(arr.map(item => cleanText(item[key])).filter(Boolean))];
}

function loadClasses() {
  const classes = uniqueValues(allData, "class_sec");
  classSecEl.innerHTML = '<option value="">Select class</option>';
  classes.forEach(cls => {
    const opt = document.createElement("option");
    opt.value = cls;
    opt.textContent = cls;
    classSecEl.appendChild(opt);
  });
}

function loadStudents(selectedClass) {
  const students = allData.filter(item => cleanText(item.class_sec) === selectedClass);
  studentNameEl.innerHTML = '<option value="">Select student</option>';

  students.forEach(stu => {
    const opt = document.createElement("option");
    opt.value = cleanText(stu.name);
    opt.textContent = cleanText(stu.name);
    studentNameEl.appendChild(opt);
  });
}

function renderResult(student) {
  outClass.textContent = cleanText(student.class_sec);
  outName.textContent = cleanText(student.name);
  outFather.textContent = cleanText(student.father);
  outRoll.textContent = cleanText(student.roll);
  outRank.textContent = cleanText(student.rank);
  outSummary.textContent = cleanText(student.summary);

  subjectBody.innerHTML = "";

  const subjects = Array.isArray(student.subjects) ? student.subjects : [];

  subjects.forEach(sub => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${cleanText(sub.subject)}</td>
      <td>${cleanText(sub.total)}</td>
      <td>${cleanText(sub.obtained)}</td>
      <td>${cleanText(sub.grade)}</td>
      <td>${cleanText(sub.gpa)}</td>
    `;
    subjectBody.appendChild(tr);
  });

  resultCard.classList.remove("hidden");
}

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    allData = Array.isArray(data) ? data : [];
    loadClasses();
  } catch (error) {
    console.error("Data load failed:", error);
    alert("Could not load result data.");
  }
}

classSecEl.addEventListener("change", function () {
  const selectedClass = cleanText(this.value);
  studentNameEl.innerHTML = '<option value="">Select student</option>';
  resultCard.classList.add("hidden");

  if (selectedClass) {
    loadStudents(selectedClass);
  }
});

viewBtn.addEventListener("click", function () {
  const selectedClass = cleanText(classSecEl.value);
  const selectedStudent = cleanText(studentNameEl.value);

  if (!selectedClass || !selectedStudent) {
    alert("Please select both class and student.");
    return;
  }

  const student = allData.find(item =>
    cleanText(item.class_sec) === selectedClass &&
    cleanText(item.name) === selectedStudent
  );

  if (!student) {
    alert("Student result not found.");
    return;
  }

  renderResult(student);
});

fetchData();