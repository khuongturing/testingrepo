export default {
  collection(data) {
    data.rows = data.rows.map(row => this.item(row));
    return data;
  },
  item(row) {
    return {
      customer_id: row.customer_id,
      name: row.name,
      email: row.email,
      credit_card: row.credit_card,
      address_1: row.address_1,
      address_2: row.address_2,
      city: row.city,
      region: row.region,
      postal_code: row.postal_code,
      country: row.country,
      shipping_region_id: row.shipping_region_id,
      day_phone: row.day_phone,
      eve_phone: row.eve_phone,
      mob_phone: row.mob_phone,
    };
  },
};
