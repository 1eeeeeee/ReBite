<?php
include 'db_config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $conn->real_escape_string($data['password']);

    $sql = "SELECT email, role FROM users WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode([
            "status" => "success",
            "message" => "登入成功",
            "role" => $user['role']
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "帳號或密碼錯誤"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "請輸入帳號密碼"]);
}
$conn->close();
?>