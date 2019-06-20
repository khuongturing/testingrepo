export default {
  collection(data) {
    data.rows = data.rows.map(row => this.item(row));
    return data.rows;
  },
  item(row) {
    return {
      attribute_id: row.attribute_id,
      name: row.name,
    };
  },
  values: {
    collection(data) {
      data.rows = data.rows.map(row => this.item(row));
      return data.rows;
    },
    item(row) {
      return {
        attribute_value_id: row.attribute_value_id,
        value: row.value,
      };
    }
  }
};
