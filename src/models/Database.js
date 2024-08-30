/**
 * Database.
 *
 * @class Database
 */

export class Database {
  connect(dbUrl = "", dbKey = "") {}
  async createFromDb(table = "", columns = [], values = []) {}
  async removeFromDb(table = "", conditions = []) {}
  async updateFromDb(table = "", columns = [], values = [], conditions = []) {}
  async selectFromDb(table = "", columns = "*", conditions = []) {}
}