import { createClient } from "@supabase/supabase-js";
import { Database } from "./Database";

/**
 * Supabse.
 *
 * @class Supabse
 * @extends {Database}
 */

export class Supabse extends Database {
  #dbUrl;
  #dbKey;
  #clientDb;

  constructor(dbUrl = "", dbKey = "") {
    this.#dbUrl = dbUrl;
    this.#dbKey = dbKey;
    this.#clientDb = this.#connect(this.#dbUrl, this.#dbKey);
  }

  #applyCondition(query, conditionType, conditionField, conditionValue) {
    switch (conditionType) {
      case "eq":
        return query.eq(conditionField, conditionValue);
      case "neq":
        return query.neq(conditionField, conditionValue);
      case "gt":
        return query.gt(conditionField, conditionValue);
      case "gte":
        return query.gte(conditionField, conditionValue);
      case "lt":
        return query.lt(conditionField, conditionValue);
      case "lte":
        return query.lte(conditionField, conditionValue);
      case "like":
        return query.like(conditionField, conditionValue);
      case "ilike":
        return query.ilike(conditionField, conditionValue);
      case "is":
        return query.is(conditionField, conditionValue);
      case "in":
        return query.in(conditionField, conditionValue);
      case "contains":
        return query.contains(conditionField, conditionValue);
      case "containedBy":
        return query.containedBy(conditionField, conditionValue);
      case "or":
        const orConditions = conditionValue
          .map(({ field, operator, value }) => `${field}.${operator}.${value}`)
          .join(",");
        return query.or(orConditions);
      case "range":
        if (Array.isArray(conditionValue) && conditionValue.length === 2) {
          return query.range(conditionValue[0], conditionValue[1]);
        } else {
          throw new Error(
            "The value of the 'range' condition must be an array with two elements.",
          );
        }
      default:
        throw new Error(`Condition type not supported: ${conditionType}`);
    }
  }
  #connect(dbUrl = "", dbKey = "") {
    const supabase = createClient(dbKey, dbUrl);
    return supabase;
  }
  async createFromDb(table = "", columns = [], values = []) {
    if (!table) {
      throw new Error("A table is required to perform the query.");
    }

    if (
      !Array.isArray(columns) ||
      !Array.isArray(values) ||
      columns.length !== values.length
    ) {
      throw new Error("Columns and values must be arrays of the same length.");
    }

    const insertData = {};
    for (let i = 0; i < columns.length; i++) {
      insertData[columns[i]] = values[i];
    }

    try {
      const { data, error } = await this.#clientDb
        .from(table)
        .insert(insertData);
      if (error) {
        throw new Error(`Insert error: ${error.message}`);
      }

      // return data
    } catch (error) {
      throw new Error(`Failed to create record: ${error.message}`);
    }
  }

  async removeFromDb(table = "", conditions = []) {
    if (!table) {
      throw new Error("A table is required to perform the query.");
    }

    let query = this.#clientDb.from(table);

    // Apply conditions if provided
    if (conditions.length > 0) {
      conditions.forEach(
        ({ conditionType = "eq", conditionField, conditionValue }) => {
          query = this.#applyCondition(
            query,
            conditionType,
            conditionField,
            conditionValue,
          );
        },
      );
    }

    try {
      const { data, error } = await query.delete();
      if (error) {
        throw new Error(`Delete error: ${error.message}`);
      }
      return data;
    } catch (error) {
      throw new Error(`Failed to remove record: ${error.message}`);
    }
  }

  async updateFromDb(table = "", columns = [], values = [], conditions = []) {
    if (!table) {
      throw new Error("A table is required to perform the query.");
    }

    if (
      !Array.isArray(columns) ||
      !Array.isArray(values) ||
      columns.length !== values.length
    ) {
      throw new Error("Columns and values must be arrays of the same length.");
    }

    const updateData = {};
    for (let i = 0; i < columns.length; i++) {
      updateData[columns[i]] = values[i];
    }

    let query = this.#clientDb.from(table).update(updateData);

    // Apply conditions if provided
    if (conditions.length > 0) {
      conditions.forEach(
        ({ conditionType = "eq", conditionField, conditionValue }) => {
          query = this.#applyCondition(
            query,
            conditionType,
            conditionField,
            conditionValue,
          );
        },
      );
    }

    try {
      const { data, error } = await query;
      if (error) {
        throw new Error(`Update error: ${error.message}`);
      }
      return data;
    } catch (error) {
      throw new Error(`Failed to update record: ${error.message}`);
    }
  }

  async selectFromDb(table = "", columns = "*", conditions = []) {
    if (!table) {
      throw new Error("A table is required to perform the query.");
    }

    let query = this.#clientDb.from(table).select(columns);

    // If conditions are provided, apply them
    if (conditions.length > 0) {
      conditions.forEach(
        ({ conditionType = "eq", conditionField, conditionValue }) => {
          query = this.#applyCondition(
            query,
            conditionType,
            conditionField,
            conditionValue,
          );
        },
      );
    }

    try {
      const { data, error } = await query;
      if (error) {
        throw new Error(`Select error: ${error.message}`);
      }
      return data;
    } catch (error) {
      throw new Error(`Failed to select records: ${error.message}`);
    }
  }
}
