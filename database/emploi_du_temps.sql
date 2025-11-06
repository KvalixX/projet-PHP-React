-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 06 nov. 2025 à 15:44
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `emploi_du_temps`
--

-- --------------------------------------------------------

--
-- Structure de la table `class_sessions`
--

CREATE TABLE `class_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `module_id` bigint(20) UNSIGNED NOT NULL,
  `professor_id` bigint(20) UNSIGNED NOT NULL,
  `group_id` bigint(20) UNSIGNED NOT NULL,
  `room_id` bigint(20) UNSIGNED NOT NULL,
  `day` enum('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi') NOT NULL,
  `start_time` time NOT NULL,
  `duration` int(11) NOT NULL,
  `type` enum('Cours','TD','TP') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `class_sessions`
--

INSERT INTO `class_sessions` (`id`, `module_id`, `professor_id`, `group_id`, `room_id`, `day`, `start_time`, `duration`, `type`) VALUES
(1, 1, 1, 1, 1, 'Lundi', '08:00:00', 120, 'Cours'),
(2, 2, 3, 1, 5, 'Lundi', '10:30:00', 120, 'TD'),
(3, 3, 1, 2, 3, 'Lundi', '14:00:00', 180, 'TP'),
(4, 4, 2, 4, 2, 'Lundi', '08:00:00', 120, 'Cours'),
(5, 1, 1, 1, 5, 'Mardi', '08:00:00', 120, 'TD'),
(6, 5, 4, 5, 1, 'Mardi', '10:30:00', 120, 'Cours'),
(7, 6, 3, 3, 6, 'Mardi', '14:00:00', 120, 'Cours'),
(8, 2, 3, 1, 4, 'Mercredi', '08:00:00', 180, 'TP'),
(9, 3, 1, 2, 7, 'Mercredi', '14:00:00', 120, 'TD'),
(10, 4, 5, 4, 5, 'Jeudi', '10:30:00', 120, 'TD'),
(11, 1, 1, 1, 3, 'Jeudi', '14:00:00', 180, 'TP'),
(12, 5, 4, 5, 6, 'Vendredi', '08:00:00', 120, 'TD'),
(13, 6, 3, 3, 4, 'Vendredi', '10:30:00', 180, 'TP');

-- --------------------------------------------------------

--
-- Structure de la table `groups`
--

CREATE TABLE `groups` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `level` varchar(100) NOT NULL,
  `student_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `groups`
--

INSERT INTO `groups` (`id`, `name`, `level`, `student_count`) VALUES
(1, 'CS-L3-A', 'License 3', 45),
(2, 'CS-L3-B', 'License 3', 42),
(3, 'CS-M1-A', 'Master 1', 35),
(4, 'MATH-L2-A', 'License 2', 50),
(5, 'PHYS-L3-A', 'License 3', 38);

-- --------------------------------------------------------

--
-- Structure de la table `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `code` varchar(50) NOT NULL,
  `hours` int(11) NOT NULL,
  `color` varchar(7) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `modules`
--

INSERT INTO `modules` (`id`, `name`, `code`, `hours`, `color`) VALUES
(1, 'Algorithms & Data Structures', 'CS301', 48, '#3B82F6'),
(2, 'Database Systems', 'CS302', 42, '#10B981'),
(3, 'Web Development', 'CS303', 45, '#F59E0B'),
(4, 'Linear Algebra', 'MATH201', 36, '#8B5CF6'),
(5, 'Quantum Physics', 'PHYS301', 40, '#EF4444'),
(6, 'Software Engineering', 'CS304', 38, '#06B6D4');

-- --------------------------------------------------------

--
-- Structure de la table `professors`
--

CREATE TABLE `professors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `department` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `professors`
--

INSERT INTO `professors` (`id`, `name`, `email`, `department`) VALUES
(1, 'Dr. Sarah Johnson', 'sarah.j@university.edu', 'Computer Science'),
(2, 'Prof. Michael Chen', 'michael.c@university.edu', 'Mathematics'),
(3, 'Dr. Emma Wilson', 'emma.w@university.edu', 'Computer Science'),
(4, 'Prof. David Brown', 'david.b@university.edu', 'Physics'),
(5, 'Dr. Lisa Anderson', 'lisa.a@university.edu', 'Mathematics');

-- --------------------------------------------------------

--
-- Structure de la table `rooms`
--

CREATE TABLE `rooms` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `type` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `rooms`
--

INSERT INTO `rooms` (`id`, `name`, `capacity`, `type`) VALUES
(1, 'Amphi A', 200, 'Amphitheatre'),
(2, 'Amphi B', 150, 'Amphitheatre'),
(3, 'Lab 101', 30, 'Lab'),
(4, 'Lab 102', 30, 'Lab'),
(5, 'Room 201', 40, 'Classroom'),
(6, 'Room 202', 40, 'Classroom'),
(7, 'Room 301', 35, 'Classroom');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `role` enum('admin','professor','student') NOT NULL DEFAULT 'admin',
  `group_id` bigint(20) UNSIGNED DEFAULT NULL,
  `professor_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `role`, `group_id`, `professor_id`) VALUES
(1, 'Khalil Laknifli', 'khalil@univ.ma', NULL, '$2y$12$ukiqLTLjhwRGAcb5DtnYr.uk42/Lb8OkUk.Kqrg8gjDpJ.WVIfhGq', NULL, '2025-11-05 16:33:02', '2025-11-05 16:33:02', 'admin', NULL, NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `class_sessions`
--
ALTER TABLE `class_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_sessions_module_id_foreign` (`module_id`),
  ADD KEY `class_sessions_professor_id_foreign` (`professor_id`),
  ADD KEY `class_sessions_group_id_foreign` (`group_id`),
  ADD KEY `class_sessions_room_id_foreign` (`room_id`);

--
-- Index pour la table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `modules_code_unique` (`code`);

--
-- Index pour la table `professors`
--
ALTER TABLE `professors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `professors_email_unique` (`email`);

--
-- Index pour la table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rooms_name_unique` (`name`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `class_sessions`
--
ALTER TABLE `class_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `professors`
--
ALTER TABLE `professors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `class_sessions`
--
ALTER TABLE `class_sessions`
  ADD CONSTRAINT `class_sessions_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `class_sessions_module_id_foreign` FOREIGN KEY (`module_id`) REFERENCES `modules` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `class_sessions_professor_id_foreign` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `class_sessions_room_id_foreign` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
