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
        console.error("Error fetching data:", error); 
    } 
} 

document.getElementById("viewBtn").addEventListener("click", function() { 
    const selectedClass = document.getElementById("classSec").value; 
    const selectedName = document.getElementById("studentName").value; 
    const student = allData.find(item => item.CLASS === selectedClass && item.STUDENTS_NAME === selectedName); 
    
    if (student) renderResult(student); 
    else alert("Student name not found!"); 
}); 

function renderResult(student) { 
    // Normal Text (No Bold)
    document.getElementById("outName").textContent = student.STUDENTS_NAME || ""; 
    document.getElementById("outFather").textContent = student.FATHERS_NAME || ""; 
    document.getElementById("outClass").textContent = student.CLASS || ""; 
    
    // Bold Digits using innerHTML
    document.getElementById("outRoll").innerHTML = `<span class="bold-digit">${student.ROLL || ""}</span>`; 
    document.getElementById("outTotalText").innerHTML = `<span class="bold-digit">${student.GTT || 0}</span> / <span class="bold-digit">${student.FM || 0}</span>`; 
    document.getElementById("outPercentText").innerHTML = `<span class="bold-digit">${Number(student.PCGTT || 0).toFixed(2)}%</span>`; 
    document.getElementById("outGradeText").innerHTML = `<span class="bold-digit">${student.GDGTT || ""}</span>`; 
    document.getElementById("outRankText").innerHTML = `<span class="bold-digit">${student.ORD || ""}</span>`; 
    
    const subjectBody = document.getElementById("subjectBody"); 
    subjectBody.innerHTML = ""; 
    
    // Subject name mapping
    const nameMap = { 
        "B": "Bengali", "E": "English", "M": "Maths", "HN": "Hindi", 
        "CM": "Computer", "HS": "History", "G": "Geography", "GK": "G.K.", 
        "EV": "E.V.S.", "RYME": "Rhymes (Eng)", "RYMB": "Rhymes (Ben)", "DRAW": "Drawing" 
    }; 
    
    // Logic to dynamically extract subjects from columns
    Object.keys(student).forEach(key => { 
        // If column starts with 'FM' and value is greater than 0
        if (key.startsWith("FM") && key !== "FM" && student[key] > 0) { 
            const suffix = key.substring(2); 
            const displayName = nameMap[suffix] || suffix; 
            const tr = document.createElement("tr"); 
            
            // Only numbers are wrapped in .bold-digit class
            tr.innerHTML = ` 
                <td style="text-align:left; padding-left:15px;">${displayName}</td> 
                <td><span class="bold-digit">${student[key]}</span></td> 
                <td><span class="bold-digit">${student["TT" + suffix] || 0}</span></td> 
                <td><span class="bold-digit">${student["PC" + suffix] || 0}%</span></td> 
                <td><span class="bold-digit">${student["GD" + suffix] || ""}</span></td> 
            `; 
            subjectBody.appendChild(tr); 
        } 
    }); 
    
    document.getElementById("resultCard").classList.remove("hidden"); 
} 

fetchData();
