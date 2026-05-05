let allData = [];
const scriptURL = "https://script.google.com/macros/s/AKfycbyOnxQqelRC93Xmx61AHsmX3XsB6u3qKK_LtY0miKigHQGwH2fz75Ho1hxy8YoYYsYWQQ/exec"; 

async function fetchData() {
  try {
    const response = await fetch(scriptURL);
    allData = await response.json();
    
    const classSecSelect = document.getElementById("classSec");
    const classes = [...new Set(allData.map(item => item.CLASS))].filter(Boolean);
    
    classes.forEach(cls => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = cls;
      classSecSelect.appendChild(opt);
    });

    classSecSelect.addEventListener("change", function() {
      const studentSelect = document.getElementById("studentName");
      studentSelect.innerHTML = '<option value="">Select Student Name</option>';
      const filtered = allData.filter(item => item.CLASS === this.value);
      filtered.forEach(stu => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = stu.STUDENTS_NAME;
        studentSelect.appendChild(opt);
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

document.getElementById("viewBtn").addEventListener("click", function() {
  const selectedClass = document.getElementById("classSec").value;
  const selectedName = document.getElementById("studentName").value;
  const student = allData.find(item => item.CLASS === selectedClass && item.STUDENTS_NAME === selectedName);
  if (student) renderResult(student);
  else alert("ছাত্রের নাম পাওয়া যায়নি!");
});

function renderResult(student) {
  document.getElementById("outName").textContent = student.STUDENTS_NAME || "";
  document.getElementById("outFather").textContent = student.FATHERS_NAME || "";
  document.getElementById("outClass").textContent = student.CLASS || "";
  document.getElementById("outRoll").textContent = student.ROLL || "";
  document.getElementById("outTotalText").textContent = (student.GTT || 0) + "/" + (student.FM || 0);
  document.getElementById("outPercentText").textContent = (student.PCGTT || 0) + "%";
  document.getElementById("outGradeText").textContent = student.GDGTT || "";
  document.getElementById("outRankText").textContent = student.ORD || "";

  const subjectBody = document.getElementById("subjectBody");
  subjectBody.innerHTML = "";
  const subjects = [
    {n: "Bengali", fm: "FMB", sc: "TTB", pc: "PCB", gd: "GDB"},
    {n: "English", fm: "FME", sc: "TTE", pc: "PCE", gd: "GDE"},
    {n: "Maths", fm: "FMM", sc: "TTM", pc: "PCM", gd: "GDM"},
    {n: "Hindi", fm: "FMHN", sc: "TTHN", pc: "PCHN", gd: "GDHN"},
    {n: "Computer", fm: "FMCM", sc: "TTCM", pc: "PCCM", gd: "GDCM"},
    {n: "History", fm: "FMHS", sc: "TTHS", pc: "PCHS", gd: "GDHS"},
    {n: "Geography", fm: "FMG", sc: "TTG", pc: "PCG", gd: "GDG"}
  ];

  subjects.forEach(sub => {
    if (student[sub.fm] && student[sub.fm] != 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${sub.n}</td><td>${student[sub.fm]}</td><td>${student[sub.sc] || 0}</td><td>${student[sub.pc] || 0}%</td><td>${student[sub.gd] || ""}</td>`;
      subjectBody.appendChild(tr);
    }
  });
  document.getElementById("resultCard").classList.remove("hidden");
}
fetchData();
