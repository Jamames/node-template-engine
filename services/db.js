// Detta är en modul som samlar all databaskommunikation.

//Paketet mysql är installerat med "npm install mysql2"
import mysql from "mysql2/promise" // "mysql2/promise" gör att vi kan använda async/await istället för callbacks.

// Här skapas ett databaskopplings-objekt med inställningar för att ansluta till servern och databasen.
async function getConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "login",
  })
}

// Den här funktionen ska göra ett anrop till databasen för att hämta alla users.
async function getUsers() {
  const connection = await getConnection()
  const result = await connection.execute("SELECT * FROM guestbook")

  await connection.end() //Stänger kopplingen till databasen.
  return result[0] //Plats 0 innehåller alla rader som returnerats från databasen.
}

async function insertIntoGuestbook(name, email, comment) {
  let sql = "INSERT INTO Guestbook (name, email, comment, time) VALUES (?, ?, ?, now())";
  const connection = await getConnection()
  const result = await connection.execute(
    sql,
    [name, email,comment]
  )

  await connection.end()
}
async function getPostsByUserId(name) {
  const connection = await getConnection()
  const result = await connection.execute(
    "SELECT * FROM guestbook WHERE name = ?",
    [name]
  )

  await connection.end()
  return result[0] //Plats 0 innehåller alla rader som returnerats från databasen.
}

// Detta exporterar delar av modulen så att andra filer kan komma åt dem med require.
export default {
  getUsers,
  getPostsByUserId,
  insertIntoGuestbook
}
