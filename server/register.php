<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_config.php';

// 取得前端 JSON 資料
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $data['email'];
    $password = $data['password'];

    // 1. 檢查 Email 是否重複（使用預處理語句更安全）
    $checkSql = "SELECT id FROM users WHERE email = ?";
    $stmt = $conn->prepare($checkSql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "此 Email 已被註冊"]);
    } else {
        // 2. 密碼加密處理
        // 這樣在資料庫裡看到的會是一串亂碼（如 $2y$10...），即使管理員也看不出原密碼
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // 3. 核心防呆：強制角色設定為 'user'
        $role = 'user';

        // 4. 插入新資料
        $sql = "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sss", $email, $hashed_password, $role);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "註冊成功"]);
        } else {
            echo json_encode(["status" => "error", "message" => "註冊失敗，伺服器錯誤"]);
        }
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "資料不完整"]);
}

$conn->close();
?>