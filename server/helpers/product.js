export default {
  nestedPagination(products, page, limit = 20) {
    let offset = 0;
    if (page) {
      offset = (page - 1) * limit;
    }
    let paginationLimit = 20;
    if (limit && !page) {
      paginationLimit = limit;
    }
    if (limit && page) {
      paginationLimit = limit * page;
    }
    const paginatedProducts = products.slice(offset, paginationLimit);
    return paginatedProducts;
  },

  filterByDescriptionLength(products, descriptionLength) {
    const productsByLength = products.filter((product) => {
      const productDescriptionLength = product.dataValues.description.length;
      if (productDescriptionLength <= descriptionLength) {
        product.dataValues.description = product.dataValues.description.slice(0, descriptionLength);
      } else {
        product.dataValues.description = `${product.dataValues.description.slice(0, descriptionLength)}...`;
      }
      return product;
    });
    return productsByLength;
  }
};
