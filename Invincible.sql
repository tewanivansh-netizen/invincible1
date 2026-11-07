CREATE DATABASE  IF NOT EXISTS `invincible` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `invincible`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: invincible
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(150) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'vanshtewani@gmail.com','vansh19'),(2,'hetvipatel@gmail.com','hetvi16');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking_participants`
--

DROP TABLE IF EXISTS `booking_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_participants` (
  `participant_id` int NOT NULL AUTO_INCREMENT,
  `booking_id` int NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  PRIMARY KEY (`participant_id`),
  KEY `booking_id` (`booking_id`),
  CONSTRAINT `booking_participants_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_participants`
--

LOCK TABLES `booking_participants` WRITE;
/*!40000 ALTER TABLE `booking_participants` DISABLE KEYS */;
INSERT INTO `booking_participants` VALUES (26,21,'Vansh','Tewani','09403446214','2005-12-17','Male'),(27,21,'Richard','Brandson','8988987667','2004-05-15','Male'),(28,21,'Stephen','Hawkins','9921414214','1998-11-25','Male'),(39,25,'Vansh','Tewani','9403446214','2005-12-19','Male'),(52,28,'Hetvi ','Patel','2345768901','2005-06-13','Female'),(53,28,'Karm','Patel','9456789012','2007-01-01','Male'),(54,29,'Richard','Brandson','8988987667','2004-05-15','Male'),(55,29,'Jay','Dolwani','8087526738','2005-03-31','Male'),(56,30,'Honey ','Singh','1234567890','2002-10-26','Male'),(57,30,'Vansh','Tewani','9403446214','2005-12-19','Male'),(59,31,'Atharva','Joshi','9654758101','2005-04-10','Male'),(60,31,'Arnav','Joshi','9700664421','2012-03-26','Male'),(61,32,'hetvi ','patel','0987654321','2005-05-16','Female'),(62,32,'ahad','shaikh','9087654321','2004-10-05','Male'),(65,34,'0','0','0','2005-12-19','Male'),(66,35,'0','0','0','2012-11-03','Male');
/*!40000 ALTER TABLE `booking_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL,
  `event_id` int NOT NULL,
  `participants_count` int NOT NULL,
  `booked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`booking_id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (21,'7a4d035f-5ebc-4f01-880f-56d99fba1409',21,2,'2025-09-04 09:46:02'),(25,'ef118885-e6c2-417a-ad48-0becdd81dcb6',14,1,'2025-10-10 09:40:38'),(28,'5a9d875d-9a21-4f22-b0c3-545321e8c80e',14,1,'2025-10-13 03:50:33'),(29,'7a4d035f-5ebc-4f01-880f-56d99fba1409',3,1,'2025-10-14 08:08:54'),(30,'ef118885-e6c2-417a-ad48-0becdd81dcb6',1,1,'2025-11-03 06:22:41'),(31,'5a9d875d-9a21-4f22-b0c3-545321e8c80e',2,1,'2025-11-03 07:15:42'),(32,'ef118885-e6c2-417a-ad48-0becdd81dcb6',2,1,'2025-11-04 05:47:18'),(34,'ef118885-e6c2-417a-ad48-0becdd81dcb6',1,1,'2025-11-04 07:56:15'),(35,'ef118885-e6c2-417a-ad48-0becdd81dcb6',1,1,'2025-11-04 07:58:37');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `tagline` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `duration` varchar(100) DEFAULT NULL,
  `difficulty` varchar(100) DEFAULT NULL,
  `age_group` varchar(100) DEFAULT NULL,
  `altitude` varchar(50) DEFAULT NULL,
  `price` int DEFAULT NULL,
  `description` text,
  `event_date` date DEFAULT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Explore & Adore: Marvellous Matheran','Inviting you to play in the lap of Mother Nature!','/images/Events/Matheran.jpg','3 days / 2 nights','Easy','12-45','2,600 ft',3999,'Matheran is the smallest hill station in India, located in Maharashtra. This eco-sensitive region is Asia’s only automobile-free hill station. Walk through red soil trails and enjoy stunning valley views!','2025-11-30'),(2,'Kerela Calling','Venice of the East!','/images/Events/Kerela.jpg','6 days / 5 nights','Easy','8-40','6,100 ft',9999,'Kerala is called the God’s own country for a reason. From the serene backwaters of Alleppey to the beautiful beaches of Varkala, experience a peaceful yet vibrant 3-day escape.','2025-11-25'),(3,'Magical Maharashtra','Unveil the mysterious treks of Maharashtra!','/images/Events/Maharashtra.jpg','3 days / 2 nights','Easy to Moderate','12-35','900 ft',3900,'In this Event, Participants can experience Magical Maharashtra with Dramatic Beauty of Dang.','2025-12-10'),(4,'Mt Jagatsukh Expedition','Promoting No Drugs Campaign','/images/Events/jagatsukh_expedition.jpg','8 days / 7 nights','Moderate','16-40','16,580 ft',15000,'Jagatsukh peak is the most famous place for trekking in India situated in Kullu district, Himachal Pradesh. The place is no less than a paradise for trekkers. This panoramic views will hit different to the eyes. Mt. Jagatsukh peak is situated at 5050 metres in kullu district, Himachal Pradesh. Mt. Jagatsukh peak is an arduous trek but the trail chosen by Invincible is moderate and decorated with varied scenic views.','2025-11-16'),(5,'Saputara Family Camp','Saputara Family Camp','/images/Events/Saputara.jpg','3 days / 2 nights','Easy','8-60','3,000 ft',3300,'Nestled in the lush Sahyadri range of the Dang district, Saputara stands at an elevation of 1,081 meters above sea level. With the first rain of the season, this charming hill station transforms into a paradise of rolling greenery, cascading waterfalls, and lively streams. Our Saputara Family Camp offers the perfect escape into these stunning hills. Participants will experience the joy of living close to nature in comfortable tents, explore local attractions, and embark on invigorating hikes to nearby hilltops.','2025-12-05'),(6,'Vaarso Cycling Expedition','Ride back to our roots!','/images/Events/Vaarso_cycling.jpg','5 days / 4 nights','Moderate','14-35','0 ft',999,'The Vaarso Cycling Expedition is a 500 km journey curated to help youth connect with the rich heritage and culture of Gujarat. The route covers important locations including Ahmedabad, Palanpur, Mt. Abu, Ambaji, Vadnagar, and returns to Ahmedabad, passing through several historical and cultural sites along the way. This cycling expedition is not just about distance—it is about discovering the legacy of our land. Participants will get a chance to explore ancient temples, old towns, and stories from Gujarat’s past, while also promoting healthy living and sustainable travel. The expedition aims to inspire young people to understand and take pride in our cultural roots. It offers a meaningful platform for learning, self-discovery, and teamwork, all through the spirit of adventure. We invite passionate and energetic youth to be part of this unique experience — to ride, learn, and carry the message of heritage forward. ','2025-12-16'),(14,'Snow Trekking in Manali','Winter Snow Trek','/images/Events/1756460509748.jpg','8 days / 7 nights','Easy','12-35','9500 ft',8700,'Snow Trekking in Manali is an elite initiative by Invincible NGO which mainly targets youngsters and promotes them into less explored field of Winter Trekking','2025-10-22'),(21,'The Leh Ladakh Road Trip','A Journey Towards Heaven & back!','/images/Events/1756561138521.jpg','15 days / 14 nights','Easy to Moderate','15-35 years','17,582 ft',27500,'The Ladakh capital city of Leh lies near the eastern parts of Jammu and Kashmir, on the crossroads of the historic \'Silk Route\' from Sinkiang to West Asia and to the plains of India.','2025-09-09');
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events_summary`
--

DROP TABLE IF EXISTS `events_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events_summary` (
  `title` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_summary`
--

LOCK TABLES `events_summary` WRITE;
/*!40000 ALTER TABLE `events_summary` DISABLE KEYS */;
INSERT INTO `events_summary` VALUES ('Explore & Adore: Marvellous Matheran','/images/Events/Matheran.jpg','From ₹6500/- 3 days/2 nights'),('Kerela Calling','/images/Events/Kerela.jpg','From ₹9999/- 3 days/2 nights'),('Magical Maharashtra','/images/Events/Maharashtra.jpg','From ₹3900/- 3 days/2 nights'),('Mt Jagatsukh Expedition','/images/Events/jagatsukh_expedition.jpg','From ₹15000/- 8 days/7 nights'),('Saputara Family Camp','/images/Events/Saputara.jpg','From ₹3300/- 3 days/2 nights'),('Snow Trekking In Manali','images/Events/1756460509748.jpg','From ₹8000/- . 8 days / 7 nights'),('The Leh Ladakh Road Trip','images/Events/1756231502350.jpg','From ₹27000/-  15 days / 14 nights'),('Vaarso Cycling Expedition','/images/Events/Vaarso_cycling.jpg','From ₹999/- 5 days/4 nights');
/*!40000 ALTER TABLE `events_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact` bigint DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`user_name`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','admin@gmail.com',9078563412,'$2b$10$Md3t7GAO2aLGXq/lKeGO8.mSZYXhAwlWeMaPRnhJfOvVLUvKwanfy','833c2e78-2d13-4063-b9ce-49ca082631bf'),('hetvipatel16','hetvipatel071655@gmail.com',8766658352,'$2b$10$cnb8R66.DuLtrpujALXq0uPkYpgIpuj76/YM7iD70u9LNByd/9FKa','5a9d875d-9a21-4f22-b0c3-545321e8c80e'),('Richard_Brandson','richardbrandson@gmail.com',9234567890,'$2b$10$AWhQAhULnE7zsxxExrdGi.e3WJvDizqku6eWuqnZzyYwQJa/SOUOK','7a4d035f-5ebc-4f01-880f-56d99fba1409'),('Vansh.tewani19 ','vanshtewani@gmail.com',9403446214,'$2b$10$luYL/p/9dFJEgXP7DoEDBe1XRWiYzRcSSsshm/52MmAFR9AHGMzDi','ef118885-e6c2-417a-ad48-0becdd81dcb6');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-07 17:13:03
