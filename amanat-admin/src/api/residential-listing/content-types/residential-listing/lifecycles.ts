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

    let entry: any = null;
    if (action === 'update') {
        const modelUid = event.model.uid; // e.g., 'api::residential-listing.residential-listing'
        entry = await strapi.entityService.findOne(modelUid, event.params.where.id);
        
        if (isFieldAgent && !isVerifier && !isTrustOfficer) {
            if (entry && entry.verification_status !== 'Draft') {
                throw new ForbiddenError('Field Agents can only edit listings in Draft status.');
            }
        }
    }

    if (data.verification_status) {
        const newStatus = data.verification_status;
        const oldStatus = entry ? entry.verification_status : null;

        // Only enforce status change restrictions if the state is ACTUALLY changing
        if (newStatus !== oldStatus) {
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
}
