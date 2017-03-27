<?php

header('Content-Type: application/json');

$name = $_POST['name'];
$message = "Сообщения от пользователя: $name";

$result = mail('andrewloveua@gmail.com', 'Theme', $message);

echo json_encode(array(
 'status' => $result
));