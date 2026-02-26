-- TVET Internship Management System Database Backup
-- Generated on 2026-02-26T12:59:46.738Z

USE sql8818175;

-- Data for table students
DELETE FROM students;
INSERT INTO students (student_id, firstname, lastname, email, phone, level) VALUES
(2, 'Jean Claude', 'Niyonzima', 'jean.niyonzima@gmail.com', '+250 788123401', 'L5A BDC'),
(3, 'Diane', 'Mukamana', 'dianemukamana@gmail.com', '+250 788123402', 'L5A SOD'),
(4, 'Sandrine', 'Uwimana', 'sandrine.uwimana@gmail.com', '+250 788123404', 'L5A CSA'),
(5, 'Eric', 'Habimana', 'Habimana@gmail.com', '+250 788123403', 'L4C SOD'),
(6, 'Clarisse', 'Uwera', 'clarisse.uwera@gmail.com', '+250 788123430', 'L5B BDC'),
(7, 'Esperance', 'Mukarugwiza', 'esperance.mukarugwiza@gmail.com', '+250 788123431', 'L4A CSA'),
(8, 'Beatha', 'Nyiramugisha', 'beatha.nyiramugisha@gmail.com', '+250 788123422', 'L5A SOD'),
(9, 'Jean', 'Bosco', 'jean.bosco@gmail.com', '+250 788100300', 'L5 SOD'),
(10, 'Marie', 'Claire', 'marie.claire@gmail.com', '+250 788100301', 'L5 SOD'),
(11, 'Callixte', 'Murenzi', 'callixte.murenzi@gmail.com', '+250 788100302', 'L5 SOD'),
(12, 'Aline', 'Mukashyaka', 'aline.muk@gmail.com', '+250 788100303', 'L4 SOD'),
(13, 'Faustin', 'Twagirimana', 'faustin.twag@gmail.com', '+250 788100304', 'L4 SOD'),
(14, 'Vestine', 'Nyirabageni', 'vestine.ny@gmail.com', '+250 788100305', 'L4 SOD'),
(15, 'Emmanuel', 'Habyarimana', 'emmanuel.h@gmail.com', '+250 788100306', 'L5 CSA'),
(16, 'Solange', 'Umurerwa', 'solange.u@gmail.com', '+250 788100307', 'L5 CSA'),
(17, 'Placide', 'Nshuti', 'placide.n@gmail.com', '+250 788100308', 'L5 CSA'),
(18, 'Donatille', 'Mukandanga', 'donatille.m@gmail.com', '+250 788100309', 'L4 CSA'),
(19, 'Innocent', 'Habimana', 'innocent.h@gmail.com', '+250 788100310', 'L4 CSA'),
(20, 'Therese', 'Uwamaliya', 'therese.u@gmail.com', '+250 788100311', 'L4 CSA'),
(21, 'Pacifique', 'Bizimana', 'pacifique.b@gmail.com', '+250 788100312', 'L5 BDC'),
(22, 'Chantal', 'Ndayisaba', 'chantal.n@gmail.com', '+250 788100313', 'L5 BDC'),
(23, 'Dieudonne', 'Nsengiyumva', 'dieudonne.n@gmail.com', '+250 788100314', 'L5 BDC'),
(24, 'Angelique', 'Mukamana', 'angelique.m@gmail.com', '+250 788100315', 'L4 BDC'),
(25, 'Tharcisse', 'Gatera', 'tharcisse.g@gmail.com', '+250 788100316', 'L4 BDC'),
(26, 'Clementine', 'Maniraguha', 'clementine.m@gmail.com', '+250 788100317', 'L4 BDC'),
(27, 'Francois', 'Hagenimana', 'francois.h@gmail.com', '+250 788100318', 'L3 SOD'),
(28, 'Yvette', 'Iradukunda', 'yvette.i@gmail.com', '+250 788100319', 'L3 SOD'),
(29, 'Gervais', 'Tuyishime', 'gervais.t@gmail.com', '+250 788100320', 'L3 SOD'),
(30, 'Claudine', 'Mugisha', 'claudine.m@gmail.com', '+250 788100321', 'L3 CSA'),
(31, 'Venuste', 'Kwizera', 'venuste.k@gmail.com', '+250 788100322', 'L3 CSA'),
(32, 'Honorine', 'Iyakaremye', 'honorine.i@gmail.com', '+250 788100323', 'L3 CSA'),
(33, 'Valens', 'Niyomugabo', 'valens.n@gmail.com', '+250 788100324', 'L3 BDC'),
(34, 'Florence', 'Nzabamwita', 'florence.n@gmail.com', '+250 788100325', 'L3 BDC'),
(35, 'Theogene', 'Nshimyumuremyi', 'theogene.n@gmail.com', '+250 788100326', 'L3 BDC'),
(36, 'Josiane', 'Kayitare', 'josiane.k@gmail.com', '+250 788100327', 'L5 SOD'),
(37, 'Aloys', 'Kamanzi', 'aloys.k@gmail.com', '+250 788100328', 'L5 SOD'),
(38, 'Esperance', 'Gasana', 'esperance.g@gmail.com', '+250 788100329', 'L5 SOD');

-- Data for table companies
DELETE FROM companies;
INSERT INTO companies (company_id, company_name, address, email, supervisor_name, supervisor_phone) VALUES
(1, 'Rwandascratch', 'Kigali, Rwanda', NULL, 'Theogene Iradukunbda', '0792734752'),
(2, 'Bank of Kigali', 'Kigali, KN 4 St', 'contact@bk.rw', 'Jean Bosco Niyonsaba', '+250 788100200'),
(3, 'MTN Rwanda', 'Kigali, Nyarutarama', 'info@mtn.co.rw', 'Marie Claire Uwimana', '+250 788100201'),
(4, 'I&M Bank Rwanda', 'Kigali, City Tower', 'contact@imbank.rw', 'Callixte Murenzi', '+250 788100202'),
(5, 'Bralirwa', 'Kisenyi, Gisenyi', 'info@bralirwa.rw', 'Aline Mukashyaka', '+250 788100203'),
(6, 'Liquid Intelligent', 'Kigali, UTC Building', 'rwanda@liquid.tech', 'Faustin Twagirimana', '+250 788100204'),
(7, 'Inyange Industries', 'Kigali, Masaka', 'info@inyange.rw', 'Vestine Nyirabageni', '+250 788100205'),
(8, 'Cogebanque', 'Kigali, KN 63 St', 'info@cogebanque.co.rw', 'Emmanuel Habyarimana', '+250 788100206'),
(9, 'CIMERWA', 'Rusizi, Bugarama', 'info@cimerwa.rw', 'Solange Umurerwa', '+250 788100207'),
(10, 'Skol Brewery', 'Kigali, Nzove', 'info@skol.rw', 'Placide Nshuti', '+250 788100208'),
(11, 'RwandAir', 'Kigali, Kanombe', 'info@rwandair.com', 'Donatille Mukandanga', '+250 788100209');

-- Data for table internships
DELETE FROM internships;
INSERT INTO internships (internship_id, student_id, company_id, start_date, end_date, status) VALUES
(2, 2, 2, '2026-02-28', '2026-05-31', 'Not Started'),
(3, 3, 3, '2026-02-28', '2026-05-31', 'Not Started'),
(4, 4, 4, '2026-02-28', '2026-05-31', 'Not Started'),
(5, 5, 5, '2026-02-27', '2026-05-30', 'Ongoing'),
(6, 6, 1, '2026-02-28', '2026-05-31', 'Not Started'),
(7, 7, 2, '2026-02-28', '2026-05-31', 'Not Started'),
(8, 8, 3, '2026-02-28', '2026-05-31', 'Not Started'),
(9, 9, 4, '2026-02-28', '2026-05-31', 'Not Started'),
(10, 10, 5, '2026-02-28', '2026-05-31', 'Not Started'),
(11, 11, 1, '2026-02-28', '2026-05-31', 'Not Started'),
(12, 12, 2, '2026-02-28', '2026-05-31', 'Not Started'),
(13, 13, 3, '2026-02-28', '2026-05-31', 'Not Started'),
(14, 14, 4, '2026-02-28', '2026-05-31', 'Not Started'),
(15, 15, 5, '2026-02-28', '2026-05-31', 'Not Started'),
(16, 16, 1, '2026-02-28', '2026-05-31', 'Not Started'),
(17, 17, 2, '2026-02-28', '2026-05-31', 'Not Started'),
(18, 18, 3, '2026-02-28', '2026-05-31', 'Not Started'),
(19, 19, 4, '2026-02-28', '2026-05-31', 'Not Started'),
(20, 20, 5, '2026-02-28', '2026-05-31', 'Not Started'),
(21, 21, 2, '2026-02-25', '2026-02-27', 'Not Started'),
(22, 35, 4, '2026-02-04', '2026-02-26', 'Not Started');

