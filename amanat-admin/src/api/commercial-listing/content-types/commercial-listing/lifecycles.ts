import { errors } from '@strapi/utils';
const { ForbiddenError } = errors;

declare var strapi: any;

export default {
    async beforeCreate(event: any) {
        await validateWorkflow(event, 'create');
    },
    async beforeUpdate(event: any) {
        await validateWorkflow(event, 'update');
    },
};

async function validateWorkflow(event: any, action: string) {
    const ctx = strapi.requestContext.get();
    if (!ctx || !ctx.state || !ctx.state.user) return;

    const user = ctx.state.user;
    const roles = user.roles.map((r: any) => r.name);
    const data = event.params.data;

    const isSuperAdmin = roles.includes('Super Admin');
    const isTrustOfficer = roles.includes('Trust Officer');
    const isVerifier = roles.includes('Verifier');
    const isFieldAgent = roles.includes('Field Agent');

    if (isSuperAdmin) return;

    if (action === 'update') {
        const entry = await strapi.entityService.findOne('api::commercial-listing.commercial-listing', event.params.where.id);

        if (isFieldAgent && !isVerifier && !isTrustOfficer) {
            if (entry && entry.verification_status !== 'Draft') {
                throw new ForbiddenError('Field Agents can only edit listings in Draft status.');
            }
        }

        if (isVerifier && !isTrustOfficer) {
            if (entry && entry.verification_status === 'Published') {
                throw new ForbiddenError('Verifiers cannot edit Published listings.');
            }
        }
    }

    if (data.verification_status) {
        const newStatus = data.verification_status;

        if (isFieldAgent && !isVerifier && !isTrustOfficer) {
            if (newStatus !== 'Draft') {
                throw new ForbiddenError('Field Agents cannot change status to Verified or Published.');
            }
        }

        if (isVerifier && !isTrustOfficer) {
            if (newStatus === 'Published') {
                throw new ForbiddenError('Verifiers cannot Publish. Trust Officer approval required.');
            }
        }
    }
}
