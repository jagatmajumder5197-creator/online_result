const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyOnxQqelRC93Xmx61AHsmX3XsB6u3qKK_LtY0miKigHQGwH2fz75Ho1hxy8YoYYsYWQQ/exec";

let studentData = [];

// Configuration for Subject Mapping based on your provided columns
const subjectConfig = [
    { name: "Bengali", fm: "FMB", wt: "WTB", ol: "OLB", tt: "TTB", pc: "PCB", gd: "GDB" },
    { name: "English", fm: "FME", wt: "WTE", ol: "OLE", tt: "TTE", pc: "PCE", gd: "GDE" },
    { name: "Math", fm: "FMM", wt: "WTM", ol: "OLM", tt: "TTM", pc: "PCM", gd: "GDM" },
    { name: "Hindi", fm: "FMHN", wt: "WTHN", ol: "OLHN", tt: "TTHN", pc: "PCHN", gd: "GDHN" },
    { name: "Computer", fm: "FMCM", wt: "WTCM", ol: "OLCM", tt: "TTCM", pc: "PCCM", gd: "GDCM" },
    { name: "Rhymes Bengali", fm: "FMRYMB", wt: "WTRYMB", ol: "OLRYMB", tt: "TTRYMB", pc: "PCRYMB", gd: "GDRYMB" },
    { name: "Rhymes English", fm: "FMRYME", wt: "WTRYME", ol: "OLRYME", tt: "TTRYME", pc: "PCRYME", gd: "GDRYME" },
    { name: "GK", fm: "FMGK", wt: "WTGK", ol: "OLGK", tt: "TTGK", pc: "PCGK", gd: "GDGK" },
    { name: "EVS", fm: "FMEV", wt: "WTEV", ol: "OLEV", tt: "TTEV", pc: "PCEV", gd: "GDEV" },
    { name: "History", fm: "FMHS", wt: "WTHS", ol: "OLHS", tt: "TTHS", pc: "PCHS", gd: "GDHS" },
    { name: "Geography", fm: "FMG", wt: "WTG", ol: "OLG", tt: "TTG", pc: "PCG", gd: "GDG" },
    { name: "Life Science", fm: "FMLSC", wt: "WRLSC", ol: "OLLSC", tt: "TTLSC", pc: "PCLSC", gd: "GDLSC" },
    { name: "Physical Science", fm: "FMPSC", wt: "WTPSC", ol: "OLPSC", tt: "TTPSC", pc: "PCPSC", gd: "GDPSC" }
];

// Load Data on Start
window.onload = async () => {
    try {
        const res = await fetch(WEB_APP_URL);
        studentData = await res.json();
        populateClassDropdown();
    } catch (e) {
        alert("System Error: Could not connect to Master Sheet.");
    }
};

function populateClassDropdown() {
    const classList = [...new Set(studentData.map(item => item.CLASS))];
    const dropdown = document.getElementById("classSelect");
    classList.forEach(cls => {
        let opt = document.createElement("option");
        opt.value = opt.textContent = cls;
        dropdown.appendChild(opt);
    });
}

document.getElementById("classSelect").onchange = function() {
    const studentsInClass = studentData.filter(s => s.CLASS === this.value);
    const stuDropdown = document.getElementById("studentSelect");
    stuDropdown.innerHTML = '<option value="">STUDENTS_NAME</option>';
    studentsInClass.forEach(s => {
        let opt = document.createElement("option");
        opt.value = s.I_D;
        opt.textContent = s.STUDENTS_NAME;
        stuDropdown.appendChild(opt);
    });
};

document.getElementById("viewResultBtn").onclick = function() {
    const id = document.getElementById("studentSelect").value;
    if (!id) return alert("Select Student First");
    const student = studentData.find(s => s.I_D == id);
    renderMarksheet(student);
};

function renderMarksheet(s) {
    document.getElementById("selectionArea").classList.add("hidden");
    document.getElementById("resultWrapper").classList.remove("hidden");

    // Bio Info
    document.getElementById("certificateNo").textContent = s.I_D;
    document.getElementById("resName").textContent = s.STUDENTS_NAME;
    document.getElementById("resFather").textContent = s.FATHERS_NAME;
    document.getElementById("resClass").textContent = s.CLASS;
    document.getElementById("resRoll").textContent = s.ROLL;

    // Table Generation with Filter Logic
    const tbody = document.getElementById("subjectTableBody");
    tbody.innerHTML = "";

    subjectConfig.forEach(sub => {
        const fullMarks = Number(s[sub.fm] || 0);

        // Logic Trigger: Only show if Full Marks > 0
        if (fullMarks > 0) {
            let row = `<tr>
                <td style="text-align:left; padding-left:15px;">${sub.name}</td>
                <td>-</td><td>-</td><td>${fullMarks}</td>
                <td>${s[sub.wt] ?? 0}</td>
                <td>${s[sub.ol] ?? 0}</td>
                <td>${s[sub.total] ?? 0}</td>
                <td>${Number(s[sub.pc] || 0).toFixed(2)}%</td>
                <td>${s[sub.grade] || "D"}</td>
            </tr>`;
            tbody.innerHTML += row;
        }
    });

    // Grand Summary
    document.getElementById("totalFM").textContent = s.FM;
    document.getElementById("totalObt").textContent = s.GTT;
    document.getElementById("totalPC").textContent = Number(s.PCGTT || 0).toFixed(2) + "%";
    document.getElementById("totalGD").textContent = s.GDGTT;
    document.getElementById("totalRank").textContent = s.ORD;
}

// PDF Download
document.getElementById("downloadBtn").onclick = function() {
    const element = document.getElementById("marksheet");
    const opt = {
        margin: 0,
        filename: `Result_${document.getElementById("resName").textContent}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
};
