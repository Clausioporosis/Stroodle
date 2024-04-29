# Terminplanung

## Postman URLs
User anlegen:
http://localhost:8080/api/users
JSON Format:
{
	"id": "123"
	"name": "Max Mustermann"
	"email": "max@example.com"
}

Alle User ausgeben:
http://localhost:8080/api/users

User mit ID suchen:
http://localhost:8080/api/users/search/123

User mit Email suchen:
http://localhost:8080/api/users/search/email?email=max@example.com

User mit Name suchen:
http://localhost:8080/api/users/search/name?name=Max Mustermann

Poll anlegen:
http://localhost:8080/api/polls
JSON Format:
{
	"id": "123"
	"title": "Example"
	"description": "new poll"
}

Alle Polls ausgeben:
http://localhost:8080/api/polls

Poll mit ID suchen:
http://localhost:8080/api/polls/search/123

Poll mit Titel suchen:
http://localhost:8080/api/polls/search/title?title=Beispiel

Poll mit Beschreibung suchen:
http://localhost:8080/api/polls/search/description?description=Beschreibung