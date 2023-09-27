bootstrap:
	(cd backend && npm install)
	(cd frontend && npm install)

start:
	concurrently "(cd frontend && npm start)" "(cd backend && npm start)"

start-forever:
	caffeinate -d concurrently "(cd frontend && npm start)" "(cd backend && npm start)"

start-front:
	(cd frontend && npm start)

start-back:
	(cd backend && npm start)
