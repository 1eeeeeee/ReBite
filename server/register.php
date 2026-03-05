<?php
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);

    // 檢查 Email 是否重複
    $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
    
    if ($check->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "此 Email 已被註冊"]);
    } else {
        // 預設身分為 user
        $sql = "INSERT INTO users (email, password, role) VALUES ('$email', '$password', 'user')";
        if ($conn->query($sql)) {
            echo json_encode(["status" => "success", "message" => "註冊成功"]);
        } else {
            echo json_encode(["status" => "error", "message" => "註冊失敗，請稍後再試"]);
        }
    }
} else {
    echo json_encode(["status" => "error", "message" => "資料不完整"]);
}
$conn->close();
?>