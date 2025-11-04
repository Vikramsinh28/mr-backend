'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Get role IDs (assuming they were seeded in order: admin=1, editor=2, viewer=3)
    // In production, you'd query the database, but for seeders we assume order
    const roles = await queryInterface.sequelize.query(
      "SELECT id, name FROM roles WHERE name IN ('admin', 'editor', 'viewer')", {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // Get permission IDs
    const permissions = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions", {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // Create a map for easy lookup
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    const permissionMap = {};
    permissions.forEach(perm => {
      permissionMap[perm.name] = perm.id;
    });

    // Admin gets all permissions
    const adminPermissions = Object.values(permissionMap).map(permissionId => ({
      roleId: roleMap['admin'],
      permissionId: permissionId,
      assignedAt: new Date()
    }));

    // Editor gets: user.view, user.edit, role.view, permission.view, company.view, company.edit, department.view, department.edit
    // Editors can view and edit company profiles and manage departments
    const editorPermissions = [
      permissionMap['user.view'],
      permissionMap['user.edit'],
      permissionMap['role.view'],
      permissionMap['permission.view'],
      permissionMap['company.view'],
      permissionMap['company.edit'],
      permissionMap['department.view'],
      permissionMap['department.edit']
    ].filter(Boolean).map(permissionId => ({
      roleId: roleMap['editor'],
      permissionId: permissionId,
      assignedAt: new Date()
    }));

    // Viewer gets: user.view, role.view, permission.view, company.view, department.view
    // Viewers can view company and department information but cannot edit
    const viewerPermissions = [
      permissionMap['user.view'],
      permissionMap['role.view'],
      permissionMap['permission.view'],
      permissionMap['company.view'],
      permissionMap['department.view']
    ].filter(Boolean).map(permissionId => ({
      roleId: roleMap['viewer'],
      permissionId: permissionId,
      assignedAt: new Date()
    }));

    // Check existing role-permission assignments
    // Use raw query with column position to avoid case sensitivity issues
    // The table should have: id, roleId (or roleid), permissionId (or permissionid), assignedAt
    const existingAssignmentsResult = await queryInterface.sequelize.query(
      `SELECT * FROM role_permissions`, {
        type: Sequelize.QueryTypes.SELECT
      }
    );

    // Extract roleId and permissionId from results - handle both camelCase and lowercase
    const existingAssignmentKeys = new Set();
    existingAssignmentsResult.forEach(row => {
      // Access by all possible key variations
      const keys = Object.keys(row);
      // roleId should be the second column (index 1), permissionId the third (index 2)
      // But let's access by known property names
      let roleId = row.roleId || row.roleid || row['"roleId"'] || row['"roleid"'];
      let permissionId = row.permissionId || row.permissionid || row['"permissionId"'] || row['"permissionid"'];

      // If still not found, use positional access (id=0, roleId=1, permissionId=2, assignedAt=3)
      if (roleId === undefined && keys.length >= 3) {
        const values = Object.values(row);
        roleId = values[1]; // Second column
        permissionId = values[2]; // Third column
      }

      if (roleId != null && permissionId != null) {
        existingAssignmentKeys.add(`${roleId}-${permissionId}`);
      }
    });

    // Insert all role-permission assignments (only if we have data and they don't exist)
    const allAssignments = [
      ...adminPermissions,
      ...editorPermissions,
      ...viewerPermissions
    ].filter(assignment =>
      assignment.roleId &&
      assignment.permissionId &&
      !existingAssignmentKeys.has(`${assignment.roleId}-${assignment.permissionId}`)
    );

    if (allAssignments.length > 0) {
      await queryInterface.bulkInsert('role_permissions', allAssignments, {});
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};