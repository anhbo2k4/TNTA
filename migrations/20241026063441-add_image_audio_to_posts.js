// migration file: add_image_audio_to_posts.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('Posts', 'imageUrl', {
          type: Sequelize.STRING,
          allowNull: true, // Có thể để trống nếu không cần ảnh
      });
      await queryInterface.addColumn('Posts', 'audioUrl', {
          type: Sequelize.STRING,
          allowNull: true, // Có thể để trống nếu không cần âm thanh
      });
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('Posts', 'imageUrl');
      await queryInterface.removeColumn('Posts', 'audioUrl');
  }
};
