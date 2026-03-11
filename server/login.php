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

    // 1. 使用預處理語句先找出該 Email 的使用者
    // 注意：這裡必須把 password 欄位也選出來，等下要用來驗證
    $sql = "SELECT email, password, role FROM users WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // 2. 關鍵：使用 password_verify 檢查前端傳來的明碼密碼與資料庫的雜湊值是否吻合
        if (password_verify($password, $user['password'])) {
            // 驗證成功
            echo json_encode([
                "status" => "success",
                "message" => "登入成功",
                "role" => $user['role']
            ]);
        } else {
            // 密碼不正確
            echo json_encode(["status" => "error", "message" => "帳號或密碼錯誤"]);
        }
    } else {
        // 找不到該 Email
        echo json_encode(["status" => "error", "message" => "帳號或密碼錯誤"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "請輸入帳號密碼"]);
}

$conn->close();
?>