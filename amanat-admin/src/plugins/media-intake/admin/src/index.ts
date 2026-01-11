import pluginId from './pluginId';
import { Upload } from '@strapi/icons';

export default {
    register(app: any) {
        app.createSettingSection(
            {
                id: pluginId,
                intlLabel: {
                    id: `${pluginId}.plugin.name`,
                    defaultMessage: 'Media Intake',
                },
            },
            []
        );

        app.addMenuLink({
            to: `plugins/${pluginId}`,
            icon: Upload,
            intlLabel: {
                id: `${pluginId}.plugin.name`,
                defaultMessage: 'Media Intake',
            },
            Component: async () => {
                const component = await import('./pages/HomePage');
                return component;
            },
        });
    },

    bootstrap() { },
};
