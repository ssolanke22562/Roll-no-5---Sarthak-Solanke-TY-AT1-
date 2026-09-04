/* =========================================================
   Mentor-Mentee Management System - JavaScript (Task 1 + Mentee Management)
   ========================================================= */

// Default mock data with 5 sample mentees for every mentor
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
let deleteCandidateIndex = null;
let currentMenteeMentorIndex = null;
let addImageBase64 = "";
let editImageBase64 = "";

// DOM Elements - Main Form & Table
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

/* =========================================================
   Initialization
   ========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    loadMentors();
    setupEventListeners();
    renderMentors();
});

// Load from LocalStorage or initialize with default sample data
function loadMentors() {
    const savedData = localStorage.getItem("mentor_system_records");
    if (savedData) {
        try {
            mentors = JSON.parse(savedData);
            // Ensure each mentor has at least 5 sample mentees
            mentors.forEach((m, i) => {
                if (!Array.isArray(m.mentees) || m.mentees.length === 0) {
                    m.mentees = (DEFAULT_MENTORS[i] && DEFAULT_MENTORS[i].mentees) 
                        ? JSON.parse(JSON.stringify(DEFAULT_MENTORS[i].mentees))
                        : [
                            { roll: `2024ST${i+1}01`, name: "Student Alpha", sem: "Sem 5 (TE)", email: "alpha@college.edu" },
                            { roll: `2024ST${i+1}02`, name: "Student Beta", sem: "Sem 5 (TE)", email: "beta@college.edu" },
                            { roll: `2024ST${i+1}03`, name: "Student Gamma", sem: "Sem 5 (TE)", email: "gamma@college.edu" },
                            { roll: `2024ST${i+1}04`, name: "Student Delta", sem: "Sem 5 (TE)", email: "delta@college.edu" },
                            { roll: `2024ST${i+1}05`, name: "Student Epsilon", sem: "Sem 5 (TE)", email: "epsilon@college.edu" }
                        ];
                }
            });
            saveMentorsToStorage();
        } catch (e) {
            console.error("Failed to parse localStorage data, using defaults.", e);
            mentors = JSON.parse(JSON.stringify(DEFAULT_MENTORS));
            saveMentorsToStorage();
        }
    } else {
        mentors = JSON.parse(JSON.stringify(DEFAULT_MENTORS));
        saveMentorsToStorage();
    }
}

function saveMentorsToStorage() {
    localStorage.setItem("mentor_system_records", JSON.stringify(mentors));
    updateStats();
}

/* =========================================================
   Event Listeners
   ========================================================= */
function setupEventListeners() {
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

    // Close Modals on background click
    window.addEventListener("click", (e) => {
        if (e.target === editModalOverlay) closeEditModal();
        if (e.target === deleteModalOverlay) closeDeleteModal();
        if (e.target === menteeModalOverlay) closeMenteeModal();
    });
}

/* =========================================================
   Image Helper (FileReader to Base64)
   ========================================================= */
function handleImageUpload(file, callback) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
        showToast("Please upload a valid image file", "error");
        return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
        callback(event.target.result);
    };
    reader.readAsDataURL(file);
}

// Generates fallback avatar with initials or placeholder
function getAvatarPlaceholder(name) {
    const initials = name
        ? name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
        : "M";
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=2563eb&color=fff&bold=true`;
}

/* =========================================================
   2. Add Mentor Handler
   ========================================================= */
function handleAddMentor(e) {
    e.preventDefault();

    const name = document.getElementById("mentorName").value.trim();
    const empId = document.getElementById("empId").value.trim().toUpperCase();
    const department = document.getElementById("department").value;
    const designation = document.getElementById("designation").value;
    const maxMembers = parseInt(document.getElementById("maxMembers").value, 10);

    // Validation: Check duplicate Employee ID
    const isDuplicate = mentors.some(m => m.id.toUpperCase() === empId);
    if (isDuplicate) {
        showToast(`Employee ID "${empId}" is already assigned to another mentor!`, "error");
        return;
    }

    if (maxMembers <= 0) {
        showToast("Maximum members capacity must be at least 1.", "error");
        return;
    }

    const newMentor = {
        id: empId,
        name: name,
        department: department,
        designation: designation,
        maxMembers: maxMembers,
        profilePic: addImageBase64 || getAvatarPlaceholder(name),
        mentees: []
    };

    mentors.unshift(newMentor); // Add to the top of the list
    saveMentorsToStorage();
    renderMentors();

    // Reset Form
    addMentorForm.reset();
    addImageBase64 = "";
    addImgPreview.src = "";
    addImgPreview.classList.add("hidden");
    addImgPlaceholder.classList.remove("hidden");

    showToast(`Mentor "${name}" added successfully!`);
}

/* =========================================================
   3. Render Mentor List Table
   ========================================================= */
function renderMentors() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedDept = deptFilter.value;

    // Filter mentors based on search & department
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
                            👥 ${menteeCount} / ${mentor.maxMembers}
                        </span>
                        <button class="btn-mentees" onclick="openMenteeModal(${originalIndex})" title="Manage assigned mentees">
                            ⚙️ View / Add Mentees
                        </button>
                    </div>
                </td>
                <td class="text-center">
                    <div class="actions-cell">
                        <button class="btn btn-icon btn-edit" onclick="openEditModal(${originalIndex})" title="Edit Mentor">
                            ✏️ Edit
                        </button>
                        <button class="btn btn-icon btn-delete" onclick="openDeleteModal(${originalIndex})" title="Delete Mentor">
                            🗑️ Delete
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
   Mentee Management Modal (View List & Add Mentee)
   ========================================================= */
window.openMenteeModal = function(index) {
    const mentor = mentors[index];
    if (!mentor) return;

    currentMenteeMentorIndex = index;
    if (!Array.isArray(mentor.mentees)) {
        mentor.mentees = [];
    }

    menteeModalTitle.textContent = `Mentees for ${mentor.name}`;
    menteeModalSubtitle.textContent = `${mentor.designation} &bull; ${mentor.department} (${mentor.id})`;

    renderMenteeModalDetails();
    menteeModalOverlay.classList.remove("hidden");
};

function renderMenteeModalDetails() {
    if (currentMenteeMentorIndex === null || !mentors[currentMenteeMentorIndex]) return;

    const mentor = mentors[currentMenteeMentorIndex];
    const menteeCount = mentor.mentees ? mentor.mentees.length : 0;
    const max = mentor.maxMembers;
    const percent = Math.min(100, Math.round((menteeCount / max) * 100));

    capacityStatusText.textContent = `Assigned: ${menteeCount} / ${max} Mentees`;
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
                <td><strong>${mIdx + 1}</strong></td>
                <td><span class="emp-badge">${escapeHtml(mentee.roll)}</span></td>
                <td><strong>${escapeHtml(mentee.name)}</strong></td>
                <td><span class="dept-badge" style="background:#f1f5f9;color:#334155;">${escapeHtml(mentee.sem)}</span></td>
                <td>${escapeHtml(mentee.email)}</td>
                <td class="text-center">
                    <button class="btn btn-icon btn-delete" onclick="removeMentee(${mIdx})" title="Remove Mentee">
                        🗑️ Remove
                    </button>
                </td>
            `;
            menteeTableBody.appendChild(tr);
        });
    }
}

function handleAddMentee(e) {
    e.preventDefault();
    if (currentMenteeMentorIndex === null || !mentors[currentMenteeMentorIndex]) return;

    const mentor = mentors[currentMenteeMentorIndex];
    if (!mentor.mentees) mentor.mentees = [];

    // Check capacity
    if (mentor.mentees.length >= mentor.maxMembers) {
        showToast(`Cannot add mentee! Mentor capacity of ${mentor.maxMembers} is already full.`, "error");
        return;
    }

    const name = menteeNameInput.value.trim();
    const roll = menteeRollInput.value.trim().toUpperCase();
    const sem = menteeSemInput.value;
    const email = menteeEmailInput.value.trim();

    // Check duplicate roll number across this mentor's mentees
    const isDuplicate = mentor.mentees.some(m => m.roll.toUpperCase() === roll);
    if (isDuplicate) {
        showToast(`Mentee with Roll No "${roll}" is already assigned to this mentor!`, "error");
        return;
    }

    mentor.mentees.push({ roll, name, sem, email });
    saveMentorsToStorage();
    renderMenteeModalDetails();
    renderMentors(); // Update background table

    addMenteeForm.reset();
    showToast(`Mentee "${name}" assigned successfully!`);
}

window.removeMentee = function(menteeIndex) {
    if (currentMenteeMentorIndex === null || !mentors[currentMenteeMentorIndex]) return;

    const mentor = mentors[currentMenteeMentorIndex];
    if (!mentor.mentees || !mentor.mentees[menteeIndex]) return;

    const removed = mentor.mentees.splice(menteeIndex, 1)[0];
    saveMentorsToStorage();
    renderMenteeModalDetails();
    renderMentors();
    showToast(`Mentee "${removed.name}" removed.`);
};

function closeMenteeModal() {
    menteeModalOverlay.classList.add("hidden");
    currentMenteeMentorIndex = null;
    addMenteeForm.reset();
}

/* =========================================================
   4. Edit Popup Modal
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
    editProfilePicInput.value = ""; // Clear file input

    editModalOverlay.classList.remove("hidden");
};

function closeEditModal() {
    editModalOverlay.classList.add("hidden");
    editMentorForm.reset();
    editImageBase64 = "";
}

function handleEditMentorSave(e) {
    e.preventDefault();
    const index = parseInt(editMentorIndex.value, 10);
    if (isNaN(index) || !mentors[index]) return;

    const name = editMentorName.value.trim();
    const empId = editEmpId.value.trim().toUpperCase();
    const department = editDepartment.value;
    const designation = editDesignation.value;
    const maxMembers = parseInt(editMaxMembers.value, 10);

    // Validation: Check duplicate Employee ID among other mentors
    const isDuplicate = mentors.some((m, idx) => idx !== index && m.id.toUpperCase() === empId);
    if (isDuplicate) {
        showToast(`Employee ID "${empId}" is already taken by another mentor!`, "error");
        return;
    }

    if (maxMembers <= 0) {
        showToast("Maximum members must be greater than 0.", "error");
        return;
    }

    // Preserve existing mentees list
    const existingMentees = mentors[index].mentees || [];

    // Update object
    mentors[index] = {
        id: empId,
        name: name,
        department: department,
        designation: designation,
        maxMembers: maxMembers,
        profilePic: editImageBase64 || mentors[index].profilePic || getAvatarPlaceholder(name),
        mentees: existingMentees
    };

    saveMentorsToStorage();
    renderMentors();
    closeEditModal();
    showToast(`Mentor record for "${name}" updated successfully!`);
}

/* =========================================================
   5. Delete Entry Popup & Logic
   ========================================================= */
window.openDeleteModal = function(index) {
    const mentor = mentors[index];
    if (!mentor) return;

    deleteCandidateIndex = index;
    deleteModalMessage.innerHTML = `Are you sure you want to delete <strong>"${escapeHtml(mentor.name)}"</strong> (${escapeHtml(mentor.id)}) and all their assigned mentees?`;
    deleteModalOverlay.classList.remove("hidden");
};

function closeDeleteModal() {
    deleteModalOverlay.classList.add("hidden");
    deleteCandidateIndex = null;
}

function handleConfirmDelete() {
    if (deleteCandidateIndex === null || !mentors[deleteCandidateIndex]) return;

    const deletedMentor = mentors.splice(deleteCandidateIndex, 1)[0];
    saveMentorsToStorage();
    renderMentors();
    closeDeleteModal();
    showToast(`Mentor "${deletedMentor.name}" was removed successfully.`);
}

/* =========================================================
   Utilities
   ========================================================= */
function showToast(message, type = "success") {
    toast.textContent = message;
    if (type === "error") {
        toast.style.backgroundColor = "#ef4444";
    } else {
        toast.style.backgroundColor = "#0f172a";
    }
    toast.classList.remove("hidden");

    setTimeout(() => {
        toast.classList.add("hidden");
    }, 3200);
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
