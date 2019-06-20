export default {
  collection(data, req) {
    data.rows = data.rows.map(row => this.item(row, req));
    return data.rows;
  },
  item(row, req) {
    const { description_length } = req.query;
    if (description_length) {
      row.description = `${row.description.substring(0, Number(description_length))}...`;
    }

    return {
      category_id: row.category_id,
      department_id: row.department_id,
      description: row.description,
      name: row.name,
    };
  },
};
