const API_URL = "https://script.google.com/macros/s/AKfycbzttIaoKv95G4NMjc6MYxccIO4bdlM9ooklPZwBcrVwcmDCSiCzuOy0byGPXv6RHWaQFQ/exec";

let allData = [];

// Grade Color Logic
function getGradeClass(grade) {
  if (grade === "A+") return "grade-aplus";
  if (grade === "B") return "grade-b";
  return "";
}

async function fetchData() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    allData = data;
    loadClasses();
  } catch (e) { console.error("Data load error"); }
}

function loadClasses() {
  const classes = [...new Set(allData.map(item => item.CLASS))].filter(Boolean); //
  const classSecEl = document.getElementById("classSec");
  classes.forEach(cls => {
    let opt = document.createElement("option");
    opt.value = opt.textContent = cls;
    classSecEl.appendChild(opt);
  });
}

document.getElementById("classSec").addEventListener("change", function() {
  const selectedClass = this.value;
  const studentNameEl = document.getElementById("studentName");
  studentNameEl.innerHTML = '<option value="">Select student</option>';
  const filtered = allData.filter(item => item.CLASS === selectedClass);
  filtered.forEach(stu => {
    let opt = document.createElement("option");
    opt.value = opt.textContent = stu.STUDENTS_NAME; //
    studentNameEl.appendChild(opt);
  });
});

document.getElementById("viewBtn").addEventListener("click", function() {
  const selectedClass = document.getElementById("classSec").value;
  const selectedName = document.getElementById("studentName").value;
  const student = allData.find(item => item.CLASS === selectedClass && item.STUDENTS_NAME === selectedName);

  if (student) renderResult(student);
});

function renderResult(student) {
  document.getElementById("outName").textContent = student.STUDENTS_NAME;
  document.getElementById("outFather").textContent = student.FATHERS_NAME; //
  document.getElementById("outClass").textContent = student.CLASS;
  document.getElementById("outRoll").textContent = student.ROLL; //

  // Lower Summary Mapping (Mirror Logic)
  document.getElementById("outTotalText").textContent = (student.GTT || 0) + "/" + (student.FM || 0); //
  document.getElementById("outPercentText").textContent = (student.PCGTT || 0) + "%"; //
  document.getElementById("outGradeText").innerHTML = `<span class="${getGradeClass(student.GDGTT)}">${student.GDGTT || ""}</span>`; //
  document.getElementById("outRankText").textContent = student.ORD || ""; //

  const subjectBody = document.getElementById("subjectBody");
  subjectBody.innerHTML = "";

  // Full Subject Mapping based on your request
  const subjects = [
    { n: "Bengali", fm: "FMB", sc: "TTB", pc: "PCB", gd: "GDB" },
    { n: "English", fm: "FME", sc: "TTE", pc: "PCE", gd: "GDE" },
    { n: "Maths", fm: "FMM", sc: "TTM", pc: "PCM", gd: "GDM" },
    { n: "Hindi", fm: "FMHN", sc: "TTHN", pc: "PCHN", gd: "GDHN" },
    { n: "Computer", fm: "FMCM", sc: "TTCM", pc: "PCCM", gd: "GDCM" },
    { n: "Bengali Rhyme", fm: "FMRYMB", sc: "TTRYMB", pc: "PCRYMB", gd: "GDRYMB" },
    { n: "English Rhyme", fm: "FMRYME", sc: "TTRYME", pc: "PCRYME", gd: "GDRYME" },
    { n: "GK", fm: "FMGK", sc: "TTGK", pc: "PCGK", gd: "GDGK" },
    { n: "EVS", fm: "FMEV", sc: "TTEV", pc: "PCEV", gd: "GDEV" },
    { n: "History", fm: "FMHS", sc: "TTHS", pc: "PCHS", gd: "GDHS" },
    { n: "Geography", fm: "FMG", sc: "TTG", pc: "PCG", gd: "GDG" },
    { n: "Life Science", fm: "FMLSC", sc: "TTLSC", pc: "PCLSC", gd: "GDLSC" },
    { n: "Physical Science", fm: "FMPSC", sc: "TTPSC", pc: "PCPSC", gd: "GDPSC" }
  ];

  subjects.forEach(sub => {
    const fullM = student[sub.fm];
    // Condition: If Full Marks > 0 or not empty, show row
    if (fullM && fullM != "0") {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-align:left; padding-left:20px;">${sub.n}</td>
        <td>${fullM}</td>
        <td>${student[sub.sc] || 0}</td>
        <td>${student[sub.pc] || 0}%</td>
        <td class="${getGradeClass(student[sub.gd])}">${student[sub.gd] || ""}</td>
      `;
      subjectBody.appendChild(tr);
    }
  });

  document.getElementById("resultCard").classList.remove("hidden");
}

fetchData();
