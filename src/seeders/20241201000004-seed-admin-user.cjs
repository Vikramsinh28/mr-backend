'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if admin user already exists
    const existingUsers = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'admin'", {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    let adminUserId;

    if (existingUsers && existingUsers.length > 0) {
      adminUserId = existingUsers[0].id;
    } else {
      // Hash the default admin password
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Insert admin user
      await queryInterface.bulkInsert('users', [{
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});

      // Get the newly inserted admin user ID
      const users = await queryInterface.sequelize.query(
        "SELECT id FROM users WHERE username = 'admin'", {
          type: Sequelize.QueryTypes.SELECT
        }
      );

      if (users && users.length > 0) {
        adminUserId = users[0].id;
      }
    }

    // Get admin role ID
    const roles = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'admin'", {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (adminUserId && roles && roles.length > 0) {
      // Check if role assignment already exists
      // Use SELECT * to avoid column name case sensitivity issues
      const allUserRoles = await queryInterface.sequelize.query(
        `SELECT * FROM user_roles`, {
          type: Sequelize.QueryTypes.SELECT
        }
      );

      // Check if assignment already exists by extracting userId and roleId flexibly
      const assignmentExists = allUserRoles.some(row => {
        // Try multiple ways to access the column values
        const userId = row.userId || row.userid || row['userId'] || row['userid'];
        const roleId = row.roleId || row.roleid || row['roleId'] || row['roleid'];

        // If still not found, use positional access (id=0, userId=1, roleId=2, assignedAt=3)
        const actualUserId = userId !== undefined ? userId : Object.values(row)[1];
        const actualRoleId = roleId !== undefined ? roleId : Object.values(row)[2];

        return actualUserId === adminUserId && actualRoleId === roles[0].id;
      });

      if (!assignmentExists) {
        // Assign admin role to admin user
        await queryInterface.bulkInsert('user_roles', [{
          userId: adminUserId,
          roleId: roles[0].id,
          assignedAt: new Date()
        }], {});
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Get admin user ID
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE username = 'admin'", {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    if (users && users.length > 0) {
      // Remove user_roles first (foreign key constraint)
      await queryInterface.bulkDelete('user_roles', {
        userId: users[0].id
      }, {});
    }

    // Remove admin user
    await queryInterface.bulkDelete('users', {
      username: 'admin'
    }, {});
  }
};