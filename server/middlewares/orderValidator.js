const validateOrderFields = (req, res, next) => {
  const { cart_id: cartId, shipping_id: shippingId, tax_id: taxId } = req.body;
  const errors = [];
  if (!cartId) errors.push('Cart id is required');
  if (typeof cartId !== 'string') errors.push('Cart id must be a string');
  if (!shippingId) errors.push('Shipping id is required');
  if (typeof shippingId !== 'number') errors.push('Shipping id must be a number');
  if (!taxId) errors.push('Tax id is required');
  if (typeof taxId !== 'number') errors.push('Tax id must be a number');
  if (!errors.length) {
    return next();
  }
  if (errors.length) {
    return res.status(400).json({
      error: {
        status: 400,
        code: 'ORD_04',
        message: errors
      }
    });
  }
};

export default validateOrderFields;
