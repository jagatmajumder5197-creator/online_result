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

  // সাবজেক্টের সুন্দর নাম দেখানোর ম্যাপিং
  const nameMap = {
    "B": "Bengali", "E": "English", "M": "Maths", "HN": "Hindi", 
    "CM": "Computer", "HS": "History", "G": "Geography", 
    "GK": "G.K.", "EV": "E.V.S.", "RYME": "Rhymes (Eng)", 
    "RYMB": "Rhymes (Ben)", "DRAW": "Drawing"
  };

  // শিটের সব কলাম চেক করে অটোমেটিক সাবজেক্ট বের করার লজিক
  Object.keys(student).forEach(key => {
    // যদি কলামের নাম 'FM' দিয়ে শুরু হয় (যেমন FMB, FMGK) এবং মান ০-এর বেশি হয়
    if (key.startsWith("FM") && key !== "FM" && student[key] > 0) {
      const suffix = key.substring(2); // যেমন: 'B', 'GK', 'RYME'
      const displayName = nameMap[suffix] || suffix; 
      
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td style="text-align:left; padding-left:15px;">${displayName}</td>
        <td>${student[key]}</td>
        <td>${student["TT" + suffix] || 0}</td>
        <td>${student["PC" + suffix] || 0}%</td>
        <td>${student["GD" + suffix] || ""}</td>
      `;
      subjectBody.appendChild(tr);
    }
  });

  document.getElementById("resultCard").classList.remove("hidden");
}
fetchData();
