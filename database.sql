-- MySQL dump 10.13  Distrib 8.0.31, for macos12 (x86_64)
--
-- Host: 46.4.74.141    Database: stock_market
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.36-MariaDB-0+deb10u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `stock_market_buy_sell_orders`
--

DROP TABLE IF EXISTS `stock_market_buy_sell_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_market_buy_sell_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_wallet` int(11) NOT NULL,
  `num_of_shares` int(11) NOT NULL,
  `buy_sell_price` int(11) NOT NULL DEFAULT 100,
  `type_of_order` varchar(4) NOT NULL DEFAULT 'sell',
  `completed` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `PK_wallet` (`id_wallet`),
  CONSTRAINT `PK_wallet` FOREIGN KEY (`id_wallet`) REFERENCES `stock_market_shares_wallet` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_market_buy_sell_orders`
--

LOCK TABLES `stock_market_buy_sell_orders` WRITE;
/*!40000 ALTER TABLE `stock_market_buy_sell_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_market_buy_sell_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_market_companies`
--

DROP TABLE IF EXISTS `stock_market_companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_market_companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label_id` varchar(5) NOT NULL,
  `label` varchar(42) NOT NULL,
  `num_shares` int(11) NOT NULL DEFAULT 10000,
  `type_of_company` varchar(30) NOT NULL,
  `company_money` int(11) DEFAULT 0,
  `id_owner` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `label_key` (`label_id`) USING BTREE,
  KEY `PK_owner_companies` (`id_owner`),
  CONSTRAINT `PK_owner_companies` FOREIGN KEY (`id_owner`) REFERENCES `stock_market_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_market_companies`
--

LOCK TABLES `stock_market_companies` WRITE;
/*!40000 ALTER TABLE `stock_market_companies` DISABLE KEYS */;
INSERT INTO `stock_market_companies` VALUES (1,'NYSE','New York Stock Exchange',20000,'Index',0,NULL),(26,'AUS','Austrian United Systems',1000,'Tech Company',0,NULL);
/*!40000 ALTER TABLE `stock_market_companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_market_shares_value`
--

DROP TABLE IF EXISTS `stock_market_shares_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_market_shares_value` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_company` int(11) NOT NULL,
  `num_of_free_shares` int(11) NOT NULL DEFAULT 0,
  `num_of_bought_shares` int(11) NOT NULL DEFAULT 0,
  `num_of_owner_shares` int(11) NOT NULL DEFAULT 0,
  `share_price` double NOT NULL DEFAULT 1,
  `price_change_date` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `PK_company_shares_value` (`id_company`),
  CONSTRAINT `PK_company_shares_value` FOREIGN KEY (`id_company`) REFERENCES `stock_market_companies` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_market_shares_value`
--

LOCK TABLES `stock_market_shares_value` WRITE;
/*!40000 ALTER TABLE `stock_market_shares_value` DISABLE KEYS */;
INSERT INTO `stock_market_shares_value` VALUES (3,1,12000,8000,0,12300,'2023-02-08 09:05:43'),(4,1,11000,9000,0,15300,'2023-02-08 09:34:43'),(13,26,100,400,500,12000,'2023-02-08 11:31:23'),(14,1,10999,9001,0,15300,'2023-02-12 19:10:28'),(19,1,10997,9003,0,15302,'2023-02-13 08:46:23'),(20,1,10977,9023,0,15317.3,'2023-02-13 08:47:01'),(21,1,10957,9043,0,15332.62,'2023-02-15 00:35:30'),(22,1,10977,9023,0,15317.29,'2023-02-15 00:37:10'),(23,1,10997,9003,0,15301.97,'2023-02-15 00:37:33'),(24,1,11017,8983,0,15286.67,'2023-02-15 00:37:39');
/*!40000 ALTER TABLE `stock_market_shares_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_market_shares_wallet`
--

DROP TABLE IF EXISTS `stock_market_shares_wallet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_market_shares_wallet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_company` int(11) NOT NULL,
  `num_of_shares` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `PK_company_shares_wallet` (`id_company`),
  KEY `PK_user_shares_wallet` (`id_user`),
  CONSTRAINT `PK_company_shares_wallet` FOREIGN KEY (`id_company`) REFERENCES `stock_market_companies` (`id`),
  CONSTRAINT `PK_user_shares_wallet` FOREIGN KEY (`id_user`) REFERENCES `stock_market_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_market_shares_wallet`
--

LOCK TABLES `stock_market_shares_wallet` WRITE;
/*!40000 ALTER TABLE `stock_market_shares_wallet` DISABLE KEYS */;
INSERT INTO `stock_market_shares_wallet` VALUES (1,1,1,4);
/*!40000 ALTER TABLE `stock_market_shares_wallet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_market_transations`
--

DROP TABLE IF EXISTS `stock_market_transations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_market_transations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_company` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `price_per_share` int(11) NOT NULL,
  `number_of_shares` int(11) NOT NULL,
  `transation_type` varchar(5) DEFAULT 'long',
  `transation_margin` int(11) DEFAULT 1,
  `transation_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `PK_company_transations` (`id_company`),
  KEY `PK_user_transations` (`id_user`),
  CONSTRAINT `PK_company_transations` FOREIGN KEY (`id_company`) REFERENCES `stock_market_companies` (`id`),
  CONSTRAINT `PK_user_transations` FOREIGN KEY (`id_user`) REFERENCES `stock_market_users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_market_transations`
--

LOCK TABLES `stock_market_transations` WRITE;
/*!40000 ALTER TABLE `stock_market_transations` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_market_transations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_market_users`
--

DROP TABLE IF EXISTS `stock_market_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_market_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `identifier` varchar(20) NOT NULL,
  `money_balance` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Identifier` (`identifier`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_market_users`
--

LOCK TABLES `stock_market_users` WRITE;
/*!40000 ALTER TABLE `stock_market_users` DISABLE KEYS */;
INSERT INTO `stock_market_users` VALUES (1,'steam:00001001',8823051);
/*!40000 ALTER TABLE `stock_market_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'stock_market'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-15  1:40:30
