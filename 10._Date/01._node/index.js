console.log(new Date()); // UTC Standard: ISO 8601

console.log(Date()) // Local Time Standard: RFC 2822

console.log(Date.now()); // Unix Epoch

const date = new Date();

const danishDate = new Intl.DateTimeFormat('da-DK').format(date);

console.log(danishDate);

const americanDate = new Intl.DateTimeFormat('en-US').format(date);

console.log(americanDate);