import { open } from "sqlite";
import sqlite3 from "sqlite3";
import { encrypt , decrypt } from "./crypt.js";
// Hacer clase base de datos

// Función para insertar usuarios en la base de datos
class Table{
  
    constructor(){
        
    };
    // Métodos de inserción
    async insertUser(name, userName, password, email, image = null) {
        
        const db = await open({
          filename: "./hive-db.db",
          driver: sqlite3.Database,
        });

        const encryptedText = encrypt(password);

        const stmt = await db.prepare(
          'INSERT INTO User (name, userName, password, email, image, iv, key) VALUES (? ,?, ?, ?, ?, ?, ?)'
        );

        await stmt.run(name, userName, encryptedText.encryptedData, email, image, encryptedText.iv, encryptedText.key);
        await stmt.finalize();
        await db.close();
        console.log("Usuario insertado y conexión cerrada.");
    };

    async insertGroup(groupName, createdDate, type, creatorUser){
        const db = await open({
            filename: "./hive-db.db",
            driver: sqlite3.Database,
          });
        
          const stmt = await db.prepare(
            'INSERT INTO Group (groupName, createdDate, type, creatorUser) VALUES (? ,?, ?, ?)'
          );
          await stmt.run(groupName, createdDate, type, creatorUser);
          await stmt.finalize();
          await db.close();
          console.log("Usuario insertado y conexión cerrada.");
    };

    async linkPeople(idUser, idGroup){
        const db = await open({
            filename: "./hive-db.db",
            driver: sqlite3.Database,
          });
        
          const stmt = await db.prepare(
            'INSERT INTO Groups (idUser, idGroup) VALUES (?, ?)'
          );
          await stmt.run(idUser, idGroup);
          await stmt.finalize();
          await db.close();
    };


    async insertNote(idUser, information, confirmatedDate){
      const db = await open({
          filename: "./hive-db.db",
          driver: sqlite3.Database,
        });
      
        const stmt = await db.prepare(
          'INSERT INTO Note (idUser, information, confirmatedDate) VALUES (?, ?, ?)'
        );
        await stmt.run(idUser, information, confirmatedDate);
        await stmt.finalize();
        await db.close();
        console.log("NOTA insertado y conexión cerrada.");
  };


    async insertPost(idGroup, idUser, confirmatedDate, information, image){
        const db = await open({
            filename: "./hive-db.db",
            driver: sqlite3.Database,
          });
        
          const stmt = await db.prepare(
            'INSERT INTO Post (idGroup, idUser, confirmatedDate, information, image) VALUES (?, ?, ?, ?, ?)'
          );
          await stmt.run(idGroup, idUser, confirmatedDate, information, image);
          await stmt.finalize();
          await db.close();
          console.log("Usuario insertado y conexión cerrada.");
    };

    async validateUser(userName, password, email = null){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const stmt = await db.get(
        'SELECT * FROM User WHERE userName = ?',
        [userName]
    );
      let userFound = false
      if (stmt) {
        
        userFound = true;

        if (userFound){

            const foundPassword = stmt.password;
            const iv = stmt.iv;

            const decryptedText = decrypt({encryptedData: foundPassword, iv: iv});

            if (decryptedText === password){
                userFound = true;
            }
            else{
                userFound = false;
            }
        }
        
        


      } else{
        userFound = false
      }
      await db.close();
      return userFound

    }


    async fetchEvent(idUser){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
        
      const stmt = await db.all(
        'SELECT Event.title, Event.information, Event.expiredDate, Group_.type, Group_.groupName, Group_.idGroup FROM Event JOIN Groups ON Groups.idGroup = Event.idGroup JOIN Group_ ON Event.idGroup = Group_.idGroup WHERE Groups.idUser = ?',
        [idUser]
    );

    let result;

    if (stmt) {
        result = stmt
      }
      else{
        result = null;
      }

      await db.close();
      return result;
    }

    async fetchGroupCalendar(idUser){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
        
      const stmt = await db.all(
        'SELECT Groups.idGroup, Group_.groupName FROM Groups JOIN Group_ ON Group_.idGroup = Groups.idGroup WHERE Groups.idUser = ?',
        [idUser]
    );

    let result;

    if (stmt) {
        result = stmt
      }
      else{
        result = null;
      }

      await db.close();
      console.log("resultado")
      console.log(result)
      return result;
    }
    // ROBERTO CALDERON

    async fetchGroups(idUser){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const stmt = await db.prepare(
        'SELECT * FROM Groups JOIN Group_ ON Groups.idGroup = Group_.idGroup WHERE Groups.idUser = ?');

    const registros = stmt.all(idUser);
    await stmt.finalize();

    let result;

    if (registros) {
        result = registros
      }
      else{
        result = null;
      }

      await db.close();

      return result;


    }

    async createGroup(groupName, createdDate, type_, creatorUser){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });

      const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
      let uniqueGroupCode = '';

      while (true){
        for (let i = 0; i < 7; i++) {
          const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
          uniqueGroupCode += caracteres.charAt(indiceAleatorio);
        }
        const verify = await db.get('SELECT * FROM Group_ WHERE idGroup = ?');

        if (verify){
          continue;
        }
        else{
          break;
        }

      }
    
      const stmt = await db.prepare(
        'INSERT INTO Group_ (groupName, createdDate, type, creatorUser, idGroup) VALUES (?, ?, ?, ?, ?)',
      );
      
      this.linkPeople(creatorUser, uniqueGroupCode);

      let boolType = 0;

      if (type_ === "Académico"){
        boolType = 1;
      }

      await stmt.run(groupName, createdDate, boolType, creatorUser, uniqueGroupCode)
      await stmt.finalize();
      await db.close();

    }

    async createEvent(idUser, idGroup, title, info, createdDate, expiredDate){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });

      const stmt = await db.prepare(
        'INSERT INTO Event (idUser, idGroup, title, information, createdDate, expiredDate) VALUES (?, ?, ?, ?, ?, ?)',
      );
      
      await stmt.run(idUser, idGroup, title, info, createdDate, expiredDate);
      await stmt.finalize();
      await db.close();
    }

    async getEvents(idGroup){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const stmt = await db.prepare(
        'SELECT Event.idEvent, Event.idGroup, Event.idUser, Event.title, Event.information, Event.expiredDate, Group_.groupName FROM Event JOIN Group_ ON Event.idGroup = Group_.idGroup WHERE Event.idGroup = ?');

    const registros = stmt.all(idGroup);
    await stmt.finalize();

    let result;

    if (registros) {
        result = registros
      }
      else{
        result = null;
      }

      await db.close();

      return result;
    }

    async getMembers(idGroup){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const stmt = await db.prepare(
        'SELECT idUser as member, Group_.groupName as name, Group_.idGroup as idGroup FROM Groups JOIN Group_ ON Groups.idGroup = Group_.idGroup WHERE Groups.idGroup = ?');

    const registros = stmt.all(idGroup);
    await stmt.finalize();

    let result;

    if (registros) {
        result = registros
      }
      else{
        result = null;
      }

      await db.close();

      return result;
    }


    async getEventsFeed(idUser){

      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const stmt = await db.prepare(
        'SELECT Event.title, Event.information, Event.expiredDate, Event.idUser, Group_.groupName FROM Event JOIN Groups ON Groups.idGroup = Event.idGroup JOIN Group_ ON Event.idGroup = Group_.idGroup WHERE Groups.idUser = ?');

    const registros = stmt.all(idUser);
    await stmt.finalize();

    let result;

    if (registros) {
        result = registros
      }
      else{
        result = null;
      }

      await db.close();
      
      return result;
    }

    async getNotesFeed(username){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const data = await db.all(
        'SELECT * FROM Note WHERE Note.idUser = ?',
        [username]
 
    );
      return data
    }
    // Obtener data
    async getNotes(idUser){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
    
      const data = await db.all(
        'SELECT * FROM Note JOIN User ON Note.idUser = User.userName WHERE Note.idUser = ?',
        [idUser]
 
    );
      return data
    }

    // Eliminar
    // Se modifico el delete con idNote y idUser a solo idNote
    async deleteNotes(idNotes){
      const db = await open({
        filename: "./hive-db.db",
        driver: sqlite3.Database,
      });
      const result = await db.run("DELETE FROM Note WHERE idNote = ?", [idNotes]);
      return result
    }

};


// Exporta la función para usarla en otros archivos
export {Table};