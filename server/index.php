<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header('Content-Type: application/json; charset=utf-8');

include('./DbConnect.php');

$connection = new DbConnect();
$database = $connection->connect();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($database);
        break;
    case 'POST':
        handlePost($database);
        break;
    case 'DELETE':
        handleDelete($database);
        break;
    default:
        sendResponse(['status' => 0, 'message' => 'Invalid request method.']);
        break;
}

// handleGet - Reads all data from the database.
// $database - Connected database.
function handleGet($database) {
    $action = $_GET['action'] ?? '';

    if ($action == 'getAll') {
        try {      
            $stmt = $database->prepare("SELECT * FROM measurement_tables");         
            $stmt->execute();                         
            $measurements = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $response = [];
            foreach ($measurements as $measurement) {
                $measurement_name = $measurement['measurement_name'];
                $stmt = $database->prepare("SELECT * FROM $measurement_name");
                $stmt->execute();
                $response[$measurement_name] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }  
            sendResponse($response);
        } catch (PDOException $e) {
            sendResponse(["Database error: " . $e->getMessage()]);
        }  
    } elseif ($action === 'rename' && isset($_GET['currentTitle'], $_GET['newTitle'])) {
        renameTable($database, $_GET['currentTitle'], $_GET['newTitle']);
    } else {
        sendResponse(['status' => 0, 'message' => 'Invalid action or missing parameters.']);
    }
}

// renameTable - Renames the measurement table in the database.
// $database - Connected database.
function renameTable($database, $currentTitle, $newTitle) {
    $data = ['status' => 0, 'message' => "'$currentTitle' has not been renamed."];  

    try {
        $stmt = $database->prepare("ALTER TABLE `$currentTitle` RENAME TO `$newTitle`");
        if ($stmt->execute()) {
            $stmt = $database->prepare("UPDATE measurement_tables SET measurement_name = :newTitle WHERE measurement_name = :currentTitle");
            $stmt->bindParam(':newTitle', $newTitle);
            $stmt->bindParam(':currentTitle', $currentTitle);

            if ($stmt->execute()) {
                $data = ['status' => 1, 'message' => "'$currentTitle' successfully renamed."];
            }
        } } catch (PDOException $e) {
        $data = ['status' => 0, 'message' => "Database error: " . $e->getMessage()];
    }
    sendResponse($data);
}

// handlePost - Adds a measurement table in the database.
// $database - Connected database.
function handlePost($database) {
    $measurementData = json_decode(file_get_contents('php://input'));
        $measurements = $measurementData->measurement;
        $title = $measurementData->title;
        $data = ['status' => 0, 'message' => "'$title' has not been added to the database."];

        try {
            $createTableSQL = "CREATE TABLE `$title` (
                id INT PRIMARY KEY AUTO_INCREMENT,
                timestamp BIGINT NOT NULL,
                latitude DOUBLE PRECISION NULL,
                longitude DOUBLE PRECISION NULL,
                cellId INT NULL,
                locationAreaCode INT NULL,
                mobileCountryCode INT NULL,
                mobileNetworkCode INT NULL,
                radioType VARCHAR(10) NULL,
                signalStrength DOUBLE PRECISION NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";

            $stmt = $database->prepare($createTableSQL); 

            if ($stmt->execute()) {
                $insertSQL = "INSERT INTO `$title` (timestamp, latitude, longitude, cellId, locationAreaCode, mobileCountryCode, mobileNetworkCode, radioType, signalStrength) VALUES (:timestamp, :latitude, :longitude, :cellId, :locationAreaCode, :mobileCountryCode, :mobileNetworkCode, :radioType, :signalStrength)";
                $stmt = $database->prepare($insertSQL);
                $isDataAdded = true;

                foreach ($measurements as $item) {  
                    $stmt->bindValue(':timestamp', $item->timestamp);
                    $stmt->bindValue(':latitude', $item->latitude ?? null);
                    $stmt->bindValue(':longitude', $item->longitude ?? null);
                    $stmt->bindValue(':cellId', $item->cellId ?? null);
                    $stmt->bindValue(':locationAreaCode', $item->locationAreaCode ?? null);
                    $stmt->bindValue(':mobileCountryCode', $item->mobileCountryCode ?? null);
                    $stmt->bindValue(':mobileNetworkCode', $item->mobileNetworkCode ?? null);
                    $stmt->bindValue(':radioType', $item->radioType ?? null);
                    $stmt->bindValue(':signalStrength', $item->signalStrength ?? null);

                    if (!$stmt->execute()) {
                        $isDataAdded = false;
                        break;
                    }   
                }

                if ($isDataAdded) {
                    $stmt = $database->prepare("INSERT INTO measurement_tables (measurement_name) VALUES (:title)");
                    $stmt->bindParam(':title', $title);

                    if ($stmt->execute()) {
                        $data = ['status' => 1, 'message' => "'$title' successfully added to the database."];
                    }
                }
            }
        } catch (PDOException $e) {
            $data = ['status' => 0, 'message' => "Database error: " . $e->getMessage()];
        }   
        sendResponse($data); 
}

// handlePost - Deletes the measurement table in the database.
// $database -Connected database.
function handleDelete($database) {
        $title = basename($_SERVER['REQUEST_URI']);
        $data = ['status' => 0, 'message' => "'$title' the measurement has not been deleted."];

        try {
            $stmt = $database->prepare("DROP TABLE `$title`");
            if ($stmt->execute()) {
                $stmt = $database->prepare("DELETE FROM measurement_tables WHERE measurement_name = :title");
                $stmt->bindParam(':title', $title);

                if ($stmt->execute()) {
                    $data = ['status' => 1, 'message' => "'$title' successfully deleted from the database."];
                }
            }
        } catch (PDOException $e) {
            $data = ['status' => 0, 'message' => "Database error: " . $e->getMessage()];
        }
        sendResponse($data);
}

// sendResponse - Sends the response to the frontend after the perfomed action.
// $data - Content of the answer.
function sendResponse($data) {
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}
?>


