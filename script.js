/* =========================================================
   MARG - Mentorship & Academic Relationship Gateway
   ========================================================= */

// API endpoint configuration
const API_URL = "api.php";

// Default mock data (used for fallback initialization if offline/static file)
const DEFAULT_MENTORS = [
    {
        id: "EMP-1001",
        name: "Dr. Arvind Kulkarni",
        department: "Computer Engineering",
        designation: "Professor & Head",
        maxMembers: 20,
        profilePic: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        mentees: [
            { roll: "2024CE101", name: "Aarav Sharma", sem: "Sem 5 (TE)", email: "aarav.sharma@college.edu" },
            { roll: "2024CE102", name: "Pooja Patel", sem: "Sem 5 (TE)", email: "pooja.patel@college.edu" },
            { roll: "2024CE103", name: "Rohan Mehta", sem: "Sem 5 (TE)", email: "rohan.mehta@college.edu" },
            { roll: "2024CE104", name: "Ananya Iyer", sem: "Sem 5 (TE)", email: "ananya.iyer@college.edu" },
            { roll: "2024CE105", name: "Kunal Shah", sem: "Sem 5 (TE)", email: "kunal.shah@college.edu" }
        ]
    },
    {
        id: "EMP-1045",
        name: "Prof. Sunita Rao",
        department: "Information Technology",
        designation: "Associate Professor",
        maxMembers: 15,
        profilePic: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        mentees: [
            { roll: "2024IT201", name: "Nikhil Verma", sem: "Sem 5 (TE)", email: "nikhil.verma@college.edu" },
            { roll: "2024IT202", name: "Sneha Nair", sem: "Sem 5 (TE)", email: "sneha.nair@college.edu" },
            { roll: "2024IT203", name: "Aditya Joshi", sem: "Sem 5 (TE)", email: "aditya.joshi@college.edu" },
            { roll: "2024IT204", name: "Meera Gupta", sem: "Sem 5 (TE)", email: "meera.gupta@college.edu" },
            { roll: "2024IT205", name: "Varun Kapse", sem: "Sem 5 (TE)", email: "varun.kapse@college.edu" }
        ]
    },
    {
        id: "EMP-2088",
        name: "Dr. Vikram Deshmukh",
        department: "Electronics & Telecom",
        designation: "Assistant Professor",
        maxMembers: 12,
        profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        mentees: [
            { roll: "2024EX301", name: "Siddharth Rao", sem: "Sem 5 (TE)", email: "siddharth.rao@college.edu" },
            { roll: "2024EX302", name: "Tanvi Sawant", sem: "Sem 5 (TE)", email: "tanvi.sawant@college.edu" },
            { roll: "2024EX303", name: "Gaurav More", sem: "Sem 5 (TE)", email: "gaurav.more@college.edu" },
            { roll: "2024EX304", name: "Isha Jain", sem: "Sem 5 (TE)", email: "isha.jain@college.edu" },
            { roll: "2024EX305", name: "Yash Kulkarni", sem: "Sem 5 (TE)", email: "yash.kulkarni@college.edu" }
        ]
    }
];

// Application State
let mentors = [];
let isBackendActive = false;
let deleteCandidateIndex = null;
let currentMenteeMentorIndex = null;
let addImageBase64 = "";
let editImageBase64 = "";

// DOM Elements
const addMentorForm = document.getElementById("addMentorForm");
const mentorTableBody = document.getElementById("mentorTableBody");
const emptyState = document.getElementById("emptyState");
const totalMentorCount = document.getElementById("totalMentorCount");
const totalMenteeCount = document.getElementById("totalMenteeCount");
const totalCapacityCount = document.getElementById("totalCapacityCount");

// Search & Filter
const searchInput = document.getElementById("searchInput");
const deptFilter = document.getElementById("deptFilter");

// Add Image Preview elements
const profilePicInput = document.getElementById("profilePicInput");
const addImgPreview = document.getElementById("addImgPreview");
const addImgPlaceholder = document.getElementById("addImgPlaceholder");
const resetBtn = document.getElementById("resetBtn");

// Edit Modal Elements
const editModalOverlay = document.getElementById("editModalOverlay");
const editMentorForm = document.getElementById("editMentorForm");
const closeEditModalBtn = document.getElementById("closeEditModalBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const editMentorIndex = document.getElementById("editMentorIndex");
const editMentorName = document.getElementById("editMentorName");
const editEmpId = document.getElementById("editEmpId");
const editDepartment = document.getElementById("editDepartment");
const editDesignation = document.getElementById("editDesignation");
const editMaxMembers = document.getElementById("editMaxMembers");
const editProfilePicInput = document.getElementById("editProfilePicInput");
const editImgPreview = document.getElementById("editImgPreview");

// Delete Modal Elements
const deleteModalOverlay = document.getElementById("deleteModalOverlay");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
const deleteModalMessage = document.getElementById("deleteModalMessage");

// Mentee Management Modal Elements
const menteeModalOverlay = document.getElementById("menteeModalOverlay");
const closeMenteeModalBtn = document.getElementById("closeMenteeModalBtn");
const closeMenteeModalFooterBtn = document.getElementById("closeMenteeModalFooterBtn");
const menteeModalTitle = document.getElementById("menteeModalTitle");
const menteeModalSubtitle = document.getElementById("menteeModalSubtitle");
const capacityStatusText = document.getElementById("capacityStatusText");
const capacityPercentText = document.getElementById("capacityPercentText");
const capacityProgressBar = document.getElementById("capacityProgressBar");
const addMenteeForm = document.getElementById("addMenteeForm");
const menteeTableBody = document.getElementById("menteeTableBody");
const menteeTableCount = document.getElementById("menteeTableCount");
const menteeEmptyState = document.getElementById("menteeEmptyState");
const menteeNameInput = document.getElementById("menteeName");
const menteeRollInput = document.getElementById("menteeRoll");
const menteeSemInput = document.getElementById("menteeSem");
const menteeEmailInput = document.getElementById("menteeEmail");

// Toast Element
const toast = document.getElementById("toast");

// Theme Toggle Elements
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeIcon = document.getElementById("themeIcon");
const themeText = document.getElementById("themeText");

/* =========================================================
   Initialization
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupEventListeners();
    fetchMentors();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem("mentor_system_theme");
    if (savedTheme === "dark") {
        applyTheme("dark");
    } else {
        applyTheme("light");
    }
}

function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeIcon) themeIcon.textContent = "☀️";
        if (themeText) themeText.textContent = "Light Mode";
        localStorage.setItem("mentor_system_theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        if (themeIcon) themeIcon.textContent = "🌙";
        if (themeText) themeText.textContent = "Dark Mode";
        localStorage.setItem("mentor_system_theme", "light");
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
}

/* =========================================================
   Data Fetching & Backend API Integration
   ========================================================= */
async function fetchMentors() {
    try {
        const res = await fetch(`${API_URL}?action=get_mentors`);
        if (res.ok) {
            const data = await res.json();
            if (data && data.success && Array.isArray(data.mentors)) {
                mentors = data.mentors;
                isBackendActive = true;
                renderMentors();
                return;
            }
        }
        throw new Error("PHP backend unreachable or returned invalid response");
    } catch (err) {
        console.warn("Using LocalStorage fallback (PHP backend not detected):", err.message);
        isBackendActive = false;
        loadLocalMentors();
        renderMentors();
    }
}

function loadLocalMentors() {
    const savedData = localStorage.getItem("mentor_system_records");
    if (savedData) {
        try {
            mentors = JSON.parse(savedData);
        } catch (e) {
            mentors = JSON.parse(JSON.stringify(DEFAULT_MENTORS));
        }
    } else {
        mentors = JSON.parse(JSON.stringify(DEFAULT_MENTORS));
        localStorage.setItem("mentor_system_records", JSON.stringify(mentors));
    }
}

function saveLocalMentors() {
    localStorage.setItem("mentor_system_records", JSON.stringify(mentors));
    updateStats();
}

/* =========================================================
   Event Listeners
   ========================================================= */
function setupEventListeners() {
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", toggleTheme);
    }

    // Add Mentor Form Submission
    addMentorForm.addEventListener("submit", handleAddMentor);

    // Image upload preview for Add Form
    profilePicInput.addEventListener("change", (e) => {
        handleImageUpload(e.target.files[0], (base64) => {
            addImageBase64 = base64;
            addImgPreview.src = base64;
            addImgPreview.classList.remove("hidden");
            addImgPlaceholder.classList.add("hidden");
        });
    });

    // Reset Form button
    resetBtn.addEventListener("click", () => {
        addImageBase64 = "";
        addImgPreview.src = "";
        addImgPreview.classList.add("hidden");
        addImgPlaceholder.classList.remove("hidden");
    });

    // Search and Filter inputs
    searchInput.addEventListener("input", renderMentors);
    deptFilter.addEventListener("change", renderMentors);

    // Edit Modal Events
    closeEditModalBtn.addEventListener("click", closeEditModal);
    cancelEditBtn.addEventListener("click", closeEditModal);
    editMentorForm.addEventListener("submit", handleEditMentorSave);

    // Image upload preview for Edit Form
    editProfilePicInput.addEventListener("change", (e) => {
        handleImageUpload(e.target.files[0], (base64) => {
            editImageBase64 = base64;
            editImgPreview.src = base64;
        });
    });

    // Delete Modal Events
    cancelDeleteBtn.addEventListener("click", closeDeleteModal);
    confirmDeleteBtn.addEventListener("click", handleConfirmDelete);

    // Mentee Modal Events
    closeMenteeModalBtn.addEventListener("click", closeMenteeModal);
    closeMenteeModalFooterBtn.addEventListener("click", closeMenteeModal);
    addMenteeForm.addEventListener("submit", handleAddMentee);

    // Close Modals on backdrop click
    window.addEventListener("click", (e) => {
        if (e.target === editModalOverlay) closeEditModal();
        if (e.target === deleteModalOverlay) closeDeleteModal();
        if (e.target === menteeModalOverlay) closeMenteeModal();
    });
}

/* =========================================================
   Image Helper
   ========================================================= */
function handleImageUpload(file, callback) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        showToast("Please select a valid image file.", "error");
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

function getAvatarPlaceholder(name) {
    const initials = name
        ? name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
        : "M";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&bold=true`;
}

/* =========================================================
   Add Mentor Handler
   ========================================================= */
async function handleAddMentor(e) {
    e.preventDefault();

    const name = document.getElementById("mentorName").value.trim();
    const empId = document.getElementById("empId").value.trim().toUpperCase();
    const department = document.getElementById("department").value;
    const designation = document.getElementById("designation").value;
    const maxMembers = parseInt(document.getElementById("maxMembers").value, 10);
    const profilePic = addImageBase64 || getAvatarPlaceholder(name);

    if (maxMembers <= 0) {
        showToast("Student capacity must be at least 1.", "error");
        return;
    }

    if (isBackendActive) {
        try {
            const res = await fetch(`${API_URL}?action=add_mentor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    emp_id: empId,
                    department,
                    designation,
                    max_members: maxMembers,
                    profile_pic: profilePic
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                showToast(data.message || "Failed to add mentor", "error");
                return;
            }
            await fetchMentors();
        } catch (err) {
            showToast("Server communication error", "error");
            return;
        }
    } else {
        const isDuplicate = mentors.some(m => m.id.toUpperCase() === empId);
        if (isDuplicate) {
            showToast(`Employee ID ${empId} already exists.`, "error");
            return;
        }

        const newMentor = {
            id: empId,
            name: name,
            department: department,
            designation: designation,
            maxMembers: maxMembers,
            profilePic: profilePic,
            mentees: []
        };

        mentors.unshift(newMentor);
        saveLocalMentors();
        renderMentors();
    }

    addMentorForm.reset();
    addImageBase64 = "";
    addImgPreview.src = "";
    addImgPreview.classList.add("hidden");
    addImgPlaceholder.classList.remove("hidden");

    showToast(`Mentor ${name} added.`);
}

/* =========================================================
   Render Mentor List Table
   ========================================================= */
function renderMentors() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedDept = deptFilter.value;

    const filteredMentors = mentors.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm) ||
            m.id.toLowerCase().includes(searchTerm) ||
            m.department.toLowerCase().includes(searchTerm) ||
            m.designation.toLowerCase().includes(searchTerm);

        const matchesDept = (selectedDept === "ALL" || m.department === selectedDept);

        return matchesSearch && matchesDept;
    });

    mentorTableBody.innerHTML = "";

    if (filteredMentors.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");

        filteredMentors.forEach((mentor) => {
            const originalIndex = mentors.indexOf(mentor);
            const menteeCount = mentor.mentees ? mentor.mentees.length : 0;
            const isCapacityFull = menteeCount >= mentor.maxMembers;

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <img 
                        src="${mentor.profilePic || getAvatarPlaceholder(mentor.name)}" 
                        alt="${mentor.name}" 
                        class="mentor-avatar"
                        onerror="this.src='${getAvatarPlaceholder(mentor.name)}'"
                    >
                </td>
                <td><strong>${escapeHtml(mentor.name)}</strong></td>
                <td><span class="emp-badge">${escapeHtml(mentor.id)}</span></td>
                <td><span class="dept-badge">${escapeHtml(mentor.department)}</span></td>
                <td>${escapeHtml(mentor.designation)}</td>
                <td>
                    <div class="capacity-container">
                        <span class="mentee-count-badge ${isCapacityFull ? 'full' : ''}">
                            ${menteeCount} / ${mentor.maxMembers} students
                        </span>
                        <button class="btn-mentees" onclick="openMenteeModal(${originalIndex})" title="Manage student assignments">
                            Manage Students
                        </button>
                    </div>
                </td>
                <td class="text-center">
                    <div class="actions-cell">
                        <button class="btn btn-icon btn-edit" onclick="openEditModal(${originalIndex})" title="Edit Mentor">
                            Edit
                        </button>
                        <button class="btn btn-icon btn-delete" onclick="openDeleteModal(${originalIndex})" title="Delete Mentor">
                            Delete
                        </button>
                    </div>
                </td>
            `;
            mentorTableBody.appendChild(tr);
        });
    }

    updateStats();
}

/* Update Header Stats */
function updateStats() {
    totalMentorCount.textContent = mentors.length;
    
    let totalMentees = 0;
    let totalCap = 0;

    mentors.forEach(m => {
        totalCap += (parseInt(m.maxMembers, 10) || 0);
        totalMentees += (m.mentees ? m.mentees.length : 0);
    });

    totalMenteeCount.textContent = totalMentees;
    totalCapacityCount.textContent = totalCap;
}

/* =========================================================
   Mentee Management Modal
   ========================================================= */
window.openMenteeModal = function(index) {
    const mentor = mentors[index];
    if (!mentor) return;

    currentMenteeMentorIndex = index;
    if (!Array.isArray(mentor.mentees)) {
        mentor.mentees = [];
    }

    menteeModalTitle.textContent = `${mentor.name}`;
    menteeModalSubtitle.textContent = `${mentor.designation}, ${mentor.department} (${mentor.id})`;

    renderMenteeModalDetails();
    menteeModalOverlay.classList.remove("hidden");
};

function renderMenteeModalDetails() {
    if (currentMenteeMentorIndex === null || !mentors[currentMenteeMentorIndex]) return;

    const mentor = mentors[currentMenteeMentorIndex];
    const menteeCount = mentor.mentees ? mentor.mentees.length : 0;
    const max = mentor.maxMembers;
    const percent = Math.min(100, Math.round((menteeCount / max) * 100));

    capacityStatusText.textContent = `Assigned: ${menteeCount} / ${max} Students`;
    capacityPercentText.textContent = `${percent}% Capacity`;
    capacityProgressBar.style.width = `${percent}%`;

    if (menteeCount >= max) {
        capacityProgressBar.classList.add("full");
    } else {
        capacityProgressBar.classList.remove("full");
    }

    menteeTableCount.textContent = menteeCount;
    menteeTableBody.innerHTML = "";

    if (menteeCount === 0) {
        menteeEmptyState.classList.remove("hidden");
    } else {
        menteeEmptyState.classList.add("hidden");
        mentor.mentees.forEach((mentee, mIdx) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${mIdx + 1}</td>
                <td><span class="emp-badge">${escapeHtml(mentee.roll)}</span></td>
                <td><strong>${escapeHtml(mentee.name)}</strong></td>
                <td><span class="dept-badge">${escapeHtml(mentee.sem)}</span></td>
                <td>${escapeHtml(mentee.email)}</td>
                <td class="text-center">
                    <button class="btn btn-icon btn-delete" onclick="removeMentee('${mentor.id}', '${escapeHtml(mentee.roll)}', ${mIdx})" title="Remove Student">
                        Remove
                    </button>
                </td>
            `;
            menteeTableBody.appendChild(tr);
        });
    }
}

async function handleAddMentee(e) {
    e.preventDefault();
    if (currentMenteeMentorIndex === null || !mentors[currentMenteeMentorIndex]) return;

    const mentor = mentors[currentMenteeMentorIndex];
    if (!mentor.mentees) mentor.mentees = [];

    const name = menteeNameInput.value.trim();
    const roll = menteeRollInput.value.trim().toUpperCase();
    const sem = menteeSemInput.value;
    const email = menteeEmailInput.value.trim();

    if (isBackendActive) {
        try {
            const res = await fetch(`${API_URL}?action=add_mentee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mentor_emp_id: mentor.id,
                    roll_no: roll,
                    name,
                    sem,
                    email
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                showToast(data.message || "Failed to assign student", "error");
                return;
            }
            await fetchMentors();
            renderMenteeModalDetails();
        } catch (err) {
            showToast("Server error occurred.", "error");
            return;
        }
    } else {
        if (mentor.mentees.length >= mentor.maxMembers) {
            showToast(`Capacity limit reached (${mentor.maxMembers} students maximum).`, "error");
            return;
        }

        const isDuplicate = mentor.mentees.some(m => m.roll.toUpperCase() === roll);
        if (isDuplicate) {
            showToast(`Student with roll number ${roll} is already assigned to this mentor.`, "error");
            return;
        }

        mentor.mentees.push({ roll, name, sem, email });
        saveLocalMentors();
        renderMenteeModalDetails();
        renderMentors();
    }

    addMenteeForm.reset();
    showToast(`Student ${name} assigned.`);
}

window.removeMentee = async function(mentorEmpId, rollNo, menteeIndex) {
    if (currentMenteeMentorIndex === null || !mentors[currentMenteeMentorIndex]) return;

    if (isBackendActive) {
        try {
            const res = await fetch(`${API_URL}?action=delete_mentee`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mentor_emp_id: mentorEmpId,
                    roll_no: rollNo
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                showToast(data.message || "Failed to remove student", "error");
                return;
            }
            await fetchMentors();
            renderMenteeModalDetails();
            showToast("Student removed.");
        } catch (err) {
            showToast("Server error occurred.", "error");
        }
    } else {
        const mentor = mentors[currentMenteeMentorIndex];
        if (!mentor.mentees || !mentor.mentees[menteeIndex]) return;

        const removed = mentor.mentees.splice(menteeIndex, 1)[0];
        saveLocalMentors();
        renderMenteeModalDetails();
        renderMentors();
        showToast(`Student ${removed.name} removed.`);
    }
};

function closeMenteeModal() {
    menteeModalOverlay.classList.add("hidden");
    currentMenteeMentorIndex = null;
    addMenteeForm.reset();
}

/* =========================================================
   Edit Mentor Modal
   ========================================================= */
window.openEditModal = function(index) {
    const mentor = mentors[index];
    if (!mentor) return;

    editMentorIndex.value = index;
    editMentorName.value = mentor.name;
    editEmpId.value = mentor.id;
    editDepartment.value = mentor.department;
    editDesignation.value = mentor.designation;
    editMaxMembers.value = mentor.maxMembers;
    
    editImageBase64 = mentor.profilePic || "";
    editImgPreview.src = mentor.profilePic || getAvatarPlaceholder(mentor.name);
    editProfilePicInput.value = "";

    editModalOverlay.classList.remove("hidden");
};

function closeEditModal() {
    editModalOverlay.classList.add("hidden");
    editMentorForm.reset();
    editImageBase64 = "";
}

async function handleEditMentorSave(e) {
    e.preventDefault();
    const index = parseInt(editMentorIndex.value, 10);
    if (isNaN(index) || !mentors[index]) return;

    const oldEmpId = mentors[index].id;
    const name = editMentorName.value.trim();
    const empId = editEmpId.value.trim().toUpperCase();
    const department = editDepartment.value;
    const designation = editDesignation.value;
    const maxMembers = parseInt(editMaxMembers.value, 10);
    const profilePic = editImageBase64 || mentors[index].profilePic || getAvatarPlaceholder(name);

    if (maxMembers <= 0) {
        showToast("Student capacity must be greater than 0.", "error");
        return;
    }

    if (isBackendActive) {
        try {
            const res = await fetch(`${API_URL}?action=update_mentor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    old_emp_id: oldEmpId,
                    emp_id: empId,
                    name,
                    department,
                    designation,
                    max_members: maxMembers,
                    profile_pic: profilePic
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                showToast(data.message || "Failed to update mentor", "error");
                return;
            }
            await fetchMentors();
        } catch (err) {
            showToast("Server communication error", "error");
            return;
        }
    } else {
        const isDuplicate = mentors.some((m, idx) => idx !== index && m.id.toUpperCase() === empId);
        if (isDuplicate) {
            showToast(`Employee ID ${empId} is already in use.`, "error");
            return;
        }

        const existingMentees = mentors[index].mentees || [];

        mentors[index] = {
            id: empId,
            name: name,
            department: department,
            designation: designation,
            maxMembers: maxMembers,
            profilePic: profilePic,
            mentees: existingMentees
        };

        saveLocalMentors();
        renderMentors();
    }

    closeEditModal();
    showToast(`Mentor ${name} updated.`);
}

/* =========================================================
   Delete Mentor Modal
   ========================================================= */
window.openDeleteModal = function(index) {
    const mentor = mentors[index];
    if (!mentor) return;

    deleteCandidateIndex = index;
    deleteModalMessage.innerHTML = `Are you sure you want to delete <strong>${escapeHtml(mentor.name)}</strong> (${escapeHtml(mentor.id)}) and all assigned student records?`;
    deleteModalOverlay.classList.remove("hidden");
};

function closeDeleteModal() {
    deleteModalOverlay.classList.add("hidden");
    deleteCandidateIndex = null;
}

async function handleConfirmDelete() {
    if (deleteCandidateIndex === null || !mentors[deleteCandidateIndex]) return;

    const deletedMentor = mentors[deleteCandidateIndex];

    if (isBackendActive) {
        try {
            const res = await fetch(`${API_URL}?action=delete_mentor`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emp_id: deletedMentor.id })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                showToast(data.message || "Failed to delete mentor", "error");
                return;
            }
            await fetchMentors();
        } catch (err) {
            showToast("Server communication error", "error");
            return;
        }
    } else {
        mentors.splice(deleteCandidateIndex, 1);
        saveLocalMentors();
        renderMentors();
    }

    closeDeleteModal();
    showToast(`Mentor ${deletedMentor.name} deleted.`);
}

/* =========================================================
   Utilities
   ========================================================= */
function showToast(message, type = "success") {
    toast.textContent = message;
    if (type === "error") {
        toast.style.backgroundColor = "#dc2626";
        toast.style.borderColor = "#b91c1c";
    } else {
        toast.style.backgroundColor = "#0f172a";
        toast.style.borderColor = "#334155";
    }
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
