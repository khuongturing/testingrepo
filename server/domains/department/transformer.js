export default {
  collection(data) {
    data.rows = data.rows.map(row => this.item(row));
    return data.rows;
  },
  item(row) {
    return {
      department_id: row.department_id,
      description: row.description,
      name: row.name,
    };
  }
};
