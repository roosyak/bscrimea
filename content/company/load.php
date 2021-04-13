<?php 
$mysqli = new mysqli("localhost", "yaruslan", "yaruslan", "bscrimea");

$result = $mysqli->query("SELECT * FROM agency");

$_towns = [
	//'' => '',
	// 0 => '',  
	1 => 'Алупка',
	2 => 'Алушта',
	3 => 'Армянск',
	4 => 'Бахчисарай',
	5 => 'Белогорск',
	6 => 'Джанкой',
	7 => 'Евпатория',
	8 => 'Инкерман',
	9 => 'Керчь',
	10 => 'Красноперекопск',
	11 => 'Саки',
	12 => 'Севастополь',
	13 => 'Симферополь',
	14 => 'Старый Крым',
	15 => 'Судак',
	16 => 'Феодосия',
	17 => 'Щёлкино',
	18 => 'Ялта',
  ];

  
foreach ($result as $row) { 
	foreach($row as $k => $v){
		$row[$k] = str_replace('"', '\"', $v);
	}

    echo "{$row['id'] }\t {$row['name']}\n";
	$a = []; 
	$a[] = "--- ";
	$a[] = "title: \"{$row['name']}\" ";
	$a[] = "site: \"{$row['url']}\" ";
	$a[] = "town: \"{$_towns[$row['town']]}\" ";
	$a[] = "tel: [\"{$row['tel']}\"] ";
	$a[] = "address: \"{$row['address']}\" ";
	$a[] = "mail: \"{$row['mail']}\" ";
	$a[] = "--- ";

	file_put_contents("{$row['id']}.md", join("\n", $a));
}