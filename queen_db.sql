-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: 127.0.0.1    Database: queen_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `queen_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `queen_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `queen_db`;

--
-- Table structure for table `adresses_livraison`
--

DROP TABLE IF EXISTS `adresses_livraison`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `adresses_livraison` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `titre` varchar(50) DEFAULT 'Domicile',
  `adresse_complete` text NOT NULL,
  `ville` varchar(100) NOT NULL,
  `telephone` varchar(20) NOT NULL,
  `est_principale` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `adresses_livraison_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `adresses_livraison`
--

LOCK TABLES `adresses_livraison` WRITE;
/*!40000 ALTER TABLE `adresses_livraison` DISABLE KEYS */;
INSERT INTO `adresses_livraison` VALUES (2,6,'Domicile','NADOR/BOUYAFER','','+212612345678',1);
/*!40000 ALTER TABLE `adresses_livraison` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `annonces_promo`
--

DROP TABLE IF EXISTS `annonces_promo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `annonces_promo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `texte` varchar(255) NOT NULL,
  `lien` varchar(255) DEFAULT NULL,
  `couleur_fond` varchar(20) DEFAULT '#000000',
  `couleur_texte` varchar(20) DEFAULT '#FFFFFF',
  `date_debut` datetime DEFAULT NULL,
  `date_fin` datetime DEFAULT NULL,
  `est_actif` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `annonces_promo`
--

LOCK TABLES `annonces_promo` WRITE;
/*!40000 ALTER TABLE `annonces_promo` DISABLE KEYS */;
/*!40000 ALTER TABLE `annonces_promo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avis_produits`
--

DROP TABLE IF EXISTS `avis_produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avis_produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `note` int(11) NOT NULL CHECK (`note` >= 1 and `note` <= 5),
  `commentaire` text DEFAULT NULL,
  `est_approuve` tinyint(1) DEFAULT 0,
  `date_avis` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `produit_id` (`produit_id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `avis_produits_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE,
  CONSTRAINT `avis_produits_ibfk_2` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=855 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avis_produits`
--

LOCK TABLES `avis_produits` WRITE;
/*!40000 ALTER TABLE `avis_produits` DISABLE KEYS */;
INSERT INTO `avis_produits` VALUES (2,1,6,4,'BLAN',1,'2026-11-06 11:38:53'),(5,5,6,5,'FF',1,'2026-11-06 12:09:29'),(549,77,6,1,'AWIIIIIIIILYYYYY 3LA MADONA B 236 DH AWIIIILYYYY',1,'2026-11-08 05:47:02'),(550,88,28,5,'SARAHA LAHOMA BARIK',1,'2026-11-08 18:08:09'),(556,3,2,5,NULL,1,'2026-11-02 19:43:39'),(558,3,28,4,NULL,1,'2026-10-15 19:43:39'),(559,3,6,5,NULL,1,'2026-10-07 19:43:39'),(560,3,7,5,NULL,1,'2026-10-18 19:43:39'),(561,10,7,2,NULL,1,'2026-08-23 19:43:39'),(563,10,2,2,NULL,1,'2026-08-23 19:43:39'),(564,10,28,2,NULL,1,'2026-10-24 19:43:39'),(565,10,13,2,NULL,1,'2026-08-24 19:43:39'),(566,11,28,3,NULL,1,'2026-08-16 19:43:39'),(567,12,6,4,NULL,1,'2026-09-26 19:43:39'),(569,12,28,3,NULL,1,'2026-10-26 19:43:39'),(570,12,7,4,NULL,1,'2026-10-22 19:43:39'),(571,13,7,5,NULL,1,'2026-11-03 19:43:39'),(573,13,13,4,NULL,1,'2026-09-16 19:43:39'),(574,13,28,5,NULL,1,'2026-09-07 19:43:39'),(575,15,7,4,NULL,1,'2026-11-01 19:43:39'),(576,15,2,5,NULL,1,'2026-08-15 19:43:39'),(578,15,13,4,NULL,1,'2026-08-29 19:43:39'),(579,16,7,2,NULL,1,'2026-10-28 19:43:39'),(581,16,28,2,NULL,1,'2026-10-22 19:43:39'),(582,18,6,4,NULL,1,'2026-08-14 19:43:39'),(583,18,2,5,NULL,1,'2026-08-18 19:43:39'),(585,18,13,4,NULL,1,'2026-09-12 19:43:39'),(586,18,7,4,NULL,1,'2026-10-06 19:43:39'),(587,19,2,4,NULL,1,'2026-11-01 19:43:39'),(588,19,6,5,NULL,1,'2026-08-26 19:43:39'),(589,19,13,3,NULL,1,'2026-10-18 19:43:39'),(590,19,28,4,NULL,1,'2026-10-05 19:43:39'),(592,20,7,5,NULL,1,'2026-09-21 19:43:39'),(593,20,13,5,NULL,1,'2026-08-28 19:43:39'),(594,20,6,4,NULL,1,'2026-09-28 19:43:39'),(595,20,2,5,NULL,1,'2026-08-18 19:43:39'),(596,21,28,5,NULL,1,'2026-09-26 19:43:39'),(597,21,13,5,NULL,1,'2026-10-27 19:43:39'),(598,21,7,4,NULL,1,'2026-09-08 19:43:39'),(599,21,6,5,NULL,1,'2026-09-07 19:43:39'),(600,22,6,4,NULL,1,'2026-09-28 19:43:39'),(601,22,7,5,NULL,1,'2026-08-13 19:43:39'),(602,22,2,3,NULL,1,'2026-11-07 19:43:39'),(603,22,13,4,NULL,1,'2026-11-04 19:43:39'),(604,23,13,3,NULL,1,'2026-09-16 19:43:39'),(605,24,13,2,NULL,1,'2026-08-18 19:43:39'),(607,25,7,5,NULL,1,'2026-09-25 19:43:39'),(608,26,28,4,NULL,1,'2026-11-03 19:43:39'),(609,26,2,5,NULL,1,'2026-09-11 19:43:39'),(610,26,6,3,NULL,1,'2026-10-16 19:43:39'),(611,26,13,4,NULL,1,'2026-10-27 19:43:39'),(613,27,6,4,NULL,1,'2026-10-22 19:43:39'),(615,28,2,3,NULL,1,'2026-10-13 19:43:39'),(616,28,13,2,NULL,1,'2026-09-05 19:43:39'),(620,32,7,2,NULL,1,'2026-09-26 19:43:39'),(623,35,13,2,NULL,1,'2026-11-04 19:43:39'),(624,36,6,3,NULL,1,'2026-08-23 19:43:39'),(626,36,13,2,NULL,1,'2026-08-30 19:43:39'),(627,36,7,3,NULL,1,'2026-10-19 19:43:39'),(628,37,6,4,NULL,1,'2026-10-28 19:43:39'),(629,37,28,4,NULL,1,'2026-09-12 19:43:39'),(630,38,13,4,NULL,1,'2026-10-11 19:43:39'),(631,38,6,5,NULL,1,'2026-11-04 19:43:39'),(632,38,2,3,NULL,1,'2026-10-05 19:43:39'),(633,38,7,4,NULL,1,'2026-09-30 19:43:39'),(635,39,2,5,NULL,1,'2026-08-15 19:43:39'),(636,39,28,3,NULL,1,'2026-11-03 19:43:39'),(637,39,6,4,NULL,1,'2026-11-07 19:43:39'),(638,39,13,4,NULL,1,'2026-10-30 19:43:39'),(639,40,2,3,NULL,1,'2026-10-16 19:43:39'),(640,40,28,3,NULL,1,'2026-09-19 19:43:39'),(641,41,6,4,NULL,1,'2026-10-05 19:43:39'),(642,41,28,5,NULL,1,'2026-09-22 19:43:39'),(644,42,2,2,NULL,1,'2026-11-05 19:43:39'),(645,42,13,3,NULL,1,'2026-11-03 19:43:39'),(647,42,7,2,NULL,1,'2026-09-27 19:43:39'),(648,42,6,2,NULL,1,'2026-10-21 19:43:39'),(649,43,6,3,NULL,1,'2026-08-15 19:43:39'),(650,43,2,3,NULL,1,'2026-09-18 19:43:39'),(651,44,7,3,NULL,1,'2026-08-21 19:43:39'),(652,44,28,4,NULL,1,'2026-10-14 19:43:39'),(653,44,6,2,NULL,1,'2026-10-31 19:43:39'),(655,44,13,3,NULL,1,'2026-10-31 19:43:39'),(656,45,7,2,NULL,1,'2026-10-25 19:43:39'),(657,45,13,3,NULL,1,'2026-09-04 19:43:39'),(659,45,6,2,NULL,1,'2026-09-30 19:43:39'),(660,45,28,2,NULL,1,'2026-10-15 19:43:39'),(662,46,13,5,NULL,1,'2026-09-07 19:43:39'),(663,46,7,4,NULL,1,'2026-10-31 19:43:39'),(664,46,2,5,NULL,1,'2026-09-14 19:43:39'),(665,47,7,5,NULL,1,'2026-09-23 19:43:39'),(666,47,13,5,NULL,1,'2026-08-24 19:43:39'),(667,47,28,4,NULL,1,'2026-09-04 19:43:39'),(668,48,7,3,NULL,1,'2026-11-07 19:43:39'),(669,48,28,4,NULL,1,'2026-08-16 19:43:39'),(671,48,2,3,NULL,1,'2026-09-29 19:43:39'),(672,48,13,3,NULL,1,'2026-10-01 19:43:39'),(673,49,28,5,NULL,1,'2026-10-01 19:43:39'),(674,49,7,5,NULL,1,'2026-08-26 19:43:39'),(675,49,2,4,NULL,1,'2026-10-25 19:43:39'),(676,49,6,5,NULL,1,'2026-10-24 19:43:39'),(677,50,13,2,NULL,1,'2026-10-08 19:43:39'),(678,51,28,5,NULL,1,'2026-10-06 19:43:39'),(679,51,2,5,NULL,1,'2026-10-16 19:43:39'),(680,51,6,4,NULL,1,'2026-10-02 19:43:39'),(681,51,13,5,NULL,1,'2026-09-15 19:43:39'),(682,52,13,5,NULL,1,'2026-10-25 19:43:39'),(683,53,28,5,NULL,1,'2026-09-24 19:43:39'),(684,53,7,5,NULL,1,'2026-10-04 19:43:39'),(685,53,13,4,NULL,1,'2026-10-01 19:43:39'),(687,53,6,5,NULL,1,'2026-08-28 19:43:39'),(688,54,7,5,NULL,1,'2026-08-14 19:43:39'),(689,54,13,5,NULL,1,'2026-10-15 19:43:39'),(690,54,28,4,NULL,1,'2026-10-03 19:43:39'),(691,54,6,5,NULL,1,'2026-08-30 19:43:39'),(692,55,6,2,NULL,1,'2026-08-21 19:43:39'),(693,55,7,2,NULL,1,'2026-11-02 19:43:39'),(694,56,13,4,NULL,1,'2026-09-21 19:43:39'),(695,56,2,5,NULL,1,'2026-09-25 19:43:39'),(696,56,28,3,NULL,1,'2026-10-04 19:43:39'),(697,56,6,4,NULL,1,'2026-11-06 19:43:39'),(698,56,7,4,NULL,1,'2026-10-31 19:43:39'),(699,57,28,4,NULL,1,'2026-09-14 19:43:39'),(700,57,6,5,NULL,1,'2026-09-23 19:43:39'),(701,57,2,3,NULL,1,'2026-09-20 19:43:39'),(702,57,7,4,NULL,1,'2026-10-15 19:43:39'),(703,58,6,3,NULL,1,'2026-10-22 19:43:39'),(704,59,2,2,NULL,1,'2026-08-22 19:43:39'),(705,59,6,3,NULL,1,'2026-09-18 19:43:39'),(706,59,28,2,NULL,1,'2026-09-22 19:43:39'),(707,59,13,2,NULL,1,'2026-10-04 19:43:39'),(709,60,6,4,NULL,1,'2026-09-03 19:43:39'),(710,60,7,2,NULL,1,'2026-08-28 19:43:39'),(711,61,7,4,NULL,1,'2026-09-28 19:43:39'),(712,61,6,4,NULL,1,'2026-08-27 19:43:39'),(713,62,13,3,NULL,1,'2026-09-28 19:43:39'),(714,62,28,4,NULL,1,'2026-08-14 19:43:39'),(715,62,2,2,NULL,1,'2026-09-01 19:43:39'),(716,62,7,3,NULL,1,'2026-09-20 19:43:39'),(718,63,7,5,NULL,1,'2026-08-29 19:43:39'),(720,64,6,5,NULL,1,'2026-09-20 19:43:39'),(721,65,7,5,NULL,1,'2026-11-06 19:43:39'),(722,65,6,5,NULL,1,'2026-10-22 19:43:39'),(723,65,13,4,NULL,1,'2026-10-21 19:43:39'),(724,65,28,5,NULL,1,'2026-08-11 19:43:39'),(727,66,7,5,NULL,1,'2026-09-22 19:43:39'),(728,66,28,3,NULL,1,'2026-09-23 19:43:39'),(729,66,13,4,NULL,1,'2026-08-11 19:43:39'),(730,67,13,2,NULL,1,'2026-08-17 19:43:39'),(731,67,7,3,NULL,1,'2026-08-24 19:43:39'),(733,67,6,2,NULL,1,'2026-09-26 19:43:39'),(734,67,28,2,NULL,1,'2026-10-14 19:43:39'),(735,68,7,3,NULL,1,'2026-09-09 19:43:39'),(736,68,28,3,NULL,1,'2026-08-21 19:43:39'),(738,69,2,5,NULL,1,'2026-09-01 19:43:39'),(739,70,13,4,NULL,1,'2026-09-01 19:43:39'),(740,71,2,3,NULL,1,'2026-09-03 19:43:39'),(741,71,7,4,NULL,1,'2026-10-26 19:43:39'),(742,71,13,2,NULL,1,'2026-09-02 19:43:39'),(743,71,6,3,NULL,1,'2026-09-05 19:43:39'),(744,72,6,3,NULL,1,'2026-10-22 19:43:39'),(745,72,13,4,NULL,1,'2026-09-08 19:43:39'),(747,72,28,3,NULL,1,'2026-10-26 19:43:39'),(748,72,2,3,NULL,1,'2026-08-25 19:43:39'),(749,73,7,3,NULL,1,'2026-09-30 19:43:39'),(750,74,28,2,NULL,1,'2026-11-07 19:43:39'),(751,75,7,3,NULL,1,'2026-09-22 19:43:39'),(752,75,2,3,NULL,1,'2026-09-30 19:43:39'),(753,76,13,3,NULL,1,'2026-08-10 19:43:39'),(754,76,28,3,NULL,1,'2026-10-14 19:43:39'),(755,78,7,3,NULL,1,'2026-08-24 19:43:39'),(756,79,13,4,NULL,1,'2026-10-29 19:43:39'),(757,79,6,5,NULL,1,'2026-08-18 19:43:39'),(758,79,7,3,NULL,1,'2026-11-05 19:43:39'),(759,79,2,4,NULL,1,'2026-10-29 19:43:39'),(761,80,2,2,NULL,1,'2026-08-14 19:43:39'),(763,81,2,3,NULL,1,'2026-11-03 19:43:39'),(764,82,6,2,NULL,1,'2026-09-07 19:43:39'),(765,82,2,3,NULL,1,'2026-10-24 19:43:39'),(766,82,28,2,NULL,1,'2026-10-02 19:43:39'),(767,82,7,2,NULL,1,'2026-10-07 19:43:39'),(769,83,6,2,NULL,1,'2026-09-12 19:43:39'),(770,83,28,3,NULL,1,'2026-09-08 19:43:39'),(771,83,7,2,NULL,1,'2026-10-05 19:43:39'),(772,84,28,4,NULL,1,'2026-10-04 19:43:39'),(773,84,13,4,NULL,1,'2026-10-29 19:43:39'),(774,85,28,5,NULL,1,'2026-09-08 19:43:39'),(775,85,7,5,NULL,1,'2026-09-16 19:43:39'),(777,85,6,5,NULL,1,'2026-10-18 19:43:39'),(779,86,6,4,NULL,1,'2026-10-26 19:43:39'),(780,86,7,2,NULL,1,'2026-09-29 19:43:39'),(781,86,13,3,NULL,1,'2026-09-19 19:43:39'),(782,86,28,3,NULL,1,'2026-10-11 19:43:39'),(784,87,6,5,NULL,1,'2026-09-02 19:43:39'),(785,89,2,4,NULL,1,'2026-08-25 19:43:39'),(786,89,7,5,NULL,1,'2026-08-28 19:43:39'),(787,89,28,3,NULL,1,'2026-10-05 19:43:39'),(788,90,6,4,NULL,1,'2026-09-19 19:43:39'),(789,90,13,5,NULL,1,'2026-10-24 19:43:39'),(790,90,28,3,NULL,1,'2026-09-23 19:43:39'),(792,91,7,5,NULL,1,'2026-09-30 19:43:39'),(793,91,13,5,NULL,1,'2026-11-05 19:43:39'),(794,91,6,4,NULL,1,'2026-09-16 19:43:39'),(795,91,28,5,NULL,1,'2026-10-09 19:43:39'),(796,92,6,5,NULL,1,'2026-09-23 19:43:39'),(797,92,2,5,NULL,1,'2026-09-08 19:43:39'),(799,92,7,5,NULL,1,'2026-09-17 19:43:39'),(800,92,28,5,NULL,1,'2026-11-07 19:43:39'),(801,93,28,5,NULL,1,'2026-10-06 19:43:39'),(802,93,13,5,NULL,1,'2026-09-08 19:43:39'),(804,93,7,5,NULL,1,'2026-11-02 19:43:39'),(805,93,2,5,NULL,1,'2026-09-09 19:43:39'),(806,94,7,2,NULL,1,'2026-09-24 19:43:39'),(807,94,28,3,NULL,1,'2026-08-28 19:43:39'),(810,95,28,3,NULL,1,'2026-09-28 19:43:39'),(811,95,7,2,NULL,1,'2026-09-19 19:43:39'),(812,95,13,2,NULL,1,'2026-09-22 19:43:39'),(813,96,7,5,NULL,1,'2026-10-19 19:43:39'),(815,96,28,4,NULL,1,'2026-10-15 19:43:39'),(816,96,2,5,NULL,1,'2026-09-21 19:43:39'),(817,96,6,5,NULL,1,'2026-10-19 19:43:39'),(818,97,13,3,NULL,1,'2026-09-30 19:43:39'),(819,97,28,4,NULL,1,'2026-09-05 19:43:39'),(821,98,28,2,NULL,1,'2026-08-23 19:43:39'),(822,98,13,2,NULL,1,'2026-10-26 19:43:39'),(823,99,6,5,NULL,1,'2026-08-22 19:43:39'),(824,99,7,5,NULL,1,'2026-11-07 19:43:39'),(825,100,2,2,NULL,1,'2026-10-27 19:43:39'),(826,101,6,5,NULL,1,'2026-10-05 19:43:39'),(828,101,7,4,NULL,1,'2026-09-01 19:43:39'),(829,101,28,5,NULL,1,'2026-08-31 19:43:39'),(830,102,28,2,NULL,1,'2026-09-19 19:43:39'),(831,103,6,4,NULL,1,'2026-08-27 19:43:39'),(832,103,28,5,NULL,1,'2026-09-03 19:43:39'),(833,103,13,3,NULL,1,'2026-09-20 19:43:39'),(834,103,2,4,NULL,1,'2026-09-23 19:43:39'),(836,104,7,2,NULL,1,'2026-10-29 19:43:39'),(837,104,6,3,NULL,1,'2026-10-14 19:43:39'),(838,104,2,2,NULL,1,'2026-08-24 19:43:39'),(839,104,28,2,NULL,1,'2026-08-27 19:43:39'),(840,105,13,3,NULL,1,'2026-11-02 19:43:39'),(841,105,6,4,NULL,1,'2026-10-26 19:43:39'),(842,105,7,2,NULL,1,'2026-11-04 19:43:39'),(843,106,28,5,NULL,1,'2026-10-16 19:43:39'),(844,107,6,4,NULL,1,'2026-10-29 19:43:39'),(845,107,13,5,NULL,1,'2026-09-19 19:43:39'),(846,107,28,3,NULL,1,'2026-10-07 19:43:39'),(847,108,13,5,NULL,1,'2026-08-10 19:43:39'),(848,109,28,5,NULL,1,'2026-11-06 19:43:39'),(850,109,13,4,NULL,1,'2026-10-10 19:43:39'),(851,109,7,5,NULL,1,'2026-10-16 19:43:39'),(852,109,6,5,NULL,1,'2026-10-16 19:43:39'),(853,89,30,1,'AIME PAS DE TOUTES IL EST TRES CHER POUR MOI',1,'2026-11-09 11:06:14'),(854,87,13,3,'TEST',1,'2026-11-09 23:49:45');
/*!40000 ALTER TABLE `avis_produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `commandes`
--

DROP TABLE IF EXISTS `commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commandes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `date_commande` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL,
  `statut` enum('En attente','Acceptee','Refusee','Livree') DEFAULT 'En attente',
  `nom_livraison` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `ville` varchar(80) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `statut_vu` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `commandes_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `utilisateurs` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `commandes`
--

LOCK TABLES `commandes` WRITE;
/*!40000 ALTER TABLE `commandes` DISABLE KEYS */;
INSERT INTO `commandes` VALUES (1,2,'2026-11-02 03:27:12',250.00,'Refusee',NULL,NULL,NULL,NULL,NULL),(2,6,'2026-11-02 04:04:01',95.00,'Livree','Adam','0612345678','SDFGHJDFG','QSDFGHSDFGHJ','Livree'),(3,6,'2026-11-03 07:32:38',250.00,'Livree','Adam','+212612345678','SDFGHJSDFGHJ','WXCHBQSDFGHJ','Livree'),(4,6,'2026-11-03 07:48:15',50.00,'Livree','Adam','+212612345678','IFRAN WAROY','IFRAN WAROY','Livree'),(5,6,'2026-11-03 12:35:43',137.50,'Livree','Adam','+212612345678','SDFGHJDFC','WXCHBDFGHJ','Livree'),(6,6,'2026-11-04 00:44:49',432.50,'Livree','Adam','+212612345678','NADOR','NADOR/BOUYAFER','Livree'),(7,6,'2026-11-04 11:57:30',120.00,'Livree','Adam','+212612345678','NADOR','NADOR/BOUYAFER','Livree'),(13,6,'2026-11-06 23:32:15',450.00,'Livree','YASSINE','+212612345678','NADOR','NADOR/BOUYAFER','Livree'),(15,6,'2026-11-07 00:43:54',253.95,'Livree','YASSINE','+212612345678','NADOR','NADOR/BOUYAFER','Livree'),(16,13,'2026-11-08 14:34:02',2815.80,'Livree','Adam','+212612345678','IFRAN WAROY','NADOR/BOUYAFER','Livree'),(17,13,'2026-11-08 14:35:50',703.95,'Livree','Adam','+212612345678','IFRAN WAROY','NADOR/BOUYAFER','Livree'),(18,13,'2026-11-08 14:38:07',3219.90,'Livree','Adam','+212612345678','IFRAN WAROY','NADOR/BOUYAFER','Livree'),(19,6,'2026-11-08 14:49:46',252.04,'En attente','YASSINE','0607080912','NADOR','NADOR/BOUYAFER','En attente'),(20,13,'2026-11-08 18:00:50',346.11,'En attente','Adam','+212612345678','IFRAN WAROY','NADOR/BOUYAFER','En attente'),(21,28,'2026-11-08 18:01:55',245.57,'En attente','Adam','+212612345678','NADOR','NADOR/BOUYAFER','En attente'),(22,28,'2026-11-08 18:02:15',443.40,'Acceptee','Adam','+212612345678','NADOR','NADOR/BOUYAFER','Acceptee'),(23,13,'2026-11-08 22:40:31',467.83,'En attente','mariem','+212612345678','NADOR','NADOR/BOUYAFER','En attente'),(24,13,'2026-11-13 23:08:04',254.17,'Livree','SIMO','+212612345678','NADOR','NADOR/BOUYAFER','Livree');
/*!40000 ALTER TABLE `commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `details_commandes`
--

DROP TABLE IF EXISTS `details_commandes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `details_commandes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commande_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `variante_id` int(11) DEFAULT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(10,2) NOT NULL,
  `pack_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `commande_id` (`commande_id`),
  KEY `produit_id` (`produit_id`),
  KEY `details_commandes_variante_id_foreign` (`variante_id`),
  KEY `details_commandes_pack_id_foreign` (`pack_id`),
  CONSTRAINT `details_commandes_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`),
  CONSTRAINT `details_commandes_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`),
  CONSTRAINT `details_commandes_pack_id_foreign` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `details_commandes_variante_id_foreign` FOREIGN KEY (`variante_id`) REFERENCES `variantes_produits` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `details_commandes`
--

LOCK TABLES `details_commandes` WRITE;
/*!40000 ALTER TABLE `details_commandes` DISABLE KEYS */;
INSERT INTO `details_commandes` VALUES (1,1,3,NULL,1,250.00,NULL),(2,2,2,NULL,1,95.00,NULL),(3,3,3,NULL,1,250.00,NULL),(4,4,5,NULL,1,50.00,NULL),(5,5,3,NULL,1,137.50,NULL),(6,6,3,NULL,1,137.50,NULL),(7,6,2,NULL,1,95.00,NULL),(8,6,4,NULL,1,120.00,NULL),(9,6,1,NULL,1,80.00,NULL),(10,7,4,NULL,1,120.00,NULL),(16,13,3,NULL,1,250.00,NULL),(17,13,4,NULL,1,120.00,NULL),(18,13,1,NULL,1,80.00,NULL),(21,15,94,NULL,3,36.12,13),(22,15,67,NULL,1,31.56,13),(23,15,74,NULL,1,60.09,13),(24,15,88,NULL,1,53.95,NULL),(25,16,89,NULL,20,140.79,NULL),(26,17,89,NULL,5,140.79,NULL),(27,18,104,NULL,15,214.66,NULL),(28,19,70,NULL,1,252.04,NULL),(29,20,87,NULL,1,292.16,NULL),(30,20,88,NULL,1,53.95,NULL),(31,21,37,NULL,1,245.57,NULL),(32,22,85,NULL,2,221.70,NULL),(33,23,219,876,1,45.00,NULL),(34,23,25,647,1,178.90,NULL),(35,23,22,639,1,243.93,NULL),(36,24,19,630,1,254.17,NULL);
/*!40000 ALTER TABLE `details_commandes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoris`
--

DROP TABLE IF EXISTS `favoris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favoris` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `date_ajout` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `utilisateur_id` (`utilisateur_id`,`produit_id`),
  KEY `produit_id` (`produit_id`),
  CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoris`
--

LOCK TABLES `favoris` WRITE;
/*!40000 ALTER TABLE `favoris` DISABLE KEYS */;
INSERT INTO `favoris` VALUES (12,6,17,'2026-11-06 15:57:01'),(15,6,88,'2026-11-06 17:06:18'),(16,6,5,'2026-11-07 05:05:16'),(17,6,210,'2026-11-07 05:06:28'),(24,13,219,'2026-11-08 10:51:45'),(25,28,219,'2026-11-08 12:10:37'),(28,13,87,'2026-11-09 14:50:31');
/*!40000 ALTER TABLE `favoris` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `images_produits`
--

DROP TABLE IF EXISTS `images_produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images_produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `chemin_image` varchar(255) NOT NULL,
  `est_principale` tinyint(1) DEFAULT 0,
  `ordre_affichage` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `produit_id` (`produit_id`),
  CONSTRAINT `images_produits_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images_produits`
--

LOCK TABLES `images_produits` WRITE;
/*!40000 ALTER TABLE `images_produits` DISABLE KEYS */;
INSERT INTO `images_produits` VALUES (5,9,'creme-visage-7201701c.webp',0,1),(6,9,'creme-visage-193c84ee.webp',0,2),(7,9,'creme-visage-328d18da.webp',0,3),(8,9,'creme-visage-7bbac553.webp',0,4),(9,9,'creme-visage-76e1b0c5.webp',0,5),(10,9,'creme-visage-e7ff0885.webp',0,6),(11,5,'vera-wang-08b6eaea.webp',0,1),(12,5,'vera-wang-67958715.webp',0,2),(13,5,'vera-wang-fa6c40a5.webp',0,3),(14,5,'vera-wang-2e947805.webp',0,4),(15,210,'dd-e5873941.webp',0,1),(16,219,'slower-soul-97d18116.jpg',0,1),(17,219,'slower-soul-82aa4cfb.webp',0,2),(18,219,'slower-soul-8c494428.webp',0,3);
/*!40000 ALTER TABLE `images_produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `liens_service`
--

DROP TABLE IF EXISTS `liens_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `liens_service` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `whatsapp` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `gmail` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `liens_service`
--

LOCK TABLES `liens_service` WRITE;
/*!40000 ALTER TABLE `liens_service` DISABLE KEYS */;
INSERT INTO `liens_service` VALUES (3,NULL,NULL,'https://www.instagram.com/',NULL,NULL);
/*!40000 ALTER TABLE `liens_service` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_utilisateurs_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_01_01_000001_create_queen_tables',1),(5,'2026_01_01_000002_create_personal_access_tokens_table',1),(6,'2026_11_05_000001_create_top_bars_tables',2),(7,'2026_11_06_000001_add_product_variants_gallery_favorites',3),(8,'2026_11_07_000001_create_liens_service_table',4),(9,'2026_11_07_000002_add_instagram_to_liens_service',5),(10,'2026_11_07_000003_add_pack_customization_and_orders',6),(11,'2026_11_07_000004_create_reclamations_table',7),(12,'2026_11_08_000001_add_soft_delete_to_produits',8),(13,'2026_11_08_000002_add_prix_to_variantes_produits',9),(14,'2026_11_09_000001_create_parametres_theme_table',10);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pack_produit`
--

DROP TABLE IF EXISTS `pack_produit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pack_produit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pack_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `quantite` int(11) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `pack_id` (`pack_id`),
  KEY `produit_id` (`produit_id`),
  CONSTRAINT `pack_produit_ibfk_1` FOREIGN KEY (`pack_id`) REFERENCES `packs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pack_produit_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pack_produit`
--

LOCK TABLES `pack_produit` WRITE;
/*!40000 ALTER TABLE `pack_produit` DISABLE KEYS */;
INSERT INTO `pack_produit` VALUES (1,1,1,1),(2,1,2,1),(26,16,104,1),(27,16,61,1),(28,14,95,1),(29,14,103,1),(30,13,103,1),(31,16,13,1),(32,15,94,1);
/*!40000 ALTER TABLE `pack_produit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `packs`
--

DROP TABLE IF EXISTS `packs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `packs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `prix_promo` decimal(10,2) NOT NULL,
  `est_actif` tinyint(1) DEFAULT 1,
  `date_creation` datetime DEFAULT current_timestamp(),
  `couleur_fond` varchar(20) NOT NULL DEFAULT '#735A65',
  `couleur_texte` varchar(20) NOT NULL DEFAULT '#FFFFFF',
  `texte_bouton` varchar(40) NOT NULL DEFAULT 'Voir le pack',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `packs`
--

LOCK TABLES `packs` WRITE;
/*!40000 ALTER TABLE `packs` DISABLE KEYS */;
INSERT INTO `packs` VALUES (1,'Pack Soirée Glamour','Le pack parfait pour vos soirées: Rouge à lèvres + Mascara.','pack-soiree-glamour-ac0ee8ab.jpg',150.00,1,'2026-11-06 04:50:24','#676767','#FFFFFF','Voir le pack'),(13,'QUEEN PACK','BEST','queen-pack-91e04668.jpg',200.00,1,'2026-11-06 15:40:59','#f3dbdb','#ffffff','Voir le pack'),(14,'PACK DRAWCH',NULL,'pack-drawch-a08b3354.webp',300.00,1,'2026-11-06 15:50:20','#060b10','#FFFFFF','Voir le pack'),(15,'PACK MACHI DYAL DRAWCH',NULL,'pack-machi-dyal-drawch-12de1d83.jpg',50.00,1,'2026-11-06 15:51:50','#ffffff','#000000','Voir le pack'),(16,'PACK ZWIN',NULL,'pack-zwin-1c822910.webp',200.00,1,'2026-11-07 18:14:56','#f1d5b0','#ffffff','Voir le pack');
/*!40000 ALTER TABLE `packs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `paiements`
--

DROP TABLE IF EXISTS `paiements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paiements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `commande_id` int(11) NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `methode` varchar(50) DEFAULT 'Livraison',
  `statut` enum('Non paye','Paye') DEFAULT 'Non paye',
  PRIMARY KEY (`id`),
  UNIQUE KEY `commande_id` (`commande_id`),
  CONSTRAINT `paiements_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `paiements`
--

LOCK TABLES `paiements` WRITE;
/*!40000 ALTER TABLE `paiements` DISABLE KEYS */;
INSERT INTO `paiements` VALUES (1,1,250.00,'Livraison','Non paye'),(2,2,95.00,'Livraison','Paye'),(3,3,250.00,'Livraison','Paye'),(4,4,50.00,'Livraison','Paye'),(5,5,137.50,'Livraison','Paye'),(6,6,432.50,'Livraison','Paye'),(7,7,120.00,'Livraison','Paye'),(13,13,450.00,'Livraison','Paye'),(15,15,253.95,'Livraison','Paye'),(16,16,2815.80,'Livraison','Paye'),(17,17,703.95,'Livraison','Paye'),(18,18,3219.90,'Livraison','Paye'),(19,19,252.04,'Livraison','Non paye'),(20,20,346.11,'Livraison','Non paye'),(21,21,245.57,'Livraison','Non paye'),(22,22,443.40,'Livraison','Non paye'),(23,23,467.83,'Livraison','Non paye'),(24,24,254.17,'Livraison','Paye');
/*!40000 ALTER TABLE `paiements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametres_header`
--

DROP TABLE IF EXISTS `parametres_header`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parametres_header` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom_marque` varchar(150) NOT NULL DEFAULT 'QUEEN-Cosmetics',
  `couleur_fond` varchar(20) DEFAULT '#000000',
  `couleur_texte` varchar(20) DEFAULT '#D4AF37',
  `est_actif` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametres_header`
--

LOCK TABLES `parametres_header` WRITE;
/*!40000 ALTER TABLE `parametres_header` DISABLE KEYS */;
INSERT INTO `parametres_header` VALUES (1,'QUEEN-Cosmetics','#000000','#ffffff',1);
/*!40000 ALTER TABLE `parametres_header` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametres_theme`
--

DROP TABLE IF EXISTS `parametres_theme`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parametres_theme` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `valeurs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`valeurs`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametres_theme`
--

LOCK TABLES `parametres_theme` WRITE;
/*!40000 ALTER TABLE `parametres_theme` DISABLE KEYS */;
INSERT INTO `parametres_theme` VALUES (9,'{\"nav_bg\":\"#ffffff\",\"nav_text\":\"#5a4150\",\"footer_bg\":\"#000000\",\"footer_text\":\"#ffffff\",\"page_bg\":\"#f9f3f2\",\"accent\":\"#735a65\",\"font_heading\":\"lora\",\"font_body\":\"lora\",\"card_bg\":\"#ffffff\",\"card_radius\":24,\"card_shadow\":\"soft\",\"card_border\":true,\"price_color\":null,\"badge_promo\":\"#d3261c\",\"badge_out\":\"#e8261c\",\"button_style\":\"pill\",\"site_width\":\"normal\",\"banner_height\":\"normal\",\"logo\":null}');
/*!40000 ALTER TABLE `parametres_theme` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=337 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (8,'App\\Models\\User',6,'nextjs','829fd8b1093bf0f16cb230bd25a70704cea3e77af23841965dc9b2b9616aaa25','[\"*\"]','2026-11-04 19:58:40','2026-11-05 03:58:35','2026-11-04 19:58:35','2026-11-04 19:58:40'),(126,'App\\Models\\User',6,'nextjs','16ed65113beaf3ea57198ee6c2d6ad0aefa282dec4354b9e2b64037bcbe93506','[\"*\"]','2026-11-08 12:01:36','2026-11-08 20:01:35','2026-11-08 12:01:35','2026-11-08 12:01:36'),(135,'App\\Models\\User',13,'nextjs','7e53be9ef7829f15383df8212146adc333ee90dbeeed7a29eaac49308d0adcce','[\"*\"]','2026-11-08 13:56:47','2026-11-08 21:25:48','2026-11-08 13:25:48','2026-11-08 13:56:47'),(136,'App\\Models\\User',7,'nextjs','14f51d03932be09db4f85d58e37620914d262b5557aab192d5ea201cb05d3ae3','[\"*\"]','2026-11-08 22:16:49','2026-11-09 06:16:30','2026-11-08 22:16:30','2026-11-08 22:16:49'),(137,'App\\Models\\User',7,'nextjs','a3721f50ab52b92a4d6d658e5739640684c05b5000e57c973aaad4a4cca78c38','[\"*\"]',NULL,'2026-11-09 06:17:03','2026-11-08 22:17:03','2026-11-08 22:17:03'),(139,'App\\Models\\User',7,'nextjs','af51ab5517a99043d86f0f07e36193ce566d9df2875291b9f665321c5a63b28e','[\"*\"]','2026-11-08 22:26:57','2026-11-09 06:21:35','2026-11-08 22:21:35','2026-11-08 22:26:57'),(145,'App\\Models\\User',13,'nextjs','be752aa76a1c71f6a29a3011817cdf57749d84280581b445887468caf24f8f6e','[\"*\"]','2026-11-08 22:38:07','2026-11-09 06:36:51','2026-11-08 22:36:51','2026-11-08 22:38:07'),(148,'App\\Models\\User',3,'nextjs','ff79a2c147d3a76f7eaa5ce5b65868047b37022337c7e8bf0dc7b695af659a1c','[\"*\"]','2026-11-08 22:44:00','2026-11-09 06:43:26','2026-11-08 22:43:26','2026-11-08 22:44:00'),(149,'App\\Models\\User',4,'nextjs','3ff32dc8dc46b0e0f019ff833d27595fc4be15779cdb5fd61d88165cedb28b11','[\"*\"]','2026-11-08 22:44:19','2026-11-09 06:44:02','2026-11-08 22:44:02','2026-11-08 22:44:19'),(150,'App\\Models\\User',5,'nextjs','9deaf44504aea92b167452db3b79c120196abd73357768c6a5e264fe0aa584c1','[\"*\"]','2026-11-08 22:44:33','2026-11-09 06:44:21','2026-11-08 22:44:21','2026-11-08 22:44:33'),(151,'App\\Models\\User',3,'nextjs','b230c1d1450712af630dd0c75e09516c510701193e358d5864528b28f580ba75','[\"*\"]','2026-11-08 22:52:36','2026-11-09 06:52:03','2026-11-08 22:52:03','2026-11-08 22:52:36'),(152,'App\\Models\\User',4,'nextjs','e6cd335e2ef7dc515ea147cf69ed9804be0862e5c28eed753b1773ffa0efe2e6','[\"*\"]','2026-11-08 22:53:15','2026-11-09 06:52:40','2026-11-08 22:52:40','2026-11-08 22:53:15'),(153,'App\\Models\\User',5,'nextjs','21d1c789ca1c48fffae79e05641f5562126f5b56bde16e0e71ae99d3d5e8a6d3','[\"*\"]','2026-11-08 22:53:43','2026-11-09 06:53:19','2026-11-08 22:53:19','2026-11-08 22:53:43'),(154,'App\\Models\\User',7,'nextjs','ac238349d570f9b480b04e3ae54e53c89284df872954428128f158dc42e1968f','[\"*\"]','2026-11-08 22:54:27','2026-11-09 06:53:46','2026-11-08 22:53:46','2026-11-08 22:54:27'),(155,'App\\Models\\User',3,'nextjs','8feceb8dfc1eb3fcd08c72a70f68a7f3c56c603886b056af65164106c6425747','[\"*\"]','2026-11-08 22:56:07','2026-11-09 06:55:23','2026-11-08 22:55:23','2026-11-08 22:56:07'),(156,'App\\Models\\User',4,'nextjs','2e0f3c960c2c6fbf5c135c0dcc49e89d54406cd704f576e6a71b99e65d5d94cb','[\"*\"]','2026-11-08 22:56:36','2026-11-09 06:56:10','2026-11-08 22:56:10','2026-11-08 22:56:36'),(157,'App\\Models\\User',7,'nextjs','94d13a488bbbadbe16613982d7e8777255d5f19cf75c7fc0302551d8c9694a1f','[\"*\"]','2026-11-08 22:57:25','2026-11-09 06:56:40','2026-11-08 22:56:40','2026-11-08 22:57:25'),(158,'App\\Models\\User',3,'nextjs','d699ac75e80218db0cbc48e73c35caf06b14c4a8201b53bc0db601b0121ed027','[\"*\"]','2026-11-08 22:58:09','2026-11-09 06:58:07','2026-11-08 22:58:07','2026-11-08 22:58:09'),(159,'App\\Models\\User',3,'nextjs','0b49acbbbc2caaad33456a30457b02bd86a30fc390477630bcbfab293349ad68','[\"*\"]','2026-11-08 22:58:14','2026-11-09 06:58:12','2026-11-08 22:58:12','2026-11-08 22:58:14'),(160,'App\\Models\\User',7,'nextjs','76db0da93aed307208ce8e31a9cf5ac011ef14cd579d39dcd861abb2355e0ea0','[\"*\"]','2026-11-08 22:58:21','2026-11-09 06:58:18','2026-11-08 22:58:18','2026-11-08 22:58:21'),(161,'App\\Models\\User',3,'nextjs','ec5455f2ac15f205164fdb2ea2e1c1f6af9ce6cb9fb9e7c03ea61986bec3ea4f','[\"*\"]','2026-11-08 22:58:44','2026-11-09 06:58:38','2026-11-08 22:58:38','2026-11-08 22:58:44'),(162,'App\\Models\\User',7,'nextjs','1c25457d3eed5cfcaefa6208c751fbe3463f839b07b819686898af92c1f86a7f','[\"*\"]','2026-11-08 22:58:59','2026-11-09 06:58:48','2026-11-08 22:58:48','2026-11-08 22:58:59'),(163,'App\\Models\\User',3,'nextjs','d0f48701d3c2b78ba47cf1b94b0c586e599ea0da0c1dd9104ec9a27c3d18c9f5','[\"*\"]','2026-11-08 23:01:35','2026-11-09 07:00:39','2026-11-08 23:00:39','2026-11-08 23:01:35'),(164,'App\\Models\\User',4,'nextjs','672e05052d571c03801974753a1b6ab71f0e99b65a180de53cf8eb78c9526781','[\"*\"]','2026-11-08 23:02:11','2026-11-09 07:01:38','2026-11-08 23:01:38','2026-11-08 23:02:11'),(165,'App\\Models\\User',5,'nextjs','71e22b56ec7a346d2aca37bdcf961c1d426d9bc6eed5202e194c1f17dd8ad741','[\"*\"]','2026-11-08 23:02:38','2026-11-09 07:02:15','2026-11-08 23:02:15','2026-11-08 23:02:38'),(166,'App\\Models\\User',7,'nextjs','a7f405ed4eb570a1c960d6de56a23c77e27f21d38b0ef9229391e060d00fd980','[\"*\"]','2026-11-08 23:03:40','2026-11-09 07:02:41','2026-11-08 23:02:41','2026-11-08 23:03:40'),(167,'App\\Models\\User',3,'nextjs','ff4492a3008e455800810874e71a06c28e33d97788601f8a119bf7805156a86f','[\"*\"]','2026-11-08 23:05:57','2026-11-09 07:05:04','2026-11-08 23:05:04','2026-11-08 23:05:57'),(168,'App\\Models\\User',4,'nextjs','99aa75b36ed2b8aa214be23c5916ac194030cef55a6931fe7683f41ce6c780b7','[\"*\"]','2026-11-08 23:06:34','2026-11-09 07:06:01','2026-11-08 23:06:01','2026-11-08 23:06:34'),(169,'App\\Models\\User',5,'nextjs','b5166bb12015ee35ddfc52282bcc295687f5eacb7086420442fcaff8cb10ed5f','[\"*\"]','2026-11-08 23:07:00','2026-11-09 07:06:37','2026-11-08 23:06:37','2026-11-08 23:07:00'),(170,'App\\Models\\User',7,'nextjs','fcc6d27f1418ad9bfdb8365a0aca683b941e266d2b811156e9d9adfcd2b14376','[\"*\"]','2026-11-08 23:07:59','2026-11-09 07:07:03','2026-11-08 23:07:03','2026-11-08 23:07:59'),(171,'App\\Models\\User',3,'nextjs','20680dbc193c6b78677ef6a59ee7bd1c31ca40ed7fd401f96bbeb0025df4b19e','[\"*\"]','2026-11-08 23:28:53','2026-11-09 07:28:52','2026-11-08 23:28:52','2026-11-08 23:28:53'),(172,'App\\Models\\User',7,'nextjs','1f491c40c5a77849013dc7f5565c8e6998d317456b79f1557b7e1380830c4128','[\"*\"]','2026-11-08 23:38:49','2026-11-09 07:38:41','2026-11-08 23:38:41','2026-11-08 23:38:49'),(173,'App\\Models\\User',4,'nextjs','7cd2a0f4e0fa62a0ac5b308eaa8e66db4686f0f45231138d77afbe65659032c6','[\"*\"]','2026-11-08 23:42:24','2026-11-09 07:38:52','2026-11-08 23:38:52','2026-11-08 23:42:24'),(175,'App\\Models\\User',7,'nextjs','443f7421b1db5dade7463d2ec47fa18f50a21c5eec19d26e3cb7e7f953c2cc48','[\"*\"]','2026-11-08 23:42:37','2026-11-09 07:42:36','2026-11-08 23:42:36','2026-11-08 23:42:37'),(177,'App\\Models\\User',7,'nextjs','22e6856b45278917441750ad0581ca036afa49ce6df7898c89b55b526912fc2f','[\"*\"]','2026-11-09 01:05:02','2026-11-09 09:04:41','2026-11-09 01:04:41','2026-11-09 01:05:02'),(178,'App\\Models\\User',3,'nextjs','2a00a3e7bbb43dc19bc190683e3399c6c0caad1e43251823f42e81346db2294d','[\"*\"]','2026-11-09 01:05:36','2026-11-09 09:05:08','2026-11-09 01:05:08','2026-11-09 01:05:36'),(179,'App\\Models\\User',4,'nextjs','185aa78b6a5c9558649ea11ddddd37b437f326fd030b9a4ff928f0f717c9556b','[\"*\"]','2026-11-09 01:05:47','2026-11-09 09:05:40','2026-11-09 01:05:40','2026-11-09 01:05:47'),(180,'App\\Models\\User',5,'nextjs','fb76dbd5e8a4b80bd73bb655b7e02431d3be7be98ec855ae5b43d66324d4451c','[\"*\"]','2026-11-09 01:05:56','2026-11-09 09:05:52','2026-11-09 01:05:52','2026-11-09 01:05:56'),(181,'App\\Models\\User',7,'nextjs','072e2549b918d10e55d5f818c0ba2350fb27af4a9b8a7c33836580f9535bee85','[\"*\"]','2026-11-09 01:23:17','2026-11-09 09:23:02','2026-11-09 01:23:02','2026-11-09 01:23:17'),(182,'App\\Models\\User',3,'nextjs','440e6a68442eeb99631c01943df0b506db525716ebc0978e72be23c28c25fd45','[\"*\"]','2026-11-09 01:23:42','2026-11-09 09:23:22','2026-11-09 01:23:22','2026-11-09 01:23:42'),(183,'App\\Models\\User',4,'nextjs','2f80df150bb7eff6cc5fabbe4e2f37c8f6c8d07061221a911e101c4da7229b76','[\"*\"]','2026-11-09 01:23:51','2026-11-09 09:23:47','2026-11-09 01:23:47','2026-11-09 01:23:51'),(184,'App\\Models\\User',5,'nextjs','3aeb21d8f70ff961b5a3e44fab255aa69f7bd486af6116c3fcfe801c94f8f0fb','[\"*\"]','2026-11-09 01:38:54','2026-11-09 09:23:56','2026-11-09 01:23:56','2026-11-09 01:38:54'),(185,'App\\Models\\User',3,'nextjs','16555806ee56199acdb228e413eb9e78adcc591d91d5e599ba9d84a697797f48','[\"*\"]','2026-11-09 01:47:44','2026-11-09 09:47:43','2026-11-09 01:47:43','2026-11-09 01:47:44'),(186,'App\\Models\\User',3,'nextjs','e0fe9cf58015ed68d66c133fa9553d98227e450239961c3a6672a6f445dbcfe1','[\"*\"]','2026-11-09 01:48:33','2026-11-09 09:48:31','2026-11-09 01:48:31','2026-11-09 01:48:33'),(187,'App\\Models\\User',3,'nextjs','5809cdf546661860532a9026a0c65feccff38ad8e28091950de0cc968f548392','[\"*\"]','2026-11-09 01:49:50','2026-11-09 09:49:01','2026-11-09 01:49:01','2026-11-09 01:49:50'),(188,'App\\Models\\User',3,'nextjs','3dba6c30b20593e31e99f096ccfca7ce3cf9c1e7943e8ea0c8db9fc8a0787fff','[\"*\"]','2026-11-09 01:50:46','2026-11-09 09:49:59','2026-11-09 01:49:59','2026-11-09 01:50:46'),(189,'App\\Models\\User',4,'nextjs','e352663f65fb4b1599f8498ef000a04acf3eabb4bf10f66228973e943364a133','[\"*\"]','2026-11-09 01:51:10','2026-11-09 09:50:52','2026-11-09 01:50:52','2026-11-09 01:51:10'),(190,'App\\Models\\User',5,'nextjs','62f66aa0c857fdc85ba9087b01a93578ad03a437c8eee1ec71cf6d7b9e24d5d8','[\"*\"]','2026-11-09 01:51:17','2026-11-09 09:51:16','2026-11-09 01:51:16','2026-11-09 01:51:17'),(191,'App\\Models\\User',7,'nextjs','7c60bcb48578e0b05d8f6b8bc28afae88e34eac3c8473a530124baf3e8f8e2b1','[\"*\"]','2026-11-09 01:51:31','2026-11-09 09:51:20','2026-11-09 01:51:20','2026-11-09 01:51:31'),(192,'App\\Models\\User',7,'nextjs','4f329258c640a4fd30aa9ceaaecf3274873dd6191fb6c30850fdf4c7b2456f2b','[\"*\"]','2026-11-09 01:52:33','2026-11-09 09:52:19','2026-11-09 01:52:19','2026-11-09 01:52:33'),(193,'App\\Models\\User',3,'nextjs','3a0e05281be112608ea8b27ff1b30c3e38c15bd6d4b4e15730fda9b3c6af5a92','[\"*\"]','2026-11-09 01:52:59','2026-11-09 09:52:38','2026-11-09 01:52:38','2026-11-09 01:52:59'),(194,'App\\Models\\User',4,'nextjs','6715e7de406f96c606ba81b354b3ee73a238875ce02f7ad38a84303ae8db1af5','[\"*\"]','2026-11-09 01:53:08','2026-11-09 09:53:04','2026-11-09 01:53:04','2026-11-09 01:53:08'),(195,'App\\Models\\User',5,'nextjs','189c8cf4ecc70cb980a3ef688284ee2b558572c67a6837af804743b442070bce','[\"*\"]','2026-11-09 01:53:14','2026-11-09 09:53:12','2026-11-09 01:53:12','2026-11-09 01:53:14'),(202,'App\\Models\\User',28,'nextjs','2df74343dc5136be0bd12d2f421e2ce1762772e786c42f5c4bbfa6065df3efb2','[\"*\"]','2026-11-09 02:07:28','2026-11-09 10:07:24','2026-11-09 02:07:24','2026-11-09 02:07:28'),(203,'App\\Models\\User',28,'nextjs','219f0b8c0174d24745a0efb66183a1316235a359fcaeba1e379640146752aede','[\"*\"]','2026-11-09 02:08:32','2026-11-09 10:08:07','2026-11-09 02:08:07','2026-11-09 02:08:32'),(206,'App\\Models\\User',28,'nextjs','f8916692a3f41e034ee13600447ec46dff0f52195b8fb6de4d174eb35b5bf1dd','[\"*\"]','2026-11-09 02:09:35','2026-11-09 10:09:18','2026-11-09 02:09:18','2026-11-09 02:09:35'),(207,'App\\Models\\User',5,'nextjs','a6481b15a657137a9f07cb0ddc1d97a7bcdd3c7741c6a7c381902096eb02db30','[\"*\"]','2026-11-09 02:09:40','2026-11-09 10:09:39','2026-11-09 02:09:39','2026-11-09 02:09:40'),(208,'App\\Models\\User',28,'nextjs','bb51899b96bf18d335c037f853a09b6563efeb466cb1b26999bfb3c96bf318fe','[\"*\"]','2026-11-09 02:09:57','2026-11-09 10:09:53','2026-11-09 02:09:53','2026-11-09 02:09:57'),(209,'App\\Models\\User',5,'nextjs','cd93f6eb1f57dc7b5fed3405270c12ae5d07ae26e2aab1bd9e27fd9c08625f69','[\"*\"]','2026-11-09 02:10:02','2026-11-09 10:10:00','2026-11-09 02:10:00','2026-11-09 02:10:02'),(210,'App\\Models\\User',28,'nextjs','8e45f920a1abc1d8383acd0ab1faeea348b8fa25306051d09e81170b7bc4c952','[\"*\"]','2026-11-09 02:19:28','2026-11-09 10:18:06','2026-11-09 02:18:06','2026-11-09 02:19:28'),(212,'App\\Models\\User',4,'nextjs','a6bae79b4f9204a766bbad34b7707ac6547e165e7ffbfa756d8e1b893f4f1592','[\"*\"]','2026-11-09 02:20:01','2026-11-09 10:19:57','2026-11-09 02:19:57','2026-11-09 02:20:01'),(213,'App\\Models\\User',4,'nextjs','e4c1e44fce73bd8736f05aea325154441406e8155e5ccbbaec2f17fe30f59901','[\"*\"]','2026-11-09 02:20:20','2026-11-09 10:20:19','2026-11-09 02:20:19','2026-11-09 02:20:20'),(214,'App\\Models\\User',28,'nextjs','199b7a952b50124f7fc43b1fcd8a562daa8c527bccc64bd899b7ede116983f7c','[\"*\"]','2026-11-09 02:21:36','2026-11-09 10:21:17','2026-11-09 02:21:17','2026-11-09 02:21:36'),(215,'App\\Models\\User',3,'nextjs','d3e29c93258a33d6d1a94febb0892d4c40eddbbb34a2d2cd423c7765326a64f0','[\"*\"]','2026-11-09 02:22:02','2026-11-09 10:21:39','2026-11-09 02:21:39','2026-11-09 02:22:02'),(216,'App\\Models\\User',4,'nextjs','c33cc449281a9c27858dcac2fae06315d515e7d5a3eda03fb5b98928d4457aa6','[\"*\"]','2026-11-09 02:22:09','2026-11-09 10:22:05','2026-11-09 02:22:05','2026-11-09 02:22:09'),(217,'App\\Models\\User',5,'nextjs','f8263d1d9b18ced335c2b5b0ac3955c3ee10f69cf366edc9c7c4beb3f266a050','[\"*\"]','2026-11-09 02:30:06','2026-11-09 10:22:12','2026-11-09 02:22:12','2026-11-09 02:30:06'),(220,'App\\Models\\User',28,'nextjs','45a528fdc13b14ca44591a480283143d3cab6f4a26aa11e68b75624b4cbc6fb6','[\"*\"]','2026-11-09 02:31:53','2026-11-09 10:31:10','2026-11-09 02:31:10','2026-11-09 02:31:53'),(221,'App\\Models\\User',5,'nextjs','766757f66d1090b74ef21445063f84905873786958f35a03b737a9a925abcb4e','[\"*\"]','2026-11-09 02:31:58','2026-11-09 10:31:57','2026-11-09 02:31:57','2026-11-09 02:31:58'),(222,'App\\Models\\User',3,'nextjs','ae9447281ca79cb622f18732f839327d9521296d3b8d8634fc1bb55cc84a1b90','[\"*\"]','2026-11-09 02:32:05','2026-11-09 10:32:01','2026-11-09 02:32:01','2026-11-09 02:32:05'),(223,'App\\Models\\User',28,'nextjs','873ef36a230ad8b3487f1843a645d976cba1c78581a979f700ed4f7ff50ddbe2','[\"*\"]','2026-11-09 02:32:21','2026-11-09 10:32:16','2026-11-09 02:32:16','2026-11-09 02:32:21'),(224,'App\\Models\\User',28,'nextjs','6e35049830400dec26866455767cb466fc818e389de3018ec60a18f5df41f542','[\"*\"]','2026-11-09 02:33:17','2026-11-09 10:32:58','2026-11-09 02:32:58','2026-11-09 02:33:17'),(225,'App\\Models\\User',3,'nextjs','3bef9e76b321075553bdc5ada904258371128f8f6924eb3988f344316f46c27a','[\"*\"]','2026-11-09 02:33:42','2026-11-09 10:33:20','2026-11-09 02:33:20','2026-11-09 02:33:42'),(226,'App\\Models\\User',4,'nextjs','84a29b8e737b857e9b1a1616ece69ae6499fd7b755cf6b4daf50bbc25a1897d4','[\"*\"]','2026-11-09 02:33:49','2026-11-09 10:33:45','2026-11-09 02:33:45','2026-11-09 02:33:49'),(227,'App\\Models\\User',5,'nextjs','ec1d8118d81e6a473521ee8fe001c6ffed99b9238efd1c96ae6452a939833ac8','[\"*\"]','2026-11-09 02:33:54','2026-11-09 10:33:53','2026-11-09 02:33:53','2026-11-09 02:33:54'),(228,'App\\Models\\User',28,'nextjs','b8c61a24be75432ab3a3c6224acb59b651f052b70cb12e63218fa0237d7f9f49','[\"*\"]','2026-11-09 02:47:53','2026-11-09 10:45:48','2026-11-09 02:45:48','2026-11-09 02:47:53'),(229,'App\\Models\\User',3,'nextjs','c7cc63ca4c98d6df2a54954a9f0ca16406457457a822e4658296b6e34ca00c94','[\"*\"]','2026-11-09 02:48:04','2026-11-09 10:45:50','2026-11-09 02:45:50','2026-11-09 02:48:04'),(230,'App\\Models\\User',28,'nextjs','43bff7d5c2ecb5192119f5bbe333f5cce158e52cc17024aeb3680429891d8a82','[\"*\"]','2026-11-09 02:50:42','2026-11-09 10:48:36','2026-11-09 02:48:36','2026-11-09 02:50:42'),(231,'App\\Models\\User',3,'nextjs','4c0e0891192a5bdbe63277288d0fe3a3c6413b85736288623227a72dc483711a','[\"*\"]','2026-11-09 02:50:53','2026-11-09 10:48:39','2026-11-09 02:48:39','2026-11-09 02:50:53'),(232,'App\\Models\\User',28,'nextjs','1023b54af94ff31ea151767d3795d1204881a1972769da8e72ad18e1a476fbfe','[\"*\"]','2026-11-09 02:57:58','2026-11-09 10:55:53','2026-11-09 02:55:53','2026-11-09 02:57:58'),(233,'App\\Models\\User',3,'nextjs','53765756d10728df2a61c2f13c6a5f39fd181be8a1d75825e6a6ea6e17c057df','[\"*\"]','2026-11-09 02:58:09','2026-11-09 10:55:56','2026-11-09 02:55:56','2026-11-09 02:58:09'),(235,'App\\Models\\User',28,'nextjs','6506622efe4b546187a29127df93a3cda7a18a93ad091e5465c90328b34e9cb6','[\"*\"]','2026-11-09 02:58:37','2026-11-09 10:58:33','2026-11-09 02:58:33','2026-11-09 02:58:37'),(236,'App\\Models\\User',28,'nextjs','370fb7e0f7915454440871f9823253414cc2b5cd9121a58b643bdc85b0a0ba96','[\"*\"]','2026-11-09 02:58:59','2026-11-09 10:58:39','2026-11-09 02:58:39','2026-11-09 02:58:59'),(237,'App\\Models\\User',3,'nextjs','34efc6ab9087c36dc3c91dd3c3e150f0ca8c99ab04b7d24051198e48731a70bb','[\"*\"]','2026-11-09 02:59:06','2026-11-09 10:59:04','2026-11-09 02:59:04','2026-11-09 02:59:06'),(238,'App\\Models\\User',28,'nextjs','2b22f7ba4827368bc0dc0a31d9660fba17808c4811684da8141a5abb62531567','[\"*\"]','2026-11-09 02:59:13','2026-11-09 10:59:11','2026-11-09 02:59:11','2026-11-09 02:59:13'),(239,'App\\Models\\User',28,'nextjs','9f56832fe6dd910b131f79c36f711e1f20f5ce0f1d679c202a27ef1b325be3d3','[\"*\"]','2026-11-09 03:00:37','2026-11-09 11:00:15','2026-11-09 03:00:15','2026-11-09 03:00:37'),(240,'App\\Models\\User',3,'nextjs','72439da6172156921cf0de61be75a14ca8a6b425d7d3b0027e97e11be6e7b431','[\"*\"]','2026-11-09 03:01:08','2026-11-09 11:00:42','2026-11-09 03:00:42','2026-11-09 03:01:08'),(241,'App\\Models\\User',4,'nextjs','0452cc999a533546fbcc80445c3f01ee8ec6ac1ca99787d715fe02251344f876','[\"*\"]','2026-11-09 03:01:18','2026-11-09 11:01:13','2026-11-09 03:01:13','2026-11-09 03:01:18'),(242,'App\\Models\\User',5,'nextjs','21659213cbb7d22c274927d684c1e9cc0f4cf8f8f3349844385e64fe1657eae4','[\"*\"]','2026-11-09 03:01:25','2026-11-09 11:01:23','2026-11-09 03:01:23','2026-11-09 03:01:25'),(244,'App\\Models\\User',28,'nextjs','85c027f290176700c2d1b34fc90479d7f10e9470bd7ae792c9309185f38949fc','[\"*\"]','2026-11-09 03:20:43','2026-11-09 11:20:33','2026-11-09 03:20:33','2026-11-09 03:20:43'),(246,'App\\Models\\User',4,'nextjs','013dcb15b714191c262ea11d0c5d5c808440cdee6aea69bd7c6cc489d4c1bac8','[\"*\"]','2026-11-09 03:46:02','2026-11-09 11:45:45','2026-11-09 03:45:45','2026-11-09 03:46:02'),(247,'App\\Models\\User',28,'nextjs','aca9bc7d26be90efe49c9c2217576af5ce6595b66f59340d4caed94fb069825d','[\"*\"]','2026-11-09 03:46:24','2026-11-09 11:46:08','2026-11-09 03:46:08','2026-11-09 03:46:24'),(248,'App\\Models\\User',4,'nextjs','2589c64c2518afd96b94b718eea81c867f06ec1f15ecc0e2d1c30a12f74bb512','[\"*\"]','2026-11-09 03:46:33','2026-11-09 11:46:31','2026-11-09 03:46:31','2026-11-09 03:46:33'),(249,'App\\Models\\User',4,'nextjs','03f8be4961d2841db82fb5aef86264e83150fba084632f1c3231f97c3e405513','[\"*\"]','2026-11-09 03:46:49','2026-11-09 11:46:48','2026-11-09 03:46:48','2026-11-09 03:46:49'),(250,'App\\Models\\User',28,'nextjs','e07064ed9cd8bd9b42b78f0ef0a37c17cf8bfef11a6ce2ebbb0ce132076ec714','[\"*\"]','2026-11-09 03:49:00','2026-11-09 11:48:48','2026-11-09 03:48:49','2026-11-09 03:49:00'),(251,'App\\Models\\User',3,'nextjs','18c35315cf458c5ed9c20cfb0b52cef2eae438791fa6eff02db15cc5f294e70a','[\"*\"]','2026-11-09 03:49:15','2026-11-09 11:49:04','2026-11-09 03:49:04','2026-11-09 03:49:15'),(252,'App\\Models\\User',4,'nextjs','f453ccaf61c8c3c5e93657c0276b02ff8179081ad2026ba545437c9410c1afae','[\"*\"]','2026-11-09 03:49:25','2026-11-09 11:49:20','2026-11-09 03:49:20','2026-11-09 03:49:25'),(253,'App\\Models\\User',5,'nextjs','92e4e3cd11191e2cf166cb72f5b02e36a7b96cffc0bde1063acee8cfae6cbd9e','[\"*\"]','2026-11-09 03:49:31','2026-11-09 11:49:29','2026-11-09 03:49:29','2026-11-09 03:49:31'),(262,'App\\Models\\User',28,'nextjs','77438307cd3ac526b9ad6a2cd550ee57f51be8f00b82c2dca1b591ab52a5d6ab','[\"*\"]','2026-11-09 06:33:36','2026-11-09 14:17:46','2026-11-09 06:17:46','2026-11-09 06:33:36'),(264,'App\\Models\\User',13,'nextjs','07c9b9290ec775a0c73b0db4af0f7d01df8022ff35b78aef9885fbe3f2300fb0','[\"*\"]','2026-11-09 06:40:51','2026-11-09 14:36:34','2026-11-09 06:36:34','2026-11-09 06:40:51'),(268,'App\\Models\\User',28,'nextjs','a2deed6eee201f3876a397e756170fe6c283015cf71ff750ca330a109fd0fadd','[\"*\"]','2026-11-09 17:33:37','2026-11-10 01:33:35','2026-11-09 17:33:35','2026-11-09 17:33:37'),(269,'App\\Models\\User',30,'nextjs','3951852e9c4c88e9544e78daaea28ad773ed1e4b2b5c63e53d1c56fd6c7ccad5','[\"*\"]','2026-11-09 19:08:53','2026-11-10 03:04:50','2026-11-09 19:04:50','2026-11-09 19:08:53'),(272,'App\\Models\\User',3,'nextjs','9685e62c386695d456b3e6aebd5c8541d43a17792330018b7de80b6b805e82a1','[\"*\"]','2026-11-09 21:01:40','2026-11-10 05:01:22','2026-11-09 21:01:22','2026-11-09 21:01:40'),(273,'App\\Models\\User',3,'nextjs','2168b08163f73a1a815d7b0cea697e2a3fef09ca04dc63c48e9c0046fd70a976','[\"*\"]','2026-11-09 21:02:09','2026-11-10 05:02:07','2026-11-09 21:02:07','2026-11-09 21:02:09'),(274,'App\\Models\\User',3,'nextjs','51f0e104eee79799b6f69c13884a6663695d9838dd67d740443ad52b05cab16e','[\"*\"]','2026-11-09 21:03:21','2026-11-10 05:03:04','2026-11-09 21:03:04','2026-11-09 21:03:21'),(276,'App\\Models\\User',3,'nextjs','3d289f05ac67ab8c0656fb925125405ec5400ec00d813aa7076c5152e640804a','[\"*\"]','2026-11-09 21:04:17','2026-11-10 05:04:14','2026-11-09 21:04:14','2026-11-09 21:04:17'),(278,'App\\Models\\User',3,'nextjs','0deb3b01aa9bd19f440bb1e2ce01cabb49d2e7c41469101b4986825f88172e7d','[\"*\"]','2026-11-09 21:04:52','2026-11-10 05:04:48','2026-11-09 21:04:48','2026-11-09 21:04:52'),(279,'App\\Models\\User',3,'nextjs','18ee16b5ecc336e43f9a9ecf557fb0a6606bda1d9f3ad338b377606b02fa5677','[\"*\"]','2026-11-09 21:05:09','2026-11-10 05:05:07','2026-11-09 21:05:07','2026-11-09 21:05:09'),(280,'App\\Models\\User',3,'nextjs','390774e1b23b267cb81fd8d12472399d3d6b7a776282012c01e2c2069e26f4e1','[\"*\"]','2026-11-09 21:06:30','2026-11-10 05:06:23','2026-11-09 21:06:23','2026-11-09 21:06:30'),(281,'App\\Models\\User',3,'nextjs','708c330b0e6ab3700e3a02cf0603cb72c97dbe990d14717c5bc8fc2bee70fa83','[\"*\"]',NULL,'2026-11-10 05:17:07','2026-11-09 21:17:07','2026-11-09 21:17:07'),(282,'App\\Models\\User',3,'nextjs','f0e027f1503d554d54b35a44623ebadee2a414cf736001338a7efb77f12e9c03','[\"*\"]',NULL,'2026-11-10 05:17:44','2026-11-09 21:17:44','2026-11-09 21:17:44'),(283,'App\\Models\\User',3,'nextjs','5fcace77e67bb7019ad14f21e883022803f58059f80daf6688b4591cbc92ba10','[\"*\"]',NULL,'2026-11-10 05:17:47','2026-11-09 21:17:47','2026-11-09 21:17:47'),(284,'App\\Models\\User',3,'nextjs','e2aa8c430e5ed69f1046e290320995104799553042a7a04f2077d497de66d46b','[\"*\"]','2026-11-09 21:18:10','2026-11-10 05:17:56','2026-11-09 21:17:56','2026-11-09 21:18:10'),(285,'App\\Models\\User',3,'nextjs','033bd5517295a9355f06208c36713e7ce41c774daac1a7f55ec22764ec8c584c','[\"*\"]','2026-11-09 21:19:14','2026-11-10 05:19:10','2026-11-09 21:19:10','2026-11-09 21:19:14'),(286,'App\\Models\\User',3,'nextjs','a89945680543cca0b1bef2df4832c4d73ef759e6f4a9f5c927d0713827cea69a','[\"*\"]','2026-11-09 21:20:10','2026-11-10 05:20:07','2026-11-09 21:20:07','2026-11-09 21:20:10'),(287,'App\\Models\\User',3,'nextjs','ed45f67c470961595a38b2de31425605269cf07de0785f42b23a0ef45765cda8','[\"*\"]','2026-11-09 21:20:28','2026-11-10 05:20:25','2026-11-09 21:20:25','2026-11-09 21:20:28'),(288,'App\\Models\\User',3,'nextjs','cd56358cf6d3d359112161fc74ab922d74f496ba5a1f83e27ed7309b04c9328d','[\"*\"]','2026-11-09 21:20:43','2026-11-10 05:20:40','2026-11-09 21:20:40','2026-11-09 21:20:43'),(289,'App\\Models\\User',3,'nextjs','99bae2cd6ef6d73507fd51a9c11bcd7371b6332fba623ecfc52eb4a07b085e45','[\"*\"]',NULL,'2026-11-10 05:31:51','2026-11-09 21:31:51','2026-11-09 21:31:51'),(290,'App\\Models\\User',3,'nextjs','16f555493d53c916b29a91387c71086d0ff6a3e07c4ed76ce7489a4220a95d70','[\"*\"]','2026-11-09 21:33:34','2026-11-10 05:32:41','2026-11-09 21:32:41','2026-11-09 21:33:34'),(292,'App\\Models\\User',28,'nextjs','7c3ee5c273797dcceb9d30156b2d739cec4bdc973258c93a9f5b5e66682520a3','[\"*\"]','2026-11-09 21:39:03','2026-11-10 05:38:05','2026-11-09 21:38:05','2026-11-09 21:39:03'),(293,'App\\Models\\User',28,'nextjs','167fb53aa1b61418e9b436bb6e7aba31466a456ad597d075d89757c70b4549ea','[\"*\"]','2026-11-09 21:43:15','2026-11-10 05:42:51','2026-11-09 21:42:51','2026-11-09 21:43:15'),(294,'App\\Models\\User',3,'nextjs','fe5adab97b41723e368b5011993e6ef366ed1521b62be67fe2c8fc94b0fb4909','[\"*\"]','2026-11-09 21:43:48','2026-11-10 05:43:18','2026-11-09 21:43:18','2026-11-09 21:43:48'),(295,'App\\Models\\User',4,'nextjs','bb401a869be5ef131d8043c011a2e38cef158ed518139639c32300d9db280af9','[\"*\"]','2026-11-09 21:43:57','2026-11-10 05:43:51','2026-11-09 21:43:51','2026-11-09 21:43:57'),(296,'App\\Models\\User',5,'nextjs','dc731d9860886594df7c3a7a3efb682a07c0d0b2ad20758d6ecde7c939524cdc','[\"*\"]','2026-11-09 21:44:10','2026-11-10 05:44:07','2026-11-09 21:44:07','2026-11-09 21:44:10'),(297,'App\\Models\\User',28,'nextjs','482135055262a102c70e1733c59328a173f031326e2f1c47887ebbcd7bce8c9e','[\"*\"]','2026-11-09 21:44:47','2026-11-10 05:44:32','2026-11-09 21:44:33','2026-11-09 21:44:47'),(298,'App\\Models\\User',3,'nextjs','b0da62f9f8b6b3bd11c31a3d4eb60d8f6a6c287e1491cd7f7a593847f5ac4ca9','[\"*\"]','2026-11-09 21:44:59','2026-11-10 05:44:51','2026-11-09 21:44:51','2026-11-09 21:44:59'),(299,'App\\Models\\User',3,'nextjs','53e3aada4bfff4436ff55588ca8fd97f87d0f6cf9387144ac35fd80e8046158f','[\"*\"]','2026-11-09 21:47:59','2026-11-10 05:47:51','2026-11-09 21:47:51','2026-11-09 21:47:59'),(300,'App\\Models\\User',4,'nextjs','ce6ee5ae6c651e987a6d606b331bbd25e26086da9d024aa9a2a96a2099601775','[\"*\"]','2026-11-09 21:48:06','2026-11-10 05:48:02','2026-11-09 21:48:02','2026-11-09 21:48:06'),(301,'App\\Models\\User',5,'nextjs','52fc5447014afa34c984029df8465421193ab7dbb32cf0698ecab782f57c8fa8','[\"*\"]','2026-11-09 21:48:11','2026-11-10 05:48:10','2026-11-09 21:48:10','2026-11-09 21:48:11'),(302,'App\\Models\\User',28,'nextjs','c3ec79e190cd4d5ab391d7947d1d5b2fa129bb4bf7ec882b5279385f2ade0e38','[\"*\"]','2026-11-09 21:48:20','2026-11-10 05:48:14','2026-11-09 21:48:14','2026-11-09 21:48:20'),(306,'App\\Models\\User',13,'nextjs','f988767e472c1221574dbdf177c1e1493f712589564c32f93d3e4379cccb285a','[\"*\"]','2026-11-10 03:35:10','2026-11-10 11:35:07','2026-11-10 03:35:07','2026-11-10 03:35:10'),(316,'App\\Models\\User',13,'nextjs','6377bb2b5cb7de2ad55474f6c097b5c203c33e63e3e1c2160b3769e51d8e1de2','[\"*\"]','2026-11-10 05:55:40','2026-11-10 13:38:16','2026-11-10 05:38:16','2026-11-10 05:55:40'),(317,'App\\Models\\User',3,'nextjs','e84f2a6091923aab55882fee42b8117bb26eab0882dba8d25ea69c726166fb23','[\"*\"]','2026-11-10 05:54:14','2026-11-10 13:53:50','2026-11-10 05:53:50','2026-11-10 05:54:14'),(318,'App\\Models\\User',4,'nextjs','31abadb47eabaf5e7e958d7fdf131505424ddbb1972967fd2f54a0e7eee01f4b','[\"*\"]','2026-11-10 05:54:33','2026-11-10 13:54:31','2026-11-10 05:54:31','2026-11-10 05:54:33'),(321,'App\\Models\\User',5,'nextjs','d645f44328272241fda1cad5c5fcf7798096747cdcf9a4fc7b28f62d6502c914','[\"*\"]','2026-11-10 05:57:22','2026-11-10 13:57:17','2026-11-10 05:57:17','2026-11-10 05:57:22'),(325,'App\\Models\\User',28,'nextjs','c214a51a200746568e148327cf9d92ab710b51e0700415060c2e1400c9321c7e','[\"*\"]','2026-11-10 07:21:43','2026-11-10 15:00:43','2026-11-10 07:00:43','2026-11-10 07:21:43'),(329,'App\\Models\\User',3,'nextjs','e63317a2318d3004101e387fa3e9b0a94718113b4d470072851af4be742c30e5','[\"*\"]','2026-11-10 07:50:09','2026-11-10 15:20:27','2026-11-10 07:20:27','2026-11-10 07:50:09'),(330,'App\\Models\\User',13,'nextjs','9ff3368413a585ae27967d66c478b11b9d342e9c3fe73e9db948d4290fc2019a','[\"*\"]','2026-11-10 07:50:40','2026-11-10 15:43:20','2026-11-10 07:43:20','2026-11-10 07:50:40'),(336,'App\\Models\\User',28,'nextjs','4c9f4ce2e73a73cb011f36bbe6802053a14174e7cd022178dbaf76349d8088ed','[\"*\"]','2026-11-14 09:12:29','2026-11-14 16:45:07','2026-11-14 08:45:07','2026-11-14 09:12:29');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produits`
--

DROP TABLE IF EXISTS `produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `categorie` varchar(50) DEFAULT NULL,
  `sous_categorie` varchar(100) DEFAULT NULL,
  `marque` varchar(100) DEFAULT NULL,
  `details` text DEFAULT NULL,
  `tranche_age` varchar(50) DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  `quantite_stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `promotion` int(11) NOT NULL DEFAULT 0,
  `supprime_le` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=220 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produits`
--

LOCK TABLES `produits` WRITE;
/*!40000 ALTER TABLE `produits` DISABLE KEYS */;
INSERT INTO `produits` VALUES (1,'Rouge a levres','Maquillage',NULL,NULL,NULL,NULL,80.00,18,'rouge-a-levres-49730228.webp',0,'2026-11-08 13:25:27'),(2,'Mascara','Maquillage',NULL,NULL,NULL,NULL,95.00,13,'mascara-67b77147.webp',0,'2026-11-08 13:25:22'),(3,'Parfum Rose','Parfum',NULL,NULL,NULL,NULL,250.00,38,'parfum-rose-69e49c2f.webp',0,NULL),(4,'Creme visage','Soin',NULL,NULL,NULL,NULL,120.00,22,'creme-visage-84f07733.webp',0,'2026-11-08 13:25:18'),(5,'VERA WANG','Maquillage','CREM','VB','TEST\r\nTEST\r\nTEST','18',50.00,45,'selecon-2776b31e.webp',25,'2026-11-08 13:25:15'),(9,'Creme visage','Maquillage','CREM','VB','qsdfghj, sdfgbn, xcvbn, ertyu et ertghyjcvbnertyhjdfghjdfg','18',80.00,0,'creme-visage-280de2e1.webp',16,'2026-11-08 13:25:12'),(10,'Luminous Silk','Maquillage Visage','Fond de Teint','Armani','Le meilleur de la categorie maquillage visage. Luminous Silk par Huda Beauty vous offre une qualite exceptionnelle.','Tous les ages',134.89,161,'luminous-silk-10.jpg',10,NULL),(11,'Matte Cover','Maquillage Visage','Anticernes','LOreal','Le meilleur de la categorie maquillage visage. Matte Cover par The Ordinary vous offre une qualite exceptionnelle.','Adultes',270.41,41,'matte-cover-11.jpg',0,NULL),(12,'Glow Filter','Maquillage Visage','Poudre',NULL,'Le meilleur de la categorie maquillage visage. Glow Filter par KIKO vous offre une qualite exceptionnelle.','Tous les ages',284.30,0,'glow-filter-12.jpg',0,NULL),(13,'Perfect Base','Maquillage Visage','Fond de Teint',NULL,'Le meilleur de la categorie maquillage visage. Perfect Base par Dior vous offre une qualite exceptionnelle.','Adultes',314.66,12,'perfect-base-4f3b0a90.webp',10,NULL),(14,'Infaillible','Maquillage Visage','Anticernes','LOreal','Le meilleur de la categorie maquillage visage. Infaillible par Mac vous offre une qualite exceptionnelle.','Adultes',273.31,38,'infaillible-14.jpg',20,'2026-11-08 10:58:32'),(15,'Fit Me','Maquillage Visage','Poudre','Maybelline','Le meilleur de la categorie maquillage visage. Fit Me par YSL vous offre une qualite exceptionnelle.','Tous les ages',125.71,113,'fit-me-15.jpg',15,NULL),(16,'Superstay','Maquillage Visage','Fond de Teint','Maybelline','Le meilleur de la categorie maquillage visage. Superstay par LOreal vous offre une qualite exceptionnelle.','Tous les ages',295.51,66,'superstay-16.jpg',0,'2026-11-10 07:00:31'),(17,'True Portrait','Maquillage Visage','Anticernes',NULL,'Le meilleur de la categorie maquillage visage. True Portrait par Chanel vous offre une qualite exceptionnelle.','Tous les ages',165.25,18,'true-portrait-17.jpg',0,'2026-11-08 10:57:26'),(18,'Pro Filtr','Maquillage Visage','Poudre','Fenty Beauty','Le meilleur de la categorie maquillage visage. Pro Filtr par Maybelline vous offre une qualite exceptionnelle.','Adultes',161.16,168,'pro-filtr-93b2efff.webp',20,NULL),(19,'Teint Idole','Maquillage Visage','Fond de Teint','Lancome','Le meilleur de la categorie maquillage visage. Teint Idole par Dior vous offre une qualite exceptionnelle.','Tous les ages',282.41,54,'teint-idole-19.jpg',10,NULL),(20,'Lash Paradise','Maquillage Yeux','Mascara','LOreal','Le meilleur de la categorie maquillage yeux. Lash Paradise par NARS vous offre une qualite exceptionnelle.','Adultes',211.30,18,'lash-paradise-20.jpg',30,NULL),(21,'Better Than Sex','Maquillage Yeux','Palette Fards','Too Faced','Le meilleur de la categorie maquillage yeux. Better Than Sex par Cerave vous offre une qualite exceptionnelle.','Adultes',67.16,2,'better-than-sex-21.jpg',10,'2026-11-10 07:00:27'),(22,'Naked Palette','Maquillage Yeux','Eyeliner','Urban Decay','Le meilleur de la categorie maquillage yeux. Naked Palette par Dior vous offre une qualite exceptionnelle.','Adultes',271.03,68,'naked-palette-57dc1ff8.webp',10,NULL),(23,'Tattoo Liner','Maquillage Yeux','Mascara',NULL,'Le meilleur de la categorie maquillage yeux. Tattoo Liner par YSL vous offre une qualite exceptionnelle.','Adultes',151.94,127,'tattoo-liner-23.jpg',0,NULL),(24,'Rose Metals','Maquillage Yeux','Palette Fards',NULL,'Le meilleur de la categorie maquillage yeux. Rose Metals par Cerave vous offre une qualite exceptionnelle.','Tous les ages',64.27,104,'rose-metals-735171e3.webp',10,NULL),(25,'Lash Sensational','Maquillage Yeux','Eyeliner','Maybelline','Le meilleur de la categorie maquillage yeux. Lash Sensational par NARS vous offre une qualite exceptionnelle.','Tous les ages',255.57,1,'lash-sensational-25.jpg',30,NULL),(26,'Epic Ink','Maquillage Yeux','Mascara','NYX','Le meilleur de la categorie maquillage yeux. Epic Ink par LOreal vous offre une qualite exceptionnelle.','Adultes',128.45,0,'epic-ink-26.jpg',0,NULL),(27,'Desert Dusk','Maquillage Yeux','Palette Fards','Huda Beauty','Le meilleur de la categorie maquillage yeux. Desert Dusk par Dior vous offre une qualite exceptionnelle.','Adultes',79.33,129,'desert-dusk-27.jpg',30,'2026-11-09 05:05:51'),(28,'Soft Glam','Maquillage Yeux','Eyeliner','Anastasia Beverly Hills','Le meilleur de la categorie maquillage yeux. Soft Glam par Mac vous offre une qualite exceptionnelle.','Tous les ages',80.30,307,'soft-glam-24cb1ccc.webp',0,NULL),(29,'Roller Lash','Maquillage Yeux','Mascara','Benefit','Le meilleur de la categorie maquillage yeux. Roller Lash par Dior vous offre une qualite exceptionnelle.','Adultes',177.18,108,'roller-lash-bd463e6a.webp',15,NULL),(30,'Matte Revolution','Maquillage Levres','Rouge a Levres','Charlotte Tilbury','Le meilleur de la categorie maquillage levres. Matte Revolution par Huda Beauty vous offre une qualite exceptionnelle.','Adultes',334.85,36,'matte-revolution-30.jpg',30,NULL),(31,'Super Stay Matte','Maquillage Levres','Gloss','Maybelline','Le meilleur de la categorie maquillage levres. Super Stay Matte par Huda Beauty vous offre une qualite exceptionnelle.','Adultes',159.35,171,'super-stay-matte-31.jpg',20,'2026-11-10 07:00:23'),(32,'Lip Cheat','Maquillage Levres','Crayon Levres','Charlotte Tilbury','Le meilleur de la categorie maquillage levres. Lip Cheat par KIKO vous offre une qualite exceptionnelle.','Tous les ages',319.18,42,'lip-cheat-32.jpg',20,'2026-11-10 07:00:20'),(33,'Gloss Bomb','Maquillage Levres','Rouge a Levres','Fenty Beauty','Le meilleur de la categorie maquillage levres. Gloss Bomb par The Ordinary vous offre une qualite exceptionnelle.','Tous les ages',271.90,86,'gloss-bomb-76c7e513.webp',0,NULL),(34,'Rouge Velvet','Maquillage Levres','Gloss',NULL,'Le meilleur de la categorie maquillage levres. Rouge Velvet par LOreal vous offre une qualite exceptionnelle.','Adultes',256.01,42,'rouge-velvet-6930a9ae.webp',15,NULL),(35,'Lip Injection','Maquillage Levres','Crayon Levres','Too Faced','Le meilleur de la categorie maquillage levres. Lip Injection par LOreal vous offre une qualite exceptionnelle.','Adultes',288.66,83,'lip-injection-35.jpg',10,NULL),(36,'Cream Lip Stain','Maquillage Levres','Rouge a Levres','Sephora','Le meilleur de la categorie maquillage levres. Cream Lip Stain par Sephora vous offre une qualite exceptionnelle.','Adultes',207.63,121,'cream-lip-stain-c733a001.webp',0,NULL),(37,'Retro Matte','Maquillage Levres','Gloss','Mac','Le meilleur de la categorie maquillage levres. Retro Matte par The Ordinary vous offre une qualite exceptionnelle.','Tous les ages',288.90,95,'retro-matte-37.jpg',15,NULL),(38,'Color Sensational','Maquillage Levres','Crayon Levres','Maybelline','Le meilleur de la categorie maquillage levres. Color Sensational par Cerave vous offre une qualite exceptionnelle.','Tous les ages',86.03,375,'color-sensational-38.jpg',10,NULL),(39,'Lip Glow','Maquillage Levres','Rouge a Levres','Dior','Le meilleur de la categorie maquillage levres. Lip Glow par Sephora vous offre une qualite exceptionnelle.','Adultes',104.83,159,'lip-glow-39.jpg',10,NULL),(40,'Creme Desalterante','Soin Visage','Creme Hydratante',NULL,'Le meilleur de la categorie soin visage. Creme Desalterante par NARS vous offre une qualite exceptionnelle.','Adultes',73.32,75,'creme-desalterante-40.jpg',0,'2026-11-10 07:00:14'),(41,'Serum Acide Hyaluronique','Soin Visage','Serum',NULL,'Le meilleur de la categorie soin visage. Serum Acide Hyaluronique par La Roche-Posay vous offre une qualite exceptionnelle.','Tous les ages',127.34,67,'serum-acide-hyaluronique-41.jpg',0,'2026-11-10 07:00:12'),(42,'Gel Moussant','Soin Visage','Nettoyant',NULL,'Le meilleur de la categorie soin visage. Gel Moussant par Lancome vous offre une qualite exceptionnelle.','Adultes',127.87,73,'gel-moussant-42.jpg',20,'2026-11-10 07:00:09'),(43,'Lotion Tonique','Soin Visage','Creme Hydratante',NULL,'Le meilleur de la categorie soin visage. Lotion Tonique par KIKO vous offre une qualite exceptionnelle.','Adultes',275.42,45,'lotion-tonique-43.jpg',0,'2026-11-10 07:00:06'),(44,'Niacinamide 10','Soin Visage','Serum','The Ordinary','Le meilleur de la categorie soin visage. Niacinamide 10 par LOreal vous offre une qualite exceptionnelle.','Adultes',274.24,47,'niacinamide-10-44.jpg',10,NULL),(45,'Serum Vitamine C','Soin Visage','Nettoyant',NULL,'Le meilleur de la categorie soin visage. Serum Vitamine C par NARS vous offre une qualite exceptionnelle.','Tous les ages',249.04,21,'serum-vitamine-c-45.jpg',10,NULL),(46,'Eau Micellaire','Soin Visage','Creme Hydratante',NULL,'Le meilleur de la categorie soin visage. Eau Micellaire par KIKO vous offre une qualite exceptionnelle.','Tous les ages',200.74,38,'eau-micellaire-46.jpg',20,'2026-11-10 07:00:02'),(47,'Creme Reparatrice','Soin Visage','Serum',NULL,'Le meilleur de la categorie soin visage. Creme Reparatrice par La Roche-Posay vous offre une qualite exceptionnelle.','Tous les ages',242.97,56,'creme-reparatrice-47.jpg',15,'2026-11-10 06:59:59'),(48,'Baume Nettoyant','Soin Visage','Nettoyant',NULL,'Le meilleur de la categorie soin visage. Baume Nettoyant par KIKO vous offre une qualite exceptionnelle.','Tous les ages',73.84,155,'baume-nettoyant-48.jpg',30,'2026-11-10 06:59:57'),(49,'Soin Anti-Rides','Soin Visage','Creme Hydratante',NULL,'Le meilleur de la categorie soin visage. Soin Anti-Rides par Lancome vous offre une qualite exceptionnelle.','Tous les ages',265.39,2,'soin-anti-rides-49.jpg',10,'2026-11-10 06:59:54'),(50,'La Vie Est Belle','Parfums','Eau de Parfum','Lancome','Le meilleur de la categorie parfums. La Vie Est Belle par Fenty Beauty vous offre une qualite exceptionnelle.','Adultes',319.76,16,'la-vie-est-belle-50.jpg',15,'2026-11-10 06:59:51'),(51,'Black Opium','Parfums','Brume Corporelle','YSL','Le meilleur de la categorie parfums. Black Opium par Sephora vous offre une qualite exceptionnelle.','Tous les ages',235.71,45,'black-opium-51.jpg',30,NULL),(52,'Libre','Parfums','Coffret Parfum','YSL','Le meilleur de la categorie parfums. Libre par KIKO vous offre une qualite exceptionnelle.','Adultes',99.74,94,'libre-52.jpg',20,NULL),(53,'Sauvage','Parfums','Eau de Parfum','Dior','Le meilleur de la categorie parfums. Sauvage par KIKO vous offre une qualite exceptionnelle.','Adultes',127.95,60,'sauvage-53.jpg',0,'2026-11-10 06:59:47'),(54,'Baccarat Rouge','Parfums','Brume Corporelle','Maison Francis Kurkdjian','Le meilleur de la categorie parfums. Baccarat Rouge par YSL vous offre une qualite exceptionnelle.','Tous les ages',141.83,113,'baccarat-rouge-54.jpg',0,'2026-11-10 06:59:45'),(55,'Good Girl','Parfums','Coffret Parfum','Carolina Herrera','Le meilleur de la categorie parfums. Good Girl par La Roche-Posay vous offre une qualite exceptionnelle.','Adultes',220.17,69,'good-girl-55.jpg',0,'2026-11-10 06:59:41'),(56,'Alien','Parfums','Eau de Parfum','Mugler','Le meilleur de la categorie parfums. Alien par Mac vous offre une qualite exceptionnelle.','Tous les ages',174.49,31,'alien-56.jpg',0,'2026-11-10 06:59:39'),(57,'Jadore','Parfums','Brume Corporelle','Dior','Le meilleur de la categorie parfums. Jadore par Sephora vous offre une qualite exceptionnelle.','Tous les ages',189.65,58,'jadore-57.jpg',15,'2026-11-10 06:59:36'),(58,'Bleu de Chanel','Parfums','Coffret Parfum','Chanel','Le meilleur de la categorie parfums. Bleu de Chanel par Lancome vous offre une qualite exceptionnelle.','Tous les ages',301.96,18,'bleu-de-chanel-58.jpg',0,'2026-11-10 06:59:34'),(59,'Scandal','Parfums','Eau de Parfum','Jean Paul Gaultier','Le meilleur de la categorie parfums. Scandal par KIKO vous offre une qualite exceptionnelle.','Adultes',111.95,57,'scandal-59.jpg',15,'2026-11-10 06:59:31'),(60,'Shampoing Reparateur','Soin Cheveux','Shampoing',NULL,'Le meilleur de la categorie soin cheveux. Shampoing Reparateur par LOreal vous offre une qualite exceptionnelle.','Adultes',147.57,0,'shampoing-reparateur-60.jpg',15,'2026-11-10 06:59:29'),(61,'Masque Keratine','Soin Cheveux','Masque Capillaire',NULL,'Le meilleur de la categorie soin cheveux. Masque Keratine par LOreal vous offre une qualite exceptionnelle.','Adultes',81.69,36,'masque-keratine-61.jpg',15,'2026-11-10 06:59:27'),(62,'Huile Extraordinaire','Soin Cheveux','Serum Cheveux','LOreal','Le meilleur de la categorie soin cheveux. Huile Extraordinaire par Mac vous offre une qualite exceptionnelle.','Tous les ages',269.43,24,'huile-extraordinaire-62.jpg',10,'2026-11-10 06:59:25'),(63,'Serum Anti-Chute','Soin Cheveux','Shampoing',NULL,'Le meilleur de la categorie soin cheveux. Serum Anti-Chute par YSL vous offre une qualite exceptionnelle.','Tous les ages',330.09,19,'serum-anti-chute-63.jpg',0,'2026-11-10 06:59:22'),(64,'Shampoing Sans Sulfate','Soin Cheveux','Masque Capillaire',NULL,'Le meilleur de la categorie soin cheveux. Shampoing Sans Sulfate par Dior vous offre une qualite exceptionnelle.','Tous les ages',69.04,152,'shampoing-sans-sulfate-64.jpg',30,'2026-11-10 06:59:20'),(65,'Soin Demelant','Soin Cheveux','Serum Cheveux',NULL,'Le meilleur de la categorie soin cheveux. Soin Demelant par The Ordinary vous offre une qualite exceptionnelle.','Tous les ages',232.27,37,'soin-demelant-65.jpg',20,'2026-11-10 06:59:19'),(66,'Masque Argan','Soin Cheveux','Shampoing',NULL,'Le meilleur de la categorie soin cheveux. Masque Argan par YSL vous offre une qualite exceptionnelle.','Adultes',134.32,78,'masque-argan-66.jpg',0,'2026-11-10 06:59:17'),(67,'Creme Boucles','Soin Cheveux','Masque Capillaire',NULL,'Le meilleur de la categorie soin cheveux. Creme Boucles par Fenty Beauty vous offre une qualite exceptionnelle.','Tous les ages',118.88,74,'creme-boucles-67.jpg',0,'2026-11-10 06:59:15'),(68,'Shampoing Sec','Soin Cheveux','Serum Cheveux',NULL,'Le meilleur de la categorie soin cheveux. Shampoing Sec par LOreal vous offre une qualite exceptionnelle.','Adultes',203.10,56,'shampoing-sec-68.jpg',0,'2026-11-10 06:59:12'),(69,'Huile de Ricin','Soin Cheveux','Shampoing',NULL,'Le meilleur de la categorie soin cheveux. Huile de Ricin par Maybelline vous offre une qualite exceptionnelle.','Tous les ages',239.03,19,'huile-de-ricin-69.jpg',0,'2026-11-10 06:59:10'),(70,'Vernis Rouge Classique','Ongles','Vernis Classique',NULL,'Le meilleur de la categorie ongles. Vernis Rouge Classique par YSL vous offre une qualite exceptionnelle.','Adultes',296.52,98,'vernis-rouge-classique-70.jpg',15,'2026-11-10 06:59:08'),(71,'Top Coat Brillance','Ongles','Vernis Gel',NULL,'Le meilleur de la categorie ongles. Top Coat Brillance par Sephora vous offre une qualite exceptionnelle.','Tous les ages',309.32,11,'top-coat-brillance-71.jpg',10,'2026-11-10 06:59:05'),(72,'Durcisseur','Ongles','Soin des Ongles',NULL,'Le meilleur de la categorie ongles. Durcisseur par La Roche-Posay vous offre une qualite exceptionnelle.','Adultes',210.21,40,'durcisseur-72.jpg',0,'2026-11-10 06:58:59'),(73,'Vernis Nude','Ongles','Vernis Classique',NULL,'Le meilleur de la categorie ongles. Vernis Nude par Chanel vous offre une qualite exceptionnelle.','Tous les ages',75.06,488,'vernis-nude-73.jpg',0,'2026-11-10 06:58:57'),(74,'Base Coat','Ongles','Vernis Gel',NULL,'Le meilleur de la categorie ongles. Base Coat par NARS vous offre une qualite exceptionnelle.','Tous les ages',226.31,10,'base-coat-74.jpg',0,'2026-11-10 06:58:55'),(75,'Vernis Noir Profond','Ongles','Soin des Ongles',NULL,'Le meilleur de la categorie ongles. Vernis Noir Profond par YSL vous offre une qualite exceptionnelle.','Tous les ages',61.87,265,'vernis-noir-profond-75.jpg',0,'2026-11-10 06:58:53'),(76,'Huile Cuticules','Ongles','Vernis Classique',NULL,'Le meilleur de la categorie ongles. Huile Cuticules par Mac vous offre une qualite exceptionnelle.','Adultes',212.09,26,'huile-cuticules-76.jpg',15,'2026-11-10 06:58:51'),(77,'Dissolvant Doux','Ongles','Vernis Gel',NULL,'Le meilleur de la categorie ongles. Dissolvant Doux par NARS vous offre une qualite exceptionnelle.','Adultes',295.57,42,'dissolvant-doux-77.jpg',20,'2026-11-10 06:58:49'),(78,'Vernis Paillete','Ongles','Soin des Ongles',NULL,'Le meilleur de la categorie ongles. Vernis Paillete par Huda Beauty vous offre une qualite exceptionnelle.','Tous les ages',72.03,322,'vernis-paillete-78.jpg',10,'2026-11-10 06:58:46'),(79,'Soin Reparateur','Ongles','Vernis Classique',NULL,'Le meilleur de la categorie ongles. Soin Reparateur par Mac vous offre une qualite exceptionnelle.','Adultes',302.67,19,'soin-reparateur-79.jpg',0,'2026-11-10 06:58:44'),(80,'Beauty Blender','Accessoires','Pinceaux','Beautyblender','Le meilleur de la categorie accessoires. Beauty Blender par Huda Beauty vous offre une qualite exceptionnelle.','Adultes',158.52,132,'beauty-blender-80-c.jpg',20,'2026-11-10 06:58:36'),(81,'Kit Pinceaux Yeux','Accessoires','Eponges',NULL,'Le meilleur de la categorie accessoires. Kit Pinceaux Yeux par Cerave vous offre une qualite exceptionnelle.','Adultes',79.69,156,'kit-pinceaux-yeux-81-c.jpg',0,'2026-11-10 06:58:39'),(82,'Trousse Voyage','Accessoires','Trousses',NULL,'Le meilleur de la categorie accessoires. Trousse Voyage par KIKO vous offre une qualite exceptionnelle.','Adultes',127.73,126,'trousse-voyage-82-c.jpg',0,'2026-11-10 06:58:41'),(83,'Pinceau Fond de Teint','Accessoires','Pinceaux',NULL,'Le meilleur de la categorie accessoires. Pinceau Fond de Teint par Huda Beauty vous offre une qualite exceptionnelle.','Tous les ages',115.87,109,'pinceau-fond-de-teint-83-c.jpg',0,'2026-11-10 06:58:30'),(84,'Eponge Maquillage','Accessoires','Eponges',NULL,'Le meilleur de la categorie accessoires. Eponge Maquillage par YSL vous offre une qualite exceptionnelle.','Tous les ages',306.42,21,'eponge-maquillage-d8e3345a.webp',30,NULL),(85,'Pinceau Poudre','Accessoires','Trousses',NULL,'Le meilleur de la categorie accessoires. Pinceau Poudre par Huda Beauty vous offre une qualite exceptionnelle.','Tous les ages',246.33,44,'pinceau-poudre-7b97fe2f.webp',10,NULL),(86,'Nettoyant Pinceaux','Accessoires','Pinceaux',NULL,'Le meilleur de la categorie accessoires. Nettoyant Pinceaux par Maybelline vous offre une qualite exceptionnelle.','Tous les ages',303.69,6,'nettoyant-pinceaux-67e57d58.webp',15,NULL),(87,'Pinceau Highlighter','Accessoires','Eponges',NULL,'Le meilleur de la categorie accessoires. Pinceau Highlighter par La Roche-Posay vous offre une qualite exceptionnelle.','Adultes',292.16,61,'pinceau-highlighter-7dcbaa33.webp',0,NULL),(88,'Trousse Transparente','Accessoires','Trousses',NULL,'Le meilleur de la categorie accessoires. Trousse Transparente par Huda Beauty vous offre une qualite exceptionnelle.','Tous les ages',63.47,297,'trousse-transparente-19ced975.webp',15,NULL),(89,'Recourbe-cils','Accessoires','Pinceaux',NULL,'Le meilleur de la categorie accessoires. Recourbe-cils par LOreal vous offre une qualite exceptionnelle.','Tous les ages',201.13,28,'recourbe-cils-9c090309.webp',30,NULL),(90,'Lait Corps Nourrissant','Soin Corps','Lait Hydratant',NULL,'Le meilleur de la categorie soin corps. Lait Corps Nourrissant par YSL vous offre une qualite exceptionnelle.','Adultes',161.65,78,'lait-corps-nourrissant-90.jpg',15,'2026-11-10 06:58:26'),(91,'Gommage au Cafe','Soin Corps','Gommage',NULL,'Le meilleur de la categorie soin corps. Gommage au Cafe par NARS vous offre une qualite exceptionnelle.','Tous les ages',347.99,18,'gommage-au-cafe-91.jpg',15,'2026-11-10 06:58:24'),(92,'Creme Mains Karite','Soin Corps','Creme Mains',NULL,'Le meilleur de la categorie soin corps. Creme Mains Karite par Lancome vous offre une qualite exceptionnelle.','Adultes',332.29,16,'creme-mains-karite-92.jpg',0,'2026-11-10 06:58:21'),(93,'Beurre Corporel','Soin Corps','Lait Hydratant',NULL,'Le meilleur de la categorie soin corps. Beurre Corporel par Chanel vous offre une qualite exceptionnelle.','Tous les ages',221.66,24,'beurre-corporel-93.jpg',20,'2026-11-10 06:58:18'),(94,'Gel Douche Surgras','Soin Corps','Gommage',NULL,'Le meilleur de la categorie soin corps. Gel Douche Surgras par Cerave vous offre une qualite exceptionnelle.','Tous les ages',136.04,28,'gel-douche-surgras-94.jpg',20,NULL),(95,'Huile Seche','Soin Corps','Creme Mains',NULL,'Le meilleur de la categorie soin corps. Huile Seche par The Ordinary vous offre une qualite exceptionnelle.','Adultes',195.23,57,'huile-seche-95.jpg',10,'2026-11-10 06:58:16'),(96,'Gommage Sucre','Soin Corps','Lait Hydratant',NULL,'Le meilleur de la categorie soin corps. Gommage Sucre par KIKO vous offre une qualite exceptionnelle.','Tous les ages',178.63,75,'gommage-sucre-96.jpg',0,'2026-11-10 06:58:13'),(97,'Lotion Reparatrice','Soin Corps','Gommage',NULL,'Le meilleur de la categorie soin corps. Lotion Reparatrice par Fenty Beauty vous offre une qualite exceptionnelle.','Adultes',62.80,185,'lotion-reparatrice-97.jpg',15,'2026-11-10 06:58:11'),(98,'Baume Corps','Soin Corps','Creme Mains',NULL,'Le meilleur de la categorie soin corps. Baume Corps par Sephora vous offre une qualite exceptionnelle.','Adultes',261.74,41,'baume-corps-98.jpg',10,'2026-11-10 06:58:09'),(99,'Creme Pieds','Soin Corps','Lait Hydratant',NULL,'Le meilleur de la categorie soin corps. Creme Pieds par Lancome vous offre une qualite exceptionnelle.','Adultes',271.63,23,'creme-pieds-99.jpg',0,'2026-11-10 06:58:06'),(100,'Anthelios UVmune','Solaire','Ecran Solaire','La Roche-Posay','Le meilleur de la categorie solaire. Anthelios UVmune par Cerave vous offre une qualite exceptionnelle.','Tous les ages',97.91,120,'anthelios-uvmune-100.jpg',0,'2026-11-10 06:58:03'),(101,'Photoderm Max','Solaire','Apres-soleil','Bioderma','Le meilleur de la categorie solaire. Photoderm Max par KIKO vous offre une qualite exceptionnelle.','Tous les ages',308.01,3,'photoderm-max-101.jpg',15,'2026-11-10 06:58:01'),(102,'Lait Apres-Soleil','Solaire','Autobronzant',NULL,'Le meilleur de la categorie solaire. Lait Apres-Soleil par KIKO vous offre une qualite exceptionnelle.','Tous les ages',238.97,32,'lait-apres-soleil-102.jpg',0,'2026-11-10 06:57:58'),(103,'Brume Solaire','Solaire','Ecran Solaire',NULL,'Le meilleur de la categorie solaire. Brume Solaire par LOreal vous offre une qualite exceptionnelle.','Adultes',315.01,12,'brume-solaire-103.jpg',10,'2026-11-10 06:57:56'),(104,'Mousse Autobronzante','Solaire','Apres-soleil',NULL,'Le meilleur de la categorie solaire. Mousse Autobronzante par Dior vous offre une qualite exceptionnelle.','Tous les ages',214.66,20,'mousse-autobronzante-104.jpg',0,'2026-11-10 06:57:53'),(105,'Creme Solaire Teintee','Solaire','Autobronzant',NULL,'Le meilleur de la categorie solaire. Creme Solaire Teintee par Fenty Beauty vous offre une qualite exceptionnelle.','Tous les ages',113.01,123,'creme-solaire-teintee-105.jpg',0,'2026-11-10 06:57:50'),(106,'Gouttes Autobronzantes','Solaire','Ecran Solaire',NULL,'Le meilleur de la categorie solaire. Gouttes Autobronzantes par The Ordinary vous offre une qualite exceptionnelle.','Adultes',300.61,25,'gouttes-autobronzantes-106.jpg',0,'2026-11-10 06:57:45'),(107,'Gel Apaisant Aloe Vera','Solaire','Apres-soleil',NULL,'Le meilleur de la categorie solaire. Gel Apaisant Aloe Vera par Chanel vous offre une qualite exceptionnelle.','Adultes',186.50,47,'gel-apaisant-aloe-vera-7ba3418f.webp',20,NULL),(108,'Stick Solaire','Solaire','Autobronzant',NULL,'Le meilleur de la categorie solaire. Stick Solaire par Fenty Beauty vous offre une qualite exceptionnelle.','Tous les ages',253.65,35,'stick-solaire-219b588e.webp',0,NULL),(109,'Huile Solaire','Solaire','Ecran Solaire',NULL,'Le meilleur de la categorie solaire. Huile Solaire par Mac vous offre une qualite exceptionnelle.','Adultes',140.34,116,'huile-solaire-19a31392.webp',0,NULL),(210,'DD','Maquillage Levres','CREM','VB','QSD','18',50.00,68,'dd-14e0a713.webp',0,'2026-11-08 10:51:47'),(215,'EE','Ongles','CREM','EE',NULL,'18',250.00,94,'ee-988cc455.webp',22,'2026-11-08 10:51:41'),(219,'slower soul','Parfums','boody','THE ROSE','An homage to the velvety embrace of a bouquet of roses—heady with hints of cool green and petals as cool as silk. This lush exuberance captures the essence of a rose, from petal to stem, opening on ripe notes of red berries, followed by a fresh whiff of geranium, the rich floral character of rose absolute',NULL,50.00,99,'slower-soul-326466ec.webp',10,NULL);
/*!40000 ALTER TABLE `produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `publicites`
--

DROP TABLE IF EXISTS `publicites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `publicites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `reduction` int(11) DEFAULT 0,
  `produit_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `publicites`
--

LOCK TABLES `publicites` WRITE;
/*!40000 ALTER TABLE `publicites` DISABLE KEYS */;
INSERT INTO `publicites` VALUES (1,'QUEEN - GIFTS FOR ALL','queen-gifts-for-all-8c5bdd4e.png',0,NULL),(2,'QUEEN - POROMOTION','queen-chrismas-offers-c593abb2.png',30,74),(3,'QUEEN - Des Promotions execeptionnelles tout l\'année','queen-des-promotions-execeptionnelles-to-7e3e78bf.png',0,NULL);
/*!40000 ALTER TABLE `publicites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reclamations`
--

DROP TABLE IF EXISTS `reclamations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reclamations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) DEFAULT NULL,
  `sujet` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `statut` enum('Ouvert','En cours','Resolu') DEFAULT 'Ouvert',
  `date_reclamation` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `reclamations_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reclamations`
--

LOCK TABLES `reclamations` WRITE;
/*!40000 ALTER TABLE `reclamations` DISABLE KEYS */;
INSERT INTO `reclamations` VALUES (2,6,'TEST','HADCHI NAAAADI','Ouvert','2026-11-07 05:27:32');
/*!40000 ALTER TABLE `reclamations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tentatives_connexion`
--

DROP TABLE IF EXISTS `tentatives_connexion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tentatives_connexion` (
  `cle` varchar(64) NOT NULL,
  `ip` varchar(45) NOT NULL,
  `date_tentative` datetime NOT NULL,
  KEY `idx_tentatives` (`cle`,`date_tentative`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tentatives_connexion`
--

LOCK TABLES `tentatives_connexion` WRITE;
/*!40000 ALTER TABLE `tentatives_connexion` DISABLE KEYS */;
INSERT INTO `tentatives_connexion` VALUES ('c5f8cab98c22359bb7d61155668691e3d339dddba69cb05dc2e0e094b7449b5e','::1','2026-11-02 13:41:47'),('705c6c509154f400862b5a1d8c9da67e1aac152919cdfe9825740c9b67afb28e','::1','2026-11-03 16:32:38'),('c5f8cab98c22359bb7d61155668691e3d339dddba69cb05dc2e0e094b7449b5e','::1','2026-11-03 16:47:02'),('705c6c509154f400862b5a1d8c9da67e1aac152919cdfe9825740c9b67afb28e','::1','2026-11-03 16:48:15'),('705c6c509154f400862b5a1d8c9da67e1aac152919cdfe9825740c9b67afb28e','::1','2026-11-03 21:35:43');
/*!40000 ALTER TABLE `tentatives_connexion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usps`
--

DROP TABLE IF EXISTS `usps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `icone` varchar(100) DEFAULT NULL,
  `texte` varchar(255) NOT NULL,
  `lien` varchar(255) DEFAULT NULL,
  `ordre_affichage` int(11) DEFAULT 0,
  `est_actif` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usps`
--

LOCK TABLES `usps` WRITE;
/*!40000 ALTER TABLE `usps` DISABLE KEYS */;
/*!40000 ALTER TABLE `usps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `role` enum('client','admin','responsable_produits','responsable_commandes') DEFAULT 'client',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateurs`
--

LOCK TABLES `utilisateurs` WRITE;
/*!40000 ALTER TABLE `utilisateurs` DISABLE KEYS */;
INSERT INTO `utilisateurs` VALUES (2,'Adam','azdadadam02@GMAIL.COM','$2y$10$vsa5spqeLmmqDsi6mXzvU.ENGVX1PtvMAMSI7prDN88C7Kf4fYicW',NULL,NULL,'client'),(3,'Admin Queen','admin@queen.ma','$2y$12$IaDH.0T.Vw1G8sbNw7woQOyOjh2DGhK2s/DoeP7up3aFVMxJN6RoK',NULL,NULL,'admin'),(4,'Karim Produits','produits@queen.ma','$2y$12$2/aksHsLRx7ffQSuCQFjsOmVPUUoXmopNbU8BO7S1d32UzPc0Yf5G',NULL,NULL,'responsable_produits'),(5,'Salma Commandes','commandes@queen.ma','$2y$12$XDg.nC6UaHGuzOAr/JLhiu4F5nVxa6EyuoxXoBefT6ukBxJtXOL42',NULL,NULL,'responsable_commandes'),(6,'YASSINE','yassin1@gmail.com','$2y$12$P3xu5LBusxwK5EcdeqOzKu/pCpefD0KHSarLzkK5c5BIZJJYoT.ui','2002-11-06','avatar-b2a5bd8b.jpg','client'),(7,'Client Test','client@queen.ma','$2y$12$WBhwHTseMnSSTMae8o80NuJYRVeOZY8KN6G/cGuq5HxomHbQ8krju',NULL,NULL,'client'),(13,'SIMO','azdad@gmail.com','$2y$12$9cKiMVPNYGLRMKyfNgBh.O5IPW5R4VW31O4XG1vUpp19VXsXrH5c6',NULL,NULL,'client'),(28,'Adam','doon@gmail.com','$2y$12$VxJ4b2Lpj4xk3mIUFoYEe.B0wUrjqKdZsDPZQgcDgcEJsLFo54mwa',NULL,'avatar-a5d938b4.png','client'),(30,'nohaila','nohailaachmid@gmail.com','$2y$12$qH6JiaxYSubPZ13ivOONQOrioFlJSkdbUT7VThF.v8n9ji7ip4Sw6',NULL,NULL,'client');
/*!40000 ALTER TABLE `utilisateurs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variantes_produits`
--

DROP TABLE IF EXISTS `variantes_produits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variantes_produits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `produit_id` int(11) NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `couleur` varchar(50) DEFAULT NULL,
  `taille` varchar(20) DEFAULT NULL,
  `volume_ml` int(11) DEFAULT NULL,
  `poids_g` int(11) DEFAULT NULL,
  `quantite_pieces` int(11) DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `quantite_stock` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `produit_id` (`produit_id`),
  CONSTRAINT `variantes_produits_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=878 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variantes_produits`
--

LOCK TABLES `variantes_produits` WRITE;
/*!40000 ALTER TABLE `variantes_produits` DISABLE KEYS */;
INSERT INTO `variantes_produits` VALUES (9,9,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,0),(10,9,NULL,'#f11f04',NULL,NULL,NULL,NULL,NULL,0),(11,9,NULL,'#000000',NULL,NULL,NULL,NULL,NULL,0),(12,5,NULL,'#0b0a0a',NULL,NULL,NULL,NULL,NULL,0),(13,5,NULL,'#ff1e00','L',1,NULL,NULL,NULL,0),(14,5,NULL,'#b5736a','XL',4,25,32,NULL,45),(15,210,NULL,'#ffffff','L',NULL,NULL,NULL,NULL,34),(16,210,NULL,'#ffffff','XL',NULL,NULL,NULL,NULL,25),(17,210,NULL,'#ffffff','XXL',NULL,NULL,NULL,NULL,9),(20,215,NULL,'#e61b00','L',NULL,NULL,75,NULL,44),(21,215,NULL,'#eb1b00','X',NULL,NULL,36,NULL,16),(22,215,NULL,'#b5736a','XX',NULL,NULL,1,NULL,34),(605,3,NULL,NULL,NULL,50,NULL,NULL,188.00,28),(606,3,NULL,NULL,NULL,100,NULL,NULL,375.00,10),(607,10,NULL,'#b9774f',NULL,NULL,NULL,NULL,NULL,21),(608,10,NULL,'#d6a074',NULL,NULL,NULL,NULL,NULL,57),(609,10,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,44),(610,10,NULL,'#8a5638',NULL,NULL,NULL,NULL,NULL,19),(611,10,NULL,'#f6dcc3',NULL,NULL,NULL,NULL,NULL,20),(612,11,NULL,'#f6dcc3',NULL,NULL,NULL,NULL,NULL,23),(613,11,NULL,'#d6a074',NULL,NULL,NULL,NULL,NULL,18),(614,11,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,0),(615,12,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,0),(616,12,NULL,'#f6dcc3',NULL,NULL,NULL,NULL,NULL,0),(617,12,NULL,'#b9774f',NULL,NULL,NULL,NULL,NULL,0),(618,12,NULL,'#8a5638',NULL,NULL,NULL,NULL,NULL,0),(619,15,NULL,'#f6dcc3',NULL,NULL,NULL,NULL,NULL,23),(620,15,NULL,'#d6a074',NULL,NULL,NULL,NULL,NULL,3),(621,15,NULL,'#8a5638',NULL,NULL,NULL,NULL,NULL,27),(622,15,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,60),(623,16,NULL,'#f6dcc3',NULL,NULL,NULL,NULL,NULL,19),(624,16,NULL,'#d6a074',NULL,NULL,NULL,NULL,NULL,29),(625,16,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,18),(626,18,NULL,'#d6a074',NULL,NULL,NULL,NULL,NULL,26),(627,18,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,31),(628,18,NULL,'#f6dcc3',NULL,NULL,NULL,NULL,NULL,52),(629,18,NULL,'#b9774f',NULL,NULL,NULL,NULL,NULL,59),(630,19,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,15),(631,19,NULL,'#b9774f',NULL,NULL,NULL,NULL,NULL,19),(632,19,NULL,'#d6a074',NULL,NULL,NULL,NULL,NULL,20),(633,20,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,17),(634,20,NULL,'#4a3425',NULL,NULL,NULL,NULL,NULL,1),(635,21,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,1),(636,21,NULL,'#4a3425',NULL,NULL,NULL,NULL,NULL,1),(637,22,NULL,'#c9a68f',NULL,NULL,NULL,NULL,NULL,28),(638,22,NULL,'#4b4048',NULL,NULL,NULL,NULL,NULL,30),(639,22,NULL,'#d9a0a6',NULL,NULL,NULL,NULL,NULL,10),(640,23,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,44),(641,23,NULL,'#4a3425',NULL,NULL,NULL,NULL,NULL,47),(642,23,NULL,'#1b2a49',NULL,NULL,NULL,NULL,NULL,36),(643,24,NULL,'#c9a68f',NULL,NULL,NULL,NULL,NULL,60),(644,24,NULL,'#4b4048',NULL,NULL,NULL,NULL,NULL,2),(645,24,NULL,'#d9a0a6',NULL,NULL,NULL,NULL,NULL,42),(646,25,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,1),(647,25,NULL,'#4a3425',NULL,NULL,NULL,NULL,NULL,0),(648,26,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,0),(649,26,NULL,'#4a3425',NULL,NULL,NULL,NULL,NULL,0),(650,26,NULL,'#1b2a49',NULL,NULL,NULL,NULL,NULL,0),(651,27,NULL,'#c9a68f',NULL,NULL,NULL,NULL,NULL,0),(652,27,NULL,'#4b4048',NULL,NULL,NULL,NULL,NULL,38),(653,27,NULL,'#d9a0a6',NULL,NULL,NULL,NULL,NULL,91),(654,28,NULL,'#c9a68f',NULL,NULL,NULL,NULL,NULL,98),(655,28,NULL,'#4b4048',NULL,NULL,NULL,NULL,NULL,108),(656,28,NULL,'#d9a0a6',NULL,NULL,NULL,NULL,NULL,101),(657,29,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,59),(658,29,NULL,'#4a3425',NULL,NULL,NULL,NULL,NULL,49),(659,30,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,13),(660,30,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,6),(661,30,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,9),(662,30,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,8),(663,31,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,0),(664,31,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,24),(665,31,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,53),(666,31,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,35),(667,31,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,24),(668,31,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,35),(669,32,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,5),(670,32,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,9),(671,32,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,6),(672,32,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,0),(673,32,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,14),(674,32,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,8),(675,33,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,14),(676,33,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,20),(677,33,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,22),(678,33,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,26),(679,33,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,4),(680,34,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,21),(681,34,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,10),(682,34,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,0),(683,34,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,11),(684,35,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,2),(685,35,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,23),(686,35,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,21),(687,35,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,15),(688,35,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,22),(689,36,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,26),(690,36,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,27),(691,36,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,24),(692,36,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,30),(693,36,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,14),(694,37,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,12),(695,37,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,18),(696,37,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,28),(697,37,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,16),(698,37,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,21),(699,38,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,110),(700,38,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,44),(701,38,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,74),(702,38,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,0),(703,38,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,62),(704,38,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,85),(705,39,NULL,'#8b1e3f',NULL,NULL,NULL,NULL,NULL,0),(706,39,NULL,'#6b2d3a',NULL,NULL,NULL,NULL,NULL,47),(707,39,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,55),(708,39,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,20),(709,39,NULL,'#d4756b',NULL,NULL,NULL,NULL,NULL,37),(710,40,NULL,NULL,NULL,50,NULL,NULL,55.00,70),(711,40,NULL,NULL,NULL,30,NULL,NULL,110.00,5),(712,41,NULL,NULL,NULL,15,NULL,NULL,96.00,41),(713,41,NULL,NULL,NULL,30,NULL,NULL,191.00,26),(714,42,NULL,NULL,NULL,100,NULL,NULL,96.00,48),(715,42,NULL,NULL,NULL,200,NULL,NULL,192.00,25),(716,43,NULL,NULL,NULL,200,NULL,NULL,207.00,25),(717,43,NULL,NULL,NULL,100,NULL,NULL,413.00,20),(718,44,NULL,NULL,NULL,15,NULL,NULL,206.00,26),(719,44,NULL,NULL,NULL,30,NULL,NULL,411.00,21),(720,45,NULL,NULL,NULL,15,NULL,NULL,187.00,9),(721,45,NULL,NULL,NULL,30,NULL,NULL,374.00,12),(722,46,NULL,NULL,NULL,200,NULL,NULL,151.00,19),(723,46,NULL,NULL,NULL,100,NULL,NULL,301.00,19),(724,47,NULL,NULL,NULL,30,NULL,NULL,182.00,27),(725,47,NULL,NULL,NULL,50,NULL,NULL,364.00,29),(726,48,NULL,NULL,NULL,200,NULL,NULL,55.00,64),(727,48,NULL,NULL,NULL,100,NULL,NULL,111.00,91),(728,49,NULL,NULL,NULL,100,NULL,NULL,199.00,1),(729,49,NULL,NULL,NULL,30,NULL,NULL,398.00,1),(730,50,NULL,NULL,NULL,30,NULL,NULL,240.00,11),(731,50,NULL,NULL,NULL,50,NULL,NULL,480.00,5),(732,51,NULL,NULL,NULL,30,NULL,NULL,177.00,29),(733,51,NULL,NULL,NULL,50,NULL,NULL,265.00,4),(734,51,NULL,NULL,NULL,100,NULL,NULL,354.00,12),(735,52,NULL,NULL,NULL,100,NULL,NULL,75.00,52),(736,52,NULL,NULL,NULL,50,NULL,NULL,112.00,1),(737,52,NULL,NULL,NULL,30,NULL,NULL,150.00,41),(738,53,NULL,NULL,NULL,50,NULL,NULL,96.00,26),(739,53,NULL,NULL,NULL,100,NULL,NULL,192.00,34),(740,54,NULL,NULL,NULL,30,NULL,NULL,106.00,55),(741,54,NULL,NULL,NULL,100,NULL,NULL,213.00,58),(742,55,NULL,NULL,NULL,50,NULL,NULL,165.00,17),(743,55,NULL,NULL,NULL,30,NULL,NULL,248.00,22),(744,55,NULL,NULL,NULL,100,NULL,NULL,330.00,30),(745,56,NULL,NULL,NULL,100,NULL,NULL,131.00,0),(746,56,NULL,NULL,NULL,30,NULL,NULL,196.00,30),(747,56,NULL,NULL,NULL,50,NULL,NULL,262.00,1),(748,57,NULL,NULL,NULL,50,NULL,NULL,142.00,35),(749,57,NULL,NULL,NULL,100,NULL,NULL,213.00,23),(750,57,NULL,NULL,NULL,30,NULL,NULL,284.00,0),(751,58,NULL,NULL,NULL,100,NULL,NULL,226.00,6),(752,58,NULL,NULL,NULL,50,NULL,NULL,453.00,12),(753,59,NULL,NULL,NULL,30,NULL,NULL,84.00,20),(754,59,NULL,NULL,NULL,50,NULL,NULL,168.00,37),(755,60,NULL,NULL,NULL,750,NULL,NULL,111.00,0),(756,60,NULL,NULL,NULL,250,NULL,NULL,166.00,0),(757,60,NULL,NULL,NULL,400,NULL,NULL,221.00,0),(758,62,NULL,NULL,NULL,100,NULL,NULL,202.00,13),(759,62,NULL,NULL,NULL,50,NULL,NULL,404.00,11),(760,63,NULL,NULL,NULL,50,NULL,NULL,248.00,7),(761,63,NULL,NULL,NULL,100,NULL,NULL,495.00,12),(762,64,NULL,NULL,NULL,250,NULL,NULL,52.00,46),(763,64,NULL,NULL,NULL,750,NULL,NULL,104.00,106),(764,65,NULL,NULL,NULL,200,NULL,NULL,174.00,20),(765,65,NULL,NULL,NULL,500,NULL,NULL,348.00,17),(766,66,NULL,NULL,NULL,500,NULL,NULL,101.00,50),(767,66,NULL,NULL,NULL,200,NULL,NULL,201.00,28),(768,67,NULL,NULL,NULL,200,NULL,NULL,89.00,39),(769,67,NULL,NULL,NULL,500,NULL,NULL,178.00,35),(770,68,NULL,NULL,NULL,750,NULL,NULL,152.00,15),(771,68,NULL,NULL,NULL,250,NULL,NULL,228.00,28),(772,68,NULL,NULL,NULL,400,NULL,NULL,305.00,13),(773,69,NULL,NULL,NULL,100,NULL,NULL,179.00,4),(774,69,NULL,NULL,NULL,50,NULL,NULL,359.00,15),(775,70,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,18),(776,70,NULL,'#1b2a49',NULL,NULL,NULL,NULL,NULL,5),(777,70,NULL,'#4b7f52',NULL,NULL,NULL,NULL,NULL,0),(778,70,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,26),(779,70,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,23),(780,70,NULL,'#7b1530',NULL,NULL,NULL,NULL,NULL,12),(781,70,NULL,'#f2e3d5',NULL,NULL,NULL,NULL,NULL,14),(782,71,NULL,NULL,NULL,15,NULL,NULL,232.00,11),(783,71,NULL,NULL,NULL,10,NULL,NULL,464.00,0),(784,72,NULL,NULL,NULL,15,NULL,NULL,158.00,25),(785,72,NULL,NULL,NULL,10,NULL,NULL,315.00,15),(786,73,NULL,'#7b1530',NULL,NULL,NULL,NULL,NULL,98),(787,73,NULL,'#f2e3d5',NULL,NULL,NULL,NULL,NULL,47),(788,73,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,100),(789,73,NULL,'#4b7f52',NULL,NULL,NULL,NULL,NULL,66),(790,73,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,37),(791,73,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,78),(792,73,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,62),(793,74,NULL,NULL,NULL,10,NULL,NULL,170.00,0),(794,74,NULL,NULL,NULL,15,NULL,NULL,339.00,10),(795,75,NULL,'#c1272d',NULL,NULL,NULL,NULL,NULL,103),(796,75,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,54),(797,75,NULL,'#f2e3d5',NULL,NULL,NULL,NULL,NULL,5),(798,75,NULL,'#1b2a49',NULL,NULL,NULL,NULL,NULL,0),(799,75,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,103),(800,76,NULL,NULL,NULL,15,NULL,NULL,159.00,5),(801,76,NULL,NULL,NULL,10,NULL,NULL,318.00,21),(802,77,NULL,NULL,NULL,50,NULL,NULL,222.00,27),(803,77,NULL,NULL,NULL,100,NULL,NULL,443.00,15),(804,78,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,55),(805,78,NULL,'#e79aa6',NULL,NULL,NULL,NULL,NULL,68),(806,78,NULL,'#4b7f52',NULL,NULL,NULL,NULL,NULL,80),(807,78,NULL,'#1b2a49',NULL,NULL,NULL,NULL,NULL,54),(808,78,NULL,'#b5736a',NULL,NULL,NULL,NULL,NULL,65),(809,79,NULL,NULL,NULL,15,NULL,NULL,227.00,11),(810,79,NULL,NULL,NULL,10,NULL,NULL,454.00,8),(811,80,NULL,'#f1c9cf',NULL,NULL,NULL,NULL,NULL,49),(812,80,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,31),(813,80,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,52),(814,81,NULL,NULL,NULL,NULL,NULL,5,60.00,107),(815,81,NULL,NULL,NULL,NULL,NULL,12,120.00,49),(816,82,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,25),(817,82,NULL,'#ffffff',NULL,NULL,NULL,NULL,NULL,44),(818,82,NULL,'#b76e79',NULL,NULL,NULL,NULL,NULL,57),(819,83,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,53),(820,83,NULL,'#b76e79',NULL,NULL,NULL,NULL,NULL,0),(821,83,NULL,'#f1c9cf',NULL,NULL,NULL,NULL,NULL,56),(822,84,NULL,'#e9bf9a',NULL,NULL,NULL,NULL,NULL,9),(823,84,NULL,'#f1c9cf',NULL,NULL,NULL,NULL,NULL,5),(824,84,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,7),(825,85,NULL,'#f1c9cf',NULL,NULL,NULL,NULL,NULL,10),(826,85,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,17),(827,85,NULL,'#b76e79',NULL,NULL,NULL,NULL,NULL,17),(828,86,NULL,NULL,NULL,100,NULL,NULL,228.00,1),(829,86,NULL,NULL,NULL,200,NULL,NULL,456.00,5),(830,87,NULL,'#b76e79',NULL,NULL,NULL,NULL,NULL,18),(831,87,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,30),(832,87,NULL,'#f1c9cf',NULL,NULL,NULL,NULL,NULL,13),(833,88,NULL,'#111111',NULL,NULL,NULL,NULL,NULL,116),(834,88,NULL,'#b76e79',NULL,NULL,NULL,NULL,NULL,108),(835,88,NULL,'#ffffff',NULL,NULL,NULL,NULL,NULL,73),(836,90,NULL,NULL,NULL,200,NULL,NULL,121.00,38),(837,90,NULL,NULL,NULL,400,NULL,NULL,242.00,40),(838,91,NULL,NULL,NULL,NULL,350,NULL,261.00,9),(839,91,NULL,NULL,NULL,NULL,200,NULL,522.00,9),(840,92,NULL,NULL,NULL,100,NULL,NULL,249.00,11),(841,92,NULL,NULL,NULL,50,NULL,NULL,498.00,5),(842,93,NULL,NULL,NULL,NULL,150,NULL,166.00,24),(843,93,NULL,NULL,NULL,NULL,250,NULL,332.00,0),(844,96,NULL,NULL,NULL,NULL,200,NULL,134.00,43),(845,96,NULL,NULL,NULL,NULL,350,NULL,268.00,32),(846,97,NULL,NULL,NULL,200,NULL,NULL,47.00,91),(847,97,NULL,NULL,NULL,400,NULL,NULL,94.00,94),(848,98,NULL,NULL,NULL,NULL,150,NULL,196.00,30),(849,98,NULL,NULL,NULL,NULL,250,NULL,393.00,11),(850,99,NULL,NULL,NULL,50,NULL,NULL,204.00,2),(851,99,NULL,NULL,NULL,100,NULL,NULL,407.00,21),(852,100,NULL,NULL,'SPF50',200,NULL,NULL,73.00,5),(853,100,NULL,NULL,'SPF30',100,NULL,NULL,110.00,1),(854,100,NULL,NULL,'SPF50',50,NULL,NULL,147.00,114),(855,101,NULL,NULL,'SPF30',100,NULL,NULL,231.00,1),(856,101,NULL,NULL,'SPF50',50,NULL,NULL,347.00,1),(857,101,NULL,NULL,'SPF50',200,NULL,NULL,462.00,1),(858,102,NULL,NULL,NULL,300,NULL,NULL,179.00,5),(859,102,NULL,NULL,NULL,150,NULL,NULL,358.00,27),(860,105,NULL,NULL,'SPF50',50,NULL,NULL,85.00,46),(861,105,NULL,NULL,'SPF30',100,NULL,NULL,127.00,20),(862,105,NULL,NULL,'SPF50',100,NULL,NULL,170.00,57),(863,106,NULL,'#c68642',NULL,NULL,NULL,NULL,NULL,5),(864,106,NULL,'#e0b48a',NULL,NULL,NULL,NULL,NULL,12),(865,106,NULL,'#8d5524',NULL,NULL,NULL,NULL,NULL,8),(866,107,NULL,NULL,NULL,300,NULL,NULL,140.00,45),(867,107,NULL,NULL,NULL,150,NULL,NULL,280.00,2),(868,108,NULL,NULL,'SPF30',NULL,15,NULL,190.00,15),(869,108,NULL,NULL,'SPF50',NULL,15,NULL,380.00,20),(870,109,NULL,NULL,'SPF30',100,NULL,NULL,105.00,34),(871,109,NULL,NULL,'SPF50',200,NULL,NULL,158.00,25),(872,109,NULL,NULL,'SPF50',100,NULL,NULL,211.00,57),(876,219,NULL,NULL,NULL,100,NULL,NULL,50.00,49),(877,219,NULL,NULL,NULL,300,NULL,NULL,100.00,50);
/*!40000 ALTER TABLE `variantes_produits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'queen_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-14  3:06:52
