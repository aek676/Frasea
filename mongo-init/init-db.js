db = db.getSiblingDB("frasea");

db.createCollection("users");

db.users.insertOne({
  username: "testuser",
  passwordHash: "123456",
  createdAt: new Date(),
  updatedAt: new Date(),
  translationHistory: [
    {
      originalText: "Hello world",
      translatedText: "Hola mundo",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-20T10:00:00Z"))
    },
    {
      originalText: "How are you?",
      translatedText: "¿Cómo estás?",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-20T10:15:00Z"))
    },
    {
      originalText: "Thank you very much",
      translatedText: "Muchas gracias",
      sourceLanguage: "en",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-21T11:30:00Z"))
    },
    {
      originalText: "Guten Tag",
      translatedText: "Buenos días",
      sourceLanguage: "de",
      targetLanguage: "es",
      timestamp: new Date(ISODate("2025-05-22T14:00:00Z"))
    }
  ]
});

db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ "translationHistory.timestamp": -1 });

print("Database 'Frasea' initialized with 'users' collection and a test user.");
