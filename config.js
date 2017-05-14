exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
		       		  'mongodb://localhost/moodful';

exports.TEST_DATABASE_URL = (
						process.env.TEST_DATABASE_URL ||
						'mongodb://localhost/test-moodful-please');  

exports.PORT = process.env.PORT || 3000;

