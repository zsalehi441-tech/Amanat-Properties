import React, { useState } from 'react';
import { Box, Typography, Loader, SingleSelect, SingleSelectOption, Field, Flex, Button } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ArrowLeft, File, Plus } from '@strapi/icons';
import { compressImage } from '../../utils/compression';

// --- Components ---

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <Box padding={10} background="neutral100" height="100vh">
            <Box paddingBottom={8}>
                <Typography variant="alpha" as="h1">Media Intake Service</Typography>
                <Typography variant="epsilon" style={{ color: '#666' }}>Select the type of media you want to upload</Typography>
            </Box>

            <Flex gap={6} wrap="wrap">
                <Box
                    background="neutral0"
                    shadow="tableShadow"
                    padding={8}
                    hasRadius
                    cursor="pointer"
                    borderColor="neutral200"
                    width="300px"
                    onClick={() => navigate('property')}
                    style={{ textAlign: 'center', transition: 'transform 0.2s', border: '1px solid #dcdce4' }}
                    onMouseEnter={(e: any) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Flex justifyContent="center" paddingBottom={4}>
                        <File style={{ width: '3rem', height: '3rem', fill: '#4945ff' }} />
                    </Flex>
                    <Typography variant="beta" as="h3">Property Photos</Typography>
                    <Box paddingTop={2}>
                        <Typography variant="pi" style={{ color: '#666' }}>Upload high-res images for property listings.</Typography>
                    </Box>
                    <Box paddingTop={6}>
                        <Button fullWidth variant="default">Select Property</Button>
                    </Box>
                </Box>

                <Box
                    background="neutral0"
                    shadow="tableShadow"
                    padding={8}
                    hasRadius
                    cursor="pointer"
                    borderColor="neutral200"
                    width="300px"
                    onClick={() => navigate('document')}
                    style={{ textAlign: 'center', transition: 'transform 0.2s', border: '1px solid #dcdce4' }}
                    onMouseEnter={(e: any) => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <Flex justifyContent="center" paddingBottom={4}>
                        <File style={{ width: '3rem', height: '3rem', fill: '#007eff' }} />
                    </Flex>
                    <Typography variant="beta" as="h3">Private Documents</Typography>
                    <Box paddingTop={2}>
                        <Typography variant="pi" textColor="neutral600">Securely upload deeds, IDs, and legal docs.</Typography>
                    </Box>
                    <Box paddingTop={6}>
                        <Button fullWidth variant="secondary">Select Documents</Button>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

const PropertyUpload = () => {
    const navigate = useNavigate();
    const { post } = useFetchClient();
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleBulkUpload = async (files: File[]) => {
        setUploading(true);
        setError(null);
        setResult(null);

        const results = [];
        const errors = [];

        for (const file of files) {
            try {
                // Compress Image if it's an image
                let fileToUpload = file;
                if (file.type.startsWith('image/')) {
                    try {
                        fileToUpload = await compressImage(file);
                    } catch (compErr) {
                        console.warn('Compression failed, trying original', compErr);
                    }
                }

                const formData = new FormData();
                formData.append('file', fileToUpload);

                // Ensure the path matches the registered admin route
                const { data } = await post('/media-intake/property', formData);
                results.push({ file: file.name, data: data });
            } catch (err: any) {
                console.error('Upload Error:', err);
                errors.push({ file: file.name, error: err.message || 'Unknown error' });
            }
        }

        setUploading(false);

        if (errors.length > 0) {
            const errorDetails = errors.map(e => `• ${e.file}: ${e.error}`).join('\n');
            setError(`Failed to upload ${errors.length} file(s):\n${errorDetails}`);
        }

        if (results.length > 0) {
            setResult({ count: results.length, uploads: results });
        }
    };

    return (
        <Box padding={8} background="neutral100" minHeight="100vh">
            <Button variant="tertiary" startIcon={<ArrowLeft />} onClick={() => navigate('..')}>Back</Button>
            <Box paddingTop={6} paddingBottom={4}>
                <Typography variant="alpha">Property Photos</Typography>
            </Box>

            <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius maxWidth="600px">
                <Box paddingBottom={4}>
                    <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
                        Accepted formats: JPG, PNG, WEBP. Max size: 10MB per file.
                    </Typography>
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        multiple
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                handleBulkUpload(Array.from(e.target.files));
                            }
                        }}
                        disabled={uploading}
                        style={{ display: 'block', width: '100%', padding: '12px', border: '1px dashed #ccc', borderRadius: '4px' }}
                    />
                </Box>

                {uploading && <Box paddingTop={2}><Loader>Optimizing & Uploading...</Loader></Box>}
                {error && (
                    <Box paddingTop={2} padding={4} background="danger100" borderColor="danger200" hasRadius>
                        <Typography textColor="danger600" fontWeight="bold">Upload Failed:</Typography>
                        <Box paddingTop={1}>
                            {error.split('\n').map((errLine, i) => (
                                <Typography key={i} style={{ display: 'block' }} textColor="danger600" variant="pi">{errLine}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {result && (
                    <Box paddingTop={4}>
                        <Typography variant="delta" textColor="success600">
                            {result.count} Photo(s) Uploaded Successfully!
                        </Typography>
                        <Box paddingTop={2}>
                            {result.uploads.map((u: any, i: number) => (
                                <Box key={i} paddingTop={1}>
                                    <Typography variant="omega" fontWeight="bold">ID: {u.data.id}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

const DocumentUpload = () => {
    const navigate = useNavigate();
    const { post } = useFetchClient();
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [docType, setDocType] = useState('other');

    const handleUpload = async (file: File) => {
        setUploading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('docType', docType);

        try {
            const { data } = await post('/media-intake/document', formData);
            setResult({ data });
        } catch (err: any) {
            console.error('Document Upload Error:', err);
            setError(err.response?.data?.error?.message || err.message || 'Upload Failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box padding={8} background="neutral100" minHeight="100vh">
            <Button variant="tertiary" startIcon={<ArrowLeft />} onClick={() => navigate('..')}>Back</Button>
            <Box paddingTop={6} paddingBottom={4}>
                <Typography variant="alpha">Private Documents</Typography>
            </Box>

            <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius maxWidth="500px">
                <Box paddingBottom={4}>
                    <Field.Root name="doc-type">
                        <Field.Label>Document Type</Field.Label>
                        <SingleSelect
                            placeholder="Select type..."
                            value={docType}
                            onChange={(val: any) => setDocType(val)}
                            disabled={uploading}
                        >
                            <SingleSelectOption value="qabala_sharhi">Qabala Sharhi (Deed)</SingleSelectOption>
                            <SingleSelectOption value="qabala_mahali">Qabala Mahali (Local)</SingleSelectOption>
                            <SingleSelectOption value="owner_id">Owner ID (Tazkira)</SingleSelectOption>
                            <SingleSelectOption value="qariadar_stamp">Qariadar Stamp</SingleSelectOption>
                            <SingleSelectOption value="gov_stamp">Gov Stamp</SingleSelectOption>
                            <SingleSelectOption value="other">Other</SingleSelectOption>
                        </SingleSelect>
                    </Field.Root>
                </Box>

                <Box paddingBottom={4}>
                    <Typography variant="pi" textColor="neutral600" style={{ display: 'block', marginBottom: '8px' }}>
                        Accepted: PDF, JPG, PNG. Max size: 20MB.
                    </Typography>
                    <input
                        type="file"
                        accept=".pdf,image/png,image/jpeg,image/webp"
                        onChange={(e) => {
                            if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                        }}
                        disabled={uploading}
                        style={{ display: 'block', width: '100%', padding: '12px', border: '1px dashed #ccc', borderRadius: '4px' }}
                    />
                </Box>

                {uploading && <Box paddingTop={2}><Loader>Securing Document...</Loader></Box>}
                {error && (
                    <Box paddingTop={2} padding={4} background="danger100" borderColor="danger200" hasRadius>
                        <Typography textColor="danger600">{error}</Typography>
                    </Box>
                )}

                {result && (
                    <Box paddingTop={4}>
                        <Typography variant="delta" textColor="success600">Document Secured!</Typography>
                        <Typography variant="omega">ID: {result.data.id}</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

// --- Main Router ---

export default function HomePage() {
    return (
        <Routes>
            <Route index element={<LandingPage />} />
            <Route path="property" element={<PropertyUpload />} />
            <Route path="document" element={<DocumentUpload />} />
        </Routes>
    );
}
