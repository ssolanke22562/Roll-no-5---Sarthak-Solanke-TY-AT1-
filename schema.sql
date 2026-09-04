-- MARG - Mentorship & Academic Relationship Gateway
-- Database Schema: `mentor_mentee_db`

CREATE DATABASE IF NOT EXISTS `mentor_mentee_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `mentor_mentee_db`;

-- 1. Mentors Table
CREATE TABLE IF NOT EXISTS `mentors` (
    `id` INT AUTO-INCREMENT PRIMARY KEY,
    `emp_id` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `department` VARCHAR(100) NOT NULL,
    `designation` VARCHAR(100) NOT NULL,
    `max_members` INT NOT NULL DEFAULT 15,
    `profile_pic` LONGTEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Mentees (Students) Table
CREATE TABLE IF NOT EXISTS `mentees` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `mentor_emp_id` VARCHAR(50) NOT NULL,
    `roll_no` VARCHAR(50) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `semester` VARCHAR(50) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`mentor_emp_id`) REFERENCES `mentors`(`emp_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY `unique_student_per_mentor` (`mentor_emp_id`, `roll_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Seed Data
INSERT INTO `mentors` (`emp_id`, `name`, `department`, `designation`, `max_members`, `profile_pic`)
VALUES 
('EMP-1001', 'Dr. Arvind Kulkarni', 'Computer Engineering', 'Professor & Head', 20, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('EMP-1045', 'Prof. Sunita Rao', 'Information Technology', 'Associate Professor', 15, 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
('EMP-2088', 'Dr. Vikram Deshmukh', 'Electronics & Telecom', 'Assistant Professor', 12, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

INSERT INTO `mentees` (`mentor_emp_id`, `roll_no`, `name`, `semester`, `email`)
VALUES
('EMP-1001', '2024CE101', 'Aarav Sharma', 'Sem 5 (TE)', 'aarav.sharma@college.edu'),
('EMP-1001', '2024CE102', 'Pooja Patel', 'Sem 5 (TE)', 'pooja.patel@college.edu'),
('EMP-1001', '2024CE103', 'Rohan Mehta', 'Sem 5 (TE)', 'rohan.mehta@college.edu'),
('EMP-1001', '2024CE104', 'Ananya Iyer', 'Sem 5 (TE)', 'ananya.iyer@college.edu'),
('EMP-1001', '2024CE105', 'Kunal Shah', 'Sem 5 (TE)', 'kunal.shah@college.edu'),
('EMP-1045', '2024IT201', 'Nikhil Verma', 'Sem 5 (TE)', 'nikhil.verma@college.edu'),
('EMP-1045', '2024IT202', 'Sneha Nair', 'Sem 5 (TE)', 'sneha.nair@college.edu'),
('EMP-1045', '2024IT203', 'Aditya Joshi', 'Sem 5 (TE)', 'aditya.joshi@college.edu'),
('EMP-1045', '2024IT204', 'Meera Gupta', 'Sem 5 (TE)', 'meera.gupta@college.edu'),
('EMP-1045', '2024IT205', 'Varun Kapse', 'Sem 5 (TE)', 'varun.kapse@college.edu'),
('EMP-2088', '2024EX301', 'Siddharth Rao', 'Sem 5 (TE)', 'siddharth.rao@college.edu'),
('EMP-2088', '2024EX302', 'Tanvi Sawant', 'Sem 5 (TE)', 'tanvi.sawant@college.edu'),
('EMP-2088', '2024EX303', 'Gaurav More', 'Sem 5 (TE)', 'gaurav.more@college.edu'),
('EMP-2088', '2024EX304', 'Isha Jain', 'Sem 5 (TE)', 'isha.jain@college.edu'),
('EMP-2088', '2024EX305', 'Yash Kulkarni', 'Sem 5 (TE)', 'yash.kulkarni@college.edu')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
