// ==================== USER DATABASE (localStorage) ====================
let users = [];

// Load users from localStorage
function loadUsersFromStorage() {
    const stored = localStorage.getItem('walabuma_users');
    if(stored) {
        users = JSON.parse(stored);
    } else {
        // Seed demo users with Ethiopian cities
        users = [
            { 
                id: Date.now() + 1, 
                firstName: "Alemu", 
                lastName: "Bekele", 
                email: "alemu@walabuma.com", 
                phone: "+251 911 234 567",
                password: "******", 
                gender: "Male", 
                country: "Ethiopia", 
                region: "Addis Ababa",
                city: "Addis Ababa",
                birthPlace: "Gondar",
                courseInterest: "JavaScript Core",
                dob: "1990-05-15" 
            },
            { 
                id: Date.now() + 2, 
                firstName: "Tigist", 
                lastName: "Desta", 
                email: "tigist@walabuma.com", 
                phone: "+251 922 345 678",
                password: "******", 
                gender: "Female", 
                country: "Ethiopia", 
                region: "Oromia",
                city: "Jimma",
                birthPlace: "Shambu",
                courseInterest: "React.js Ecosystem",
                dob: "1995-08-22" 
            },
            { 
                id: Date.now() + 3, 
                firstName: "Kebede", 
                lastName: "Tesfaye", 
                email: "kebede@walabuma.com", 
                phone: "+251 933 456 789",
                password: "******", 
                gender: "Male", 
                country: "Ethiopia", 
                region: "Harari",
                city: "Harar",
                birthPlace: "Dire Dawa",
                courseInterest: "HTML5 Mastery",
                dob: "1988-12-10" 
            },
            { 
                id: Date.now() + 4, 
                firstName: "Meron", 
                lastName: "Ayele", 
                email: "meron@walabuma.com", 
                phone: "+251 944 567 890",
                password: "******", 
                gender: "Female", 
                country: "Ethiopia", 
                region: "Amhara",
                city: "Bahir Dar",
                birthPlace: "Gondar",
                courseInterest: "CSS3 Advanced",
                dob: "1992-03-18" 
            }
        ];
        saveUsersToStorage();
    }
    updateAdminUI();
}

function saveUsersToStorage() {
    localStorage.setItem('walabuma_users', JSON.stringify(users));
    updateAdminUI();
}

// Helper to generate unique ID
function generateId() {
    return Date.now() + Math.floor(Math.random() * 10000);
}

// Add new user (called from registration)
function addUser(userData) {
    const newUser = {
        id: generateId(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        password: "encrypted_demo",
        gender: userData.gender || "Not specified",
        country: userData.country || "Ethiopia",
        region: userData.region || "",
        city: userData.city || "",
        birthPlace: userData.birthPlace || "",
        courseInterest: userData.courseInterest || "",
        dob: userData.dob || "N/A"
    };
    users.push(newUser);
    saveUsersToStorage();
    return newUser;
}

// Delete user by id
function deleteUserById(id) {
    if(confirm("Are you sure you want to delete this student?")) {
        users = users.filter(user => user.id !== id);
        saveUsersToStorage();
        showAdminFeedback("Student deleted successfully!", "success");
    }
}

// Delete all users
function deleteAllUsers() {
    if(confirm("⚠️ Delete ALL registered students? This action is irreversible.")) {
        users = [];
        saveUsersToStorage();
        showAdminFeedback("All students have been removed.", "success");
    }
}

// Export data to JSON
function exportData() {
    const dataStr = JSON.stringify(users, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `walabuma_students_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    showAdminFeedback("Data exported successfully!", "success");
}

// Edit user (inline prompt style)
function editUser(id) {
    const user = users.find(u => u.id === id);
    if(!user) return;
    
    const newFirstName = prompt("Edit First Name:", user.firstName);
    if(newFirstName !== null && newFirstName.trim() !== "") user.firstName = newFirstName.trim();
    
    const newLastName = prompt("Edit Last Name:", user.lastName);
    if(newLastName !== null && newLastName.trim() !== "") user.lastName = newLastName.trim();
    
    const newEmail = prompt("Edit Email:", user.email);
    if(newEmail !== null && newEmail.trim() !== "" && newEmail.includes("@")) {
        user.email = newEmail.trim();
    } else if(newEmail !== null && !newEmail.includes("@")) {
        alert("Invalid email format, unchanged.");
    }
    
    const newPhone = prompt("Edit Phone Number:", user.phone);
    if(newPhone !== null && newPhone.trim() !== "") user.phone = newPhone.trim();
    
    const newCity = prompt("Edit City/Town:", user.city);
    if(newCity !== null && newCity.trim() !== "") user.city = newCity.trim();
    
    const newBirthPlace = prompt("Edit Place of Birth:", user.birthPlace);
    if(newBirthPlace !== null && newBirthPlace.trim() !== "") user.birthPlace = newBirthPlace.trim();
    
    const newRegion = prompt("Edit Region:", user.region);
    if(newRegion !== null && newRegion.trim() !== "") user.region = newRegion.trim();
    
    const newCourse = prompt("Edit Course Interest:", user.courseInterest);
    if(newCourse !== null && newCourse.trim() !== "") user.courseInterest = newCourse.trim();
    
    saveUsersToStorage();
    showAdminFeedback(`Student ${user.firstName} ${user.lastName} updated`, "success");
}

function showAdminFeedback(msg, type) {
    const feedbackDiv = document.getElementById('adminFeedback');
    feedbackDiv.innerHTML = `<div class="success-message" style="background:${type === 'success' ? '#e0f2e9' : '#ffe6e5'};">${msg}</div>`;
    setTimeout(() => { if(feedbackDiv) feedbackDiv.innerHTML = ''; }, 3000);
}

// Render admin table
function updateAdminUI() {
    const tbody = document.getElementById('userTableBody');
    const statsSpan = document.getElementById('userStats');
    if(!tbody) return;
    
    if(users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="empty-state">📭 No students registered yet. Create one via registration form.</td></tr>';
        if(statsSpan) statsSpan.innerText = `Total Students: 0`;
        return;
    }
    
    if(statsSpan) statsSpan.innerText = `Total Students: ${users.length}`;
    let html = '';
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.id.toString().slice(-6)}</td>
                <td><strong>${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}</strong></td>
                <td>${escapeHtml(user.email)}</td>
                <td>${escapeHtml(user.phone || '—')}</td>
                <td>${escapeHtml(user.city || '—')}</td>
                <td>${escapeHtml(user.birthPlace || '—')}</td>
                <td>${escapeHtml(user.region || '—')}</td>
                <td><span class="course-badge">${escapeHtml(user.courseInterest || '—')}</span></td>
                <td>
                    <button class="edit-btn" onclick="editUser(${user.id})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="delete-btn" onclick="deleteUserById(${user.id})"><i class="fas fa-trash"></i> Del</button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function escapeHtml(str) { 
    if(!str) return ''; 
    return str.replace(/[&<>]/g, function(m){
        if(m === '&') return '&amp;'; 
        if(m === '<') return '&lt;'; 
        if(m === '>') return '&gt;'; 
        return m;
    }); 
}

// ==================== REGISTRATION FORM VALIDATION ====================
const form = document.getElementById('registrationForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const password = document.getElementById('password');
const confirmPwd = document.getElementById('confirmPwd');
const dob = document.getElementById('dob');
const city = document.getElementById('city');
const birthPlace = document.getElementById('birthPlace');

const firstNameErr = document.getElementById('firstNameError');
const lastNameErr = document.getElementById('lastNameError');
const emailErr = document.getElementById('emailError');
const phoneErr = document.getElementById('phoneError');
const passwordErr = document.getElementById('passwordError');
const confirmErr = document.getElementById('confirmError');
const dobErr = document.getElementById('dobError');
const cityErr = document.getElementById('cityError');
const birthPlaceErr = document.getElementById('birthPlaceError');
const feedbackDiv = document.getElementById('formFeedback');

function hideAllErrors() { 
    [firstNameErr, lastNameErr, emailErr, phoneErr, passwordErr, confirmErr, dobErr, cityErr, birthPlaceErr].forEach(e => { 
        if(e) { e.style.display = 'none'; e.innerText = ''; } 
    }); 
    if(feedbackDiv) feedbackDiv.innerHTML = ''; 
}

function showError(el, msg) { 
    if(el) { el.innerText = msg; el.style.display = 'block'; } 
}

function validateForm() {
    let isValid = true;
    hideAllErrors();
    
    const fName = firstName.value.trim();
    if(!fName) { showError(firstNameErr, 'First name required'); isValid = false; }
    else if(fName.length < 2) { showError(firstNameErr, 'At least 2 characters'); isValid = false; }
    
    const lName = lastName.value.trim();
    if(!lName) { showError(lastNameErr, 'Last name required'); isValid = false; }
    else if(lName.length < 2) { showError(lastNameErr, 'At least 2 characters'); isValid = false; }
    
    const emailVal = email.value.trim();
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if(!emailVal) { showError(emailErr, 'Email required'); isValid = false; }
    else if(!emailRegex.test(emailVal)) { showError(emailErr, 'Invalid email format'); isValid = false; }
    
    const phoneVal = phone.value.trim();
    const phoneRegex = /^[\+0-9\s\-\(\)]{8,20}$/;
    if(!phoneVal) { showError(phoneErr, 'Phone number required'); isValid = false; }
    else if(!phoneRegex.test(phoneVal)) { showError(phoneErr, 'Enter valid phone number (e.g., +251 912 345 678)'); isValid = false; }
    
    const pwd = password.value;
    if(!pwd) { showError(passwordErr, 'Password required'); isValid = false; }
    else if(pwd.length < 6) { showError(passwordErr, 'Password must be at least 6 characters'); isValid = false; }
    
    if(pwd !== confirmPwd.value) { showError(confirmErr, 'Passwords do not match'); isValid = false; }
    
    const cityVal = city.value;
    if(!cityVal) { showError(cityErr, 'Please select a city'); isValid = false; }
    
    const birthPlaceVal = birthPlace.value;
    if(!birthPlaceVal) { showError(birthPlaceErr, 'Please select place of birth'); isValid = false; }
    
    const dobVal = dob.value;
    if(dobVal) {
        const birth = new Date(dobVal);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if(monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
        if(age < 12 && age > 0) { showError(dobErr, 'Must be at least 12 years old'); isValid = false; }
        else if(age > 110) { showError(dobErr, 'Invalid birth year'); isValid = false; }
        else if(age < 0) { showError(dobErr, 'Invalid date of birth'); isValid = false; }
    }
    
    return isValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(validateForm()) {
        const genderSelected = document.querySelector('input[name="gender"]:checked');
        const gender = genderSelected ? genderSelected.value : 'Not specified';
        const newUserData = {
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            gender: gender,
            country: document.getElementById('country').value,
            region: document.getElementById('region').value,
            city: city.value,
            birthPlace: birthPlace.value,
            courseInterest: document.getElementById('courseInterest').value,
            dob: dob.value || "N/A",
        };
        addUser(newUserData);
        feedbackDiv.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> ✅ Registration successful! Welcome to Walabuma Frontend Dev, ${newUserData.firstName}! Your journey starts now.</div>`;
        form.reset();
        document.getElementById('country').value = 'Ethiopia';
        document.getElementById('city').value = '';
        document.getElementById('birthPlace').value = '';
        document.getElementById('courseInterest').value = '';
        setTimeout(() => { if(feedbackDiv) feedbackDiv.innerHTML = ''; }, 4000);
        
        if(document.getElementById('admin-page').classList.contains('active-page')) updateAdminUI();
    } else {
        feedbackDiv.innerHTML = '<div
