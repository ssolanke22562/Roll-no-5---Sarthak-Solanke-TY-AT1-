<?php
/**
 * MARG - Mentorship & Academic Relationship Gateway
 * REST API Endpoints
 */

// Enable CORS and JSON Response headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

// Helper to read JSON request body or POST form data
function getRequestData() {
    $json = file_get_contents('php://input');
    if (!empty($json)) {
        $decoded = json_decode($json, true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return $_POST;
}

$action = $_GET['action'] ?? '';
$data = getRequestData();

switch ($action) {
    
    // ==========================================
    // 1. GET ALL MENTORS AND ASSIGNED MENTEES
    // ==========================================
    case 'get_mentors':
        try {
            $stmtMentors = $pdo->query("SELECT * FROM `mentors` ORDER BY `id` DESC");
            $mentorsList = $stmtMentors->fetchAll();

            $stmtMentees = $pdo->query("SELECT * FROM `mentees` ORDER BY `id` ASC");
            $allMentees = $stmtMentees->fetchAll();

            // Group mentees by mentor_emp_id
            $menteesByMentor = [];
            foreach ($allMentees as $m) {
                $menteesByMentor[$m['mentor_emp_id']][] = [
                    'id' => (int)$m['id'],
                    'roll' => $m['roll_no'],
                    'name' => $m['name'],
                    'sem' => $m['semester'],
                    'email' => $m['email']
                ];
            }

            // Format response array
            $responseMentors = [];
            foreach ($mentorsList as $mentor) {
                $empId = $mentor['emp_id'];
                $responseMentors[] = [
                    'id' => $empId,
                    'db_id' => (int)$mentor['id'],
                    'name' => $mentor['name'],
                    'department' => $mentor['department'],
                    'designation' => $mentor['designation'],
                    'maxMembers' => (int)$mentor['max_members'],
                    'profilePic' => $mentor['profile_pic'] ?? '',
                    'mentees' => $menteesByMentor[$empId] ?? []
                ];
            }

            echo json_encode([
                'success' => true,
                'mentors' => $responseMentors
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // ==========================================
    // 2. ADD MENTOR
    // ==========================================
    case 'add_mentor':
        $name = trim($data['name'] ?? '');
        $empId = strtoupper(trim($data['emp_id'] ?? $data['id'] ?? ''));
        $dept = trim($data['department'] ?? '');
        $designation = trim($data['designation'] ?? '');
        $maxMembers = (int)($data['max_members'] ?? $data['maxMembers'] ?? 15);
        $profilePic = trim($data['profile_pic'] ?? $data['profilePic'] ?? '');

        if (empty($name) || empty($empId) || empty($dept) || empty($designation) || $maxMembers <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
            exit;
        }

        try {
            // Check for duplicate emp_id
            $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM `mentors` WHERE UPPER(`emp_id`) = ?");
            $checkStmt->execute([$empId]);
            if ($checkStmt->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => "Employee ID $empId already exists."]);
                exit;
            }

            $insertStmt = $pdo->prepare("
                INSERT INTO `mentors` (`emp_id`, `name`, `department`, `designation`, `max_members`, `profile_pic`)
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $insertStmt->execute([$empId, $name, $dept, $designation, $maxMembers, $profilePic]);

            echo json_encode([
                'success' => true,
                'message' => "Mentor $name added successfully."
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // ==========================================
    // 3. UPDATE MENTOR
    // ==========================================
    case 'update_mentor':
        $oldEmpId = strtoupper(trim($data['old_emp_id'] ?? $data['old_id'] ?? ''));
        $empId = strtoupper(trim($data['emp_id'] ?? $data['id'] ?? ''));
        $name = trim($data['name'] ?? '');
        $dept = trim($data['department'] ?? '');
        $designation = trim($data['designation'] ?? '');
        $maxMembers = (int)($data['max_members'] ?? $data['maxMembers'] ?? 15);
        $profilePic = trim($data['profile_pic'] ?? $data['profilePic'] ?? '');

        if (empty($oldEmpId) || empty($empId) || empty($name) || empty($dept) || empty($designation) || $maxMembers <= 0) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'All required fields must be filled.']);
            exit;
        }

        try {
            // Check if new emp_id already belongs to a different mentor
            if ($oldEmpId !== $empId) {
                $checkStmt = $pdo->prepare("SELECT COUNT(*) FROM `mentors` WHERE UPPER(`emp_id`) = ?");
                $checkStmt->execute([$empId]);
                if ($checkStmt->fetchColumn() > 0) {
                    http_response_code(409);
                    echo json_encode(['success' => false, 'message' => "Employee ID $empId already in use."]);
                    exit;
                }
            }

            $updateStmt = $pdo->prepare("
                UPDATE `mentors` 
                SET `emp_id` = ?, `name` = ?, `department` = ?, `designation` = ?, `max_members` = ?, `profile_pic` = ?
                WHERE UPPER(`emp_id`) = ?
            ");
            $updateStmt->execute([$empId, $name, $dept, $designation, $maxMembers, $profilePic, $oldEmpId]);

            echo json_encode([
                'success' => true,
                'message' => "Mentor $name updated successfully."
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // ==========================================
    // 4. DELETE MENTOR
    // ==========================================
    case 'delete_mentor':
        $empId = strtoupper(trim($data['emp_id'] ?? $data['id'] ?? ''));

        if (empty($empId)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Employee ID is required.']);
            exit;
        }

        try {
            $delStmt = $pdo->prepare("DELETE FROM `mentors` WHERE UPPER(`emp_id`) = ?");
            $delStmt->execute([$empId]);

            echo json_encode([
                'success' => true,
                'message' => "Mentor record deleted."
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // ==========================================
    // 5. ASSIGN MENTEE (STUDENT)
    // ==========================================
    case 'add_mentee':
        $mentorEmpId = strtoupper(trim($data['mentor_emp_id'] ?? ''));
        $roll = strtoupper(trim($data['roll'] ?? $data['roll_no'] ?? ''));
        $name = trim($data['name'] ?? '');
        $sem = trim($data['sem'] ?? $data['semester'] ?? '');
        $email = trim($data['email'] ?? '');

        if (empty($mentorEmpId) || empty($roll) || empty($name) || empty($sem) || empty($email)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'All student fields are required.']);
            exit;
        }

        try {
            // Verify mentor exists and get capacity
            $mStmt = $pdo->prepare("SELECT `max_members` FROM `mentors` WHERE UPPER(`emp_id`) = ?");
            $mStmt->execute([$mentorEmpId]);
            $mentor = $mStmt->fetch();

            if (!$mentor) {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Mentor not found.']);
                exit;
            }

            // Check current student count
            $cStmt = $pdo->prepare("SELECT COUNT(*) FROM `mentees` WHERE UPPER(`mentor_emp_id`) = ?");
            $cStmt->execute([$mentorEmpId]);
            $currentCount = $cStmt->fetchColumn();

            if ($currentCount >= $mentor['max_members']) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => "Capacity reached ({$mentor['max_members']} students maximum)."]);
                exit;
            }

            // Check duplicate roll number for this mentor
            $rStmt = $pdo->prepare("SELECT COUNT(*) FROM `mentees` WHERE UPPER(`mentor_emp_id`) = ? AND UPPER(`roll_no`) = ?");
            $rStmt->execute([$mentorEmpId, $roll]);
            if ($rStmt->fetchColumn() > 0) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => "Student with roll number $roll is already assigned to this mentor."]);
                exit;
            }

            // Insert mentee
            $insStmt = $pdo->prepare("
                INSERT INTO `mentees` (`mentor_emp_id`, `roll_no`, `name`, `semester`, `email`)
                VALUES (?, ?, ?, ?, ?)
            ");
            $insStmt->execute([$mentorEmpId, $roll, $name, $sem, $email]);

            echo json_encode([
                'success' => true,
                'message' => "Student $name assigned successfully."
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // ==========================================
    // 6. DELETE MENTEE (STUDENT)
    // ==========================================
    case 'delete_mentee':
        $mentorEmpId = strtoupper(trim($data['mentor_emp_id'] ?? ''));
        $roll = strtoupper(trim($data['roll'] ?? $data['roll_no'] ?? ''));

        if (empty($mentorEmpId) || empty($roll)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Mentor ID and Student Roll Number are required.']);
            exit;
        }

        try {
            $delStmt = $pdo->prepare("DELETE FROM `mentees` WHERE UPPER(`mentor_emp_id`) = ? AND UPPER(`roll_no`) = ?");
            $delStmt->execute([$mentorEmpId, $roll]);

            echo json_encode([
                'success' => true,
                'message' => "Student removed."
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Invalid API action requested.']);
        break;
}
