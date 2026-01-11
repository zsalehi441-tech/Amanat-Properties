export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // --- DEBUG: Log all registered routes ---
    try {
      const routes = strapi.server.listRoutes();
      strapi.log.info('--- REGISTERED ROUTES START ---');
      routes.forEach(route => {
        strapi.log.info(`${route.method} ${route.path}`);
      });
      strapi.log.info('--- REGISTERED ROUTES END ---');
    } catch (routeErr) {
      strapi.log.error('Failed to log routes', routeErr);
    }

    // Bootstrap Admin Roles
    try {
      const adminPlugin = strapi.plugin('admin');
      if (!adminPlugin) {
        strapi.log.warn('Admin plugin not found during bootstrap, skipping role initialization');
        return;
      }

      const roleService = adminPlugin.service('role');
      if (!roleService) {
        strapi.log.warn('Role service not found in admin plugin, skipping role initialization');
        return;
      }

      const existingRoles = await roleService.find();

      const rolesDefaults = [
        {
          name: 'Field Agent',
          code: 'field-agent',
          description: 'Can create and edit own Drafts. Cannot Verify or Publish.',
        },
        {
          name: 'Verifier',
          code: 'verifier',
          description: 'Can verify Drafts. Cannot Publish.',
        },
        {
          name: 'Trust Officer',
          code: 'trust-officer',
          description: 'Can Publish Verified listings. Full Control.',
        },
      ];

      for (const roleDef of rolesDefaults) {
        const found = existingRoles.find((r) => r.name === roleDef.name);
        if (!found) {
          strapi.log.info(`Creating Role: ${roleDef.name}`);
          await roleService.create(roleDef);
        }
      }

      // Allow Public Access to Media Intake (since we use auth: false and call from client)
      const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
      if (publicRole) {
        const actions = [
          'plugin::media-intake.media-intake.uploadProperty',
          'plugin::media-intake.media-intake.uploadDocument'
        ];

        for (const action of actions) {
          const permission = await strapi.query('plugin::users-permissions.permission').findOne({
            where: { role: publicRole.id, action }
          });
          if (!permission) {
            strapi.log.info(`Granting Public Permission: ${action}`);
            await strapi.query('plugin::users-permissions.permission').create({
              data: { action, role: publicRole.id }
            });
          }
        }
      }
    } catch (err) {
      strapi.log.error('Failed to bootstrap roles', err);
    }
  },
};
