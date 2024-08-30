## Esta sujeto a cambios ...

```JavaScript
const table = 'your_table_name';
const columns = ['column1', 'column2'];
const values = ['value1', 'value2'];

await db.createFromDb(table, columns, values);
```

```JavaScript
const conditions = [
  { conditionField: "id", conditionValue: 2 },
  { conditionType: "gt", conditionField: "population", conditionValue: 1000000 }
];

const { data, error } = await db.selectFromDb("countries", "*", conditions);
```