// وظيفة لفتح وإغلاق الأقسام
function toggleSection(sectionId) {
    var sections = document.querySelectorAll('section');
    sections.forEach(function(section) {
        section.classList.add('hidden');
    });
    var section = document.getElementById(sectionId);
    section.classList.remove('hidden');
}

// استرجاع البيانات من LocalStorage
function loadData() {
    if (localStorage.getItem("projects")) {
        let projects = JSON.parse(localStorage.getItem("projects"));
        populateTable("projectsTable", projects);
    }
    if (localStorage.getItem("materials")) {
        let materials = JSON.parse(localStorage.getItem("materials"));
        populateTable("materialsTable", materials);
    }
    if (localStorage.getItem("equipment")) {
        let equipment = JSON.parse(localStorage.getItem("equipment"));
        populateTable("equipmentTable", equipment);
    }
    if (localStorage.getItem("accounts")) {
        let accounts = JSON.parse(localStorage.getItem("accounts"));
        populateTable("accountsTable", accounts);
    }
}

// ملء الجدول بالبيانات المخزنة
function populateTable(tableId, data) {
    var table = document.getElementById(tableId);
    data.forEach(function(rowData) {
        var row = table.insertRow();
        
        // إضافة الخلايا من البيانات
        rowData.forEach(function(cellData, index) {
            var cell = row.insertCell();
            cell.innerHTML = `<input type="text" value="${cellData}" class="data-cell">`;
        });

        // إضافة الزر لحذف الصف في آخر خلية
        var deleteCell = row.insertCell();
        deleteCell.innerHTML = `<button onclick="deleteRow(this)">حذف</button>`;
    });
}

// حفظ البيانات في LocalStorage
function saveData(tableId, dataKey) {
    var table = document.getElementById(tableId);
    var rows = Array.from(table.rows).slice(1); // تجاهل صف العنوان
    
    // تحويل الصفوف إلى بيانات
    var tableData = rows.map(function(row) {
        var cells = Array.from(row.cells).slice(0, -1); // استبعاد الخلية الأخيرة (اللي فيها زر الحذف)
        return cells.map(function(cell) {
            return cell.querySelector('input').value.trim(); // التأكد من إزالة الفراغات
        });
    }).filter(function(row) {
        return row.every(function(cell) {
            return cell !== ""; // التأكد من أن جميع الخلايا غير فارغة
        });
    });

    // هنا هتضيف console.log لعرض البيانات قبل التخزين
    console.log(tableData);  // دي هتظهر البيانات اللي هتتحفظ في الـ localStorage

    // تخزين البيانات في localStorage
    if (tableData.length > 0) {
        localStorage.setItem(dataKey, JSON.stringify(tableData));
    } else {
        localStorage.removeItem(dataKey); // لو البيانات كلها اتحدفت، امسح الـ localStorage
    }
}



// حفظ بيانات المشاريع
function saveProjects() {
    saveData("projectsTable", "projects");
}

// حفظ بيانات المواد الخام
function saveMaterials() {
    saveData("materialsTable", "materials");
}

// حفظ بيانات المعدات
function saveEquipment() {
    saveData("equipmentTable", "equipment");
}

// حفظ بيانات الحسابات
function saveAccounts() {
    saveData("accountsTable", "accounts");
}

// إضافة مشروع جديد
function addProject() {
    var table = document.getElementById("projectsTable");
    var row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="الموقع"></td>
        <td><input type="text" placeholder="المشرف"></td>
        <td><input type="number" placeholder="عدد الأفراد"></td>
        <td><input type="number" placeholder="نسبة التقدم"></td>
        <td><input type="number" placeholder="المكسب الحالي"></td>
        <td><button onclick="deleteRow(this)">حذف</button></td>
    `;
    saveData("projectsTable", "projects"); // حفظ البيانات بعد إضافة صف
}

// إضافة مادة خام جديدة
// إضافة مادة خام جديدة
function addMaterial() {
    var table = document.getElementById("materialsTable");
    var row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="المادة الخام" class="material-name"></td>
        <td>
            <select class="supplier" onchange="updateSupplier(this)">
                <option value="">اختر المورد</option>
                ${getSuppliersOptions()}
            </select>
            <button onclick="addSupplier()">إضافة مورد جديد</button>
        </td>
        <td><input type="number" placeholder="الكمية" class="quantity" oninput="calculateTotalPrice(this)"></td>
        <td><input type="number" placeholder="السعر الوحدة" class="unit-price" oninput="calculateTotalPrice(this)"></td>
        <td><input type="number" placeholder="السعر الإجمالي" class="total-price" disabled></td>
        <td><button onclick="deleteRow(this)">حذف</button></td>
    `;
}

// الحصول على الموردين المخزنين في الـ localStorage
function getSuppliersOptions() {
    let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
    return suppliers.map(supplier => `<option value="${supplier}">${supplier}</option>`).join("");
}

// إضافة مورد جديد
function addSupplier() {
    var supplierName = prompt("أدخل اسم المورد الجديد:");
    if (supplierName) {
        let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
        suppliers.push(supplierName);
        localStorage.setItem("suppliers", JSON.stringify(suppliers));
        alert("تم إضافة المورد بنجاح.");
        location.reload(); // إعادة تحميل الصفحة لتحديث القائمة
    }
}

// حساب السعر الإجمالي
function calculateTotalPrice(element) {
    var row = element.closest("tr");
    var quantity = row.querySelector(".quantity").value;
    var unitPrice = row.querySelector(".unit-price").value;
    var totalPrice = row.querySelector(".total-price");

    if (quantity && unitPrice) {
        totalPrice.value = (quantity * unitPrice).toFixed(2); // حساب السعر الإجمالي
    }
}


// إضافة معدات جديدة
function addEquipment() {
    var table = document.getElementById("equipmentTable");
    var row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="المعدة"></td>
        <td><input type="text" placeholder="الحالة"></td>
        <td><input type="text" placeholder="المؤجر"></td>
        <td><button onclick="deleteRow(this)">حذف</button></td>
    `;
    saveData("equipmentTable", "equipment"); // حفظ البيانات بعد إضافة صف
}

// إضافة حساب جديد
function addAccount() {
    var table = document.getElementById("accountsTable");
    var row = table.insertRow();
    row.innerHTML = `
        <td><input type="text" placeholder="الوصف"></td>
        <td><input type="number" placeholder="المبلغ"></td>
        <td><input type="text" placeholder="النوع"></td>
        <td><button onclick="deleteRow(this)">حذف</button></td>
    `;
    saveData("accountsTable", "accounts"); // حفظ البيانات بعد إضافة صف
}

// حذف الصف
function deleteRow(button) {
    var row = button.closest("tr");
    var table = row.closest("table"); // الحصول على الجدول
    var tableId = table.id; // تحديد الـ ID للجدول (projectsTable, materialsTable, ...)

    // حذف الصف
    row.remove();
    
    // بعد الحذف، نحدث الـ LocalStorage بناءً على الجدول المحذوف منه الصف
    if (tableId === "projectsTable") {
        saveData("projectsTable", "projects");
    } else if (tableId === "materialsTable") {
        saveData("materialsTable", "materials");
    } else if (tableId === "equipmentTable") {
        saveData("equipmentTable", "equipment");
    } else if (tableId === "accountsTable") {
        saveData("accountsTable", "accounts");
    }
}


// تحميل البيانات عند تحميل الصفحة
window.onload = loadData;
