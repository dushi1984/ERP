// دالة لحفظ المشاريع على السيرفر
function saveProjects() {
    var table = document.getElementById("projectsTable");
    var rows = Array.from(table.rows).slice(1); // تجاهل رأس الجدول
    var tableData = rows.map(row => Array.from(row.cells).slice(0, -1).map(cell => cell.querySelector('input').value.trim()));

    fetch('/api/projects', {
        method: 'POST', // لو كنت هتحفظ أو تحدث البيانات
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData) // إرسال البيانات بصيغة JSON
    })
    .then(response => response.json())
    .then(data => {
        console.log("تم حفظ المشاريع بنجاح:", data);
    })
    .catch(error => {
        console.error("حدث خطأ أثناء حفظ المشاريع:", error);
    });
}

// دالة لحفظ المواد الخام على السيرفر
function saveMaterials() {
    var table = document.getElementById("materialsTable");
    var rows = Array.from(table.rows).slice(1); // تجاهل رأس الجدول
    var tableData = rows.map(row => {
        return Array.from(row.cells).slice(0, -1).map(cell => cell.querySelector('input').value.trim());
    });

    fetch('/api/materials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableData)
    })
    .then(response => response.json())
    .then(data => {
        console.log("تم حفظ المواد الخام بنجاح:", data);
    })
    .catch(error => {
        console.error("حدث خطأ أثناء حفظ المواد الخام:", error);
    });
}

// استرجاع البيانات من السيرفر عند التحميل
window.onload = () => {
    fetch('/api/projects')
        .then(response => response.json())
        .then(data => {
            console.log("المشاريع المحفوظة:", data);
            populateTable("projectsTable", data); // ملء الجدول بالمشاريع المسترجعة
        });

    fetch('/api/materials')
        .then(response => response.json())
        .then(data => {
            console.log("المواد الخام المحفوظة:", data);
            populateTable("materialsTable", data);
        });
};

// ملء الجدول بالبيانات المسترجعة
function populateTable(tableId, data) {
    var table = document.getElementById(tableId);
    data.forEach(function(rowData) {
        var row = table.insertRow();
        rowData.forEach(function(cellData, index) {
            var cell = row.insertCell();
            cell.innerHTML = `<input type="text" value="${cellData}" class="data-cell">`;
        });

        var deleteCell = row.insertCell();
        deleteCell.innerHTML = `<button onclick="deleteRow(this)">حذف</button>`;
    });
}
