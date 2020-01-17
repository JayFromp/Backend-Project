exports.up = function(knex) {
  return knex.schema.createTable("comments", commentsTable => {
    commentsTable
      .increments("comment_id")
      .primary()
      .notNullable();
    commentsTable
      .string("author")
      .references("users.username")
      .notNullable();
    commentsTable
      .integer("article_id")
      .references("articles.article_id")
      .notNullable();
    commentsTable
      .integer("votes")
      .defaultsTo(0)
      .notNullable();
    commentsTable
      .timestamp("created_at")
      .defaultsTo(knex.fn.now())
      .notNullable();
    commentsTable.text("body").notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};
