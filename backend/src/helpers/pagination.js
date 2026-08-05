const buildPaginationResponse = ({ page, limit, total }) => ({
  pagination: {
    page,
    limit,
    total,
    total_pages: total > 0 ? Math.ceil(total / limit) : 0,
  },
});

module.exports = { buildPaginationResponse };
