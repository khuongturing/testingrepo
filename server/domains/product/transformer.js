export default {
  collection(data, req) {
    data.rows = data.rows.map(row => this.item(row, req));
    return data;
  },
  item(row, req) {
    const { description_length } = req.query;
    if (description_length) {
      row.description = `${row.description.substring(0, Number(description_length))}...`;
    }

    return {
      product_id: row.product_id,
      description: row.description,
      name: row.name,
      price: Number(row.price),
      discounted_price: row.discounted_price,
      image: row.image,
      image_2: row.image_2,
      thumbnail: row.thumbnail,
      display: row.display,
    };
  },
  locations: {
    collection(data) {
      data.rows = data.rows.map(row => this.item(row));
      return data;
    },
    item(row) {
      return {
        category_id: row.category_id,
        category_name: row.name,
        department_id: row.department_id,
        department_name: row.department.name,
      };
    }
  },
  attributeValues: {
    collection(data) {
      data.rows = data.rows.map(row => this.item(row));
      return data;
    },
    item(row) {
      return {
        attribute_value_id: row.attribute_value_id,
        attribute_name: row.attribute.name,
        attribute_value: row.value,
      };
    }
  }
};
