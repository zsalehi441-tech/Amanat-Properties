import type { Schema, Struct } from '@strapi/strapi';

export interface SharedImageUrl extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_urls';
  info: {
    displayName: 'Image URL';
    icon: 'image';
  };
  attributes: {
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.image-url': SharedImageUrl;
    }
  }
}
