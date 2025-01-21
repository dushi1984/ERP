const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// تمكين ال JSON-Data في الـ request body
app.use(express.json());

// المسار الرئيسي لتقديم ملفات الـ HTML، CSS، و JS
app.use(express.static(path.join(__dirname, 'public')));

// المسار لتخزين البيانات في ملف JSON
app.post('/saveData', (req, res) => {
    const data = req.body;
    fs.writeFileSync(path.join(__dirname, 'data', 'storedData.json'), JSON.stringify(data, null, 2));
    res.json({ message: 'Data saved successfully' });
});

// المسار لتحميل البيانات من الملف
app.get('/loadData', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'storedData.json');
    if (fs.existsSync(filePath)) {
        const rawData = fs.readFileSync(filePath);
        const data = JSON.parse(rawData);
        res.json(data);
    } else {
        res.status(404).json({ message: 'No data found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
