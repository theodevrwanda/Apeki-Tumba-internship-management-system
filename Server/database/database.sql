
-- 2️⃣ Create Students Table
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    firstname CHAR(100) NOT NULL,
    lastname CHAR(100) NOT NULL,
    email CHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    level CHAR(20) NOT NULL,

    INDEX idx_student_email (email),
    INDEX idx_student_level (level)
);

-- 3️⃣ Create Companies Table
CREATE TABLE companies (
    company_id INT AUTO_INCREMENT PRIMARY KEY,
    company_name CHAR(100) NOT NULL,
    address CHAR(200) NOT NULL,
    supervisor_name CHAR(100) NOT NULL,
    supervisor_phone VARCHAR(20) NOT NULL,

    INDEX idx_company_name (company_name)
);

-- 4️⃣ Create Internships Table
CREATE TABLE internships (
    internship_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT UNIQUE NOT NULL,
    company_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Not Started', 'Ongoing', 'Completed') DEFAULT 'Not Started',

    INDEX idx_internship_status (status),
    INDEX idx_company_id (company_id),

    CONSTRAINT fk_student
        FOREIGN KEY (student_id)
        REFERENCES students(student_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES companies(company_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);